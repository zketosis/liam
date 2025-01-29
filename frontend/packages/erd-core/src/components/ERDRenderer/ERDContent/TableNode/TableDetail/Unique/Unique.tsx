import type { Columns } from '@liam-hq/db-structure'
import { ChevronDown, ChevronUp, Fingerprint, IconButton } from '@liam-hq/ui'
import clsx from 'clsx'
import { type FC, type MouseEvent, useState } from 'react'
import styles from './Unique.module.css'

type Props = {
  columns: Columns
}

export const Unique: FC<Props> = ({ columns }) => {
  const [isClosed, setIsClosed] = useState(false)
  const handleClose = (event: MouseEvent) => {
    event.stopPropagation()
    setIsClosed(!isClosed)
  }
  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsClosed(!isClosed)
    }
  }

  return (
    <>
      <div
        className={styles.header}
        // biome-ignore lint/a11y/useSemanticElements: Implemented with div button to be button in button
        role="button"
        tabIndex={0}
        onClick={handleClose}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.iconTitleContainer}>
          <Fingerprint width={12} />
          <h2 className={styles.heading}>Unique</h2>
        </div>
        <IconButton
          icon={isClosed ? <ChevronDown /> : <ChevronUp />}
          tooltipContent={isClosed ? 'Open' : 'Close'}
          onClick={handleClose}
        />
      </div>

      <div className={clsx(!isClosed && styles.visible, styles.listWrapper)}>
        <ul className={styles.list}>
          {Object.entries(columns).map(([key, column]) => {
            if (!column.unique) return null
            return (
              <li key={key} className={styles.listItem}>
                {column.name}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
