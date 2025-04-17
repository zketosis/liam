'use client'

import type { Tables } from '@liam-hq/db/supabase/database.types'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { AppBar, type Project } from '../AppBar/AppBar'

// Database Project type
type DBProject = Tables<'Project'>

type ClientAppBarProps = {
  project?: DBProject | null
  branchName?: string
  branchTag?: string
  avatarInitial?: string
  avatarColor?: string
}

// Client-side function to fetch project data
async function fetchProjectData(projectId: string): Promise<DBProject | null> {
  try {
    const response = await fetch(`/api/projects/${projectId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch project data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching project data:', error)
    return null
  }
}

// Client-side function to fetch all projects
async function fetchProjects(): Promise<DBProject[]> {
  try {
    const response = await fetch('/api/projects')
    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

// Convert database Project to UI Project
function toUIProject(project: DBProject): Project {
  return {
    id: project.id,
    name: project.name,
  }
}

export function ClientAppBar({
  project: initialProject,
  branchName = 'main', // TODO: get branch name from database
  branchTag = 'production', // TODO: get branch tag from database
  avatarInitial = 'L',
  avatarColor = 'var(--color-teal-800)',
}: ClientAppBarProps) {
  const pathname = usePathname()
  const [project, setProject] = useState<DBProject | null>(
    initialProject || null,
  )
  const [projects, setProjects] = useState<DBProject[]>([])
  // Make AppBar minimal when not in a project page OR when on the new project page within an organization
  const isMinimal =
    !pathname?.includes('/projects/') ||
    Boolean(pathname?.match(/\/projects\/new/))

  useEffect(() => {
    // If we already have a project from props, don't fetch again
    if (initialProject) return

    // Try to extract projectId from URL
    const projectsPattern = /\/app\/projects\/(\d+)(?:\/|$)/
    const match = pathname?.match(projectsPattern)

    if (match?.[1]) {
      const projectId = match[1]

      // Fetch project data
      fetchProjectData(projectId).then((data) => {
        if (data) {
          setProject(data)
        }
      })
    }
  }, [pathname, initialProject])

  // Fetch all projects for the dropdown
  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data)
    })
  }, [])

  const handleProjectSelect = useCallback(
    (selectedProject: Project) => {
      // Find the selected project in the projects list and set it as the current project
      // without navigating to a new page
      const dbProject = projects.find((p) => p.id === selectedProject.id)
      if (dbProject) {
        setProject(dbProject)
      }
    },
    [projects],
  )

  const handleAddNewProject = useCallback(() => {
    // This function is intentionally empty as project navigation is disabled
  }, [])

  // Create dummy projects with different names when there are no real projects
  const createDummyProjects = (): Project[] => {
    const dummyNames = [
      'Sample Project 1',
      'E-commerce App',
      'Portfolio Website',
      'Mobile Game',
      'Analytics Dashboard',
      'Social Media Platform',
      'Booking System',
      'Inventory Management',
      'CRM Application',
      'Learning Management System',
    ]

    return dummyNames.map((name, index) => ({
      id: -index - 1,
      name,
    }))
  }

  // Create a projectsList object that matches the expected type
  // When there are no projects, provide dummy content instead of undefined
  const projectsListProp = {
    projects:
      projects.length > 0 ? projects.map(toUIProject) : createDummyProjects(),
    onProjectSelect: (selectedProject: Project) => {
      // Only update the current project if it's a real project (id > 0, not a dummy project)
      if (selectedProject.id > 0) {
        handleProjectSelect(selectedProject)
      }
    },
    onAddNewProject: handleAddNewProject,
  }

  return (
    <AppBar
      project={project ? toUIProject(project) : undefined}
      branchName={branchName}
      branchTag={branchTag}
      avatarInitial={avatarInitial}
      avatarColor={avatarColor}
      minimal={isMinimal}
      projectsList={projectsListProp}
    />
  )
}
