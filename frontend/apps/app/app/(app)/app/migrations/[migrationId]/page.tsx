import type { PageProps } from '@/app/types'
import { MigrationDetailPage } from '@/features/migrations/pages/MigrationDetailPage'
import { prisma } from '@liam-hq/db'
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

  return <MigrationDetailPage migrationId={migrationId} />
}
