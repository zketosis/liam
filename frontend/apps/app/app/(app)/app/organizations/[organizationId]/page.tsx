import type { PageProps } from '@/app/types'
import { OrganizationDetailPage } from '@/features/organizations/pages/OrganizationDetailPage'
import {
  getOrganizationDetails,
  getOrganizationInvites,
  getOrganizationMembers,
} from '@/features/organizations/pages/OrganizationDetailPage/getOrganizationDetails'
import { notFound } from 'next/navigation'
import * as v from 'valibot'

const paramsSchema = v.object({
  organizationId: v.string(),
})

export default async function OrganizationPage({ params }: PageProps) {
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()
  const { organizationId } = parsedParams.output
  const organization = await getOrganizationDetails(organizationId)

  if (!organization) {
    return notFound()
  }

  const members = await getOrganizationMembers(organizationId)
  const invites = await getOrganizationInvites(organizationId)

  return (
    <OrganizationDetailPage
      organization={organization}
      members={members}
      invites={invites}
    />
  )
}
