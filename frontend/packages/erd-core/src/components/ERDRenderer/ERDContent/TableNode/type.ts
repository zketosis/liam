import type { Cardinality, Table } from '@liam-hq/db-structure'
import type { Node } from '@xyflow/react'

export type Data = {
  table: Table
  isHighlighted: boolean
  isRelated: boolean
  highlightedHandles: string[]
  sourceColumnName: string | undefined
  targetColumnCardinalities?:
    | Record<string, Cardinality | undefined>
    | undefined
}

export type TableNodeType = Node<Data, 'table'>
