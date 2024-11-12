import { Background, Controls, type Node, ReactFlow } from '@xyflow/react'
import type { FC } from 'react'
import styles from './ERDContent.module.css'

const nodes: Node[] = [
  {
    id: '1',
    data: { label: 'An input node' },
    position: { x: 0, y: 50 },
  },
  {
    id: '2',
    data: {},
    style: { border: '1px solid #777', padding: 10 },
    position: { x: 300, y: 50 },
  },
  {
    id: '3',
    data: { label: 'Output A' },
    position: { x: 650, y: 25 },
  },
  {
    id: '4',
    data: { label: 'Output B' },
    position: { x: 650, y: 100 },
  },
]

export const ERDContent: FC = () => {
  return (
    <div className={styles.wrapper}>
      <ReactFlow
        nodes={nodes}
        defaultEdgeOptions={{
          /* NOTE: Ensure that the Edge always appears above the Node (Note: The z-index of a selected Node is 1000). */
          zIndex: 1001,
        }}
        minZoom={0.5}
        maxZoom={1}
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  )
}
