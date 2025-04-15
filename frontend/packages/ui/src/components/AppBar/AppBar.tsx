'use client'

import { Bell, ChevronRight, Search } from 'lucide-react'
import type {
  ChangeEvent,
  ComponentProps,
  KeyboardEvent,
  ReactNode,
} from 'react'
import { Avatar } from '../Avatar'
import { IconButton } from '../IconButton'
import styles from './AppBar.module.css'

type BreadcrumbItemProps = {
  label: string
  icon?: ReactNode | undefined
  tag?: string | undefined
  onClick?: (() => void) | undefined
}

type AppBarProps = {
  projectName: string
  branchName: string
  branchTag?: string
  onProjectClick?: () => void
  onBranchClick?: () => void
  onSearchChange?: (value: string) => void
  onNotificationClick?: () => void
  onAvatarClick?: () => void
  avatarInitial: string
  avatarColor?: string
  minimal?: boolean
} & ComponentProps<'div'>

export const AppBar = ({
  projectName,
  branchName,
  branchTag,
  onProjectClick,
  onBranchClick,
  onSearchChange,
  onNotificationClick,
  onAvatarClick,
  avatarInitial,
  avatarColor = 'var(--avatar-background)',
  minimal = false,
  ...props
}: AppBarProps) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchChange) {
      onSearchChange((e.target as HTMLInputElement).value)
    }
  }

  if (minimal) {
    return (
      <div className={`${styles.appBar} ${styles.minimal}`} {...props}>
        <div className={styles.rightSection}>
          <IconButton
            icon={<Bell size={16} />}
            tooltipContent="Notifications"
            onClick={onNotificationClick}
            aria-label="Notifications"
          />

          <Avatar
            initial={avatarInitial}
            size="sm"
            color={avatarColor}
            onClick={onAvatarClick}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.appBar} {...props}>
      <div className={styles.leftSection}>
        <div className={styles.breadcrumbs}>
          <BreadcrumbItem
            label={projectName}
            icon={<ProjectIcon />}
            onClick={onProjectClick}
          />
          <div className={styles.breadcrumbDivider}>
            <ChevronRight size={16} />
          </div>
          <BreadcrumbItem
            label={branchName}
            tag={branchTag}
            onClick={onBranchClick}
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchIcon}>
            <Search size={16} />
          </div>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search"
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <div className={styles.shortcutContainer}>
            <div className={styles.shortcutKey}>⌘</div>
            <div className={styles.shortcutKey}>K</div>
          </div>
        </div>

        <IconButton
          icon={<Bell size={16} />}
          tooltipContent="Notifications"
          onClick={onNotificationClick}
          aria-label="Notifications"
        />

        <Avatar
          initial={avatarInitial}
          size="sm"
          color={avatarColor}
          onClick={onAvatarClick}
        />
      </div>
    </div>
  )
}

const BreadcrumbItem = ({ label, icon, tag, onClick }: BreadcrumbItemProps) => {
  return (
    <button className={styles.breadcrumbItem} onClick={onClick} type="button">
      {icon && <div className={styles.breadcrumbIcon}>{icon}</div>}
      <span className={styles.breadcrumbText}>{label}</span>
      {tag && <div className={styles.branchTag}>{tag}</div>}
    </button>
  )
}

const ProjectIcon = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Project Icon</title>
      <rect
        x="1"
        y="1"
        width="14"
        height="14"
        rx="4"
        fill="var(--color-gray-500)"
      />
    </svg>
  )
}
