'use server'

import { createClient } from '@/libs/db/server'
import type { Tables } from '@liam-hq/db/supabase/database.types'
import { redirect } from 'next/navigation'

/**
 * Server action to get invitation data for a specific organization
 * Fetches the invitation and organization data for the current user
 */
export async function getInvitationData(organizationId: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to login if not authenticated
    redirect('/app/login')
  }

  // Get invitation and organization data
  const { data: invitation, error: invitationError } = await supabase
    .from('invitations')
    .select('*, organizations:organization_id(name)')
    .eq('organization_id', organizationId)
    .eq('email', user.email || '')
    .single()

  if (invitationError || !invitation) {
    // Invitation not found or error
    redirect('/app')
  }

  return {
    invitation: invitation as Tables<'invitations'> & {
      organizations: { name: string }
    },
    currentUser: {
      id: user.id,
      email: user.email || '',
    },
  }
}
