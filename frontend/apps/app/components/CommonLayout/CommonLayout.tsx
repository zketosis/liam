import type { ReactNode } from 'react'
import { ClientAppBar } from './ClientAppBar'
import styles from './CommonLayout.module.css'
import { GlobalNav } from './GlobalNav'

type CommonLayoutProps = {
  children: ReactNode
}

export async function CommonLayout({ children }: CommonLayoutProps) {
  // In a Server Component, we can't directly access the URL path
  // We'll let the ClientAppBar handle path detection and project ID extraction

  return (
    <div className={styles.layout}>
      <GlobalNav />
      <div className={styles.mainContent}>
        <ClientAppBar avatarInitial="L" avatarColor="var(--color-teal-800)" />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
