import { Table2 } from '@liam-hq/ui'
import type { FC } from 'react'
import styles from './TableHeader.module.css'

type Props = {
  name: string
}

export const TableHeader: FC<Props> = ({ name }) => {
  return (
    <div className={styles.wrapper}>
      <Table2 width={16} />
      <span className={styles.name}>{name}</span>
    </div>
  )
}
