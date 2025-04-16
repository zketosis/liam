'use client'

import type { Tables } from '@liam-hq/db/supabase/database.types'
import { AppBar } from '@liam-hq/ui'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type Project = Tables<'Project'>

type ClientAppBarProps = {
  project?: Project | null
  branchName?: string
  branchTag?: string
  avatarInitial?: string
  avatarColor?: string
}

// Client-side function to fetch project data
async function fetchProjectData(projectId: string): Promise<Project | null> {
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

export function ClientAppBar({
  project: initialProject,
  branchName = 'main', // TODO: get branch name from database
  branchTag = 'production', // TODO: get branch tag from database
  avatarInitial = 'L',
  avatarColor = 'var(--color-teal-800)',
}: ClientAppBarProps) {
  const pathname = usePathname()
  const [project, setProject] = useState<Project | null>(initialProject || null)
  const isMinimal = !pathname?.includes('/projects/')

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

  return (
    <AppBar
      project={project || undefined}
      branchName={branchName}
      branchTag={branchTag}
      avatarInitial={avatarInitial}
      avatarColor={avatarColor}
      minimal={isMinimal}
    />
  )
}
