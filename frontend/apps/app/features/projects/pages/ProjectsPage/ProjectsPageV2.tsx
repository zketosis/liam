import { urlgen } from '@/utils/routes'
import { ChevronDown, Scan } from '@liam-hq/ui'
import Link from 'next/link'
import type { FC } from 'react'
import styles from './ProjectsPageV2.module.css'
import {
  getCurrentOrganization,
  getUserOrganizations,
} from './getCurrentOrganization'
import { getProjects } from './getProjects'

interface ProjectsPageV2Props {
  organizationId?: number
}

export const ProjectsPageV2: FC<ProjectsPageV2Props> = async ({
  organizationId,
}) => {
  const currentOrganization = organizationId
    ? await getCurrentOrganization(organizationId)
    : await getCurrentOrganization()
  await getUserOrganizations() // Fetch for future use
  const projects = await getProjects(currentOrganization?.id)

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
    <div className={styles.container}>
      <h1 className={styles.heading}>Projects</h1>

      <div className={styles.contentContainer}>
        <div className={styles.projectsHeader}>
          <div className={styles.searchInput}>
            <Scan className={styles.searchIcon} aria-hidden="true" />
            <input type="text" placeholder="Search Projects..." />
          </div>

          <div className={styles.sortSelect}>
            <span>Sort by activity</span>
            <ChevronDown className={styles.sortSelectIcon} aria-hidden="true" />
          </div>

          <Link
            href={
              currentOrganization
                ? urlgen('organizations/[organizationId]/projects/new', {
                    organizationId: currentOrganization.id.toString(),
                  })
                : urlgen('organizations/new')
            }
            className={styles.newProjectButton}
          >
            New Project
          </Link>
        </div>

        {projects === null || projects.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No projects found.</p>
            <p>Create a new project to get started.</p>
          </div>
        ) : (
          <div className={styles.projectsGrid}>
            {projects.map((project) => (
              <Link
                key={project.id}
                href={urlgen('projects/[projectId]', {
                  projectId: `${project.id}`,
                })}
                className={styles.projectItem}
              >
                <div className={styles.projectHeader}>
                  <div className={styles.projectIcon}>
                    <div className={styles.projectIconPlaceholder}>P</div>
                  </div>
                  <h2 className={styles.projectName}>
                    {project.name || 'Untitled Project'}
                  </h2>
                </div>

                <div className={styles.projectInfo}>
                  <div className={styles.repositoryBadge}>
                    <div className={styles.repositoryIcon}>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1ZM6.5 3C6.5 2.72386 6.27614 2.5 6 2.5C5.72386 2.5 5.5 2.72386 5.5 3V6C5.5 6.27614 5.72386 6.5 6 6.5H8C8.27614 6.5 8.5 6.27614 8.5 6C8.5 5.72386 8.27614 5.5 8 5.5H6.5V3Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
