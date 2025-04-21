import { urlgen } from '@/utils/routes/urlgen'
import { TabsList, TabsTrigger } from '@liam-hq/ui'
import Link from 'next/link'
import type { FC } from 'react'
import { SETTINGS_TABS } from '../../constants'
import styles from './SettingsHeader.module.css'

interface SettingsHeaderProps {
  organizationId: string
}

export const SettingsHeader: FC<SettingsHeaderProps> = ({ organizationId }) => {
  return (
    <div className={styles.wrapper}>
      <TabsList className={styles.tabsList}>
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon
          const href = urlgen(
            `organizations/[organizationId]/settings/${tab.value}`,
            { organizationId },
          )

          return (
            <Link href={href} key={tab.value}>
              <TabsTrigger value={tab.value} className={styles.tabsTrigger}>
                <Icon size={16} />
                {tab.label}
              </TabsTrigger>
            </Link>
          )
        })}
      </TabsList>
    </div>
  )
}
