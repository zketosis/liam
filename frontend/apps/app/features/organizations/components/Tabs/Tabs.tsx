'use client'

import { type FC, type ReactNode, useState } from 'react'
import styles from './Tabs.module.css'

interface TabProps {
  id: string
  label: string
  children: ReactNode
}

export const Tab: FC<TabProps> = ({ children }) => {
  return <div className={styles.tabContent}>{children}</div>
}

interface TabsProps {
  tabs: Array<TabProps>
  defaultTab?: string
}

export const Tabs: FC<TabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={`${styles.tabTrigger} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setActiveTab(tab.id)
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabsContent}>
        {tabs.find((tab) => tab.id === activeTab)?.children}
      </div>
    </div>
  )
}
