import type { Indices as IndicesType } from '@liam-hq/db-structure'
import { Hash } from '@liam-hq/ui'
import clsx from 'clsx'
import type { FC } from 'react'
import { CollapsibleHeader } from '../CollapsibleHeader'
import styles from './Indices.module.css'

type Props = {
  indices: IndicesType
}

export const Indices: FC<Props> = ({ indices }) => {
  return (
    <CollapsibleHeader
      title="Indices"
      icon={<Hash width={12} />}
      isContentVisible={true}
      // NOTE: Header height for Columns section:
      // 40px (content) + 1px (border) = 41px
      stickyTopHeight={41}
    >
      {Object.keys(indices).length !== 0 && (
        <div className={clsx(styles.listWrapper)}>
          <ul className={styles.list}>
            {Object.entries(indices).map(([key, index]) => (
              <li key={key} className={styles.listItem}>
                {index.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </CollapsibleHeader>
  )
}
