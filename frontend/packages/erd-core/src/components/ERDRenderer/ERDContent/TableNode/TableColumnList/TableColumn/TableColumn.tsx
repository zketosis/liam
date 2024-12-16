import type {
  Cardinality as CardinalityType,
  Column,
  Table,
} from '@liam-hq/db-structure'
import { DiamondFillIcon, DiamondIcon, KeyRound } from '@liam-hq/ui'
import { Handle, Position } from '@xyflow/react'
import clsx from 'clsx'
import type { FC } from 'react'
import { match } from 'ts-pattern'
import { Cardinality } from './Cardinality'
import { CardinalityNotation } from './CardinalityNotation'
import styles from './TableColumn.module.css'

type TableColumnProps = {
  table: Table
  column: Column
  isHighlighted: boolean
  highlightedHandles: string[]
  isSource: boolean
  targetCardinality?: CardinalityType | undefined
}

export const TableColumn: FC<TableColumnProps> = ({
  table,
  column,
  isHighlighted,
  highlightedHandles,
  isSource,
  targetCardinality,
}) => {
  const handleId = `${table.name}-${column.name}`

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
