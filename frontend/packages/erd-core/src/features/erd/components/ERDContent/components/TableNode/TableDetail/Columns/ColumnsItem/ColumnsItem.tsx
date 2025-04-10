import type { Column } from '@liam-hq/db-structure'
import {
  DiamondFillIcon,
  DiamondIcon,
  GridTableDd,
  GridTableDt,
  GridTableItem,
  GridTableRoot,
  GridTableRow,
  KeyRound,
} from '@liam-hq/ui'
import type { FC } from 'react'
import styles from './ColumnsItem.module.css'

type Props = {
  column: Column
}

export const ColumnsItem: FC<Props> = ({ column }) => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>{column.name}</h3>
      {column.comment && <p className={styles.comment}>{column.comment}</p>}
      <GridTableRoot>
        <GridTableItem>
          <GridTableDt>Type</GridTableDt>
          <GridTableDd>{column.type}</GridTableDd>
        </GridTableItem>
        {column.default !== null && (
          <GridTableItem>
            <GridTableDt>Default</GridTableDt>
            <GridTableDd>{column.default}</GridTableDd>
          </GridTableItem>
        )}
        {column.primary && (
          <GridTableItem>
            <GridTableRow>
              <KeyRound className={styles.primaryKeyIcon} />
              <span>Primary Key</span>
            </GridTableRow>
          </GridTableItem>
        )}
        {column.notNull ? (
          <GridTableItem>
            <GridTableRow>
              <DiamondFillIcon className={styles.diamondIcon} />
              <span>Not-null</span>
            </GridTableRow>
          </GridTableItem>
        ) : (
          <GridTableItem>
            <GridTableRow>
              <DiamondIcon className={styles.diamondIcon} />
              <span>Nullable</span>
            </GridTableRow>
          </GridTableItem>
        )}
      </GridTableRoot>
    </div>
  )
}
