import {
  getFileContent,
  getPullRequestDetails,
  getPullRequestFiles,
} from '@liam-hq/github'
import { createClient } from '../libs/supabase'

import type { SavePullRequestPayload } from '../types'

export type SavePullRequestResult = {
  success: boolean
  prId: number
  schemaFiles: Array<{
    filename: string
    content: string
  }>
  fileChanges: Array<{
    filename: string
    status:
      | 'added'
      | 'modified'
      | 'deleted'
      | 'removed'
      | 'renamed'
      | 'copied'
      | 'changed'
      | 'unchanged'
    changes: number
    patch: string
  }>
}

export async function processSavePullRequest(
  payload: SavePullRequestPayload,
): Promise<SavePullRequestResult> {
  const supabase = createClient()

  // Find repository by owner and name
  const { data: repository, error: repositoryError } = await supabase
    .from('Repository')
    .select('*')
    .eq('owner', payload.owner)
    .eq('name', payload.name)
    .single()

  if (repositoryError || !repository) {
    throw new Error(`Repository not found: ${JSON.stringify(repositoryError)}`)
  }

  const fileChanges = await getPullRequestFiles(
    // bigint to number
    Number(repository.installationId.toString()),
    repository.owner,
    repository.name,
    payload.prNumber,
  )

  // Get project mappings with nested project and schema file patterns
  const { data: projectMappings, error: mappingsError } = await supabase
    .from('ProjectRepositoryMapping')
    .select('projectId')
    .eq('repositoryId', repository.id)

  if (mappingsError) {
    console.error('Error fetching project mappings:', mappingsError)
    throw new Error('Project mappings not found')
  }

  // Get schema paths for all projects
  const projectIds = projectMappings.map(
    (mapping: { projectId: number }) => mapping.projectId,
  )

  const { data: schemaPaths, error: pathsError } = await supabase
    .from('GitHubSchemaFilePath')
    .select('path')
    .in('projectId', projectIds)

  if (pathsError) {
    console.error('Error fetching schema paths:', pathsError)
    throw new Error('Schema paths not found')
  }

  const allSchemaPaths = schemaPaths || []

  const matchedFiles = fileChanges.filter((file) =>
    allSchemaPaths.some(
      (schemaPath: { path: string }) => file.filename === schemaPath.path,
    ),
  )

  const prDetails = await getPullRequestDetails(
    Number(repository.installationId),
    repository.owner,
    repository.name,
    payload.prNumber,
  )

  const schemaFiles: Array<{
    filename: string
    content: string
  }> = await Promise.all(
    matchedFiles.map(async (file) => {
      try {
        const { content } = await getFileContent(
          `${repository.owner}/${repository.name}`,
          file.filename,
          prDetails.head.ref,
          Number(repository.installationId),
        )
        return {
          filename: file.filename,
          content: content ?? '',
        }
      } catch (error) {
        console.error(`Error fetching content for ${file.filename}:`, error)
        return {
          filename: file.filename,
          content: '',
        }
      }
    }),
  )

  const fileChangesData = fileChanges.map((file) => {
    return {
      filename: file.filename,
      status: file.status,
      changes: file.changes,
      patch: file?.patch || '',
    }
  })

  // Check if PR exists
  const { data: existingPR } = await supabase
    .from('PullRequest')
    .select('id')
    .eq('repositoryId', repository.id)
    .eq('pullNumber', payload.prNumber)
    .maybeSingle()

  let prRecord: { id: number }
  if (existingPR) {
    // PR exists, no need to update anything in this case
    prRecord = existingPR
  } else {
    // Create new PR record
    const now = new Date().toISOString()
    const { data: newPR, error: createPRError } = await supabase
      .from('PullRequest')
      .insert({
        repositoryId: repository.id,
        pullNumber: payload.prNumber,
        updatedAt: now,
      })
      .select()
      .single()

    if (createPRError || !newPR) {
      throw new Error(
        `Failed to create PR record: ${JSON.stringify(createPRError)}`,
      )
    }

    prRecord = newPR
  }

  // Check if migration record exists
  const { data: existingMigration } = await supabase
    .from('Migration')
    .select('id')
    .eq('pullRequestId', prRecord.id)
    .maybeSingle()

  if (existingMigration) {
    // Update existing migration
    const { error: updateMigrationError } = await supabase
      .from('Migration')
      .update({
        title: payload.pullRequestTitle,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', existingMigration.id)

    if (updateMigrationError) {
      throw new Error(
        `Failed to update migration: ${JSON.stringify(updateMigrationError)}`,
      )
    }
  } else {
    // Create new migration
    const now = new Date().toISOString()
    const { error: createMigrationError } = await supabase
      .from('Migration')
      .insert({
        pullRequestId: prRecord.id,
        title: payload.pullRequestTitle,
        updatedAt: now,
      })

    if (createMigrationError) {
      throw new Error(
        `Failed to create migration: ${JSON.stringify(createMigrationError)}`,
      )
    }
  }

  return {
    success: true,
    prId: prRecord.id,
    schemaFiles,
    fileChanges: fileChangesData,
  }
}
