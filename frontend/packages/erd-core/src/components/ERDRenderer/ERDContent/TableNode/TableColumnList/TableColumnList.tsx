import type { FC } from 'react'
import type { Data } from '../type'
import { TableColumn } from './TableColumn'

type TableColumnListProps = {
  data: Data
}

export const TableColumnList: FC<TableColumnListProps> = ({ data }) => (
  <ul>
    {Object.values(data.table.columns).map((column) => (
      <TableColumn
        key={column.name}
        table={data.table}
        column={column}
        isHighlighted={data.isHighlighted}
        highlightedHandles={data.highlightedHandles ?? []}
        isSource={data.sourceColumnName === column.name}
        targetCardinality={data.targetColumnCardinalities?.[column.name]}
      />
    ))}
  </ul>
)
