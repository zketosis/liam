import type { PageProps } from '@/app/types'
import { ProjectNewPage } from '@/features/projects/pages'
import { createClient } from '@/libs/db/server'
import { getInstallations } from '@liam-hq/github'
import { notFound } from 'next/navigation'
import React from 'react'
import * as v from 'valibot'

const paramsSchema = v.object({
  organizationId: v.string(),
})

export default async function NewProjectPage({ params }: PageProps) {
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()

  const { organizationId } = parsedParams.output
  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()

  if (data.session === null) {
    return notFound()
  }

  const { data: organizationMember, error: orgError } = await supabase
    .from('OrganizationMember')
    .select('id')
    .eq('userId', data.session.user.id)
    .eq('organizationId', Number.parseInt(organizationId, 10))
    .eq('status', 'ACTIVE')
    .maybeSingle()

  if (orgError) {
    console.error('Error fetching organization members:', orgError)
    throw orgError
  }

  if (organizationMember === null) {
    return notFound()
  }

  const { installations } = await getInstallations(data.session)

  return (
    <ProjectNewPage
      installations={installations}
      organizationId={Number.parseInt(organizationId, 10)}
    />
  )
}
