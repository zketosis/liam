'use client'

import { AppBar } from '@liam-hq/ui'
import { usePathname } from 'next/navigation'
import type { FC } from 'react'
import type { ReactNode } from 'react'
import styles from './CommonLayout.module.css'
import { GlobalNav } from './GlobalNav'

type CommonLayoutProps = {
  children: ReactNode
}

export const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {
  const pathname = usePathname() || ''
  const isMinimal = pathname.includes('/organizations/')

  // Extract projectId from pathname - handle complex URL patterns
  const projectId = pathname.match(/\/projects\/(\d+)/)?.[1]

  return (
    <div className={styles.layout}>
      <GlobalNav />
      <div className={styles.mainContent}>
        <AppBar
          {...(projectId ? { projectId, projectName: 'Project Name' } : {})}
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
