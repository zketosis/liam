'use server'

import { getOrganizationInfo } from '@liam-hq/github'
import { OrganizationIconClient } from './OrganizationIconClient'

interface OrganizationIconProps {
  installationId: number
  owner: string
  repo: string
}

export async function getOrganizationData({
  installationId,
  owner,
  repo,
}: OrganizationIconProps) {
  try {
    const orgInfo = await getOrganizationInfo(installationId, owner, repo)
    return orgInfo?.avatar_url || null
  } catch (error) {
    console.error('Failed to fetch organization info:', error)
    return null
  }
}

export async function OrganizationIcon({
  installationId,
  owner,
  repo,
}: OrganizationIconProps) {
  try {
    const orgInfo = await getOrganizationInfo(installationId, owner, repo)

    if (orgInfo?.avatar_url) {
      return (
        <OrganizationIconClient avatarUrl={orgInfo.avatar_url} owner={owner} />
      )
    }
  } catch (error) {
    console.error('Failed to fetch organization info:', error)
  }

  return <OrganizationIconClient owner={owner} />
}
