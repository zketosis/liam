import type { Relationships } from '@liam-hq/db-structure'
import type { FC } from 'react'
import { columnHandleId } from '../../../columnHandleId'
import type { Data } from '../type'
import { TableColumn } from './TableColumn'

type TableColumnListProps = {
  data: Data
  filter?: 'KEY_ONLY'
  relationships: Relationships
}

export const TableColumnList: FC<TableColumnListProps> = ({
  data,
  filter,
  relationships,
}) => {
  const foreignKeyColumns = Object.values(data.table.columns).filter((column) =>
    Object.values(relationships).some(
      (rel) =>
        rel.foreignTableName === data.table.name &&
        rel.foreignColumnName === column.name,
    ),
  )

  const primaryColumns = Object.values(data.table.columns).filter((column) => {
    return column.primary
  })

  const columns =
    filter === 'KEY_ONLY'
      ? primaryColumns.concat(foreignKeyColumns)
      : Object.values(data.table.columns)

  return (
    <ul>
      {columns.map((column) => {
        const handleId = columnHandleId(data.table.name, column.name)
        const isHighlighted =
          data.isHighlighted || data.highlightedHandles?.includes(handleId)
        const isSource = data.sourceColumnName === column.name

        return (
          <TableColumn
            key={column.name}
            column={column}
            handleId={handleId}
            isHighlighted={isHighlighted}
            isSource={isSource}
            targetCardinality={data.targetColumnCardinalities?.[column.name]}
          />
        )
      })}
    </ul>
  )
}
