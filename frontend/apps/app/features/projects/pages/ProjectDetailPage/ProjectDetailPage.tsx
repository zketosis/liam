import { urlgen } from '@/utils/routes'
import Link from 'next/link'
import type { FC } from 'react'
import styles from './ProjectDetailPage.module.css'
import { getProject } from './getProject'

type Props = {
  projectId: string
}

// TODO: Delete this page
export const ProjectDetailPage: FC<Props> = async ({ projectId }) => {
  const project = await getProject(projectId)

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link
            href={
              project.organizationId
                ? urlgen('organizations/[organizationId]/projects', {
                    organizationId: project.organizationId.toString(),
                  })
                : '/'
            }
            className={styles.backLink}
            aria-label="Back to projects list"
          >
            ← Back to Projects
          </Link>
          <h1 className={styles.title}>{project.name || 'Untitled Project'}</h1>
        </div>
        <div className={styles.headerActions}>
          <Link
            href={urlgen('projects/[projectId]/migrations', {
              projectId,
            })}
            className={styles.actionButton}
          >
            View Migrations
          </Link>
          <Link
            href={urlgen('projects/[projectId]/docs', {
              projectId,
            })}
            className={styles.actionButton}
          >
            View Docs
          </Link>
          <Link
            href={`/app/projects/${project.id}/branches`}
            className={styles.actionButton}
          >
            View Branches
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.createdAt}>
          Created: {new Date(project.createdAt).toLocaleDateString('en-US')}
        </p>
      </div>
    </div>
  )
}
