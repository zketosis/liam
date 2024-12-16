import {
  updateActiveTableName,
  useDBStructureStore,
  useUserEditingStore,
} from '@/stores'
import type { Node, NodeProps } from '@xyflow/react'
import clsx from 'clsx'
import { type FC, useCallback } from 'react'
import { isRelatedToTable } from '../ERDContent'
import { TableColumnList } from './TableColumnList'
import { TableHeader } from './TableHeader'
import styles from './TableNode.module.css'
import type { TableNodeType } from './type'

export const isTableNode = (node: Node): node is TableNodeType =>
  node.type === 'table'

type Props = NodeProps<TableNodeType>

export const TableNode: FC<Props> = ({
  data: { table, isRelated, isHighlighted, highlightedHandles },
}) => {
  const { relationships } = useDBStructureStore()
  const {
    active: { tableName },
  } = useUserEditingStore()

  const isActive = tableName === table.name

  const isTableRelated =
    isRelated || isRelatedToTable(relationships, table.name, tableName)

  const { showMode } = useUserEditingStore()

  const handleClick = useCallback(() => {
    updateActiveTableName(table.name)
  }, [table])

  return (
    <button
      type="button"
      className={clsx(
        styles.wrapper,
        isTableRelated && styles.wrapperHover,
        isActive && styles.wrapperActive,
      )}
      onClick={handleClick}
    >
      <TableHeader name={table.name} />
      {showMode === 'ALL_FIELDS' && (
        <TableColumnList
          table={table}
          relationships={relationships}
          isHighlighted={isHighlighted}
          highlightedHandles={highlightedHandles ?? []}
        />
      )}
    </button>
  )
}
