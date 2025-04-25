import { getOrganizationId } from '@/features/organizations/services/getOrganizationId'
import { GeneralPage } from './GeneralPage'

export default async function Page() {
  const organizationId = await getOrganizationId()

  // TODO: Reconsider what screen should be displayed to the user when organizationId is not available
  if (organizationId == null) {
    return null
  }

  return <GeneralPage organizationId={organizationId} />
}
