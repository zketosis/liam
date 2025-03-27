import { savePullRequestTask } from '@/src/trigger/jobs'
import { prisma } from '@liam-hq/db'
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

  return { shouldContinue: true }
}
