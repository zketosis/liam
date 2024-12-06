import { Background, BackgroundVariant, ReactFlow } from '@xyflow/react'
import type { FC } from 'react'
import { useDBStructureStore } from '../../../stores'
import { convertDBStructureToNodes } from '../convertDBStructureToNodes'
import styles from './ERDContent.module.css'
import { TableNode } from './TableNode'
import { Toolbar } from './Toolbar'

const nodeTypes = {
  table: TableNode,
}

export const ERDContent: FC = () => {
  const dbStructure = useDBStructureStore()
  const nodes = convertDBStructureToNodes(dbStructure)

  return (
    <div className={styles.wrapper}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          /* NOTE: Ensure that the Edge always appears above the Node (Note: The z-index of a selected Node is 1000). */
          zIndex: 1001,
        }}
        minZoom={0.5}
        maxZoom={1}
      >
        <Background
          color="var(--color-gray-600)"
          variant={BackgroundVariant.Dots}
          size={1}
          gap={16}
        />
      </ReactFlow>
      <div className={styles.toolbarWrapper}>
        <Toolbar />
      </div>
    </div>
  )
}
