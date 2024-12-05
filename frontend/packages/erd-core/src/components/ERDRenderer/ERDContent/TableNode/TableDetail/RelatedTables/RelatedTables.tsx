import { GotoIcon, IconButton } from '@liam-hq/ui'
import type { FC } from 'react'
import styles from './RelatedTables.module.css'
import img from './related-table-ex.png'

export const RelatedTables: FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Related tables</h2>
        <IconButton icon={<GotoIcon />} tooltipContent="Go to Related tables" />
      </div>
      <div className={styles.contentWrapper}>
        {/* TODO: Replace the placeholder image with the actual component */}
        <img alt="related tables" src={img} width="100%" />
      </div>
    </div>
  )
}
