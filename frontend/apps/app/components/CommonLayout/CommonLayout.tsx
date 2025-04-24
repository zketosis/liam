import { getOrganizationId } from '@/features/organizations/services/getOrganizationId'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { ClientAppBar } from './ClientAppBar'
import styles from './CommonLayout.module.css'
import { GlobalNav } from './GlobalNav'
import { OrgCookie } from './OrgCookie'
import { getAuthUser } from './services/getAuthUser'
import { getOrganization } from './services/getOrganization'
import { getOrganizationsByUserId } from './services/getOrganizationsByUserId'

type CommonLayoutProps = {
  children: ReactNode
}

export async function CommonLayout({ children }: CommonLayoutProps) {
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
        <ClientAppBar avatarUrl={authUser.user?.user_metadata?.avatar_url} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
