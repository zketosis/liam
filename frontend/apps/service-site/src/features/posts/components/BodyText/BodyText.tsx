import type { PropsWithChildren } from 'react'
import styles from './BodyText.module.css'

export const BodyText = ({ children, ...props }: PropsWithChildren) => {
  return (
    <p {...props} className={styles.p}>
      {children}
    </p>
  )
}
