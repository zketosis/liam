import { createClient } from '../libs/supabase'
import { generateSchemaMeta } from '../prompts/generateSchemaMeta/generateSchemaMeta'
import type { GenerateSchemaMetaPayload, SchemaMetaResult } from '../types'
import { langfuseLangchainHandler } from './langfuseLangchainHandler'

export const processGenerateSchemaMeta = async (
  payload: GenerateSchemaMetaPayload,
): Promise<SchemaMetaResult> => {
  try {
    const supabase = createClient()

    // Get the overall review from the database with nested relations
    const { data: overallReview, error } = await supabase
      .from('OverallReview')
      .select(`
        *,
        pullRequest:PullRequest(*,
          repository:Repository(*)
        ),
        project:Project(*)
      `)
      .eq('id', payload.overallReviewId)
      .single()

    if (error || !overallReview) {
      throw new Error(
        `Overall review with ID ${payload.overallReviewId} not found: ${JSON.stringify(error)}`,
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

    const callbacks = [langfuseLangchainHandler]

    const schemaMeta = await generateSchemaMeta(
      overallReview.reviewComment || '',
      callbacks,
    )

    // Return the schema meta along with information needed for createKnowledgeSuggestionTask
    return {
      overrides: schemaMeta.overrides,
      projectId: project.id,
      pullRequestNumber: Number(pullRequest.pullNumber), // Convert bigint to number
      branchName: overallReview.branchName, // Get branchName from overallReview
      title: `Schema meta update from PR #${Number(pullRequest.pullNumber)}`,
    }
  } catch (error) {
    console.error('Error generating schema meta:', error)
    throw error
  }
}
