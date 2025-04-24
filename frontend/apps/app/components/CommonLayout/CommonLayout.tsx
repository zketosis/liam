import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { ClientAppBar } from './ClientAppBar'
import styles from './CommonLayout.module.css'
import { GlobalNav } from './GlobalNav'
import { getOrganization } from './services/getOrganization'
import { getOrganizationId } from './services/getOrganizationId'

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

  return (
    <div className={styles.layout}>
      <GlobalNav currentOrganization={organization} />
      <div className={styles.mainContent}>
        <ClientAppBar avatarInitial="L" avatarColor="var(--color-teal-800)" />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
