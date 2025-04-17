'use server'

import { type SupabaseClient, createClient } from '@/libs/db/server'
import { generateKnowledgeFromFeedbackTask } from '@liam-hq/jobs'
import type { Review, ReviewFeedback } from '@liam-hq/jobs/src/types'
import { categoryToKind } from '@liam-hq/jobs/src/utils/categoryUtils'
import * as v from 'valibot'

const requestSchema = v.object({
  feedbackId: v.pipe(v.string()),
  resolutionComment: v.optional(v.nullable(v.string())),
})

/**
 * Fetches feedback data with related information
 */
async function getFeedbackData(supabase: SupabaseClient, feedbackId: number) {
  const { data, error } = await supabase
    .from('ReviewFeedback')
    .select(`
      *,
      overallReview:overallReviewId(
        id,
        projectId,
        pullRequest:pullRequestId(
          id,
          repositoryId,
          pullNumber,
          repository:repositoryId(
            owner,
            name,
            installationId
          )
        ),
        branchName
      )
    `)
    .eq('id', feedbackId)
    .single()

  if (error || !data) {
    throw new Error(
      `Failed to fetch feedback data: ${error?.message || 'Not found'}`,
    )
  }

  return data
}

/**
 * Updates feedback to mark it as resolved
 */
async function updateFeedbackAsResolved(
  supabase: SupabaseClient,
  feedbackId: number,
  resolutionComment?: string | null,
) {
  const { data, error } = await supabase
    .from('ReviewFeedback')
    .update({
      resolvedAt: new Date().toISOString(),
      resolutionComment: resolutionComment || null,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', feedbackId)
    .select()

  if (error) {
    throw new Error(`Failed to resolve feedback: ${error.message}`)
  }

  return data
}

/**
 * Fetches complete OverallReview data
 */
async function getCompleteOverallReview(
  supabase: SupabaseClient,
  overallReviewId: number,
) {
  const { data, error } = await supabase
    .from('OverallReview')
    .select('*')
    .eq('id', overallReviewId)
    .single()

  if (error || !data) {
    throw new Error(
      `Failed to fetch complete OverallReview: ${error?.message || 'Not found'}`,
    )
  }

  if (!data.projectId) {
    throw new Error('Project ID not found in OverallReview')
  }

  return data
}

/**
 * Formats feedback data into review format
 */
function formatReviewFromFeedback(feedback: ReviewFeedback): Review {
  return {
    bodyMarkdown: feedback.description || '',
    feedbacks: [
      {
        kind: categoryToKind(feedback.category),
        severity: feedback.severity,
        description: feedback.description || '',
        suggestion: feedback.suggestion || '',
        suggestionSnippets: [],
      },
    ],
  }
}

/**
 * Fetches and adds snippet data to the review
 */
async function addSnippetsToReview(
  supabase: SupabaseClient,
  feedbackId: number,
  review: Review,
): Promise<Review> {
  const { data, error } = await supabase
    .from('ReviewSuggestionSnippet')
    .select('*')
    .eq('reviewFeedbackId', feedbackId)

  if (error) {
    console.warn(`Error fetching snippets: ${error.message}`)
    return review
  }

  if (data && data.length > 0) {
    review.feedbacks[0].suggestionSnippets = data.map(
      (snippet: { filename: string; snippet: string }) => ({
        filename: snippet.filename,
        snippet: snippet.snippet,
      }),
    )
  }

  return review
}

/**
 * Main function to resolve review feedback and generate knowledge if needed
 */
export const resolveReviewFeedback = async (data: {
  feedbackId: string
  resolutionComment?: string | null
}) => {
  // Validate input data
  const parsedData = v.safeParse(requestSchema, data)
  if (!parsedData.success) {
    throw new Error(`Invalid data: ${JSON.stringify(parsedData.issues)}`)
  }

  const { feedbackId, resolutionComment } = parsedData.output
  let taskId: string | null = null

  try {
    const supabase = await createClient()

    // Get feedback data
    const feedbackData = await getFeedbackData(supabase, feedbackId)

    // Update feedback as resolved
    const updatedFeedback = await updateFeedbackAsResolved(
      supabase,
      feedbackId,
      resolutionComment,
    )

    // Skip knowledge generation for POSITIVE feedback
    if (updatedFeedback[0].severity === 'POSITIVE') {
      return { success: true, data: updatedFeedback, taskId: null }
    }

    // Get complete OverallReview data
    const completeOverallReview = await getCompleteOverallReview(
      supabase,
      feedbackData.overallReviewId,
    )

    // Format review from feedback
    let reviewFormatted = formatReviewFromFeedback(updatedFeedback[0])

    // Add snippets to review
    reviewFormatted = await addSnippetsToReview(
      supabase,
      feedbackId,
      reviewFormatted,
    )

    // Trigger knowledge generation task
    const taskHandle = await generateKnowledgeFromFeedbackTask.trigger({
      projectId: Number(completeOverallReview.projectId),
      review: reviewFormatted,
      title: `Knowledge from resolved feedback #${feedbackId}`,
      reasoning: `This knowledge suggestion was automatically created from resolved feedback #${feedbackId}`,
      overallReview: completeOverallReview,
      branch: completeOverallReview.branchName,
      reviewFeedbackId: feedbackId,
    })

    taskId = taskHandle.id

    return { success: true, data: updatedFeedback, taskId }
  } catch (error) {
    console.error('Error resolving review feedback:', error)
    throw error
  }
}
