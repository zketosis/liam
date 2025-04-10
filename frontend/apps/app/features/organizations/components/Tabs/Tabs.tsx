'use client'

import React, { type FC, useState, type ReactNode } from 'react'
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

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleTabChange(tabId)
    }
  }

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList} role="tablist" aria-orientation="horizontal">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`${styles.tabTrigger} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabsContent}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            tabIndex={0}
          >
            {activeTab === tab.id && tab.children}
          </div>
        ))}
      </div>
    </div>
  )
}
