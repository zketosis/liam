'use client'

import { urlgen } from '@/utils/routes'
import type { Tables } from '@liam-hq/db/supabase/database.types'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ProjectItem,
  SearchInput,
  SortDropdown,
  type SortOption,
} from '../../components'
import { fetchLastCommitData } from '../../components/ProjectItem/LastCommitData'
import { useProjectSearch } from '../../hooks/useProjectSearch'
import styles from './ProjectsPage.module.css'
import type { ProjectWithLastCommit } from '../../types'

interface ClientSearchWrapperProps {
  initialProjects: Tables<'projects'>[] | null
  organizationId?: string
}

export const ClientSearchWrapper = ({
  initialProjects,
  organizationId,
}: ClientSearchWrapperProps) => {
  const [sortOption, setSortOption] = useState<SortOption>('activity')
  const [isLoadingCommitData, setIsLoadingCommitData] = useState(false)
  const [projectsWithCommitData, setProjectsWithCommitData] = useState<
    ProjectWithLastCommit[] | null
  >(null)

  const { searchResult, searchProjects } = useProjectSearch(
    organizationId,
    initialProjects,
  )

  const { projects: unsortedProjects, loading } = searchResult

  // Fetch commit data when projects change
  useEffect(() => {
    async function fetchCommitData() {
      if (!unsortedProjects || unsortedProjects.length === 0) {
        setProjectsWithCommitData(null)
        return
      }

      setIsLoadingCommitData(true)

      try {
        // Fetch commit data for all projects in parallel
        const projectsWithDates = await Promise.all(
          unsortedProjects.map(async (project) => {
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

        setProjectsWithCommitData(projectsWithDates)
      } catch (error) {
        console.error('Error fetching commit data:', error)
        // Create ProjectWithLastCommit objects for each project
        const fallbackProjects = unsortedProjects.map((project) => ({
          ...project,
          lastCommitDate: project.updated_at || project.created_at,
        }))
        setProjectsWithCommitData(fallbackProjects)
      } finally {
        setIsLoadingCommitData(false)
      }
    }

    fetchCommitData()
  }, [unsortedProjects])

  // Sort projects based on the selected sort option
  const projects = projectsWithCommitData
    ? [...projectsWithCommitData].sort((a, b) => {
        if (sortOption === 'name') {
          return a.name.localeCompare(b.name)
        }
        // Sort by activity using actual commit dates when available
        return (
          new Date(
            b.lastCommitDate || b.updated_at || b.created_at || 0,
          ).getTime() -
          new Date(
            a.lastCommitDate || a.updated_at || a.created_at || 0,
          ).getTime()
        )
      })
    : unsortedProjects

  // Calculate if we're in a loading state
  const isLoading = loading || isLoadingCommitData

  return (
    <div className={styles.projectsContainer}>
      <div className={styles.projectsHeader}>
        <SearchInput
          onSearch={searchProjects}
          loading={isLoading}
          placeholder="Search Projects..."
        />

        <SortDropdown
          initialSortOption={sortOption}
          onSortChange={setSortOption}
        />

        <Link
          href={
            organizationId
              ? urlgen('organizations/[organizationId]/projects/new', {
                  organizationId: organizationId.toString(),
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
          {isLoadingCommitData && !projectsWithCommitData ? (
            <div className={styles.emptyState}>
              Loading project activity data...
            </div>
          ) : (
            projects.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
