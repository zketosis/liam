import { createClient } from '@/libs/db/server'
import { getOrganizationIdFromCookie } from './getOrganizationIdFromCookie'

export async function getOrganizationId(): Promise<string | null> {
  const storedOrganizationId = await getOrganizationIdFromCookie()

  if (storedOrganizationId !== null && storedOrganizationId !== '') {
    return storedOrganizationId
  }

  const supabase = await createClient()
  const authUser = await supabase.auth.getUser()

  if (authUser.error) {
    throw new Error('Authentication failed: ', authUser.error)
  }

  const { data: organizationMember, error: organizationMemberError } =
    await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', authUser.data.user.id)
      .limit(1)
      .maybeSingle()

  if (organizationMemberError) {
    throw new Error(
      'Failed to fetch organization member data',
      organizationMemberError,
    )
  }

  return organizationMember?.organization_id ?? null
}
