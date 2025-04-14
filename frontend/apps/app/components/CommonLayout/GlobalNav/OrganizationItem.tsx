import { Building, ChevronDown, ChevronsUpDown } from '@/icons'
import clsx from 'clsx'
import type { FC } from 'react'
import itemStyles from './Item.module.css'
import styles from './OrganizationItem.module.css'

// TODO: Fetch the current organization and the list of organizations the user belongs to

type Props = {
  isExpanded?: boolean
}

export const OrganizationItem: FC<Props> = ({ isExpanded }) => {
  return (
    <div className={clsx(itemStyles.item, isExpanded && itemStyles.expandItem)}>
      <div className={itemStyles.iconContainer}>
        <Building />
      </div>
      <div
        className={clsx(
          itemStyles.labelArea,
          isExpanded && itemStyles.expandLabelArea,
        )}
      >
        <span className={itemStyles.label}>Elyro</span>
        <span className={styles.badgeContainer}>Free</span>
        <ChevronsUpDown className={styles.chevronIcon} />
      </div>
    </div>
  )
}
