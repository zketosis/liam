import type { FC } from 'react'
import styles from './TableGroupNode.module.css'

type TableGroupNodeProps = {
  data: {
    name: string
    comment: string | null
  }
  id: string
}

export const TableGroupNode: FC<TableGroupNodeProps> = ({ data }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>{data.name}</div>
        {data.comment && <div className={styles.actions}>{data.comment}</div>}
      </div>
    </div>
  )
}
