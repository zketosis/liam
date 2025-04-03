import { prisma } from '@liam-hq/db'
import { type MockInstance, beforeEach, describe, expect, it, vi } from 'vitest'
import { processSaveReview } from '../processSaveReview'

// Mock Prisma
vi.mock('@liam-hq/db', () => ({
  prisma: {
    pullRequest: {
      findFirst: vi.fn(),
    },
    overallReview: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}))

describe('processSaveReview', () => {
  const mockPullRequest = {
    id: 1,
    pullNumber: BigInt(1),
    repositoryId: 1,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Setup default mock returns
    ;(
      prisma.pullRequest.findFirst as unknown as MockInstance
    ).mockResolvedValue(mockPullRequest)
    ;(prisma.overallReview.create as unknown as MockInstance).mockResolvedValue(
      {
        id: 1,
        projectId: 1,
        pullRequestId: mockPullRequest.id,
        reviewComment: 'Test review comment',
        branchName: 'test-branch',
      },
    )
  })

  it('should successfully save a review', async () => {
    const testPayload = {
      pullRequestId: mockPullRequest.id,
      pullRequestNumber: mockPullRequest.pullNumber,
      repositoryId: 1,
      projectId: 1,
      reviewComment: 'Test review comment',
      branchName: 'test-branch',
      traceId: 'test-trace-id-123',
    }

    const result = await processSaveReview(testPayload)

    expect(result.success).toBe(true)
    expect(prisma.overallReview.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          project: {
            connect: {
              id: testPayload.projectId,
            },
          },
          pullRequest: {
            connect: {
              id: mockPullRequest.id,
            },
          },
          reviewComment: testPayload.reviewComment,
          branchName: testPayload.branchName,
        }),
      }),
    )
  })

  it('should throw error when pull request not found', async () => {
    ;(
      prisma.pullRequest.findFirst as unknown as MockInstance
    ).mockResolvedValue(null)

    const testPayload = {
      pullRequestId: 999,
      pullRequestNumber: BigInt(999),
      repositoryId: 999,
      projectId: 1,
      reviewComment: 'Test review comment',
      branchName: 'test-branch',
      traceId: 'test-trace-id-123',
    }

    await expect(processSaveReview(testPayload)).rejects.toThrow(
      'PullRequest not found',
    )
  })
})
