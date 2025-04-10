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

  const organizationId = organizationMembers[0].organizationId

  const { data: projects, error: projectsError } = await supabase
    .from('Project')
    .select('id')
    .eq('organizationId', organizationId)
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
