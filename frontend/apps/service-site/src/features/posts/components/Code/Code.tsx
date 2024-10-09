import type { FC, PropsWithChildren } from 'react'
import styles from './Code.module.css'

type Props = PropsWithChildren

export const Code: FC<Props> = ({ children }) => {
  return <code className={styles.code}>{children}</code>
}
