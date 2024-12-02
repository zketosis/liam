import '@xyflow/react/dist/style.css'
import { ReactFlowProvider } from '@xyflow/react'
import type { FC } from 'react'
import { useDBStructureStore } from '../../stores'
import { ERDContent } from './ERDContent'
import styles from './ERDRenderer.module.css'
import { convertDBStructureToNodes } from './convertDBStructureToNodes'

export const ERDRenderer: FC = () => {
  const dbStructure = useDBStructureStore()
  const nodes = convertDBStructureToNodes(dbStructure)
  return (
    <main className={styles.wrapper}>
      <div>sidebar</div>
      <ReactFlowProvider>
        <ERDContent nodes={nodes} />
      </ReactFlowProvider>
    </main>
  )
}
