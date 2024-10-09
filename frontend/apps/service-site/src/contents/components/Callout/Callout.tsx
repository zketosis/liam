import clsx from 'clsx'
import type { FC, PropsWithChildren } from 'react'
import styles from './Callout.module.css'

type Props = {
  type?: 'default' | 'danger'
}

export const Callout: FC<PropsWithChildren<Props>> = ({
  type = 'default',
  children,
}) => {
  return (
    <div
      className={clsx(styles.wrapper, {
        [styles.danger]: type === 'danger',
      })}
    >
      {children}
    </div>
  )
}
