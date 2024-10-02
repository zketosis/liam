import Link from 'next/link'
import styles from './Header.module.css'
import { LiamLogo } from './logos'

export const Header = () => {
  return (
    <header className={styles.header}>
      <Link href="/">
        <h1 className={styles.h1}>
          <LiamLogo />
        </h1>
      </Link>
    </header>
  )
}
