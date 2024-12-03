import '@xyflow/react/dist/style.css'
import {
  SidebarProvider,
  SidebarTrigger,
  getSidebarStateFromCookie,
} from '@liam-hq/ui'
import { ReactFlowProvider } from '@xyflow/react'
import type { FC } from 'react'
import { AppBar } from './AppBar'
import { ERDContent } from './ERDContent'
import styles from './ERDRenderer.module.css'
import { LeftPane } from './LeftPane'
import '@/styles/globals.css'

export const ERDRenderer: FC = () => {
  const defaultOpen = getSidebarStateFromCookie()

  return (
    <div className={styles.wrapper}>
      <AppBar />
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className={styles.mainWrapper}>
          <LeftPane />
          <main className={styles.main}>
            <div className={styles.triggerWrapper}>
              <SidebarTrigger />
            </div>
            <ReactFlowProvider>
              <ERDContent />
            </ReactFlowProvider>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
