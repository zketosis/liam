import { prisma } from '@liam-hq/db'
import {
  createPullRequestComment,
  updatePullRequestComment,
} from '@liam-hq/github'
import { type MockInstance, beforeEach, describe, expect, it, vi } from 'vitest'
import { postComment } from '../postComment'

// Mock the GitHub API functions
vi.mock('@liam-hq/github', () => ({
  createPullRequestComment: vi.fn(),
  updatePullRequestComment: vi.fn(),
}))

// Mock Prisma
vi.mock('@liam-hq/db', () => ({
  prisma: {
    repository: {
      findFirst: vi.fn(),
    },
    pullRequest: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}))

describe('postComment', () => {
  const mockRepository = {
    id: 1,
    name: 'test-repo',
    owner: 'test-owner',
    installationId: BigInt(1),
  }

  const mockPullRequest = {
    id: 1,
    pullNumber: BigInt(1),
    repositoryId: 1,
    commentId: null,
    migration: {
      id: 1,
      title: 'Test Migration',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default mock returns
    ;(prisma.repository.findFirst as unknown as MockInstance).mockResolvedValue(
      mockRepository,
    )
    ;(
      prisma.pullRequest.findFirst as unknown as MockInstance
    ).mockResolvedValue(mockPullRequest)
    ;(prisma.pullRequest.update as unknown as MockInstance).mockResolvedValue({
      ...mockPullRequest,
      commentId: BigInt(123),
    })
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
      pullRequestId: mockPullRequest.id,
      repositoryId: mockRepository.id,
      branchName: 'test-branch',
    }

    const result = await postComment(testPayload)

    expect(result.success).toBe(true)
    expect(createPullRequestComment).toHaveBeenCalledWith(
      Number(mockRepository.installationId),
      mockRepository.owner,
      mockRepository.name,
      Number(mockPullRequest.pullNumber),
      expect.stringContaining('Test review comment'),
    )
    expect(createPullRequestComment).toHaveBeenCalledTimes(1)
    expect(prisma.pullRequest.update).toHaveBeenCalledWith({
      where: { id: mockPullRequest.id },
      data: { commentId: BigInt(mockCommentId) },
    })
  })

  it('should update existing comment when comment exists', async () => {
    const existingCommentId = BigInt(456)
    ;(
      prisma.pullRequest.findFirst as unknown as MockInstance
    ).mockResolvedValue({
      ...mockPullRequest,
      commentId: existingCommentId,
    })

    const testPayload = {
      reviewComment: 'Updated review comment',
      projectId: 1,
      pullRequestId: mockPullRequest.id,
      repositoryId: mockRepository.id,
      branchName: 'test-branch',
    }

    const result = await postComment(testPayload)

    expect(result.success).toBe(true)
    expect(updatePullRequestComment).toHaveBeenCalledWith(
      Number(mockRepository.installationId),
      mockRepository.owner,
      mockRepository.name,
      Number(existingCommentId),
      expect.stringContaining('Updated review comment'),
    )
    expect(updatePullRequestComment).toHaveBeenCalledTimes(1)
  })

  it('should throw error when repository not found', async () => {
    ;(prisma.repository.findFirst as unknown as MockInstance).mockResolvedValue(
      null,
    )

    const testPayload = {
      reviewComment: 'Test review comment',
      projectId: 1,
      pullRequestId: mockPullRequest.id,
      repositoryId: 999,
      branchName: 'test-branch',
    }

    await expect(postComment(testPayload)).rejects.toThrow(
      'Repository with ID 999 not found',
    )
  })

  it('should throw error when pull request not found', async () => {
    ;(
      prisma.pullRequest.findFirst as unknown as MockInstance
    ).mockResolvedValue(null)

    const testPayload = {
      reviewComment: 'Test review comment',
      projectId: 1,
      pullRequestId: 999,
      repositoryId: mockRepository.id,
      branchName: 'test-branch',
    }

    await expect(postComment(testPayload)).rejects.toThrow(
      'Pull request with ID 999 not found',
    )
  })

  it('should throw error when migration not found', async () => {
    ;(
      prisma.pullRequest.findFirst as unknown as MockInstance
    ).mockResolvedValue({
      ...mockPullRequest,
      migration: null,
    })

    const testPayload = {
      reviewComment: 'Test review comment',
      projectId: 1,
      pullRequestId: mockPullRequest.id,
      repositoryId: mockRepository.id,
      branchName: 'test-branch',
    }

    await expect(postComment(testPayload)).rejects.toThrow(
      `Migration for Pull request with ID ${mockPullRequest.id} not found`,
    )
  })
})
