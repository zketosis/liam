import { urlgen } from '@/utils/routes'
import type { Tables } from '@liam-hq/db/supabase/database.types'
import { GithubLogo } from '@liam-hq/ui'
import Link from 'next/link'
import type { FC } from 'react'
import { LastCommitInfo } from './LastCommitInfo'
import { OrganizationIcon } from './OrganizationIcon'
import { ProjectIcon } from './ProjectIcon'
import styles from './ProjectItem.module.css'

type ProjectWithRepositories = Tables<'Project'> & {
  ProjectRepositoryMapping?: Array<{
    repository: Tables<'Repository'>
  }>
}

interface ProjectItemProps {
  project: ProjectWithRepositories
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

  const repositoryName = project.name?.toLowerCase() || 'untitled-project'
  const repository = project.ProjectRepositoryMapping?.[0]?.repository

  return (
    <Link
      href={urlgen('projects/[projectId]', {
        projectId: `${project.id}`,
      })}
      className={styles.projectItem}
    >
      <div className={styles.projectHeader}>
        <div className={styles.projectIcon}>
          <div className={styles.projectIconPlaceholder}>
            {repository ? (
              <OrganizationIcon
                installationId={repository.installationId}
                owner={repository.owner}
                repo={repository.name}
              />
            ) : (
              <ProjectIcon className={styles.projectIcon} />
            )}
          </div>
        </div>
        <h2 className={styles.projectName}>{project.name}</h2>
      </div>

      <div className={styles.projectInfo}>
        <div className={styles.repositoryBadge}>
          <GithubLogo className={styles.repositoryIcon} />
          <span className={styles.repositoryName}>
            {repository
              ? `${repository.owner}/${repository.name}`
              : repositoryName}
          </span>
        </div>

        <div className={styles.commitInfo}>
          {repository ? (
            <LastCommitInfo
              installationId={repository.installationId}
              owner={repository.owner}
              repo={repository.name}
              defaultDate={project.createdAt}
            />
          ) : (
            <>
              <span>User</span>
              <span>committed</span>
              <span>on {formatDate(project.createdAt)}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
