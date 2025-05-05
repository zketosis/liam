import type { TableNodeData } from '@/features/erd/types'
import { columnHandleId } from '@/features/erd/utils'
import type { Column } from '@liam-hq/db-structure'
import { type FC, useState } from 'react'
import { TableColumn } from './TableColumn'

type TableColumnListProps = {
  data: TableNodeData
  filter?: 'KEY_ONLY'
}

const shouldDisplayColumn = (
  column: Column,
  filter: 'KEY_ONLY' | undefined,
  targetColumnCardinalities: TableNodeData['targetColumnCardinalities'],
): boolean => {
  if (filter === 'KEY_ONLY') {
    return (
      column.primary || targetColumnCardinalities?.[column.name] !== undefined
    )
  }
  return true
}

export const TableColumnList: FC<TableColumnListProps> = ({ data, filter }) => {
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null)

  const getReleatedColumn = () => {
    const keys = Object.keys(data.targetColumnCardinalities || {})
    const releatedColumns =
      hoveredColumn && keys.includes(hoveredColumn)
        ? [hoveredColumn]
        : [
            ...keys,
            ...(data.sourceColumnName ? [data.sourceColumnName] : []),
          ].filter(Boolean)

    return releatedColumns
  }

  return (
    <ul>
      {Object.values(data.table.columns).map((column) => {
        if (
          !shouldDisplayColumn(column, filter, data.targetColumnCardinalities)
        ) {
          return null
        }
        const handleId = columnHandleId(data.table.name, column.name)
        const isSource = data.sourceColumnName === column.name

        return (
          <div
            key={column.name}
            onMouseEnter={() => setHoveredColumn(column.name)}
            onMouseLeave={() => setHoveredColumn(null)}
            style={{
              backgroundColor: getReleatedColumn().includes(column.name)
                ? '#22392f'
                : hoveredColumn === column.name
                  ? '#434546'
                  : '',
            }}
          >
            <TableColumn
              key={column.name}
              column={column}
              handleId={handleId}
              isSource={isSource}
              targetCardinality={data.targetColumnCardinalities?.[column.name]}
              isHovered={hoveredColumn === column.name}
              isSelectedTable={data.isHighlighted || data.isActiveHighlighted}
              releatedColumns={getReleatedColumn()}
            />
          </div>
        )
      })}
    </ul>
  )
}
