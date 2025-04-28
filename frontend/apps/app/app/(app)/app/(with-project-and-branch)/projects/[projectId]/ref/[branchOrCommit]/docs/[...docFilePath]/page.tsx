import type { PageProps } from '@/app/types'
import { notFound } from 'next/navigation'
import * as v from 'valibot'
import { DocsDetailPage } from './DocsDetailPage'

const paramsSchema = v.object({
  projectId: v.string(),
  branchOrCommit: v.string(),
  docFilePath: v.array(v.string()),
})

export default async function Page({ params }: PageProps) {
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) throw notFound()

  const { projectId, branchOrCommit, docFilePath } = parsedParams.output

  return (
    <DocsDetailPage
      projectId={projectId}
      branchOrCommit={branchOrCommit}
      docFilePath={docFilePath}
    />
  )
}
