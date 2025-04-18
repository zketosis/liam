'use client'

import { urlgen } from '@/utils/routes'
import type { Tables } from '@liam-hq/db/supabase/database.types'
import Link from 'next/link'
import { useState } from 'react'
import {
  ProjectItem,
  SearchInput,
  SortDropdown,
  type SortOption,
} from '../../components'
import { useProjectSearch } from '../../hooks/useProjectSearch'
import styles from './ProjectsPage.module.css'
import type { ProjectWithLastCommit } from './ProjectsWithCommitData'

interface ClientProjectsViewProps {
  initialProjects: (Tables<'projects'> | ProjectWithLastCommit)[] | null
  organizationId?: string
}

export function ClientProjectsView({
  initialProjects,
  organizationId,
}: ClientProjectsViewProps) {
  const [sortOption, setSortOption] = useState<SortOption>('activity')
  const { searchResult, searchProjects } = useProjectSearch(
    organizationId,
    initialProjects,
  )

  const { projects: unsortedProjects, loading } = searchResult

  // Sort projects based on the selected sort option
  const projects = unsortedProjects
    ? [...unsortedProjects].sort((a, b) => {
        if (sortOption === 'name') {
          return a.name.localeCompare(b.name)
        }

        // Use lastCommitDate if available (from server pre-processing)
        const projectA = a as ProjectWithLastCommit
        const projectB = b as ProjectWithLastCommit

        return (
          new Date(
            projectB.lastCommitDate ||
              projectB.updated_at ||
              projectB.created_at ||
              0,
          ).getTime() -
          new Date(
            projectA.lastCommitDate ||
              projectA.updated_at ||
              projectA.created_at ||
              0,
          ).getTime()
        )
      })
    : unsortedProjects

  return (
    <div className={styles.projectsContainer}>
      <div className={styles.projectsHeader}>
        <SearchInput
          onSearch={searchProjects}
          loading={loading}
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
          {projects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
