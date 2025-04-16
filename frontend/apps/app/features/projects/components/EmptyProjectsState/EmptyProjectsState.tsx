import { JackInBox } from '@/illustrations'
import Link from 'next/link'
import type { FC } from 'react'
import styles from './EmptyProjectsState.module.css'

interface EmptyProjectsStateProps {
  createProjectHref?: string
}

export const EmptyProjectsState: FC<EmptyProjectsStateProps> = ({
  createProjectHref = '/organizations/new',
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* JackInBox illustration */}
        <div className={styles.illustration}>
          <JackInBox
            jackInBoxClassName={styles.jackInBox}
            cross1ClassName={styles.cross1}
            plus1ClassName={styles.plus1}
            plus2ClassName={styles.plus2}
            cross2ClassName={styles.cross2}
            largeCrossClassName={styles.largeCross}
          />
        </div>

        {/* Title */}
        <h2 className={styles.title}>No projects have been created yet</h2>

        {/* Description */}
        <p className={styles.description}>
          <span className={styles.firstLine}>There are no projects exist.</span>
          <span className={styles.secondLine}>
            Start creating a new project to begin managing your schema!
          </span>
        </p>
      </div>

      {/* Create New Project button */}
      <Link href={createProjectHref} className={styles.createButton}>
        Create New Project
      </Link>
    </div>
  )
}
