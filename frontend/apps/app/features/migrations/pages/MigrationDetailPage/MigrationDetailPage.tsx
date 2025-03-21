import { prisma } from '@liam-hq/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { FC } from 'react'
import styles from './MigrationDetailPage.module.css'

type Props = {
  projectId: string
  migrationId: string
  erdLinks: Array<{
    path: string
    filename: string
  }>
}

async function getMigrationContents(migrationId: string) {
  const migration = await prisma.migration.findUnique({
    where: {
      id: Number(migrationId),
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      pullRequest: {
        select: {
          id: true,
          pullNumber: true,
        },
      },
    },
  })

  if (!migration) {
    return notFound()
  }

  const pullRequest = migration.pullRequest

  const overallReview = await prisma.overallReview.findFirst({
    where: {
      pullRequestId: pullRequest.id,
    },
  })

  if (!overallReview) {
    return notFound()
  }

  return {
    migration,
    overallReview,
  }
}

export const MigrationDetailPage: FC<Props> = async ({ 
  migrationId,
  erdLinks, }) => {
  const { migration, overallReview } = await getMigrationContents(migrationId)

  const projectId = overallReview.projectId

  const formattedReviewDate = overallReview.reviewedAt
    ? overallReview.reviewedAt.toLocaleDateString('en-US')
    : 'Not available'

  return (
    <main className={styles.wrapper}>
      <Link
        href={`/app/projects/${projectId}`}
        className={styles.backLink}
        aria-label="Back to project detail"
      >
        ← Back to Project Detail
      </Link>

      <div className={styles.heading}>
        <h1 className={styles.title}>{migration.title}</h1>
        <p className={styles.subTitle}>#{migration.pullRequest.pullNumber}</p>
      </div>
      <div className={styles.twoColumns}>
        <div className={styles.box}>
          <h2 className={styles.h2}>Migration Health</h2>
          <div className={styles.erdLinks}>
            {erdLinks.map(({ path, filename }) => (
              <Link
                key={path}
                href={path}
                className={styles.erdLink}
                aria-label={`View ERD diagram for ${filename}`}
              >
                View ERD Diagram: {filename} →
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.box}>
          <h2 className={styles.h2}>Summary</h2>
        </div>
        <div className={styles.box}>
          <h2 className={styles.h2}>Review Content</h2>
          <pre className={styles.reviewContent}>
            {overallReview.reviewComment}
          </pre>
        </div>
      </div>

      <div className={styles.metadataSection}>
        <p className={styles.metadata}>Review Date: {formattedReviewDate}</p>
      </div>
    </main>
  )
}
