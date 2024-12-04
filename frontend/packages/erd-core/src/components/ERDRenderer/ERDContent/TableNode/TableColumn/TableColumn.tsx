import type { Column } from '@liam-hq/db-structure'
import { DiamondFillIcon, DiamondIcon, KeyRound } from '@liam-hq/ui'
import type { FC } from 'react'
import styles from './TableColumn.module.css'

type Props = {
  column: Column
}

export const TableColumn: FC<Props> = ({ column }) => {
  return (
    <li key={column.name} className={styles.wrapper}>
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

      <span className={styles.columnName}>
        <span>{column.name}</span>
        <span className={styles.columnType}>{column.type}</span>
      </span>
    </li>
  )
}
