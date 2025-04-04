import { createClient } from '../libs/supabase'
import type { ReviewResponse } from '../types'

export const processSaveReview = async (
  payload: ReviewResponse,
): Promise<{ success: boolean }> => {
  try {
    const supabase = createClient()
    const { data: pullRequest, error: pullRequestError } = await supabase
      .from('PullRequest')
      .select('*')
      .eq('id', payload.pullRequestId)
      .single()

    if (pullRequestError || !pullRequest) {
      throw new Error(
        `PullRequest not found: ${JSON.stringify(pullRequestError)}`,
      )
    }

    const now = new Date().toISOString()

    // create overall review
    const { data: overallReview, error: overallReviewError } = await supabase
      .from('OverallReview')
      .insert({
        projectId: payload.projectId,
        pullRequestId: pullRequest.id,
        reviewComment: payload.review.bodyMarkdown,
        branchName: payload.branchName,
        traceId: payload.traceId,
        updatedAt: now,
      })
      .select()
      .single()

    if (overallReviewError || !overallReview) {
      throw new Error(
        `Failed to create overall review: ${JSON.stringify(overallReviewError)}`,
      )
    }

    // create review scores
    const reviewScores = payload.review.scores.map((score) => ({
      overallReviewId: overallReview.id,
      overallScore: score.value,
      category: mapCategoryEnum(score.kind),
      reason: score.reason,
      updatedAt: now,
    }))

    const { error: reviewScoresError } = await supabase
      .from('ReviewScore')
      .insert(reviewScores)

    if (reviewScoresError) {
      throw new Error(
        `Failed to create review scores: ${JSON.stringify(reviewScoresError)}`,
      )
    }

    // create review issues
    const reviewIssues = payload.review.issues.map((issue) => ({
      overallReviewId: overallReview.id,
      category: mapCategoryEnum(issue.kind),
      severity: issue.severity,
      description: issue.description,
      updatedAt: now,
    }))

    const { error: reviewIssuesError } = await supabase
      .from('ReviewIssue')
      .insert(reviewIssues)

    if (reviewIssuesError) {
      throw new Error(
        `Failed to create review issues: ${JSON.stringify(reviewIssuesError)}`,
      )
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error saving review:', error)
    throw error
  }
}

// Helper function to map category from review schema to CategoryEnum
const mapCategoryEnum = (
  category: string,
):
  | 'MIGRATION_SAFETY'
  | 'DATA_INTEGRITY'
  | 'PERFORMANCE_IMPACT'
  | 'PROJECT_RULES_CONSISTENCY'
  | 'SECURITY_OR_SCALABILITY' => {
  const mapping: Record<
    string,
    | 'MIGRATION_SAFETY'
    | 'DATA_INTEGRITY'
    | 'PERFORMANCE_IMPACT'
    | 'PROJECT_RULES_CONSISTENCY'
    | 'SECURITY_OR_SCALABILITY'
  > = {
    'Migration Safety': 'MIGRATION_SAFETY',
    'Data Integrity': 'DATA_INTEGRITY',
    'Performance Impact': 'PERFORMANCE_IMPACT',
    'Project Rules Consistency': 'PROJECT_RULES_CONSISTENCY',
    'Security or Scalability': 'SECURITY_OR_SCALABILITY',
  }
  const result = mapping[category]
  if (!result) {
    throw new Error(`Invalid category: ${category}`)
  }
  return result
}
