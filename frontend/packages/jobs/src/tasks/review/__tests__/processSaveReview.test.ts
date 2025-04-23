import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createClient } from '../../../libs/supabase'
import type { ReviewResponse } from '../generateReview'
import { processSaveReview } from '../saveReview'

vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')

describe.skip('processSaveReview', () => {
  const supabase = createClient()

  const testOrganization = {
    id: '9999',
    name: 'test-organization',
  }

  const testRepository = {
    id: '9999',
    name: 'test-repo',
    owner: 'test-owner',
    github_installation_identifier: 12345,
    github_repository_identifier: 67890,
    organization_id: testOrganization.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const testPullRequest = {
    id: '9999',
    pull_number: 9999,
    repository_id: '9999',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const testProject = {
    id: '9999',
    name: 'test-project',
    organization_id: testOrganization.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    await supabase.from('organizations').insert(testOrganization)
    await supabase.from('github_repositories').insert(testRepository)
    await supabase.from('github_pull_requests').insert(testPullRequest)
    await supabase.from('projects').insert(testProject)
  })

  afterEach(async () => {
    const { data: reviews } = await supabase
      .from('overall_reviews')
      .select('id')
      .eq('pull_request_id', testPullRequest.id)

    if (reviews && reviews.length > 0) {
      const reviewIds = reviews.map((r) => r.id)
      await supabase
        .from('review_feedbacks')
        .delete()
        .in('overall_review_id', reviewIds)
      await supabase.from('overall_reviews').delete().in('id', reviewIds)
    }

    await supabase
      .from('github_pull_requests')
      .delete()
      .eq('id', testPullRequest.id)
    await supabase.from('projects').delete().eq('id', testProject.id)
    await supabase
      .from('github_repositories')
      .delete()
      .eq('id', testRepository.id)
    await supabase.from('organizations').delete().eq('id', testOrganization.id)
  })

  it('should save review successfully', async () => {
    const testPayload: ReviewResponse = {
      pullRequestId: testPullRequest.id,
      projectId: testProject.id,
      repositoryId: testRepository.id,
      branchName: 'test-branch',
      traceId: 'test-trace-id-123',
      pullRequestNumber: testPullRequest.pull_number,
      owner: testRepository.owner,
      name: testRepository.name,
      review: {
        bodyMarkdown: 'Test review comment',
        feedbacks: [
          {
            kind: 'Migration Safety',
            severity: 'CRITICAL',
            description: 'Test issue',
            suggestion: 'Fix the issue',
            suggestionSnippets: [],
          },
        ],
      },
    }

    const result = await processSaveReview(testPayload)
    expect(result.success).toBe(true)

    const { data: review, error } = await supabase
      .from('overall_reviews')
      .select('*')
      .eq('pull_request_id', testPullRequest.id)
      .single()

    if (error) throw error
    expect(review).toBeTruthy()
    expect(review.project_id).toBe(testProject.id)

    const { data: issues, error: issuesError } = await supabase
      .from('review_feedbacks')
      .select('*')
      .eq('overall_review_id', review.id)
    if (issuesError) throw issuesError
    expect(issues).toBeTruthy()
    expect(issues.length).toBeGreaterThanOrEqual(1)
  })

  it('should throw error when pull request not found', async () => {
    const testPayload: ReviewResponse = {
      pullRequestId: '999999',
      projectId: '9999',
      repositoryId: '9999',
      branchName: 'test-branch',
      traceId: 'test-trace-id-123',
      pullRequestNumber: 999,
      owner: 'test-owner',
      name: 'test-repo',
      review: {
        bodyMarkdown: 'Test review',
        feedbacks: [],
      },
    }

    await expect(processSaveReview(testPayload)).rejects.toThrow(
      /PullRequest not found/,
    )
  })

  it('should throw error when creating overall review fails', async () => {
    const testPayload: ReviewResponse = {
      pullRequestId: '9999',
      projectId: '999999',
      repositoryId: '9999',
      branchName: 'test-branch',
      traceId: 'test-trace-id-123',
      pullRequestNumber: 999,
      owner: 'test-owner',
      name: 'test-repo',
      review: {
        bodyMarkdown: 'Test review',
        feedbacks: [],
      },
    }

    await expect(processSaveReview(testPayload)).rejects.toThrow(
      /Failed to create overall review/,
    )
  })
})
