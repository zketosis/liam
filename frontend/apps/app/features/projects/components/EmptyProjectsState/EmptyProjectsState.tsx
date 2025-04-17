import Link from 'next/link'
import type { FC } from 'react'
import styles from './EmptyProjectsState.module.css'
import { JackInBox } from './JackInBox'

interface EmptyProjectsStateProps {
  createProjectHref?: string
}

export const EmptyProjectsState: FC<EmptyProjectsStateProps> = ({
  createProjectHref = '/organizations/new',
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <JackInBox className={styles.illustration} />
        <h2 className={styles.title}>No projects have been created yet</h2>
        <p className={styles.description}>
          <span>There are no projects exist.</span>
          <br />
          <span>
            Start creating a new project to begin managing your schema!
          </span>
        </p>
      </div>

      <Link href={createProjectHref} className={styles.createButton}>
        Add New Project
      </Link>
    </div>
  )
}
