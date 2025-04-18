import { urlgen } from '@/utils/routes'
import { GithubLogo } from '@liam-hq/ui'
import Link from 'next/link'
import type { FC } from 'react'
import { ProjectIcon } from './ProjectIcon'
import styles from './ProjectItem.module.css'

interface Project {
  id: string
  name: string
  createdAt: string
}

interface ProjectItemProps {
  project: Project
}

export const ProjectItem: FC<ProjectItemProps> = ({ project }) => {
  // Format date to "MMM DD, YYYY" format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Link
      href={urlgen('projects/[projectId]', {
        projectId: `${project.id}`,
      })}
      className={styles.projectItem}
    >
      <div className={styles.projectHeader}>
        <ProjectIcon className={styles.projectIcon} />
        <h2 className={styles.projectName}>{project.name}</h2>
      </div>

      <div className={styles.projectInfo}>
        <div className={styles.repositoryBadge}>
          <GithubLogo className={styles.repositoryIcon} />
          <span className={styles.repositoryName}>
            {project.name
              ? `${project.name.toLowerCase()}`
              : 'untitled-project'}
          </span>
        </div>

        <div className={styles.commitInfo}>
          <span>User</span>
          <span>committed</span>
          <span>on {formatDate(project.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
