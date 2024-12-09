import { convertDBStructureToNodes } from '@/components/ERDRenderer/convertDBStructureToNodes'
import { useDBStructureStore } from '@/stores'
import { GotoIcon, IconButton } from '@liam-hq/ui'
import { ReactFlowProvider } from '@xyflow/react'
import type { FC } from 'react'
import { ERDContent } from '../../../ERDContent'
import styles from './RelatedTables.module.css'

export const RelatedTables: FC = () => {
  const dbStructure = useDBStructureStore()
  const { nodes, edges } = convertDBStructureToNodes(dbStructure)

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
