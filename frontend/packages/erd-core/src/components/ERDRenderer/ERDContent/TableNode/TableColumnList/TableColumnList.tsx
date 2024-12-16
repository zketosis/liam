import type { Relationships, Table } from '@liam-hq/db-structure'
import type { FC } from 'react'
import { TableColumn } from './TableColumn'

type TableColumnListProps = {
  table: Table
  relationships: Relationships
  isHighlighted: boolean
  highlightedHandles: string[]
}

export const TableColumnList: FC<TableColumnListProps> = ({
  table,
  relationships,
  isHighlighted,
  highlightedHandles,
}) => (
  <ul>
    {Object.values(table.columns).map((column) => (
      <TableColumn
        key={column.name}
        table={table}
        column={column}
        relationships={relationships}
        isHighlighted={isHighlighted}
        highlightedHandles={highlightedHandles}
      />
    ))}
  </ul>
)
