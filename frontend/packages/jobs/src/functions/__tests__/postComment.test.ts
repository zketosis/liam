import {
  createPullRequestComment,
  updatePullRequestComment,
} from '@liam-hq/github'
import {
  type MockInstance,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { createClient } from '../../libs/supabase'
import { postComment } from '../postComment'

// Mock the GitHub API functions
vi.mock('@liam-hq/github', () => ({
  createPullRequestComment: vi.fn(),
  updatePullRequestComment: vi.fn(),
}))

// Mock environment variables
vi.stubEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')

describe('postComment', () => {
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
    id: 1,
    pullNumber: 1,
    repositoryId: 9999,
    commentId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const testMigration = {
    id: 9999,
    title: 'Test Migration',
    pullRequestId: 9999,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Setup: Insert test data before tests
  beforeEach(async () => {
    vi.clearAllMocks()

    // Insert test data
    await supabase.from('Repository').insert(testRepository)
    await supabase.from('PullRequest').insert(testPullRequest)
    await supabase.from('Migration').insert(testMigration)
  })

  // Cleanup: Remove test data after tests
  afterEach(async () => {
    // Delete test data in reverse order to avoid foreign key constraints
    await supabase.from('Migration').delete().eq('id', testMigration.id)
    await supabase.from('PullRequest').delete().eq('id', testPullRequest.id)
    await supabase.from('Repository').delete().eq('id', testRepository.id)
  })

  it('should create a new comment when no comment exists', async () => {
    const mockCommentId = 123
    ;(createPullRequestComment as unknown as MockInstance).mockResolvedValue({
      id: mockCommentId,
      node_id: 'test-node-id',
      url: 'https://github.com/test/test/pull/1#discussion_r123',
    })

    const testPayload = {
      reviewComment: 'Test review comment',
      projectId: 1,
      pullRequestId: testPullRequest.id,
      repositoryId: testRepository.id,
      branchName: 'test-branch',
    }

    const result = await postComment(testPayload)

    expect(result.success).toBe(true)
    expect(createPullRequestComment).toHaveBeenCalledWith(
      testRepository.installationId,
      testRepository.owner,
      testRepository.name,
      testPullRequest.pullNumber,
      expect.stringContaining(`Test review comment

Migration URL: ${process.env['NEXT_PUBLIC_BASE_URL']}/app/migrations/${testMigration.id}`),
    )
    expect(createPullRequestComment).toHaveBeenCalledTimes(1)

    // Verify the update in the database
    const { data: updatedPR } = await supabase
      .from('PullRequest')
      .select('*')
      .eq('id', testPullRequest.id)
      .single()

    expect(updatedPR?.commentId).toBe(mockCommentId)
  })

  it('should update existing comment when comment exists', async () => {
    // First update the test pull request to have a comment ID
    const existingCommentId = 456
    await supabase
      .from('PullRequest')
      .update({ commentId: existingCommentId })
      .eq('id', testPullRequest.id)

    const testPayload = {
      reviewComment: 'Updated review comment',
      projectId: 1,
      pullRequestId: testPullRequest.id,
      repositoryId: testRepository.id,
      branchName: 'test-branch',
    }

    const result = await postComment(testPayload)

    expect(result.success).toBe(true)
    expect(updatePullRequestComment).toHaveBeenCalledWith(
      testRepository.installationId,
      testRepository.owner,
      testRepository.name,
      existingCommentId,
      expect.stringContaining('Updated review comment'),
    )
    expect(updatePullRequestComment).toHaveBeenCalledTimes(1)
  })

  it('should throw error when repository not found', async () => {
    const testPayload = {
      reviewComment: 'Test review comment',
      projectId: 1,
      pullRequestId: testPullRequest.id,
      repositoryId: 999999, // Non-existent ID
      branchName: 'test-branch',
    }

    await expect(postComment(testPayload)).rejects.toThrow(
      /Repository with ID 999999 not found/,
    )
  })

  it('should throw error when pull request not found', async () => {
    const testPayload = {
      reviewComment: 'Test review comment',
      projectId: 1,
      pullRequestId: 999999, // Non-existent ID
      repositoryId: testRepository.id,
      branchName: 'test-branch',
    }

    await expect(postComment(testPayload)).rejects.toThrow(
      /Pull request with ID 999999 not found/,
    )
  })

  it('should throw error when migration not found', async () => {
    // Create a pull request without a migration
    const prWithoutMigration = {
      id: 8888,
      pullNumber: 2,
      repositoryId: testRepository.id,
      commentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await supabase.from('PullRequest').insert(prWithoutMigration)

    const testPayload = {
      reviewComment: 'Test review comment',
      projectId: 1,
      pullRequestId: prWithoutMigration.id,
      repositoryId: testRepository.id,
      branchName: 'test-branch',
    }

    try {
      await expect(postComment(testPayload)).rejects.toThrow(
        /Migration for Pull request with ID 8888 not found/,
      )
    } finally {
      // Clean up the extra test data
      await supabase
        .from('PullRequest')
        .delete()
        .eq('id', prWithoutMigration.id)
    }
  })
})
