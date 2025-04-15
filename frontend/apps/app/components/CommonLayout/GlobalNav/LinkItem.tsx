'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type FC, type ReactNode, useMemo } from 'react'
import itemStyles from './Item.module.css'
import styles from './LinkItem.module.css'

export type LinkItemProps = {
  icon: ReactNode
  label: string
  href: string
  isExpanded?: boolean
}

export const LinkItem: FC<LinkItemProps> = ({
  icon,
  label,
  href,
  isExpanded = false,
}) => {
  const pathname = usePathname()

  const isActive = useMemo(() => pathname === href, [pathname, href])

  return (
    <Link
      href={href}
      className={clsx(
        itemStyles.item,
        isActive && styles.active,
        isExpanded && itemStyles.expandItem,
      )}
    >
      <div
        className={clsx(
          itemStyles.iconContainer,
          isActive && styles.activeIcon,
        )}
      >
        {icon}
      </div>
      <div
        className={clsx(
          itemStyles.labelArea,
          isExpanded && itemStyles.expandLabelArea,
        )}
      >
        <span className={itemStyles.label}>{label}</span>
      </div>
    </Link>
  )
}
