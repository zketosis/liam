'use client'

import { AppBar } from '@liam-hq/ui'
import { usePathname } from 'next/navigation'
import type React from 'react'
import type { ReactNode } from 'react'
import styles from './CommonLayout.module.css'
import { GlobalNav } from './GlobalNav'

type CommonLayoutProps = {
  children: ReactNode
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const isMinimal = pathname?.includes('/organizations/')
  return (
    <div className={styles.layout}>
      <GlobalNav />
      <div className={styles.mainContent}>
        <AppBar
          projectName="Liam Project"
          branchName="main"
          avatarInitial="L"
          avatarColor="var(--color-teal-800)"
          minimal={isMinimal}
        />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  )
}
