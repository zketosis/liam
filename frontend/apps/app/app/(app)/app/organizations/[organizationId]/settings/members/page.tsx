import type { PageProps } from '@/app/types'
import { OrganizationMembersPage } from '@/features/organizations/pages/OrganizationMembersPage'
import { createClient } from '@/libs/db/server'
import { notFound } from 'next/navigation'
import * as v from 'valibot'

const paramsSchema = v.object({
  organizationId: v.string(),
})

export default async function MembersPage({ params }: PageProps) {
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()
  const { organizationId } = parsedParams.output

  const supabase = await createClient()

  const { data: organization, error } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('id', organizationId)
    .single()

  if (error || !organization) {
    console.error('Error fetching organization:', error)
    notFound()
  }

  return <OrganizationMembersPage organization={organization} />
}
