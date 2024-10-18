import type { PropsWithChildren } from 'react'
import styles from './LinkText.module.css'

type Props = PropsWithChildren & {
  href: string
}

export const LinkText = ({ children, ...props }: Props) => {
  return (
    <a {...props} className={styles.link} href={props.href}>
      {children}
    </a>
  )
}
