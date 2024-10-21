import type { PropsWithChildren } from 'react'
import styles from './LinkText.module.css'

type Props = PropsWithChildren & {
  href: string
}

export const LinkText = ({ children, href }: Props) => {
  return (
    <a
      href={href}
      target="_blank"
      className={styles.link}
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}
