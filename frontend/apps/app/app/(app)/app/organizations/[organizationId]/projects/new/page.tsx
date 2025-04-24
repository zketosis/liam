import type { PageProps } from '@/app/types'
import { ProjectNewPage } from '@/features/projects/pages'
import { createClient } from '@/libs/db/server'
import { getInstallations } from '@liam-hq/github'
import { notFound } from 'next/navigation'
import * as v from 'valibot'

const paramsSchema = v.object({
  organizationId: v.string(),
})

export default async function NewProjectPage({ params }: PageProps) {
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()

  const { organizationId } = parsedParams.output
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    console.error('Error fetching user:', error)
    return notFound()
  }

  const { data } = await supabase.auth.getSession()

  if (data.session === null) {
    return notFound()
  }

  const { installations } = await getInstallations(data.session)

  return (
    <ProjectNewPage
      installations={installations}
      organizationId={organizationId}
    />
  )
}
