'use client'

import { urlgen } from '@/utils/routes'
import type { Tables } from '@liam-hq/db/supabase/database.types'
import { GithubLogo, ProjectIcon } from '@liam-hq/ui'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { getLastCommitData } from './LastCommitInfo'
import { LastCommitInfoClient } from './LastCommitInfoClient'
import { getOrganizationData } from './OrganizationIcon'
import { OrganizationIconClient } from './OrganizationIconClient'
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
  // State for organization avatar and commit info
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [commitInfo, setCommitInfo] = useState<{
    author: string
    date: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  // Fetch organization and commit data
  useEffect(() => {
    if (repository) {
      const fetchData = async () => {
        setIsLoading(true)

        try {
          // Fetch organization data
          const orgData = await getOrganizationData({
            installationId: repository.installationId,
            owner: repository.owner,
            repo: repository.name,
          })
          setAvatarUrl(orgData)

          // Fetch commit data
          const commitData = await getLastCommitData({
            installationId: repository.installationId,
            owner: repository.owner,
            repo: repository.name,
          })
          setCommitInfo(commitData)
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchData()
    }
  }, [repository])

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
              isLoading ? (
                <ProjectIcon className={styles.icon} />
              ) : (
                <OrganizationIconClient
                  avatarUrl={avatarUrl || undefined}
                  owner={repository.owner}
                />
              )
            ) : (
              <ProjectIcon className={styles.icon} />
            )}
          </div>
        </div>
        <h2 className={styles.projectName}>
          {project.name || 'Untitled Project'}
        </h2>
      </div>

      <div className={styles.projectInfo}>
        <div className={styles.repositoryBadge}>
          <div className={styles.repositoryIcon}>
            <GithubLogo className={styles.icon} opacity={0.5} />
          </div>
          <span className={styles.repositoryName}>
            {repository
              ? `${repository.owner}/${repository.name}`
              : repositoryName}
          </span>
        </div>

        <div className={styles.commitInfo}>
          {repository ? (
            isLoading ? (
              <>
                <span>Loading</span>
                <span>commit</span>
                <span>info...</span>
              </>
            ) : (
              <LastCommitInfoClient
                author={commitInfo?.author}
                date={commitInfo?.date || project.createdAt}
              />
            )
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
