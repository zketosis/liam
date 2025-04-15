'use client'

import { Bell, ChevronRight, ChevronsUpDown, Search } from 'lucide-react'
import type {
  ChangeEvent,
  ComponentProps,
  KeyboardEvent,
  ReactNode,
} from 'react'
import { useEffect, useState } from 'react'
import { Avatar } from '../Avatar'
import { IconButton } from '../IconButton'
import styles from './AppBar.module.css'

type BreadcrumbItemProps = {
  label: string
  icon?: ReactNode | undefined
  tag?: string | undefined
  onClick?: (() => void) | undefined
  isActive?: boolean
  isProject?: boolean
}

type AppBarProps = {
  projectId?: string
  projectName?: string
  branchName?: string
  branchTag?: string
  onProjectClick?: () => void
  onBranchClick?: () => void
  onSearchChange?: (value: string) => void
  onNotificationClick?: () => void
  onAvatarClick?: () => void
  avatarInitial?: string
  avatarColor?: string
  minimal?: boolean
} & ComponentProps<'div'>

type Project = {
  id: number
  name: string
  createdAt: string
  organizationId?: number
}

async function getProject(projectId: string): Promise<Project | null> {
  try {
    const response = await fetch(`/api/projects/${projectId}`)
    if (!response.ok) {
      console.error('Failed to fetch project:', response.statusText)
      return null
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

export const AppBar = ({
  projectId,
  projectName: initialProjectName = 'Project Name',
  branchName = 'main',
  branchTag = 'production',
  onProjectClick,
  onBranchClick,
  onSearchChange,
  onNotificationClick,
  onAvatarClick,
  avatarInitial = 'L',
  avatarColor = 'var(--avatar-background)',
  minimal = false,
  ...props
}: AppBarProps) => {
  const [projectName, setProjectName] = useState(initialProjectName)

  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        const project = await getProject(projectId)
        if (project) {
          setProjectName(project.name)
        }
      }
      fetchProject()
    }
  }, [projectId])

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
            isProject={true}
          />
          <div className={styles.breadcrumbDivider}>
            <ChevronRight size={16} />
          </div>
          <BreadcrumbItem
            label={branchName}
            tag={branchTag}
            onClick={onBranchClick}
            isProject={false}
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

const BreadcrumbItem = ({
  label,
  icon,
  tag,
  onClick,
  isActive = false,
  isProject = false,
}: BreadcrumbItemProps) => {
  const textClassName = isProject
    ? `${styles.breadcrumbText} ${styles.projectText}`
    : `${styles.breadcrumbText} ${styles.branchText}`

  return (
    <button
      className={`${styles.breadcrumbItem} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      type="button"
    >
      {icon && <div className={styles.breadcrumbIcon}>{icon}</div>}
      <span className={textClassName}>{label}</span>
      {tag && <div className={styles.branchTag}>{tag}</div>}
      <ChevronsUpDown
        size={12}
        strokeWidth={1.5}
        className={styles.chevronIcon}
      />
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
