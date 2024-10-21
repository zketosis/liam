import type { PropsWithChildren } from 'react'
import styles from './Table.module.css'

export const Table = ({ children, ...props }: PropsWithChildren) => {
  return (
    <div className={styles['table-scroll']}>
      <div className={styles['table-wrapper']}>
        <table {...props} className={styles.table}>
          {children}
        </table>
      </div>
    </div>
  )
}
