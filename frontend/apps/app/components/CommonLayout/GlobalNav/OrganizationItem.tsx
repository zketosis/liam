import { Building, ChevronsUpDown } from '@/icons'
import clsx from 'clsx'
import type { FC } from 'react'
import type { Organization } from '../services/getOrganization'
import itemStyles from './Item.module.css'
import styles from './OrganizationItem.module.css'

type Props = {
  isExpanded?: boolean
  currentOrganization: Organization
}

export const OrganizationItem: FC<Props> = ({
  isExpanded,
  currentOrganization,
}) => {
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
        <span className={itemStyles.label}>{currentOrganization.name}</span>
        {/* <span className={styles.badgeContainer}>Free</span> */}
        <ChevronsUpDown className={styles.chevronIcon} />
      </div>
    </div>
  )
}
