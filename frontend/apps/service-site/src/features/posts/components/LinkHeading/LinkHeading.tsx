import Link from 'next/link'
import type { PropsWithChildren } from 'react'
import styles from './LinkHeading.module.css'

type Props = PropsWithChildren<{
  href?: string | undefined
}>

export const LinkHeading = ({ children, href }: Props) => {
  if (href) {
    return (
      <h2 className={styles.heading}>
        <Link href={href}>{children}</Link>
      </h2>
    )
  }
  return <h2 className={styles.heading}>{children}</h2>
}
