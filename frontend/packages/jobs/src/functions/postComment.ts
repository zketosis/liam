import {
  createPullRequestComment,
  updatePullRequestComment,
} from '@liam-hq/github'
import { createClient } from '../libs/supabase'
import type { ReviewResponse } from '../types'

export async function postComment(
  payload: ReviewResponse,
): Promise<{ success: boolean; message: string }> {
  try {
    const { reviewComment, pullRequestId, repositoryId } = payload
    const supabase = createClient()

    // Get repository information
    const { data: repository, error: repoError } = await supabase
      .from('Repository')
      .select('*')
      .eq('id', repositoryId)
      .single()

    if (repoError || !repository) {
      throw new Error(
        `Repository with ID ${repositoryId} not found: ${repoError?.message}`,
      )
    }

    // Check if there's an existing PR record with a comment
    const { data: prRecord, error: prError } = await supabase
      .from('PullRequest')
      .select(`
        *,
        Migration!Migration_pullRequestId_fkey (
          id
        )
      `)
      .eq('id', pullRequestId)
      .single()

    if (prError || !prRecord) {
      throw new Error(
        `Pull request with ID ${pullRequestId} not found: ${prError?.message}`,
      )
    }

    if (!prRecord.Migration || !prRecord.Migration[0]) {
      throw new Error(
        `Migration for Pull request with ID ${pullRequestId} not found`,
      )
    }

    const migration = prRecord.Migration[0]
    const migrationUrl = `${process.env['NEXT_PUBLIC_BASE_URL']}/app/migrations/${migration.id}`

    // Append migration URL to the review comment
    const fullComment = `${reviewComment}\n\nMigration URL: ${migrationUrl}`

    // Get installation ID from repository
    const installationId = repository.installationId
    const owner = repository.owner
    const repo = repository.name

    // If PR already has a comment, update it; otherwise create a new one
    if (prRecord.commentId) {
      await updatePullRequestComment(
        Number(installationId),
        owner,
        repo,
        Number(prRecord.commentId),
        fullComment,
      )
    } else {
      const commentResponse = await createPullRequestComment(
        Number(installationId),
        owner,
        repo,
        Number(prRecord.pullNumber),
        fullComment,
      )

      // Update PR record with the comment ID
      const { error: updateError } = await supabase
        .from('PullRequest')
        .update({ commentId: commentResponse.id })
        .eq('id', pullRequestId)

      if (updateError) {
        throw new Error(
          `Failed to update pull request with comment ID: ${updateError.message}`,
        )
      }
    }

    return {
      success: true,
      message: 'Review comment posted successfully',
    }
  } catch (error) {
    console.error('Error posting comment:', error)
    throw error
  }
}
