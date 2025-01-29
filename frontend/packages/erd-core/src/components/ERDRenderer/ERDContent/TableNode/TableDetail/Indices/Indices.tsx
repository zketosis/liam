import type { Indices as IndicesType } from '@liam-hq/db-structure'
import { ChevronDown, ChevronUp, Hash, IconButton } from '@liam-hq/ui'
import clsx from 'clsx'
import { type FC, type MouseEvent, useState } from 'react'
import styles from './Indices.module.css'

type Props = {
  indices: IndicesType
}

export const Indices: FC<Props> = ({ indices }) => {
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
          <Hash width={12} />
          <h2 className={styles.heading}>Indexes</h2>
        </div>
        <IconButton
          icon={isClosed ? <ChevronDown /> : <ChevronUp />}
          tooltipContent={isClosed ? 'Open' : 'Close'}
          onClick={handleClose}
        />
      </div>
      {Object.keys(indices).length !== 0 && (
        <div className={clsx(!isClosed && styles.visible, styles.listWrapper)}>
          <ul className={styles.list}>
            {Object.entries(indices).map(([key, index]) => (
              <li key={key} className={styles.listItem}>
                {index.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
