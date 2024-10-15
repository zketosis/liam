import clsx from 'clsx'
import type { FC, PropsWithChildren } from 'react'
import { match } from 'ts-pattern'
import styles from './Badge.module.css'

type Props = {
  type?: 'default' | 'outline'
}

export const Badge: FC<PropsWithChildren<Props>> = ({
  type = 'default',
  children,
}) => {
  const typeClassName = match(type)
    .with('default', () => styles.default)
    .with('outline', () => styles.outline)
    .exhaustive()

  return <span className={clsx(typeClassName)}>{children}</span>
}
