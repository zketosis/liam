'use client'

import { TabsList, TabsTrigger } from '@liam-hq/ui'
import type { FC } from 'react'
import { SETTINGS_TABS } from '../../constants'
import styles from './SettingsHeader.module.css'

export const SettingsHeader: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TabsList className={styles.tabsList}>
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={styles.tabsTrigger}
            >
              <Icon size={16} />
              {tab.label}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </div>
  )
}
