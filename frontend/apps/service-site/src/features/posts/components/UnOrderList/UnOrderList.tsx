import type { PropsWithChildren } from 'react'
import styles from './UnOrderList.module.css'

export const UnOrderList = ({ children, ...props }: PropsWithChildren) => {
  return (
    <ul {...props} className={styles.ul}>
      {children}
    </ul>
  )
}
