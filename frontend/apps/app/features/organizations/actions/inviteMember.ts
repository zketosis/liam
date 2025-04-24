'use server'

import { createClient } from '@/libs/db/server'
import { revalidatePath } from 'next/cache'
import * as v from 'valibot'

// Define schema for form data validation
const inviteFormSchema = v.object({
  email: v.pipe(
    v.string(),
    v.email('Please enter a valid email address'),
    v.transform((value) => value.toLowerCase()),
  ),
  organizationId: v.string(),
})

const invitationResultSchema = v.union([
  v.object({
    success: v.literal(true),
    error: v.null(),
  }),
  v.object({
    success: v.literal(false),
    error: v.string(),
  }),
])

/**
 * Server action to invite a member to an organization
 * Uses an atomic RPC function to handle all database operations in a single transaction
 */
export const inviteMember = async (formData: FormData) => {
  // Parse and validate form data
  const formDataObject = {
    email: formData.get('email'),
    organizationId: formData.get('organizationId'),
  }

  const parsedData = v.safeParse(inviteFormSchema, formDataObject)
  if (!parsedData.success) {
    return {
      success: false,
      error: `Invalid form data: ${parsedData.issues.map((issue) => issue.message).join(', ')}`,
    } as const
  }

  const { email, organizationId } = parsedData.output
  const supabase = await createClient()

  // Get current user
  const currentUser = await supabase.auth.getUser()
  const userId = currentUser.data.user?.id

  if (!userId) {
    return {
      success: false,
      error: 'User not authenticated',
    } as const
  }

  // Call the RPC function to handle the invitation atomically
  const { data, error } = await supabase.rpc('invite_organization_member', {
    p_email: email,
    p_organization_id: organizationId,
    p_invite_by_user_id: userId,
  })

  if (error) {
    console.error('Error inviting member:', JSON.stringify(error, null, 2))
    return {
      success: false,
      error: 'Failed to send invitation. Please try again.',
    } as const
  }

  const result = v.safeParse(invitationResultSchema, data)
  if (!result.success) {
    return {
      success: false,
      error: `Invalid response from server: ${result.issues.map((issue) => issue.message).join(', ')}`,
    } as const
  }

  // TODO: Send email to user
  revalidatePath(
    `/app/organizations/${organizationId}/settings/members`,
    'page',
  )

  return result.output
}
