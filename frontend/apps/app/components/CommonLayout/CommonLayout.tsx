import { getOrganizationId } from '@/features/organizations/services/getOrganizationId'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { AppBar } from './AppBar'
import styles from './CommonLayout.module.css'
import { GlobalNav } from './GlobalNav'
import { OrgCookie } from './OrgCookie'
import { extractProjectPathParts } from './services/extractProjectPathParts'
import { getAuthUser } from './services/getAuthUser'
import { getOrganization } from './services/getOrganization'
import { getOrganizationsByUserId } from './services/getOrganizationsByUserId'

type CommonLayoutProps = {
  children: ReactNode
}

export async function CommonLayout({ children }: CommonLayoutProps) {
  const headersList = await headers()
  const urlPath = headersList.get('x-url-path') || ''
  const { projectId, branchOrCommit } = extractProjectPathParts(urlPath)

  const organizationId = await getOrganizationId()
  const { data: organization } = await getOrganization(organizationId)

  const { data: authUser, error } = await getAuthUser()
  if (error) {
    return notFound()
  }

  const { data: organizations } = await getOrganizationsByUserId(
    authUser.user.id,
  )

  return (
    <div className={styles.layout}>
      {organization && <OrgCookie orgId={organization.id} />}
      <GlobalNav
        currentOrganization={organization}
        organizations={organizations}
      />
      <div className={styles.mainContent}>
        <AppBar
          currentProjectId={projectId}
          currentBranchOrCommit={branchOrCommit}
        />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
