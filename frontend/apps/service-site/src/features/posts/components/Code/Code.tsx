import type { ComponentProps, FC, PropsWithChildren } from 'react'
import styles from './Code.module.css'

type Props = PropsWithChildren & ComponentProps<'code'>

export const Code: FC<Props> = ({ children, ...props }) => {
  return (
    <code {...props} className={styles.code}>
      {children}
    </code>
  )
}
