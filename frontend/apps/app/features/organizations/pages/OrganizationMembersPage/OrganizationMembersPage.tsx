import { ClientSearchWrapper } from '@/features/organizations/pages/OrganizationMembersPage/ClientSearchWrapper'
import {
  getOrganizationInvites,
  getOrganizationMembers,
} from '@/features/organizations/pages/OrganizationMembersPage/getMembersAndInvites'
import type { FC } from 'react'

interface OrganizationMembersPageProps {
  organization: {
    id: string
    name: string
  }
}

export const OrganizationMembersPage: FC<
  OrganizationMembersPageProps
> = async ({ organization }) => {
  const members = await getOrganizationMembers(organization.id)
  const invites = await getOrganizationInvites(organization.id)

  return (
    <ClientSearchWrapper
      members={members}
      invites={invites}
      organizationId={organization.id}
    />
  )
}
