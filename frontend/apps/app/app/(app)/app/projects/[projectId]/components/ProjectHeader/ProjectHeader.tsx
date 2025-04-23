import { urlgen } from '@/utils/routes/urlgen'
import { TabsList, TabsTrigger } from '@liam-hq/ui'
import Link from 'next/link'
import type { FC } from 'react'
import styles from './ProjectHeader.module.css'
import { PROJECT_TABS } from './projectConstants'

interface ProjectHeaderProps {
  projectId: string
}

export const ProjectHeader: FC<ProjectHeaderProps> = ({ projectId }) => {
  return (
    <div className={styles.wrapper}>
      <TabsList className={styles.tabsList}>
        {PROJECT_TABS.map((tab) => {
          const Icon = tab.icon
          let href: string

          // For "project" tab, use the base project route
          if (tab.value === 'project') {
            href = urlgen('projects/[projectId]', { projectId })
          } else {
            // For all other tabs, use the named route or the generic [tabValue] route
            href = urlgen(`projects/[projectId]/${tab.value}`, {
              projectId,
            })
          }

          return (
            <Link href={href} key={tab.value}>
              <TabsTrigger value={tab.value} className={styles.tabsTrigger}>
                <Icon size={16} />
                {tab.label}
              </TabsTrigger>
            </Link>
          )
        })}
      </TabsList>
    </div>
  )
}
