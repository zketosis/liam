import type { Columns as ColumnsType } from '@liam-hq/db-structure'
import { Rows3 as Rows3Icon } from '@liam-hq/ui'
import type { FC } from 'react'
import styles from './Columns.module.css'
import { ColumnsItem } from './ColumnsItem'

type Props = {
  columns: ColumnsType
}

export const Columns: FC<Props> = ({ columns }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.iconTitleContainer}>
          <Rows3Icon width={12} />
          <h2 className={styles.heading}>Columns</h2>
        </div>
      </div>
      {Object.entries(columns).map(([key, column]) => (
        <div className={styles.itemWrapper} key={key}>
          <ColumnsItem column={column} />
        </div>
      ))}
    </div>
  )
}
