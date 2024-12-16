import type { Table } from '@liam-hq/db-structure'
import type { Node } from '@xyflow/react'

export type Data = {
  table: Table
  isHighlighted: boolean
  isRelated: boolean
  highlightedHandles: string[]
  sourceColumnName: string | undefined
}

export type TableNodeType = Node<Data, 'table'>
