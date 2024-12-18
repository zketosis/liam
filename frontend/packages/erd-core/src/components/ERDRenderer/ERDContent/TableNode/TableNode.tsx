import { useDBStructureStore, useUserEditingStore } from '@/stores'
import type { Node, NodeProps } from '@xyflow/react'
import clsx from 'clsx'
import type { FC } from 'react'
import { isRelatedToTable } from '../ERDContent'
import { TableColumnList } from './TableColumnList'
import { TableHeader } from './TableHeader'
import styles from './TableNode.module.css'
import type { TableNodeType } from './type'

export const isTableNode = (node: Node): node is TableNodeType =>
  node.type === 'table'

type Props = NodeProps<TableNodeType>

export const TableNode: FC<Props> = ({ data }) => {
  const { relationships } = useDBStructureStore()
  const {
    active: { tableName },
    showMode,
  } = useUserEditingStore()

  const isActive = tableName === data.table.name

  const isTableRelated =
    data.isRelated ||
    isRelatedToTable(relationships, data.table.name, tableName)

  return (
    <div
      className={clsx(
        styles.wrapper,
        isTableRelated && styles.wrapperHover,
        isActive && styles.wrapperActive,
      )}
      data-erd="table-node"
    >
      <TableHeader data={data} />
      {showMode === 'ALL_FIELDS' && <TableColumnList data={data} />}
    </div>
  )
}
