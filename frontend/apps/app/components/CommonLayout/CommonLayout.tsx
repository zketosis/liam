import type React from 'react'
import type { ReactNode } from 'react'
import styles from './CommonLayout.module.css'
import { GlobalNav } from './GlobalNav'

type CommonLayoutProps = {
  children: ReactNode
}

export const CommonLayout: React.FC<CommonLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <GlobalNav />
      <main className={styles.content}>{children}</main>
    </div>
  )
}
