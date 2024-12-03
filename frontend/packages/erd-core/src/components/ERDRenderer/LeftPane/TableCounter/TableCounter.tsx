import { Table2 } from '@liam-hq/ui'
import type { FC } from 'react'
import { useDBStructureStore } from '../../../../stores'
import styles from './TableCounter.module.css'

export const TableCounter: FC = () => {
  const { tables } = useDBStructureStore()
  const allCount = Object.keys(tables).length
  // TODO: Implement filtering
  const visibleCount = allCount

  return (
    <div className={styles.wrapper}>
      <Table2 width={'12px'} />
      <span className={styles.text}>
        {visibleCount} / {allCount}
      </span>
    </div>
  )
}
