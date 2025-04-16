'use client'

import { AppBar } from '@liam-hq/ui'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import styles from './CommonLayout.module.css'
import { GlobalNav } from './GlobalNav'

export const CommonLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() || ''
  const isMinimal = pathname.includes('/organizations/')

  // Extract projectId and fetch project data
  const projectId = pathname.match(/\/projects\/(\d+)/)?.[1]
  const [projectName, setProjectName] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!projectId) return
    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => setProjectName(data.name))
      .catch((err) => console.error('Error fetching project:', err))
  }, [projectId])

  return (
    <div className={styles.layout}>
      <GlobalNav />
      <div className={styles.mainContent}>
        <AppBar
          projectId={projectId}
          projectName={projectName}
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
