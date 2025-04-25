import { v4 as uuidv4 } from 'uuid'
import { createClient } from '../libs/supabase'
import { generateSchemaOverride } from '../prompts/generateSchemaOverride/generateSchemaOverride'
import type {
  GenerateSchemaOverridePayload,
  SchemaOverrideResult,
} from '../types'
import { fetchSchemaInfoWithOverrides } from '../utils/schemaUtils'
import { langfuseLangchainHandler } from './langfuseLangchainHandler'

export const processGenerateSchemaOverride = async (
  payload: GenerateSchemaOverridePayload,
): Promise<SchemaOverrideResult> => {
  const supabase = createClient()

  // Get the overall review from the database with nested relations
  const { data: overallReview, error } = await supabase
    .from('overall_reviews')
    .select(`
      *,
      github_pull_requests(*,
        github_repositories(*)
      ),
      projects(*)
    `)
    .eq('id', payload.overallReviewId)
    .single()

  if (error || !overallReview) {
    throw new Error(
      `Overall review with ID ${payload.overallReviewId} not found: ${JSON.stringify(error)}`,
    )
  }

  const { github_pull_requests, projects } = overallReview
  if (!github_pull_requests) {
    throw new Error(
      `Pull request not found for overall review ${payload.overallReviewId}`,
    )
  }

  if (!projects) {
    throw new Error(
      `Project not found for overall review ${payload.overallReviewId}`,
    )
  }

  const repositories = github_pull_requests.github_repositories
  if (!repositories) {
    throw new Error(
      `Repository not found for pull request ${github_pull_requests.id}`,
    )
  }

  const predefinedRunId = uuidv4()
  const callbacks = [langfuseLangchainHandler]

  // Fetch schema information with overrides
  const repositoryFullName = `${repositories.owner}/${repositories.name}`
  const { currentSchemaOverride, overriddenSchema } =
    await fetchSchemaInfoWithOverrides(
      projects.id,
      overallReview.branch_name,
      repositoryFullName,
      repositories.github_installation_identifier,
    )

  const schemaOverrideResult = await generateSchemaOverride(
    overallReview.review_comment || '',
    callbacks,
    currentSchemaOverride,
    predefinedRunId,
    overriddenSchema,
  )

  // If no update is needed, return early with createNeeded: false
  if (!schemaOverrideResult.updateNeeded) {
    return {
      createNeeded: false,
    }
  }

  // Return the schema meta along with information needed for createKnowledgeSuggestionTask
  return {
    createNeeded: true,
    override: schemaOverrideResult.override,
    projectId: projects.id,
    pullRequestNumber: Number(github_pull_requests.pull_number), // Convert bigint to number
    branchName: overallReview.branch_name, // Get branchName from overallReview
    title: `Schema meta update from PR #${Number(github_pull_requests.pull_number)}`,
    traceId: predefinedRunId,
    reasoning: schemaOverrideResult.reasoning,
    overallReviewId: payload.overallReviewId,
  }
}
