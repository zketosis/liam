'use client'

import { LiamLogoMark, LiamMigrationLogo } from '@/logos'
import { urlgen } from '@/utils/routes'
import { LayoutGrid } from '@liam-hq/ui/src/icons'
import clsx from 'clsx'
import { type ComponentProps, type FC, useState } from 'react'
import styles from './GlobalNav.module.css'
import itemStyles from './Item.module.css'
import { LinkItem, type LinkItemProps } from './LinkItem'
import { OrganizationItem } from './OrganizationItem'

const items: LinkItemProps[] = [
  {
    icon: <LayoutGrid />,
    label: 'Projects',
    href: urlgen('projects'),
  },
]

type Props = {
  currentOrganization: ComponentProps<
    typeof OrganizationItem
  >['currentOrganization']
}

export const GlobalNav: FC<Props> = ({ currentOrganization }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleNavMouseEnter = () => {
    setIsExpanded(true)
  }

  const handleNavMouseLeave = () => {
    setIsExpanded(false)
  }

  return (
    <div className={styles.globalNavContainer}>
      <nav
        className={clsx(
          styles.globalNav,
          isExpanded && styles.globalNavExpanded,
        )}
        onMouseEnter={handleNavMouseEnter}
        onMouseLeave={handleNavMouseLeave}
      >
        <div className={styles.logoContainer}>
          <div className={styles.logoSection}>
            <div className={itemStyles.iconContainer}>
              <LiamLogoMark />
            </div>
            <div
              className={clsx(
                itemStyles.labelArea,
                isExpanded && itemStyles.expandLabelArea,
              )}
            >
              <LiamMigrationLogo className={styles.liamMigrationLogo} />
            </div>
          </div>
        </div>

        <div className={styles.navSection}>
          <OrganizationItem
            isExpanded={isExpanded}
            currentOrganization={currentOrganization}
          />

          {items.map((item) => (
            <LinkItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isExpanded={isExpanded}
            />
          ))}
        </div>
      </nav>
    </div>
  )
}
