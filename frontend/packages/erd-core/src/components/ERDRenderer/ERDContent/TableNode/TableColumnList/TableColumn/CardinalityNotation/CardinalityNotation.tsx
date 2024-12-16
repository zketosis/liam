import clsx from 'clsx'
import type { FC } from 'react'
import styles from './CardinalityNotation.module.css'

type CardinalityNotationProps = {
  direction: 'left' | 'right'
  notation: '1' | 'n'
  isHighlighted: boolean
}

export const CardinalityNotation: FC<CardinalityNotationProps> = ({
  direction,
  notation,
  isHighlighted,
}) => {
  const isLeft = direction === 'left'
  const notationClass = isLeft
    ? styles.handleCardinalityNotationLeft
    : styles.handleCardinalityNotationRight
  const highlightClass = isHighlighted
    ? styles.handleCardinalityNotationHighlighted
    : ''

  return (
    <span
      className={clsx(
        styles.handleCardinalityNotation,
        notationClass,
        highlightClass,
      )}
    >
      {notation}
    </span>
  )
}
