import type { Columns as ColumnsType } from '@liam-hq/db-structure'
import {
  ChevronDown,
  ChevronUp,
  IconButton,
  Rows3 as Rows3Icon,
} from '@liam-hq/ui'
import clsx from 'clsx'
import { type FC, type MouseEvent, useState } from 'react'
import styles from './Columns.module.css'
import { ColumnsItem } from './ColumnsItem'

type Props = {
  columns: ColumnsType
}

export const Columns: FC<Props> = ({ columns }) => {
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
        data-state={isClosed ? 'closed' : 'open'}
      >
        <div className={styles.iconTitleContainer}>
          <Rows3Icon width={12} />
          <h2 className={styles.heading}>Columns</h2>
        </div>
        <IconButton
          icon={isClosed ? <ChevronDown /> : <ChevronUp />}
          tooltipContent={isClosed ? 'Open' : 'Close'}
          onClick={handleClose}
        />
      </div>
      {Object.entries(columns).map(([key, column]) => (
        <div
          className={clsx(!isClosed && styles.visible, styles.itemWrapper)}
          key={key}
        >
          <ColumnsItem column={column} />
        </div>
      ))}
    </>
  )
}
