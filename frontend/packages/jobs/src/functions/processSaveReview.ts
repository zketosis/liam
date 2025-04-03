import { prisma } from '@liam-hq/db'
import type { ReviewResponse } from '../types'

export const processSaveReview = async (
  payload: ReviewResponse,
): Promise<{ success: boolean }> => {
  try {
    const pullRequest = await prisma.pullRequest.findFirst({
      where: {
        id: payload.pullRequestId,
      },
    })

    if (!pullRequest) {
      throw new Error('PullRequest not found')
    }

    // create overall review
    await prisma.overallReview.create({
      data: {
        ...(payload.projectId
          ? {
              project: {
                connect: {
                  id: payload.projectId,
                },
              },
            }
          : {}),
        pullRequest: {
          connect: {
            id: pullRequest.id,
          },
        },
        reviewComment: payload.reviewComment,
        branchName: payload.branchName,
        traceId: payload.traceId,
      } as any, // Using 'any' instead of Prisma.OverallReviewCreateInput due to type issues
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error saving review:', error)
    throw error
  }
}
