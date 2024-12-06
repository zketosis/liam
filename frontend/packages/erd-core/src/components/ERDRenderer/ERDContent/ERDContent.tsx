import { Background, BackgroundVariant, ReactFlow } from '@xyflow/react'
import type { FC } from 'react'
import { useDBStructureStore } from '../../../stores'
import { convertDBStructureToNodes } from '../convertDBStructureToNodes'
import styles from './ERDContent.module.css'
import { RelationshipEdge } from './RelationshipEdge'
import { TableNode } from './TableNode'

const nodeTypes = {
  table: TableNode,
}

const edgeTypes = {
  relationship: RelationshipEdge,
}

export const ERDContent: FC = () => {
  const dbStructure = useDBStructureStore()
  const { nodes, edges } = convertDBStructureToNodes(dbStructure)

  return (
    <div className={styles.wrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
    </div>
  )
}
