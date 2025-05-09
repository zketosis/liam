import type { TableNodeData } from '@/features/erd/types'
import { columnHandleId } from '@/features/erd/utils'
import { updateHoverColumn, useUserEditingStore } from '@/stores'
import type { Column } from '@liam-hq/db-structure'
import type { FC } from 'react'
import type { HoverInfo } from '../../../ERDContent'
import { TableColumn } from './TableColumn'

type TableColumnListProps = {
  data: TableNodeData
  filter?: 'KEY_ONLY'
  onTableColumnMouseEnter: (
    event: React.MouseEvent,
    hoverInfo?: HoverInfo,
  ) => void;
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

export const TableColumnList: FC<TableColumnListProps> = ({ data, filter, onTableColumnMouseEnter }) => {
  const { hoverInfo } = useUserEditingStore()

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
        const targetColumnCardinalities = data.targetColumnCardinalities

        return (
          <div
            key={column.name}
            onMouseEnter={(e) => {
              const hoveredInfo = {                
                tableName: data.table.name,
                columnName: column.name,
                columnType:
                  isSource || !!targetColumnCardinalities?.[column.name],
              }
              onTableColumnMouseEnter(e, hoveredInfo)
              updateHoverColumn(hoveredInfo)
            }
            }
            onMouseLeave={() =>
              updateHoverColumn({
                tableName: undefined,
                columnName: undefined,
                columnType: false,
              })
            }
          >
            <TableColumn
              key={column.name}
              column={column}
              handleId={handleId}
              isSource={isSource}
              targetCardinality={targetColumnCardinalities?.[column.name]}
              isHovered={
                hoverInfo.tableName === data.table.name &&
                hoverInfo.columnName === column.name
              }
              isSelectedTable={data.isHighlighted || data.isActiveHighlighted}
              isRelated={
                hoverInfo.columnName &&
                (targetColumnCardinalities?.[hoverInfo.columnName] ||
                  data.sourceColumnName === hoverInfo.columnName)
                  ? hoverInfo.columnName === column.name
                  : isSource || !!targetColumnCardinalities?.[column.name]
              }
            />
          </div>
        )
      })}
    </ul>
  )
}
