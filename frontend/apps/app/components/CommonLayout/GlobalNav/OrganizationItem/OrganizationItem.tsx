import { DropdownMenuRoot, DropdownMenuTrigger } from '@/components'
import { Building, ChevronsUpDown } from '@/icons'
import clsx from 'clsx'
import type { FC } from 'react'
import type { Organization } from '../../services/getOrganization'
import type { OrganizationsByUserId } from '../../services/getOrganizationsByUserId'
import itemStyles from '../Item.module.css'
import { OrganizationDropdownContent } from './OrganizationDropdownContent'
import styles from './OrganizationItem.module.css'

type Props = {
  isExpanded?: boolean
  currentOrganization: Organization
  organizations: OrganizationsByUserId
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const OrganizationItem: FC<Props> = ({
  isExpanded,
  currentOrganization,
  organizations,
  open,
  onOpenChange,
}) => {
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
  }

  return (
    <DropdownMenuRoot open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger>
        <div
          className={clsx(itemStyles.item, isExpanded && itemStyles.expandItem)}
        >
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
      </DropdownMenuTrigger>
      <OrganizationDropdownContent
        currentOrganization={currentOrganization}
        organizations={organizations}
      />
    </DropdownMenuRoot>
  )
}
