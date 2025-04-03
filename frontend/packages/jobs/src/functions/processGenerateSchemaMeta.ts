import { prisma } from '@liam-hq/db'
import { v4 as uuidv4 } from 'uuid'
import { generateSchemaMeta } from '../prompts/generateSchemaMeta/generateSchemaMeta'
import type { GenerateSchemaMetaPayload, SchemaMetaResult } from '../types'
import { langfuseLangchainHandler } from './langfuseLangchainHandler'

export const processGenerateSchemaMeta = async (
  payload: GenerateSchemaMetaPayload,
): Promise<SchemaMetaResult> => {
  try {
    // Get the overall review from the database
    const overallReview = await prisma.overallReview.findUnique({
      where: {
        id: payload.overallReviewId,
      },
      include: {
        pullRequest: {
          include: {
            repository: true,
          },
        },
        project: true, // Include project directly from overallReview
      },
    })

    if (!overallReview) {
      throw new Error(
        `Overall review with ID ${payload.overallReviewId} not found`,
      )
    }

    const { pullRequest, project } = overallReview
    if (!pullRequest) {
      throw new Error(
        `Pull request not found for overall review ${payload.overallReviewId}`,
      )
    }

    if (!project) {
      throw new Error(
        `Project not found for overall review ${payload.overallReviewId}`,
      )
    }

    const { repository } = pullRequest
    if (!repository) {
      throw new Error(`Repository not found for pull request ${pullRequest.id}`)
    }

    const predefinedRunId = uuidv4()

    const callbacks = [langfuseLangchainHandler]

    const schemaMeta = await generateSchemaMeta(
      overallReview.reviewComment || '',
      callbacks,
      predefinedRunId,
    )

    // Return the schema meta along with information needed for createKnowledgeSuggestionTask
    return {
      overrides: schemaMeta.overrides,
      projectId: project.id,
      pullRequestNumber: Number(pullRequest.pullNumber), // Convert bigint to number
      branchName: overallReview.branchName, // Get branchName from overallReview
      title: `Schema meta update from PR #${Number(pullRequest.pullNumber)}`,
      traceId: predefinedRunId,
    }
  } catch (error) {
    console.error('Error generating schema meta:', error)
    throw error
  }
}
