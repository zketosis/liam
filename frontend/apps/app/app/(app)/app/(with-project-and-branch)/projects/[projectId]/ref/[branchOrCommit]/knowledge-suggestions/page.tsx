import type { PageProps } from '@/app/types'
import { KnowledgeSuggestionsListPage } from '@/features/projects/pages/KnowledgeSuggestionsListPage'
import { branchOrCommitSchema } from '@/utils/routes'
import { notFound } from 'next/navigation'
import * as v from 'valibot'

const paramsSchema = v.object({
  projectId: v.string(),
  branchOrCommit: branchOrCommitSchema,
})

export default async function KnowledgeSuggestionsPage({ params }: PageProps) {
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()

  const { projectId, branchOrCommit } = parsedParams.output

  return (
    <KnowledgeSuggestionsListPage
      projectId={String(projectId)}
      branchOrCommit={branchOrCommit}
    />
  )
}
