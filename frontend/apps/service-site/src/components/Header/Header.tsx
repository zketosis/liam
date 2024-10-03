import Link from 'next/link'
import { LiamLogo } from '../logos'
import styles from './Header.module.css'

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
