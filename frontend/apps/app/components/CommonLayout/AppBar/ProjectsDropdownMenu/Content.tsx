'use client'

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@/components'
import { Plus } from '@/icons'
import { type FC, useCallback } from 'react'
import styles from './ProjectsDropdownMenu.module.css'
import type { Project } from './services/getProject'
import type { Projects } from './services/getProjects'

type Props = {
  currentProject: Project
  projects: Projects
}

export const Content: FC<Props> = ({ currentProject, projects }) => {
  const handleClick = useCallback(() => {
    // TODO: Navigate to /projects/new after organizing page paths
  }, [])

  return (
    <DropdownMenuPortal>
      <DropdownMenuContent
        align="start"
        sideOffset={5}
        className={styles.content}
      >
        <DropdownMenuRadioGroup value={currentProject.id}>
          {projects
            .sort((a, b) => {
              // If a is selected, it comes first
              if (a.id === currentProject.id) return -1
              // If b is selected, it comes first
              if (b.id === currentProject.id) return 1
              // Otherwise, maintain original order
              return 0
            })
            .map(({ id, name }) => (
              <DropdownMenuRadioItem key={id} value={id} label={name} />
            ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem leftIcon={<Plus />} onClick={handleClick}>
          Add New Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  )
}
