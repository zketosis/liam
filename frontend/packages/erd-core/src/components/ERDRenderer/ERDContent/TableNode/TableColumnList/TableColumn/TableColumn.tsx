import type { Column, Relationships, Table } from '@liam-hq/db-structure'
import { DiamondFillIcon, DiamondIcon, KeyRound } from '@liam-hq/ui'
import { Handle, Position } from '@xyflow/react'
import clsx from 'clsx'
import { useMemo } from 'react'
import type { FC } from 'react'
import { match } from 'ts-pattern'
import { Cardinality } from './Cardinality'
import { CardinalityNotation } from './CardinalityNotation'
import styles from './TableColumn.module.css'

type TableColumnProps = {
  table: Table
  column: Column
  relationships: Relationships
  isHighlighted: boolean
  highlightedHandles: string[]
}

export const TableColumn: FC<TableColumnProps> = ({
  table,
  column,
  relationships,
  isHighlighted,
  highlightedHandles,
}) => {
  const handleId = `${table.name}-${column.name}`

  const { sourceColumns, targetCardinalities } = useMemo(() => {
    const sourceColumns: Set<string> = new Set()
    const targetCardinalities: Record<string, string | undefined> = {}

    for (const relationship of Object.values(relationships)) {
      const sourceKey = `${relationship.primaryTableName}-${relationship.primaryColumnName}`
      sourceColumns.add(sourceKey)

      const targetKey = `${relationship.foreignTableName}-${relationship.foreignColumnName}`
      targetCardinalities[targetKey] = relationship.cardinality
    }

    return { sourceColumns, targetCardinalities }
  }, [relationships])

  const isSource = sourceColumns.has(handleId)
  const targetCardinality = targetCardinalities[handleId]

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
        <>
          <Handle
            id={handleId}
            type="source"
            position={Position.Right}
            className={clsx([styles.handle])}
          />
          <Cardinality
            direction="right"
            cardinality="ONE_TO_ONE"
            isHighlighted={
              isHighlighted || highlightedHandles.includes(handleId)
            }
          />
          <CardinalityNotation
            direction="right"
            notation="1"
            isHighlighted={
              isHighlighted || highlightedHandles.includes(handleId)
            }
          />
        </>
      )}

      {targetCardinality && (
        <>
          <Handle
            id={handleId}
            type="target"
            position={Position.Left}
            className={clsx([styles.handle])}
          />
          {match(targetCardinality)
            .with('ONE_TO_ONE', () => (
              <>
                <Cardinality
                  direction="left"
                  cardinality="ONE_TO_ONE"
                  isHighlighted={
                    isHighlighted || highlightedHandles.includes(handleId)
                  }
                />
                <CardinalityNotation
                  direction="left"
                  notation="1"
                  isHighlighted={
                    isHighlighted || highlightedHandles.includes(handleId)
                  }
                />
              </>
            ))
            .with('ONE_TO_MANY', () => (
              <>
                <Cardinality
                  direction="left"
                  cardinality="ONE_TO_MANY"
                  isHighlighted={
                    isHighlighted || highlightedHandles.includes(handleId)
                  }
                />
                <CardinalityNotation
                  direction="left"
                  notation="n"
                  isHighlighted={
                    isHighlighted || highlightedHandles.includes(handleId)
                  }
                />
              </>
            ))
            .otherwise(() => null)}
        </>
      )}
    </li>
  )
}
