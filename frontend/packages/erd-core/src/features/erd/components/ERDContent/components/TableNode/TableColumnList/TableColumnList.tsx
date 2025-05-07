import type { TableNodeData } from '@/features/erd/types'
import { columnHandleId } from '@/features/erd/utils'
import { updateHoverColumn, useUserEditingStore } from '@/stores'
import type { Column } from '@liam-hq/db-structure'
import type { FC } from 'react'
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
  const { hoverInfo } = useUserEditingStore()
  const keys = Object.keys(data.targetColumnCardinalities || {})
  const totalKeys = [
    ...keys,
    ...(data.sourceColumnName ? [data.sourceColumnName] : []),
  ].filter(Boolean)

  const hoverHandle = (tableName: string, columnName: string) => {
    updateHoverColumn({
      tableName: tableName,
      columnName: columnName,
      columnType: !!totalKeys.includes(columnName),
    })
  }
  const getReleatedColumn = () => {
    const releatedColumns =
      hoverInfo.columnName && keys.includes(hoverInfo.columnName)
        ? [hoverInfo.columnName]
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
            onMouseEnter={() => hoverHandle(data.table.name, column.name)}
            onMouseLeave={() =>
              updateHoverColumn({
                tableName: undefined,
                columnName: undefined,
                columnType: false,
              })
            }
            style={{
              backgroundColor: getReleatedColumn().includes(column.name)
                ? '#22392f'
                : hoverInfo.columnName === column.name
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
              isHovered={
                hoverInfo.tableName === data.table.name &&
                hoverInfo.columnName === column.name
              }
              isSelectedTable={data.isHighlighted || data.isActiveHighlighted}
              releatedColumns={getReleatedColumn()}
            />
          </div>
        )
      })}
    </ul>
  )
}
