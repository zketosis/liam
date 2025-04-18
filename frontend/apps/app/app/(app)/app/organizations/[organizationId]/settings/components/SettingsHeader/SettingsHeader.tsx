'use client'

import { TabsList, TabsTrigger } from '@liam-hq/ui'
import type { FC } from 'react'
import { SETTINGS_TABS } from '../../constants'
import styles from './SettingsHeader.module.css'

export const SettingsHeader: FC = () => {
  return (
    <div className={styles.wrapper}>
      <TabsList className={styles.tabsList}>
        {SETTINGS_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={styles.tabsTrigger}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  )
}
