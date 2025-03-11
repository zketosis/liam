import { logger, task } from '@trigger.dev/sdk/v3'

export const savePullRequestTask = task({
  id: 'save-pull-request',
  run: async (payload: {
    prNumber: number
    repositoryId: string
    title: string
  }) => {
    logger.log('Executing PR save task:', { payload })
    await generateReviewTask.trigger({
      prNumber: payload.prNumber,
      repositoryId: payload.repositoryId,
      schemaChanges: 'schemaChanges',
    })
    return { success: true }
  },
})

export const generateReviewTask = task({
  id: 'generate-review',
  run: async (payload: {
    prNumber: number
    repositoryId: string
    schemaChanges: string
  }) => {
    logger.log('Executing review generation task:', { payload })
    const review = {
      summary: 'Test Review',
      suggestions: [
        {
          title: 'Test Suggestion',
          description: 'This is a test suggestion',
          severity: 'low',
        },
      ],
      bestPractices: ['Test Best Practice'],
    }
    await saveReviewTask.trigger({
      prNumber: payload.prNumber,
      repositoryId: payload.repositoryId,
      review,
    })
    return review
  },
})

export const saveReviewTask = task({
  id: 'save-review',
  run: async (payload: {
    prNumber: number
    repositoryId: string
    review: Record<string, unknown>
  }) => {
    logger.log('Executing review save task:', { payload })
    await postCommentTask.trigger({
      prNumber: payload.prNumber,
      repositoryId: payload.repositoryId,
      review: payload.review,
    })
    return { success: true }
  },
})

export const postCommentTask = task({
  id: 'post-comment',
  run: async (payload: {
    prNumber: number
    repositoryId: string
    review: Record<string, unknown>
  }) => {
    logger.log('Executing comment post task:', { payload })
    return { success: true }
  },
})
