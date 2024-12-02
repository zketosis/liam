import '@xyflow/react/dist/style.css'
import { ReactFlowProvider } from '@xyflow/react'
import type { FC } from 'react'
import { ERDContent } from './ERDContent'
import styles from './ERDRenderer.module.css'

export const ERDRenderer: FC = () => {
  return (
    <main className={styles.wrapper}>
      <div>sidebar</div>
      <ReactFlowProvider>
        <ERDContent />
      </ReactFlowProvider>
    </main>
  )
}
