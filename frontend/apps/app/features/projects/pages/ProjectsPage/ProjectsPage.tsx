import { urlgen } from '@/utils/routes'
import { ChevronDown, SearchIcon } from '@liam-hq/ui'
import Link from 'next/link'
import type { FC } from 'react'
import { EmptyProjectsState, ProjectItem } from '../../components'
import styles from './ProjectsPage.module.css'
import {
  getCurrentOrganization,
  getUserOrganizations,
} from './getCurrentOrganization'
import { getProjects } from './getProjects'

interface ProjectsPageProps {
  organizationId?: number
}

export const ProjectsPage: FC<ProjectsPageProps> = async ({
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
        {projects === null || projects.length === 0 ? (
          <EmptyProjectsState
            createProjectHref={
              currentOrganization
                ? urlgen('organizations/[organizationId]/projects/new', {
                    organizationId: currentOrganization.id.toString(),
                  })
                : urlgen('organizations/new')
            }
          />
        ) : (
          <div className={styles.projectsContainer}>
            <div className={styles.projectsHeader}>
              <div className={styles.searchInput}>
                <SearchIcon className={styles.searchIcon} />
                <input type="text" placeholder="Search Projects..." />
              </div>

              <div className={styles.sortSelect}>
                <span>Sort by activity</span>
                <ChevronDown
                  className={styles.sortSelectIcon}
                  aria-hidden="true"
                />
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

            <div className={styles.projectsGrid}>
              {projects.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
