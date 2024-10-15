import type { FC, HTMLAttributes, PropsWithChildren } from 'react'
import styles from './Code.module.css'

type Props = PropsWithChildren & HTMLAttributes<HTMLElement>

export const Code: FC<Props> = ({ children, ...props }) => {
  return (
    <code {...props} className={styles.code}>
      {children}
    </code>
  )
}
