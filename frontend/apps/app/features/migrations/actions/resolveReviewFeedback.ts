'use server'

import { createClient } from '@/libs/db/server'
import { generateKnowledgeFromFeedbackTask } from '@liam-hq/jobs/src/trigger/jobs'
import * as v from 'valibot'

const requestSchema = v.object({
  feedbackId: v.pipe(v.number()),
  resolutionComment: v.optional(v.nullable(v.string())),
})

export const resolveReviewFeedback = async (data: {
  feedbackId: number
  resolutionComment?: string | null
}) => {
  const parsedData = v.safeParse(requestSchema, data)

  if (!parsedData.success) {
    throw new Error(`Invalid data: ${JSON.stringify(parsedData.issues)}`)
  }

  const { feedbackId, resolutionComment } = parsedData.output

  try {
    const supabase = await createClient()

    // First, get the feedback data to use for knowledge suggestion
    const { data: feedbackData, error: fetchError } = await supabase
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

    if (fetchError || !feedbackData) {
      throw new Error(
        `Failed to fetch feedback data: ${fetchError?.message || 'Not found'}`,
      )
    }

    // Update the feedback to mark it as resolved
    const { data: updatedFeedback, error } = await supabase
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

    // Create a knowledge suggestion based on the feedback
    const overallReviewId = feedbackData.overallReviewId
    if (!overallReviewId) {
      throw new Error('Overall review ID not found for the feedback')
    }

    // Get the complete OverallReview object
    const { data: completeOverallReview, error: overallReviewError } =
      await supabase
        .from('OverallReview')
        .select('*')
        .eq('id', overallReviewId)
        .single()

    if (overallReviewError || !completeOverallReview) {
      throw new Error(
        `Failed to fetch complete OverallReview: ${overallReviewError?.message || 'Not found'}`,
      )
    }

    if (!completeOverallReview.projectId) {
      throw new Error('Project ID not found in OverallReview')
    }

    const projectId: number = completeOverallReview.projectId
    let taskId: string | null = null

    // Trigger the knowledge suggestion creation task with reviewFeedbackId
    const taskHandle = await generateKnowledgeFromFeedbackTask.trigger({
      projectId,
      reviewFeedback: updatedFeedback[0],
      title: `Knowledge from resolved feedback #${feedbackId}`,
      reasoning: `This knowledge suggestion was automatically created from resolved feedback #${feedbackId}`,
      overallReview: completeOverallReview,
      branch: completeOverallReview.branchName,
    })

    taskId = taskHandle.id

    // Return the task information so the client can track its progress
    return {
      success: true,
      data: updatedFeedback,
      taskId,
    }
  } catch (error) {
    console.error('Error resolving review feedback:', error)
    throw error
  }
}
