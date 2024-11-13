import type { FC } from 'react'
import '@xyflow/react/dist/style.css'
import { ReactFlowProvider } from '@xyflow/react'
import { ERDContent } from './ERDContent'

export const ERDRenderer: FC = () => {
  return (
    <ReactFlowProvider>
      <ERDContent />
    </ReactFlowProvider>
  )
}
