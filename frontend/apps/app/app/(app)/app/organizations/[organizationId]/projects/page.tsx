import type { PageProps } from '@/app/types'
import { ProjectsPage } from '@/features/projects/pages'
import { migrationFlag } from '@/libs'
import { createClient } from '@/libs/db/server'
import { notFound } from 'next/navigation'
import * as v from 'valibot'

const paramsSchema = v.object({
  organizationId: v.string(),
})

export default async function Page({ params }: PageProps) {
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()
  const { organizationId } = parsedParams.output

  const migrationEnabled = await migrationFlag()

  if (!migrationEnabled) {
    notFound()
  }

  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    console.error('Error fetching user:', error)
    return notFound()
  }
  if (data.session === null) {
    return notFound()
  }

  return <ProjectsPage organizationId={organizationId} />
}
