import type { Relationships } from '@liam-hq/db-structure'
import type { FC } from 'react'
import type { Data } from '../type'
import { TableColumn } from './TableColumn'

type TableColumnListProps = {
  data: Data
  relationships: Relationships
}

export const TableColumnList: FC<TableColumnListProps> = ({
  data,
  relationships,
}) => (
  <ul>
    {Object.values(data.table.columns).map((column) => (
      <TableColumn
        key={column.name}
        table={data.table}
        column={column}
        relationships={relationships}
        isHighlighted={data.isHighlighted}
        highlightedHandles={data.highlightedHandles ?? []}
        isSource={data.sourceColumnName === column.name}
      />
    ))}
  </ul>
)
