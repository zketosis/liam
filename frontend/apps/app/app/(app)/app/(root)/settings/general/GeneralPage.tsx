import { getOrganizationDetails } from '@/features/organizations/services/organizationService'

import { GeneralPageClient } from './GeneralPageClient'

export async function GeneralPage({
  organizationId,
}: {
  organizationId: string
}) {
  // Fetch organization details using the existing function
  const organization = await getOrganizationDetails(organizationId)

  if (!organization) {
    throw new Error('Organization not found')
  }

  // Use the client component with useActionState for toast notifications
  return <GeneralPageClient organization={organization} />
}
