import { createClient } from '@/libs/db/server'
import { getPullRequestFiles } from '@liam-hq/github'
import { minimatch } from 'minimatch'

type CheckSchemaChangesParams = {
  installationId: number
  pullRequestNumber: number
  pullRequestTitle: string
  projectId: number
  owner: string
  name: string
}

export const checkSchemaChanges = async (
  params: CheckSchemaChangesParams,
): Promise<{ shouldContinue: boolean }> => {
  const { pullRequestNumber, projectId, owner, name, installationId } = params

  // Get changed files from pull request
  const files = await getPullRequestFiles(
    installationId,
    owner,
    name,
    pullRequestNumber,
  )
  const filenames = files.map((file) => file.filename)

  // Get patterns for the project
  const supabase = await createClient()
  const { data: patterns, error } = await supabase
    .from('WatchSchemaFilePattern')
    .select('pattern')
    .eq('projectId', projectId)

  if (error) {
    throw new Error('Failed to fetch schema file patterns')
  }

  if (!patterns || patterns.length === 0) {
    return { shouldContinue: false }
  }
  // Check if filenames match the patterns
  const matchedFiles = filenames.filter((filename) =>
    patterns.some((pattern) => minimatch(filename, pattern.pattern)),
  )

  if (matchedFiles.length === 0) {
    return { shouldContinue: false }
  }

  return { shouldContinue: true }
}
