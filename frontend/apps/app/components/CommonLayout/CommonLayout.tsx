import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { ClientAppBar } from './ClientAppBar'
import styles from './CommonLayout.module.css'
import { GlobalNav } from './GlobalNav'
import { OrgCookie } from './OrgCookie'
import { getAuthUser } from './services/getAuthUser'
import { getOrganization } from './services/getOrganization'
import { getOrganizationId } from './services/getOrganizationId'
import { getOrganizationsByUserId } from './services/getOrganizationsByUserId'

type CommonLayoutProps = {
  children: ReactNode
}

export async function CommonLayout({ children }: CommonLayoutProps) {
  // In a Server Component, we can't directly access the URL path
  // We'll let the ClientAppBar handle path detection and project ID extraction
  const organizationId = await getOrganizationId()
  const { data: organization, error } = await getOrganization(organizationId)

  if (error) {
    return notFound()
  }

  const { data: authUser, error: authUserError } = await getAuthUser()

  if (authUserError) {
    return notFound()
  }

  const { data: organizations, error: organizationsError } =
    await getOrganizationsByUserId(authUser.user.id)

  if (organizationsError) {
    return notFound()
  }

  return (
    <div className={styles.layout}>
      {organization && (
        <>
          <OrgCookie orgId={organization.id} />
          <GlobalNav
            currentOrganization={organization}
            organizations={organizations}
          />
        </>
      )}
      <div className={styles.mainContent}>
        <ClientAppBar avatarInitial="L" avatarColor="var(--color-teal-800)" />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
