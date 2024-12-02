import '@xyflow/react/dist/style.css'
import type { DBStructure } from '@liam-hq/db-structure'
import { ReactFlowProvider } from '@xyflow/react'
import type { FC } from 'react'
import { ERDContent } from './ERDContent'
import { convertDBStructureToNodes } from './convertDBStructureToNodes'

interface ERDRendererProps {
  dbStructure: DBStructure
}

export const ERDRenderer: FC<ERDRendererProps> = ({ dbStructure }) => {
  const nodes = convertDBStructureToNodes(dbStructure)
  return (
    <ReactFlowProvider>
      <ERDContent nodes={nodes} />
    </ReactFlowProvider>
  )
}
