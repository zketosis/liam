import { prisma } from '@liam-hq/db'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReviewResponse } from '../../types'
import { processSaveReview } from '../processSaveReview'

// Mock Prisma client
vi.mock('@liam-hq/db', () => ({
  prisma: {
    pullRequest: {
      findUnique: vi.fn(),
    },
    overallReview: {
      create: vi.fn(),
    },
  },
}))

describe('processSaveReview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should save review successfully', async () => {
    const mockPullRequest = {
      id: 1,
      pullNumber: BigInt(1),
      commentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      repositoryId: 1,
    }
    const mockOverallReview = {
      id: 1,
      projectId: 1,
      pullRequestId: mockPullRequest.id,
      reviewComment: 'Test review comment',
      branchName: 'test-branch',
      createdAt: new Date(),
      updatedAt: new Date(),
      reviewedAt: new Date(),
    }

    // Mock Prisma responses
    vi.mocked(prisma.pullRequest.findUnique).mockResolvedValueOnce(
      mockPullRequest,
    )
    vi.mocked(prisma.overallReview.create).mockResolvedValueOnce(
      mockOverallReview,
    )

    const testPayload: ReviewResponse = {
      pullRequestId: mockPullRequest.id,
      projectId: 1,
      repositoryId: 1,
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
    expect(prisma.pullRequest.findUnique).toHaveBeenCalledWith({
      where: { id: testPayload.pullRequestId },
    })
    expect(prisma.overallReview.create).toHaveBeenCalledWith({
      data: {
        projectId: testPayload.projectId,
        pullRequestId: mockPullRequest.id,
        reviewComment: testPayload.review.bodyMarkdown,
        branchName: testPayload.branchName,
        updatedAt: expect.any(Date),
        reviewScores: {
          create: [
            {
              overallScore: 8,
              category: 'MIGRATION_SAFETY',
              reason: 'Good migration safety',
              updatedAt: expect.any(Date),
            },
          ],
        },
        reviewIssues: {
          create: [
            {
              category: 'MIGRATION_SAFETY',
              severity: 'CRITICAL',
              description: 'Test issue',
              updatedAt: expect.any(Date),
            },
          ],
        },
      },
    })
  })

  it('should throw error when pull request not found', async () => {
    vi.mocked(prisma.pullRequest.findUnique).mockResolvedValueOnce(null)

    const testPayload: ReviewResponse = {
      pullRequestId: 999,
      projectId: 1,
      repositoryId: 999,
      branchName: 'test-branch',
      review: {
        bodyMarkdown: 'Test review comment',
        summary: 'Test review summary',
        scores: [],
        issues: [],
      },
    }

    await expect(processSaveReview(testPayload)).rejects.toThrow(
      'PullRequest not found',
    )
    expect(prisma.pullRequest.findUnique).toHaveBeenCalledWith({
      where: { id: testPayload.pullRequestId },
    })
  })
})
