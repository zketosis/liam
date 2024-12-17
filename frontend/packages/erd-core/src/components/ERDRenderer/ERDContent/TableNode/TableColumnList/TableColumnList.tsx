import type { FC } from 'react'
import { columnHandleId } from '../../../columnHandleId'
import type { Data } from '../type'
import { TableColumn } from './TableColumn'

type TableColumnListProps = {
  data: Data
}

export const TableColumnList: FC<TableColumnListProps> = ({ data }) => (
  <ul>
    {Object.values(data.table.columns).map((column) => {
      const handleId = columnHandleId(data.table.name, column.name)
      const isHighlighted =
        data.isHighlighted || data.highlightedHandles.includes(handleId)
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
