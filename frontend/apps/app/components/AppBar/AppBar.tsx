import { Avatar, ChevronRight, ChevronsUpDown } from '@liam-hq/ui'
import { DropdownMenuRoot, DropdownMenuTrigger } from '@liam-hq/ui'
import type { ComponentProps, ReactNode } from 'react'
import { forwardRef, useState } from 'react'
import { ProjectIcon } from '../ProjectIcon'
import { ProjectsDropdown } from '../ProjectsDropdown'
import styles from './AppBar.module.css'

type BreadcrumbItemProps = {
  label: string
  icon?: ReactNode | undefined
  tag?: string | undefined
  onClick?: (() => void) | undefined
  isActive?: boolean
  isProject?: boolean
}

// Define a simple Project interface that matches ProjectItem from UI package
export interface Project {
  id: number
  name: string
}

export interface ProjectsList {
  projects: Project[]
  onProjectSelect: (project: Project) => void
  onAddNewProject?: () => void
}

type AppBarProps = {
  project?: Project
  branchName: string
  branchTag: string
  onProjectClick?: () => void
  onBranchClick?: () => void
  onAvatarClick?: () => void
  avatarInitial?: string
  avatarColor?: string
  minimal?: boolean
  projectsList?: ProjectsList
  onSearchChange?: (value: string) => void
} & ComponentProps<'div'>

export const AppBar = ({
  project,
  branchName = 'main',
  branchTag = 'production',
  onProjectClick,
  onBranchClick,
  onAvatarClick,
  avatarInitial = 'L',
  avatarColor = 'var(--avatar-background)',
  minimal = false,
  projectsList,
  onSearchChange,
  ...props
}: AppBarProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleProjectClick = () => {
    if (!projectsList && onProjectClick) {
      onProjectClick()
    }
  }

  if (minimal) {
    return (
      <div className={`${styles.appBar} ${styles.minimal}`} {...props}>
        <div className={styles.rightSection}>
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
          {projectsList ? (
            <DropdownMenuRoot open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <button type="button" className={styles.breadcrumbTrigger}>
                  <BreadcrumbItem
                    label={project?.name || 'Project Name'}
                    icon={<ProjectIcon color="rgba(255, 255, 255, 0.2)" />}
                    isProject={true}
                    isActive={isOpen}
                  />
                </button>
              </DropdownMenuTrigger>
              <ProjectsDropdown
                projects={projectsList.projects}
                selectedProjectId={project?.id}
                onProjectSelect={(selectedProject) => {
                  projectsList.onProjectSelect(selectedProject)
                  setIsOpen(false)
                }}
                onAddNewProject={() => {
                  if (projectsList.onAddNewProject) {
                    projectsList.onAddNewProject()
                    setIsOpen(false)
                  }
                }}
              />
            </DropdownMenuRoot>
          ) : (
            <BreadcrumbItem
              label={project?.name || 'Project Name'}
              icon={<ProjectIcon color="rgba(255, 255, 255, 0.2)" />}
              onClick={handleProjectClick}
              isProject={true}
            />
          )}
          <div className={styles.breadcrumbDivider}>
            <ChevronRight size={16} strokeWidth={1.5} />
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

const BreadcrumbItem = forwardRef<HTMLButtonElement, BreadcrumbItemProps>(
  ({ label, tag, onClick, isActive = false, isProject = false }, ref) => {
    const textClassName = isProject
      ? `${styles.breadcrumbText} ${styles.projectText}`
      : `${styles.breadcrumbText} ${styles.branchText}`

    return (
      <button
        ref={ref}
        className={`${styles.breadcrumbItem} ${isActive ? styles.active : ''}`}
        onClick={onClick}
        type="button"
      >
        {isProject && (
          <div className={styles.breadcrumbIcon}>
            <ProjectIcon
              width={16}
              height={16}
              color="rgba(255, 255, 255, 0.2)"
            />
          </div>
        )}
        <span className={textClassName}>{label}</span>
        {tag && <div className={styles.branchTag}>{tag}</div>}
        <ChevronsUpDown
          size={12}
          strokeWidth={1.5}
          className={styles.chevronIcon}
        />
      </button>
    )
  },
)

BreadcrumbItem.displayName = 'BreadcrumbItem'
