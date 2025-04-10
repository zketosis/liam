import { createClient } from '@/libs/db/server'
import { urlgen } from '@/utils/routes'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect(urlgen('login'))
  }

  const { data: organizationMembers, error: orgError } = await supabase
    .from('OrganizationMember')
    .select('organizationId')
    .eq('userId', data.user.id)
    .eq('status', 'ACTIVE')
    .limit(1)

  if (orgError) {
    console.error('Error fetching organization members:', orgError)
  }

  if (!organizationMembers || organizationMembers.length === 0) {
    redirect(urlgen('organizations/new'))
  }

  const { data: projects } = await supabase
    .from('Project')
    .select('id')
    .limit(1)

  if (projects && projects.length > 0) {
    redirect(urlgen('projects'))
  }

  const organizationId = organizationMembers[0].organizationId
  redirect(
    urlgen('organizations/[organizationId]/projects/new', {
      organizationId: organizationId.toString(),
    }),
  )
}
