import { urlgen } from '@/utils/routes'
import Link from 'next/link'
import type React from 'react'
import type { ReactNode } from 'react'
import styles from './CommonLayout.module.css'

type CommonLayoutProps = {
  children: ReactNode
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <img src="/path/to/logo.png" alt="Liam Schema Logo" />
          <span>Liam Schema</span>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li>
              <Link href="/" className={styles.link}>
                <span className={styles.icon}>📁</span>
                Projects
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  )
}
