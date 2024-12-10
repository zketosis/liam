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
import { useDBStructureStore } from '@/stores'
import { TableDetailDrawer, TableDetailDrawerRoot } from './TableDetailDrawer'
import { convertDBStructureToNodes } from './convertDBStructureToNodes'

export const ERDRenderer: FC = () => {
  const defaultOpen = getSidebarStateFromCookie()
  const dbStructure = useDBStructureStore()
  const { nodes, edges } = convertDBStructureToNodes(dbStructure)

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
            <TableDetailDrawerRoot>
              <ReactFlowProvider>
                <ERDContent nodes={nodes} edges={edges} />
              </ReactFlowProvider>
              <TableDetailDrawer />
            </TableDetailDrawerRoot>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}
