'use client'

import { Button } from '@liam-hq/ui'

import type { FC } from 'react'

import { useRouter } from 'next/navigation'
import { addProject } from '../../actions'
import styles from './NewProjectPage.module.css'

export const Form: FC = () => {
  const router = useRouter()

  return (
    <form
      action={async (formData) => {
        const project = await addProject(formData)
        router.push(`/app/projects/${project.id}`)
      }}
      className={styles.form}
    >
      <label htmlFor="projectName" className={styles.label}>
        Project Name
      </label>
      <input
        id="projectName"
        name="projectName"
        type="text"
        className={styles.input}
        placeholder="Enter project name"
        required
        aria-label="Enter new project name"
      />
      <Button type="submit" size="lg">
        Add New Project
      </Button>
    </form>
  )
}
