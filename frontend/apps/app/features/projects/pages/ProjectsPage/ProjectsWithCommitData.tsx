'use server'

import type { Tables } from '@liam-hq/db/supabase/database.types'
import { fetchLastCommitData } from '../../components/ProjectItem/LastCommitData'
import { ClientProjectsView } from './ClientProjectsView'

// Extended project type with last commit date
export type ProjectWithLastCommit = Tables<'Project'> & {
  lastCommitDate?: string
  ProjectRepositoryMapping?: Array<{
    repository: Tables<'Repository'>
  }>
}

interface ProjectsWithCommitDataProps {
  projects: Tables<'Project'>[] | null
  organizationId?: number
}

export async function ProjectsWithCommitData({
  projects,
  organizationId,
}: ProjectsWithCommitDataProps) {
  if (!projects || projects.length === 0) {
    // Pass null/empty projects directly to client component
    return (
      <ClientProjectsView
        initialProjects={projects}
        organizationId={organizationId}
      />
    )
  }

  try {
    // Fetch commit data for all projects in parallel
    const projectsWithDates = await Promise.all(
      projects.map(async (project) => {
        const projectWithLastCommit = project as ProjectWithLastCommit
        const repository =
          projectWithLastCommit.ProjectRepositoryMapping?.[0]?.repository

        if (repository) {
          try {
            const commitData = await fetchLastCommitData(
              repository.installationId,
              repository.owner,
              repository.name,
            )

            if (commitData?.date) {
              return {
                ...projectWithLastCommit,
                lastCommitDate: commitData.date,
              }
            }
          } catch (error) {
            console.error(
              'Error fetching commit data for project:',
              project.id,
              error,
            )
          }
        }

        // Use project update/creation date as fallback
        return {
          ...projectWithLastCommit,
          lastCommitDate: project.updatedAt || project.createdAt,
        }
      }),
    )

    // Return client component with enhanced project data
    return (
      <ClientProjectsView
        initialProjects={projectsWithDates}
        organizationId={organizationId}
      />
    )
  } catch (error) {
    console.error('Error processing projects with commit data:', error)
    // Fallback to original projects if there's an error
    return (
      <ClientProjectsView
        initialProjects={projects}
        organizationId={organizationId}
      />
    )
  }
}
