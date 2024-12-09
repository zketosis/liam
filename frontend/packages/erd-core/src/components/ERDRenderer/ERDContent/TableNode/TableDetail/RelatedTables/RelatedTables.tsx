import { convertDBStructureToNodes } from '@/components/ERDRenderer/convertDBStructureToNodes'
import { useDBStructureStore } from '@/stores'
import type { Table } from '@liam-hq/db-structure'
import { GotoIcon, IconButton } from '@liam-hq/ui'
import { ReactFlowProvider } from '@xyflow/react'
import type { FC } from 'react'
import { ERDContent } from '../../../ERDContent'
import styles from './RelatedTables.module.css'
import { extractDBStructureForTable } from './extractDBStructureForTable'

type Props = {
  table: Table
}

export const RelatedTables: FC<Props> = ({ table }) => {
  const dbStructure = useDBStructureStore()
  const extractedDBStructure = extractDBStructureForTable(table, dbStructure)
  const { nodes, edges } = convertDBStructureToNodes(extractedDBStructure)

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Related tables</h2>
        <IconButton icon={<GotoIcon />} tooltipContent="Go to Related tables" />
      </div>
      <div className={styles.contentWrapper}>
        <ReactFlowProvider>
          <ERDContent nodes={nodes} edges={edges} />
        </ReactFlowProvider>
      </div>
    </div>
  )
}
