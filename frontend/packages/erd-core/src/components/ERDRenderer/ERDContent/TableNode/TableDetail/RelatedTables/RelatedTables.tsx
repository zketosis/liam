import { convertDBStructureToNodes } from '@/components/ERDRenderer/convertDBStructureToNodes'
import { openRelatedTablesLogEvent } from '@/features/gtm/utils'
import { useVersion } from '@/providers'
import {
  replaceHiddenNodeIds,
  updateActiveTableName,
  useDBStructureStore,
} from '@/stores'
import type { Table } from '@liam-hq/db-structure'
import {
  ChevronDown,
  ChevronUp,
  GotoIcon,
  IconButton,
  Waypoints as WaypointsIcon,
} from '@liam-hq/ui'
import { ReactFlowProvider, useReactFlow } from '@xyflow/react'
import clsx from 'clsx'
import { type FC, type MouseEvent, useCallback, useState } from 'react'
import { ERDContent } from '../../../ERDContent'
import styles from './RelatedTables.module.css'
import { extractDBStructureForTable } from './extractDBStructureForTable'

type Props = {
  table: Table
}

export const RelatedTables: FC<Props> = ({ table }) => {
  const dbStructure = useDBStructureStore()
  const extractedDBStructure = extractDBStructureForTable(table, dbStructure)
  const { nodes, edges } = convertDBStructureToNodes({
    dbStructure: extractedDBStructure,
    showMode: 'TABLE_NAME',
  })
  const { getNodes } = useReactFlow()
  const { version } = useVersion()
  const handleClick = useCallback(
    (event: MouseEvent) => {
      const visibleNodeIds: string[] = nodes.map((node) => node.id)
      const mainPaneNodes = getNodes()
      const hiddenNodeIds = mainPaneNodes
        .filter((node) => !visibleNodeIds.includes(node.id))
        .map((node) => node.id)

      event.stopPropagation()
      replaceHiddenNodeIds(hiddenNodeIds)
      updateActiveTableName(undefined)
      openRelatedTablesLogEvent({
        tableId: table.name,
        platform: version.displayedOn,
        gitHash: version.gitHash,
        ver: version.version,
        appEnv: version.envName,
      })
    },
    [nodes, getNodes, table.name, version],
  )
  const [isClosed, setIsClosed] = useState(false)
  const handleClose = (event: MouseEvent) => {
    event.stopPropagation()
    setIsClosed(!isClosed)
  }
  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsClosed(!isClosed)
    }
  }

  return (
    <>
      <div
        className={styles.header}
        // biome-ignore lint/a11y/useSemanticElements: Implemented with div button to be button in button
        role="button"
        tabIndex={0}
        onClick={handleClose}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.iconTitleContainer}>
          <WaypointsIcon width={12} />
          <h2 className={styles.heading}>Related tables</h2>
        </div>
        <div className={styles.iconContainer}>
          <IconButton
            icon={<GotoIcon />}
            tooltipContent="Open in main area"
            onClick={handleClick}
          />
          <IconButton
            icon={isClosed ? <ChevronDown /> : <ChevronUp />}
            tooltipContent={isClosed ? 'Open' : 'Close'}
            onClick={handleClose}
          />
        </div>
      </div>
      <div className={clsx(!isClosed && styles.visible, styles.outerWrapper)}>
        <div className={styles.contentWrapper}>
          <ReactFlowProvider>
            <ERDContent
              nodes={nodes}
              edges={edges}
              enabledFeatures={{
                fitViewWhenActiveTableChange: false,
                initialFitViewToActiveTable: false,
              }}
            />
          </ReactFlowProvider>
        </div>
      </div>
    </>
  )
}
