import type { Columns as ColumnsType } from '@liam-hq/db-structure'
import { Rows3 as Rows3Icon } from '@liam-hq/ui'
import type { FC } from 'react'
import { CollapsibleHeader } from '../CollapsibleHeader'
import styles from './Columns.module.css'
import { ColumnsItem } from './ColumnsItem'

type Props = {
  columns: ColumnsType
}

export const Columns: FC<Props> = ({ columns }) => {
  return (
    <CollapsibleHeader
      title="Columns"
      icon={<Rows3Icon width={12} />}
      isContentVisible={true}
      stickyTopHeight={0}
    >
      {Object.entries(columns).map(([key, column]) => (
        <div className={styles.itemWrapper} key={key}>
          <ColumnsItem column={column} />
        </div>
      ))}
    </CollapsibleHeader>
  )
}
