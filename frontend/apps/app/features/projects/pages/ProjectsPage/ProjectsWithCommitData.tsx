'use server'

import type { Tables } from '@liam-hq/db/supabase/database.types'
import { fetchLastCommitData } from '../../components/ProjectItem/LastCommitData'
import { ClientProjectsView } from './ClientProjectsView'
import type { ProjectWithLastCommit } from '../../types'

interface ProjectsWithCommitDataProps {
  projects: Tables<'projects'>[] | null
  organizationId?: string
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
        // Create a new object with the ProjectWithLastCommit shape
        const projectWithLastCommit: ProjectWithLastCommit = {
          ...project,
          lastCommitDate: undefined,
        }

        const repository =
          projectWithLastCommit.project_repository_mappings?.[0]?.repository

        if (repository) {
          try {
            const commitData = await fetchLastCommitData(
              repository.installation_id,
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
          lastCommitDate: project.updated_at || project.created_at,
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
