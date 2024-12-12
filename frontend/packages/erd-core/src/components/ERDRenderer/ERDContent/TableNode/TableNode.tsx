import {
  updateActiveTableName,
  useDBStructureStore,
  useUserEditingStore,
} from '@/stores'
import type { Table } from '@liam-hq/db-structure'
import { DiamondFillIcon, DiamondIcon, KeyRound } from '@liam-hq/ui'
import { Handle, type Node, type NodeProps, Position } from '@xyflow/react'
import clsx from 'clsx'
import { type FC, useCallback } from 'react'
import { isRelatedToTable } from '../ERDContent'
import { TableHeader } from './TableHeader'
import styles from './TableNode.module.css'

type Data = {
  table: Table
  isHovered: boolean
}

type TableNodeType = Node<Data, 'Table'>

type Props = NodeProps<TableNodeType>

export const TableNode: FC<Props> = ({ data: { table, isHovered } }) => {
  const { relationships } = useDBStructureStore()
  const {
    active: { tableName },
  } = useUserEditingStore()

  const isActive = tableName === table.name

  const isRelated =
    isHovered || isRelatedToTable(relationships, table.name, tableName)

  const { showMode } = useUserEditingStore()

  const handleClick = useCallback(() => {
    updateActiveTableName(table.name)
  }, [table])

  return (
    <button
      type="button"
      className={clsx(
        styles.wrapper,
        isRelated && styles.wrapperHover,
        isActive && styles.wrapperActive,
      )}
      onClick={handleClick}
    >
      <TableHeader name={table.name} />
      {showMode === 'ALL_FIELDS' && (
        <ul>
          {Object.values(table.columns).map((column) => {
            const handleId = `${table.name}-${column.name}`
            const isSource = Object.values(relationships).some(
              (relationship) =>
                relationship.primaryTableName === table.name &&
                relationship.primaryColumnName === column.name,
            )
            const isTarget = Object.values(relationships).some(
              (relationship) =>
                relationship.foreignTableName === table.name &&
                relationship.foreignColumnName === column.name,
            )

            return (
              <li key={column.name} className={styles.columnWrapper}>
                {column.primary && (
                  <KeyRound
                    width={16}
                    height={16}
                    className={styles.primaryKeyIcon}
                    role="img"
                    aria-label="Primary Key"
                  />
                )}
                {!column.primary &&
                  (column.notNull ? (
                    <DiamondFillIcon
                      width={16}
                      height={16}
                      className={styles.diamondIcon}
                      role="img"
                      aria-label="Not Null"
                    />
                  ) : (
                    <DiamondIcon
                      width={16}
                      height={16}
                      className={styles.diamondIcon}
                      role="img"
                      aria-label="Nullable"
                    />
                  ))}

                <span className={styles.columnNameWrapper}>
                  <span className={styles.columnName}>{column.name}</span>
                  <span className={styles.columnType}>{column.type}</span>
                </span>

                {isSource && (
                  <Handle
                    id={handleId}
                    type="source"
                    position={Position.Right}
                    className={styles.handle}
                  />
                )}

                {isTarget && (
                  <Handle
                    id={handleId}
                    type="target"
                    position={Position.Left}
                    className={styles.handle}
                  />
                )}
              </li>
            )
          })}
        </ul>
      )}
    </button>
  )
}
