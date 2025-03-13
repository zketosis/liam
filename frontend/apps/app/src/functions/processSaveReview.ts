import { prisma } from '@liam-hq/db'
import type { ReviewResponse } from '../types'

export async function processSaveReview(
  payload: ReviewResponse,
): Promise<{ success: boolean }> {
  try {
    // find pull request by pull request id and repository id
    const pullRequest = await prisma.pullRequest.findUnique({
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
        projectId: payload.projectId,
        pullRequestId: pullRequest.id,
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
