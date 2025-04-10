import { ProjectsPage } from '@/features/projects/pages'
import { migrationFlag } from '@/libs'
import { createClient } from '@/libs/db/server'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function Page({
  params,
}: { params: { organizationId: string } }) {
  const migrationEnabled = await migrationFlag()

  if (!migrationEnabled) {
    notFound()
  }

  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()

  if (data.session === null) {
    return notFound()
  }

  const organizationId = Number.parseInt(params.organizationId, 10)

  const { data: organizationMembers, error: orgError } = await supabase
    .from('OrganizationMember')
    .select('id')
    .eq('userId', data.session.user.id)
    .eq('organizationId', organizationId)
    .eq('status', 'ACTIVE')
    .limit(1)

  if (orgError) {
    console.error('Error fetching organization members:', orgError)
  }

  if (!organizationMembers || organizationMembers.length === 0) {
    return notFound()
  }

  return <ProjectsPage organizationId={organizationId} />
}
