import clsx from 'clsx'
import type { FC, PropsWithChildren } from 'react'
import { match } from 'ts-pattern'
import styles from './Heading.module.css'

type Props = PropsWithChildren & {
  as: 'h2' | 'h3' | 'h4' | 'h5'
}

export const Heading: FC<Props> = ({ as, children }) => {
  const Tag = as

  const asClassName = match(as)
    .with('h2', () => styles.h2)
    .with('h3', () => styles.h3)
    .with('h4', () => styles.h4)
    .with('h5', () => styles.h5)
    .exhaustive()

  return <Tag className={clsx(styles.heading, asClassName)}>{children}</Tag>
}
