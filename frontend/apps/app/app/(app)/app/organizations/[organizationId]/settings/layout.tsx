import { TabsContent, TabsRoot } from '@liam-hq/ui'
import type { ReactNode } from 'react'
import { SettingsHeader } from './components/SettingsHeader'
import { SETTINGS_TAB } from './constants'
import styles from './layout.module.css'

interface LayoutProps {
  children: ReactNode
}

export default async function OrganizationSettingsLayout({
  children,
}: LayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <h1 className={styles.heading}>Settings</h1>

        <TabsRoot
          // TODO: Make it possible to retrieve it from the current path
          defaultValue={SETTINGS_TAB.GENERAL}
        >
          <SettingsHeader />
          <TabsContent
            value={SETTINGS_TAB.GENERAL}
            className={styles.tabContent}
          >
            {children}
          </TabsContent>
          <TabsContent
            value={SETTINGS_TAB.MEMBERS}
            className={styles.tabContent}
          >
            {children}
          </TabsContent>
          <TabsContent
            value={SETTINGS_TAB.BILLING}
            className={styles.tabContent}
          >
            {children}
          </TabsContent>
          <TabsContent
            value={SETTINGS_TAB.PROJECTS}
            className={styles.tabContent}
          >
            {children}
          </TabsContent>
        </TabsRoot>
      </div>
    </div>
  )
}
