import '@xyflow/react/dist/style.css'
import {
  type ImperativePanelHandle,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  SidebarProvider,
  type SidebarState,
  SidebarTrigger,
  ToastProvider,
} from '@liam-hq/ui'
import { ReactFlowProvider } from '@xyflow/react'
import { type FC, createRef, useCallback, useState } from 'react'
import { AppBar } from './AppBar'
import { ERDContent } from './ERDContent'
import styles from './ERDRenderer.module.css'
import { LeftPane } from './LeftPane'
import '@/styles/globals.css'
import { toggleLogEvent } from '@/features/gtm/utils'
import { useVersion } from '@/providers'
import { useDBStructureStore, useUserEditingStore } from '@/stores'
import { CardinalityMarkers } from './CardinalityMarkers'
import { ErrorDisplay } from './ErrorDisplay'
import { RelationshipEdgeParticleMarker } from './RelationshipEdgeParticleMarker'
import { TableDetailDrawer, TableDetailDrawerRoot } from './TableDetailDrawer'
import { Toolbar } from './Toolbar'
import { convertDBStructureToNodes } from './convertDBStructureToNodes'

type ErrorObject = {
  name: string
  message: string
}

type Props = {
  defaultSidebarOpen?: boolean | undefined
  errorObjects?: ErrorObject[] | undefined
}

export const ERDRenderer: FC<Props> = ({
  defaultSidebarOpen = false,
  errorObjects = [],
}) => {
  const [open, setOpen] = useState(defaultSidebarOpen)

  const { showMode } = useUserEditingStore()
  const dbStructure = useDBStructureStore()
  const { nodes, edges } = convertDBStructureToNodes({
    dbStructure,
    showMode,
  })

  const leftPanelRef = createRef<ImperativePanelHandle>()

  const { version } = useVersion()
  const handleChangeOpen = useCallback(
    (open: boolean) => {
      setOpen(open)
      toggleLogEvent({
        element: 'leftPane',
        isShow: open,
        platform: version.displayedOn,
        gitHash: version.gitHash,
        ver: version.version,
        appEnv: version.envName,
      })

      open === true
        ? leftPanelRef.current?.collapse()
        : leftPanelRef.current?.expand()
    },
    [version, leftPanelRef],
  )

  return (
    <SidebarProvider
      className={styles.wrapper}
      open={open}
      onOpenChange={handleChangeOpen}
    >
      <CardinalityMarkers />
      <RelationshipEdgeParticleMarker />
      <ToastProvider>
        <AppBar />
        <ReactFlowProvider>
          <ResizablePanelGroup
            direction="horizontal"
            className={styles.mainWrapper}
          >
            <ResizablePanel
              collapsible
              defaultSize={30}
              minSize={20}
              maxSize={50}
              ref={leftPanelRef}
            >
              <LeftPane />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel collapsible defaultSize={70} minSize={50}>
              <main className={styles.main}>
                <div className={styles.triggerWrapper}>
                  <SidebarTrigger />
                </div>
                <TableDetailDrawerRoot>
                  {errorObjects.length > 0 && (
                    <ErrorDisplay errors={errorObjects} />
                  )}
                  {errorObjects.length > 0 || (
                    <>
                      <ERDContent
                        key={`${nodes.length}-${showMode}`}
                        nodes={nodes}
                        edges={edges}
                        displayArea="main"
                      />
                      <TableDetailDrawer />
                    </>
                  )}
                </TableDetailDrawerRoot>
                {errorObjects.length === 0 && (
                  <div className={styles.toolbarWrapper}>
                    <Toolbar />
                  </div>
                )}
              </main>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ReactFlowProvider>
      </ToastProvider>
    </SidebarProvider>
  )
}
