import { createClient } from '@/libs/db/server'
import { urlgen } from '@/utils/routes'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect(urlgen('login'))
  }
  const { user } = data

  const { data: organizationMembers, error: orgError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', data.user.id)
    .limit(1)

  if (orgError) {
    console.error('Error fetching organization members:', orgError)
  }

  // NOTE: check invitations before redirect to organization/new
  if (user.email !== undefined) {
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .select('organization_id')
      .eq('email', user.email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (invitationError) {
      console.error(
        'Error fetching invitations:',
        JSON.stringify(invitationError, null, 2),
      )
    }
    if (invitation) {
      const { organization_id } = invitation
      redirect(
        urlgen('invitations/organizations/[organizationId]', {
          organizationId: organization_id,
        }),
      )
    }
  }

  if (!organizationMembers || organizationMembers.length === 0) {
    redirect(urlgen('organizations/new'))
  }

  const organizationId = organizationMembers[0].organization_id

  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id')
    .eq('organization_id', organizationId)
    .limit(1)

  if (projectsError) {
    console.error('Error fetching projects:', projectsError)
  }

  if (projects && projects.length > 0) {
    redirect(
      urlgen('organizations/[organizationId]/projects', {
        organizationId: organizationId.toString(),
      }),
    )
  }

  redirect(
    urlgen('organizations/[organizationId]/projects/new', {
      organizationId: organizationId.toString(),
    }),
  )
}
