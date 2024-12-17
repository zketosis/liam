import type { Cardinality as CardinalityType } from '@liam-hq/db-structure'
import {
  CardinalityZeroOrManyLeftIcon,
  CardinalityZeroOrOneLeftIcon,
  CardinalityZeroOrOneRightIcon,
} from '@liam-hq/ui'
import clsx from 'clsx'
import type { FC } from 'react'
import styles from './Cardinality.module.css'

type CardinalityProps = {
  direction: 'left' | 'right'
  cardinality: CardinalityType
  isHighlighted: boolean
}

export const Cardinality: FC<CardinalityProps> = ({
  direction,
  cardinality,
  isHighlighted,
}) => {
  const isLeft = direction === 'left'
  const iconClass = isLeft
    ? styles.handleCardinalityLeft
    : styles.handleCardinalityRight
  const highlightClass = isHighlighted
    ? styles.handleCardinalityHighlighted
    : ''

  const Icon =
    cardinality === 'ONE_TO_ONE'
      ? isLeft
        ? CardinalityZeroOrOneLeftIcon
        : CardinalityZeroOrOneRightIcon
      : CardinalityZeroOrManyLeftIcon

  return (
    <Icon
      className={clsx(styles.handleCardinality, iconClass, highlightClass)}
    />
  )
}
