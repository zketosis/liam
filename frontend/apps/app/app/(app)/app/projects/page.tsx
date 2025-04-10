import { migrationFlag } from '@/libs'
import { createClient } from '@/libs/db/server'
import { urlgen } from '@/utils/routes'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

export default async function Page() {
  const migrationEnabled = await migrationFlag()

  if (!migrationEnabled) {
    notFound()
  }

  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()

  if (data.session === null) {
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

  if (!organizationMembers || organizationMembers.length === 0) {
    redirect(urlgen('organizations/new'))
  }

  const organizationId = organizationMembers[0].organizationId

  redirect(
    urlgen('organizations/[organizationId]/projects', {
      organizationId: organizationId.toString(),
    }),
  )
}
