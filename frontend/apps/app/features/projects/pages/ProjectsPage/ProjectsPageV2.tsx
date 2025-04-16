import { urlgen } from '@/utils/routes'
import { ChevronDown } from '@liam-hq/ui'
import Link from 'next/link'
import type { FC } from 'react'
import { ProjectItem } from '../../components'
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

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <h1 className={styles.heading}>Projects</h1>
        <div className={styles.projectsHeader}>
          <div className={styles.searchInput}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 14L11.1 11.1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
