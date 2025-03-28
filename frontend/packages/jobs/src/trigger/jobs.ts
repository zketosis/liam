import { logger, task } from '@trigger.dev/sdk/v3'
import { getInstallationIdFromRepositoryId } from '../functions/getInstallationIdFromRepositoryId'
import { postComment } from '../functions/postComment'
import { processCreateKnowledgeSuggestion } from '../functions/processCreateKnowledgeSuggestion'
import { processGenerateDocsSuggestion } from '../functions/processGenerateDocsSuggestion'
import { processGenerateReview } from '../functions/processGenerateReview'
import { processSavePullRequest } from '../functions/processSavePullRequest'
import { processSaveReview } from '../functions/processSaveReview'
import type {
  GenerateReviewPayload,
  ReviewResponse,
  SavePullRequestWithProjectPayload,
} from '../types'
import { helloWorldTask } from './helloworld'

export const savePullRequestTask = task({
  id: 'save-pull-request',
  run: async (payload: {
    pullRequestNumber: number
    pullRequestTitle: string
    projectId: number
    owner: string
    name: string
    repositoryId: number
    branchName: string
  }) => {
    logger.log('Executing PR save task:', { payload })

    try {
      const result = await processSavePullRequest({
        prNumber: payload.pullRequestNumber,
        pullRequestTitle: payload.pullRequestTitle,
        owner: payload.owner,
        name: payload.name,
        repositoryId: payload.repositoryId,
        branchName: payload.branchName,
      })
      logger.info('Successfully saved PR to database:', { prId: result.prId })

      // Trigger the next task in the chain - generate review
      await generateReviewTask.trigger({
        ...payload,
        pullRequestId: result.prId,
        projectId: payload.projectId,
        repositoryId: payload.repositoryId,
        schemaFiles: result.schemaFiles,
        schemaChanges: result.schemaChanges,
      })

      return result
    } catch (error) {
      logger.error('Error in savePullRequest task:', { error })
      throw error
    }
  },
})

export const generateReviewTask = task({
  id: 'generate-review',
  run: async (payload: GenerateReviewPayload) => {
    const reviewComment = await processGenerateReview(payload)
    logger.log('Generated review:', { reviewComment })
    await saveReviewTask.trigger({
      reviewComment,
      ...payload,
    })
    return { reviewComment }
  },
})

export const saveReviewTask = task({
  id: 'save-review',
  run: async (payload: ReviewResponse & GenerateReviewPayload) => {
    logger.log('Executing review save task:', { payload })
    try {
      await processSaveReview(payload)

      logger.log('Creating knowledge suggestions for docs:', {
        count: payload.schemaFiles.length,
      })

      const installationId = await getInstallationIdFromRepositoryId(
        payload.repositoryId,
      )

      await postCommentTask.trigger({
        reviewComment: payload.reviewComment,
        projectId: payload.projectId,
        pullRequestId: payload.pullRequestId,
        repositoryId: payload.repositoryId,
        branchName: payload.branchName,
      })

      // Trigger docs suggestion generation after review is saved
      await generateDocsSuggestionTask.trigger({
        reviewComment: payload.reviewComment,
        projectId: payload.projectId,
        pullRequestNumber: payload.pullRequestNumber,
        owner: payload.owner,
        name: payload.name,
        installationId,
        type: 'DOCS',
        branchName: payload.branchName,
      })

      return { success: true }
    } catch (error) {
      console.error('Error in review process:', error)

      if (error instanceof Error) {
        return {
          success: false,
          error: {
            message: error.message,
            type: error.constructor.name,
          },
        }
      }

      return {
        success: false,
        error: {
          message: 'An unexpected error occurred',
          type: 'UnknownError',
        },
      }
    }
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

export const generateDocsSuggestionTask = task({
  id: 'generate-docs-suggestion',
  run: async (payload: {
    reviewComment: string
    projectId: number
    pullRequestNumber: number
    owner: string
    name: string
    installationId: number
    type: 'DOCS'
    branchName: string
  }) => {
    const suggestions = await processGenerateDocsSuggestion(payload)
    logger.log('Generated docs suggestions:', { suggestions })

    const suggestionKeys = [
      'schemaPatterns',
      'schemaContext',
      'migrationPatterns',
      'migrationOpsContext',
      'liamrules',
    ]

    for (const key of suggestionKeys) {
      // Execute each task
      await createKnowledgeSuggestionTask.trigger({
        projectId: payload.projectId,
        type: payload.type,
        title: `Docs update from PR #${payload.pullRequestNumber}`,
        path: `docs/${key}`,
        content: suggestions[key],
        repositoryOwner: payload.owner,
        repositoryName: payload.name,
        installationId: payload.installationId,
        branch: payload.branchName,
      })

      // Wait for 2 seconds before processing the next task to avoid API rate limits
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    return { suggestions }
  },
})

export const createKnowledgeSuggestionTask = task({
  id: 'create-knowledge-suggestion',
  run: async (payload: {
    projectId: number
    type: 'SCHEMA' | 'DOCS'
    title: string
    path: string
    content: string
    repositoryOwner: string
    repositoryName: string
    installationId: number
    branch: string
  }) => {
    logger.log('Executing create knowledge suggestion task:', { payload })
    try {
      const result = await processCreateKnowledgeSuggestion(payload)
      logger.info('Successfully created knowledge suggestion:', {
        suggestionId: result.suggestionId,
      })
      return result
    } catch (error) {
      logger.error('Error in createKnowledgeSuggestion task:', { error })
      throw error
    }
  },
})

export const savePullRequest = async (
  payload: SavePullRequestWithProjectPayload,
) => {
  await savePullRequestTask.trigger({
    pullRequestNumber: payload.prNumber,
    pullRequestTitle: payload.pullRequestTitle,
    projectId: payload.projectId,
    owner: payload.owner,
    name: payload.name,
    repositoryId: payload.repositoryId,
    branchName: payload.branchName,
  })
}

export const helloWorld = async (name?: string) => {
  await helloWorldTask.trigger({ name: name ?? 'World' })
}
