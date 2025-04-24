import { createClient } from '@/libs/db/server'
import { getOrganizationIdFromCookie } from './getOrganizationIdFromCookie'

export async function getOrganizationId() {
  const storedOrganizationId = await getOrganizationIdFromCookie()

  if (storedOrganizationId !== null && storedOrganizationId !== '') {
    return storedOrganizationId
  }

  const supabase = await createClient()
  const authUser = await supabase.auth.getUser()

  if (authUser.error) {
    throw new Error('Authentication failed: ', authUser.error)
  }

  const organizationMember = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', authUser.data.user.id)
    .limit(1)
    .single()

  if (organizationMember.error) {
    throw new Error(
      'Failed to fetch organization member data',
      organizationMember.error,
    )
  }

  return organizationMember.data.organization_id
}
