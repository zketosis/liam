import { postComment } from '@/src/functions/postComment'
import { processGenerateReview } from '@/src/functions/processGenerateReview'
import { logger, task } from '@trigger.dev/sdk/v3'
import type { GenerateReviewPayload, ReviewResponse } from '../types'

export const savePullRequestTask = task({
  id: 'save-pull-request',
  run: async (payload: {
    pullRequestNumber: number
    projectId: number
    repositoryId: number
    schemaChanges: Array<{
      filename: string
      status: 'added' | 'modified' | 'deleted'
      changes: number
      patch: string
    }>
  }) => {
    logger.log('Executing PR save task:', { payload })
    await generateReviewTask.trigger(payload)
    return { success: true }
  },
})

export const generateReviewTask = task({
  id: 'generate-review',
  run: async (payload: GenerateReviewPayload) => {
    const reviewComment = await processGenerateReview(payload)
    logger.log('Generated review:', { reviewComment })
    await saveReviewTask.trigger({
      reviewComment,
      projectId: payload.projectId,
      pullRequestId: payload.pullRequestNumber,
      repositoryId: payload.repositoryId,
    })
    return { reviewComment }
  },
})

export const saveReviewTask = task({
  id: 'save-review',
  run: async (payload: ReviewResponse) => {
    logger.log('Executing review save task:', { payload })
    await postCommentTask.trigger(payload)
    return { success: true }
  },
})

export const postCommentTask = task({
  id: 'post-comment',
  run: async (payload: ReviewResponse) => {
    logger.log('Executing comment post task:', { payload })
    const result = await postComment(payload)
    return result
  },
})
