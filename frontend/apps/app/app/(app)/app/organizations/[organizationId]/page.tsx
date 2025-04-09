import { OrganizationDetailPage } from '@/features/organizations/pages/OrganizationDetailPage'
import {
  getOrganizationDetails,
  getOrganizationInvites,
  getOrganizationMembers,
} from '@/features/organizations/pages/OrganizationDetailPage/getOrganizationDetails'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function Page({
  params,
}: { params: { organizationId: string } }) {
  const organization = await getOrganizationDetails(params.organizationId)

  if (!organization) {
    return notFound()
  }

  const members = await getOrganizationMembers(params.organizationId)
  const invites = await getOrganizationInvites(params.organizationId)

  return (
    <OrganizationDetailPage
      organization={organization}
      members={members}
      invites={invites}
    />
  )
}
