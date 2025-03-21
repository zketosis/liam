import type { PageProps } from '@/app/types'
import { MigrationDetailPage } from '@/features/migrations/pages/MigrationDetailPage'
import {
  getPullRequestDetails,
  getPullRequestFiles,
} from '@/libs/github/api.server'
import { prisma } from '@liam-hq/db'
import { minimatch } from 'minimatch'
import { notFound } from 'next/navigation'
import * as v from 'valibot'

const paramsSchema = v.object({
  migrationId: v.string(),
})

export default async function Page({ params }: PageProps) {
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()

  const { migrationId } = parsedParams.output

  const migration = await prisma.migration.findUnique({
    where: {
      id: Number(migrationId),
    },
    select: {
      pullRequest: {
        select: {
          pullNumber: true,
          repository: {
            select: {
              name: true,
              owner: true,
              installationId: true,
            },
          },
        },
      },
    },
  })

  if (!migration?.pullRequest?.repository) {
    return notFound()
  }

  const { repository, pullNumber } = migration.pullRequest
  const { owner, name: repo, installationId } = repository

  const prDetails = await getPullRequestDetails(
    Number(installationId),
    owner,
    repo,
    Number(pullNumber),
  )

  const files = await getPullRequestFiles(
    Number(installationId),
    owner,
    repo,
    Number(pullNumber),
  )

  const patterns = await prisma.watchSchemaFilePattern.findMany({
    where: { projectId: Number(projectId) },
    select: { pattern: true },
  })

  const matchedFiles = files
    .map((file) => file.filename)
    .filter((filename) =>
      patterns.some((pattern) => minimatch(filename, pattern.pattern)),
    )

  const erdLinks = matchedFiles.map((filename) => ({
    path: `/app/projects/${projectId}/erd/${prDetails.head.ref}/${filename}`,
    filename,
  }))

  return (
    <MigrationDetailPage
      projectId={projectId}
      migrationId={migrationId}
      erdLinks={erdLinks}
    />
  )
}
