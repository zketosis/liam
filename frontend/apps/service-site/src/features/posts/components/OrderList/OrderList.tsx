import type { PropsWithChildren } from 'react'
import styles from './OrderList.module.css'

export const OrderList = ({ children, ...props }: PropsWithChildren) => {
  return (
    <ol {...props} className={styles.ol}>
      {children}
    </ol>
  )
}
