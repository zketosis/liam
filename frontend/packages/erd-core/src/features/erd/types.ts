import type { ShowMode } from '@/schemas/showMode/types'
import type { Cardinality, Table } from '@liam-hq/db-structure'
import React from 'react';
import type { Node } from '@xyflow/react'
import type { HoverInfo } from './components'

export type TableNodeData = {
  table: Table
  isActiveHighlighted: boolean
  isHighlighted: boolean
  sourceColumnName: string | undefined
  targetColumnCardinalities?:
    | Record<string, Cardinality | undefined>
    | undefined
  showMode?: ShowMode | undefined
  onTableColumnMouseEnter: (
    event: React.MouseEvent,
    node: { id: string | undefined },
    hoverInfo?: HoverInfo | undefined,
  ) => void
}

export type TableNodeType = Node<TableNodeData, 'table'>

export type NonRelatedTableGroupNodeType = Node<
  Record<string, unknown>,
  'nonRelatedTableGroup'
>

export type DisplayArea = 'main' | 'relatedTables'

export type TableGroupNodeData = {
  name: string
}

export type TableGroupNodeType = Node<TableGroupNodeData, 'tableGroup'>
