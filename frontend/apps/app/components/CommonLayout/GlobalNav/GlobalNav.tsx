'use client'

import { LiamLogoMark, LiamMigrationLogo } from '@/logos'
import { urlgen } from '@/utils/routes'
import { LayoutGrid } from '@liam-hq/ui/src/icons'
import clsx from 'clsx'
import { type FC, useState } from 'react'
import styles from './GlobalNav.module.css'
import { LinkItem, type LinkItemProps } from './LinkItem'
import { OrganizationItem } from './OrganizationItem'

const items: LinkItemProps[] = [
  {
    icon: <LayoutGrid />,
    label: 'Projects',
    href: urlgen('projects'),
  },
]

export const GlobalNav: FC = () => {
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
            {isExpanded ? (
              // TODO: Split LiamMigrationLogo into Liam Mark + Liam Migration Text to create a more natural animation
              <LiamMigrationLogo className={styles.expandLogo} />
            ) : (
              <LiamLogoMark className={styles.logo} />
            )}
          </div>
        </div>

        <div className={styles.navSection}>
          <OrganizationItem isExpanded={isExpanded} />

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
