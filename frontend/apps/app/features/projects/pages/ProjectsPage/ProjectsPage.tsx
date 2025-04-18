import { urlgen } from '@/utils/routes'
import type { FC } from 'react'
import { EmptyProjectsState } from '../../components'
import { ClientSearchWrapper } from './ClientSearchWrapper'
import styles from './ProjectsPage.module.css'
import {
  getCurrentOrganization,
  getUserOrganizations,
} from './getCurrentOrganization'
import { getProjects } from './getProjects'

interface ProjectsPageProps {
  organizationId?: string
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
          <ClientSearchWrapper
            initialProjects={projects}
            organizationId={currentOrganization?.id}
          />
        )}
      </div>
    </div>
  )
}
