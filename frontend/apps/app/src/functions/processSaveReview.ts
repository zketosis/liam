import { prisma } from '@liam-hq/db'
import type { ReviewResponse } from '../types'

export async function processSaveReview(
  payload: ReviewResponse,
): Promise<{ success: boolean }> {
  try {
    const pullRequest = await prisma.pullRequest.findFirst({
      where: {
        id: payload.pullRequestId,
      },
    })

    if (!pullRequest) {
      throw new Error('PullRequest not found')
    }

    if (payload.projectId === undefined) {
      throw new Error('ProjectId is required')
    }

    // create overall review
    await prisma.overallReview.create({
      data: {
        project: {
          connect: {
            id: payload.projectId,
          },
        },
        pullRequest: {
          connect: {
            id: pullRequest.id,
          },
        },
        reviewComment: payload.reviewComment,
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error saving review:', error)
    throw error
  }
}
