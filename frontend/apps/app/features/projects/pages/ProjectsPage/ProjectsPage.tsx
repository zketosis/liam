import { urlgen } from '@/utils/routes'
import { EmptyProjectsState } from '../../components/EmptyProjectsState'
import styles from './ProjectsPage.module.css'
import { ProjectsWithCommitData } from './ProjectsWithCommitData'
import {
  getCurrentOrganization,
  getUserOrganizations,
} from './getCurrentOrganization'
import { getProjects } from './getProjects'

export const runtime = 'edge'

export async function ProjectsPage({
  organizationId,
}: {
  organizationId?: string
}) {
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
                    organizationId: currentOrganization.id,
                  })
                : urlgen('organizations/new')
            }
          />
        ) : (
          <ProjectsWithCommitData
            projects={projects}
            organizationId={organizationId}
          />
        )}
      </div>
    </div>
  )
}
