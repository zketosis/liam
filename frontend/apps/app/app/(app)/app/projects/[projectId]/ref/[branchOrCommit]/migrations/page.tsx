import type { PageProps } from '@/app/types'
import { MigrationsListPage } from '@/features/migrations/pages/MigrationsListPage'
import { branchOrCommitSchema } from '@/utils/routes/paramsSchema'
import { notFound } from 'next/navigation'
import * as v from 'valibot'

const paramsSchema = v.object({
  projectId: v.string(),
  branchOrCommit: branchOrCommitSchema,
})

export default async function Page({ params }: PageProps) {
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()

  const { projectId, branchOrCommit } = parsedParams.output

  return (
    <MigrationsListPage projectId={projectId} branchOrCommit={branchOrCommit} />
  )
}
