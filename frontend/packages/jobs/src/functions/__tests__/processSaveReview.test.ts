import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createClient } from '../../libs/supabase'
import type { ReviewResponse } from '../../types'
import { processSaveReview } from '../processSaveReview'

// Mock environment variables
vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')

describe('processSaveReview', () => {
  const supabase = createClient()

  // Test data
  const testRepository = {
    id: 9999,
    name: 'test-repo',
    owner: 'test-owner',
    installationId: 12345,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const testPullRequest = {
    id: 9999,
    pullNumber: 1,
    repositoryId: testRepository.id,
    commentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const testOverallReview = {
    id: 9999,
    projectId: 1,
    pullRequestId: testPullRequest.id,
    reviewComment: 'Test review comment',
    branchName: 'test-branch',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Setup: Insert test data before tests
  beforeEach(async () => {
    vi.clearAllMocks()

    // Insert test data
    await supabase.from('Repository').insert(testRepository)
    await supabase.from('PullRequest').insert(testPullRequest)
    await supabase.from('OverallReview').insert(testOverallReview)
  })

  // Cleanup: Remove test data after tests
  afterEach(async () => {
    // Delete test data in reverse order to avoid foreign key constraints
    await supabase.from('OverallReview').delete().eq('id', testOverallReview.id)
    await supabase.from('PullRequest').delete().eq('id', testPullRequest.id)
    await supabase.from('Repository').delete().eq('id', testRepository.id)
  })

  it('should save review successfully', async () => {
    const testPayload: ReviewResponse = {
      pullRequestId: testPullRequest.id,
      projectId: 1,
      repositoryId: testRepository.id,
      branchName: 'test-branch',
      review: {
        bodyMarkdown: 'Test review comment',
        summary: 'Test review summary',
        scores: [
          {
            kind: 'Migration Safety',
            value: 8,
            reason: 'Good migration safety',
          },
        ],
        issues: [
          {
            kind: 'Migration Safety',
            severity: 'high',
            description: 'Test issue',
            suggestion: 'Fix the issue',
          },
        ],
      },
    }

    const result = await processSaveReview(testPayload)
    expect(result.success).toBe(true)

    // Verify the update in the database
    const { data: updatedReview } = await supabase
      .from('OverallReview')
      .select('*')
      .eq('id', testOverallReview.id)
      .single()

    expect(updatedReview).toBeTruthy()
    expect(updatedReview?.reviewComment).toBe('Test review comment')
  })

  it('should throw error when pull request not found', async () => {
    const testPayload: ReviewResponse = {
      pullRequestId: 999999,
      projectId: 1,
      repositoryId: testRepository.id,
      branchName: 'test-branch',
      review: {
        bodyMarkdown: 'Test review comment',
        summary: 'Test review summary',
        scores: [],
        issues: [],
      },
    }

    await expect(processSaveReview(testPayload)).rejects.toThrow(
      /PullRequest not found/,
    )
  })

  it('should throw error when creating overall review fails', async () => {
    // Delete the existing overall review to simulate creation failure
    await supabase.from('OverallReview').delete().eq('id', testOverallReview.id)

    const testPayload: ReviewResponse = {
      pullRequestId: testPullRequest.id,
      projectId: 999999, // Invalid project ID to cause failure
      repositoryId: testRepository.id,
      branchName: 'test-branch',
      review: {
        bodyMarkdown: 'Test review comment',
        summary: 'Test review summary',
        scores: [],
        issues: [],
      },
    }

    await expect(processSaveReview(testPayload)).rejects.toThrow(
      /Failed to create overall review/,
    )
  })
})
