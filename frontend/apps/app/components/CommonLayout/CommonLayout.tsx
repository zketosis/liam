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

  // Extract projectId from pathname if it's a project page
  const projectIdMatch = pathname?.match(/\/projects\/(\d+)/)
  const projectId = projectIdMatch ? projectIdMatch[1] : undefined

  return (
    <div className={styles.layout}>
      <GlobalNav />
      <div className={styles.mainContent}>
        <AppBar
          projectId={projectId}
          projectName="Liam Project" // Fallback name if projectId is not available
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
