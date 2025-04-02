import { prisma } from '@liam-hq/db'
import { logger, task } from '@trigger.dev/sdk/v3'

// FIXME: This should be imported from the app package once we have proper package structure
const OVERRIDE_SCHEMA_FILE_PATH = '.liam/schema-meta.json'
import { getInstallationIdFromRepositoryId } from '../functions/getInstallationIdFromRepositoryId'
import { postComment } from '../functions/postComment'
import { processCreateKnowledgeSuggestion } from '../functions/processCreateKnowledgeSuggestion'
import {
  DOC_FILES,
  processGenerateDocsSuggestion,
} from '../functions/processGenerateDocsSuggestion'
import { processGenerateReview } from '../functions/processGenerateReview'
import { processGenerateSchemaMeta } from '../functions/processGenerateSchemaMeta'
import { processSavePullRequest } from '../functions/processSavePullRequest'
import { processSaveReview } from '../functions/processSaveReview'
import type {
  GenerateReviewPayload,
  PostCommentPayload,
  GenerateSchemaMetaPayload,
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
    const review = await processGenerateReview(payload)
    logger.log('Generated review:', { review })
    await saveReviewTask.trigger({
      review,
      ...payload,
    })
    return { review }
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
        reviewComment: payload.review.bodyMarkdown,
        projectId: payload.projectId,
        pullRequestId: payload.pullRequestId,
        repositoryId: payload.repositoryId,
        branchName: payload.branchName,
      })

      // Trigger docs suggestion generation after review is saved
      await generateDocsSuggestionTask.trigger({
        reviewComment: payload.review.bodyMarkdown,
        projectId: payload.projectId,
        pullRequestNumber: payload.pullRequestNumber,
        owner: payload.owner,
        name: payload.name,
        installationId,
        type: 'DOCS',
        branchName: payload.branchName,
      })

      // Get the overall review ID from the database
      const overallReview = await prisma.overallReview.findFirst({
        where: {
          pullRequestId: payload.pullRequestId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
        },
      })

      if (!overallReview) {
        logger.error('No overall review found for pull request', {
          pullRequestId: payload.pullRequestId,
        })
      } else {
        // Trigger schema meta suggestion generation after review is saved
        await generateSchemaMetaSuggestionTask.trigger({
          overallReviewId: overallReview.id,
        })
      }

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
  run: async (payload: PostCommentPayload) => {
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

    for (const key of DOC_FILES) {
      const content = suggestions[key]
      if (!content) {
        logger.warn(`No content found for suggestion key: ${key}`)
        continue
      }

      await createKnowledgeSuggestionTask.trigger({
        projectId: payload.projectId,
        type: payload.type,
        title: `Docs update from PR #${payload.pullRequestNumber}`,
        path: `docs/${key}`,
        content,
        branch: payload.branchName,
      })
    }

    return { suggestions }
  },
})

export const generateSchemaMetaSuggestionTask = task({
  id: 'generate-schema-meta-suggestion',
  run: async (payload: GenerateSchemaMetaPayload) => {
    logger.log('Executing schema meta suggestion task:', { payload })
    const result = await processGenerateSchemaMeta(payload)
    logger.info('Generated schema meta suggestion:', { result })

    // Create a knowledge suggestion with the schema meta using the returned information
    await createKnowledgeSuggestionTask.trigger({
      projectId: result.projectId,
      type: 'SCHEMA',
      title: result.title,
      path: OVERRIDE_SCHEMA_FILE_PATH,
      content: JSON.stringify(result.overrides, null, 2),
      branch: result.branchName,
    })

    return { result }
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
  const projectMapping = await prisma.projectRepositoryMapping.findFirst({
    where: {
      projectId: payload.projectId,
    },
    include: {
      repository: true,
    },
  })

  if (!projectMapping) {
    throw new Error(`No repository found for project ID: ${payload.projectId}`)
  }

  const { repository } = projectMapping

  await savePullRequestTask.trigger({
    pullRequestNumber: payload.prNumber,
    pullRequestTitle: payload.pullRequestTitle,
    projectId: payload.projectId,
    owner: repository.owner,
    name: repository.name,
    repositoryId: repository.id,
    branchName: payload.branchName,
  })
}

export const helloWorld = async (name?: string) => {
  await helloWorldTask.trigger({ name: name ?? 'World' })
}
