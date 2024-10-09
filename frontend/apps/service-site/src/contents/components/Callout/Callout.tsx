import { InfoIcon } from '@packages/ui'
import clsx from 'clsx'
import type { FC, PropsWithChildren } from 'react'
import { match } from 'ts-pattern'
import styles from './Callout.module.css'

type Props = {
  type?: 'default' | 'danger' | 'success' | 'info' | 'warn'
}

export const Callout: FC<PropsWithChildren<Props>> = ({
  type = 'default',
  children,
}) => {
  const typeClassName = match(type)
    .with('default', () => styles.default)
    .with('danger', () => styles.danger)
    .with('success', () => styles.success)
    .with('info', () => styles.info)
    .with('warn', () => styles.warn)
    .exhaustive()

  return (
    <div className={clsx(styles.wrapper, typeClassName)}>
      <InfoIcon />
      <div className={styles.body}>{children}</div>
    </div>
  )
}
