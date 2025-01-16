import { Table2 } from '@liam-hq/ui'
import { useNodes } from '@xyflow/react'
import type { FC } from 'react'
import styles from './TableCounter.module.css'

export const TableCounter: FC = () => {
  const tableNodes = useNodes().filter((node) => node.type === 'table')

  const allCount = tableNodes.length
  const visibleCount = tableNodes.filter((node) => !node.hidden).length

  return (
    <div className={styles.wrapper}>
      <Table2 width="12px" />
      <span className={styles.text}>
        {visibleCount} / {allCount}
      </span>
    </div>
  )
}
