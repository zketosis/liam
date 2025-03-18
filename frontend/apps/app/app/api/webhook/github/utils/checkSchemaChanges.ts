import { getPullRequestFiles } from '@/libs/github/api.server'
import { savePullRequestTask } from '@/src/trigger/jobs'
import { prisma } from '@liam-hq/db'
import { minimatch } from 'minimatch'

type CheckSchemaChangesParams = {
  pullRequestNumber: number
  pullRequestTitle: string
  projectId: number
  owner: string
  name: string
  repositoryId: number
}

export const checkSchemaChanges = async (
  params: CheckSchemaChangesParams,
): Promise<{ shouldContinue: boolean }> => {
  const { pullRequestNumber, projectId, owner, name, repositoryId } = params

  // Get changed files from pull request
  const files = await getPullRequestFiles(
    repositoryId,
    owner,
    name,
    pullRequestNumber,
  )
  const filenames = files.map((file) => file.filename)

  // Get patterns for the project
  const patterns = await prisma.watchSchemaFilePattern.findMany({
    where: { projectId },
    select: { pattern: true },
  })
  if (patterns.length === 0) {
    return { shouldContinue: false }
  }
  // Check if filenames match the patterns
  const matchedFiles = filenames.filter((filename) =>
    patterns.some((pattern) => minimatch(filename, pattern.pattern)),
  )

  if (matchedFiles.length === 0) {
    return { shouldContinue: false }
  }

  // If schema changes are detected, trigger the task
  await savePullRequestTask.trigger({
    pullRequestNumber,
    pullRequestTitle: params.pullRequestTitle,
    projectId,
    owner,
    name,
    repositoryId,
  })

  return { shouldContinue: true }
}
