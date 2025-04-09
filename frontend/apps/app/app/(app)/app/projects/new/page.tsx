import { ProjectNewPage } from '@/features/projects/pages'
import { createClient } from '@/libs/db/server'
import { getInstallations } from '@liam-hq/github'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()

  if (data.session === null) {
    // TODO: Review the behavior when the session cannot be obtained.
    return notFound()
  }

  const { data: organizationMembers, error: orgError } = await supabase
    .from('OrganizationMember')
    .select('organizationId')
    .eq('userId', data.session.user.id)
    .eq('status', 'ACTIVE')
    .limit(1)

  if (orgError) {
    console.error('Error fetching organization members:', orgError)
  }

  const organizationId =
    organizationMembers && organizationMembers.length > 0
      ? organizationMembers[0].organizationId
      : undefined

  const { installations } = await getInstallations(data.session)

  return (
    <ProjectNewPage
      installations={installations}
      organizationId={organizationId}
    />
  )
}
