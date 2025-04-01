import { urlgen } from '@/utils/routes'
import { prisma } from '@liam-hq/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { FC } from 'react'
import styles from './KnowledgeSuggestionsListPage.module.css'

type Props = {
  projectId: string
}

async function getKnowledgeSuggestions(projectId: string) {
  try {
    const projectId_num = Number(projectId)

    // Directly query knowledge suggestions by projectId
    const knowledgeSuggestions = await prisma.knowledgeSuggestion.findMany({
      where: {
        projectId: projectId_num,
      },
      select: {
        id: true,
        type: true,
        title: true,
        path: true,
        approvedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return knowledgeSuggestions
  } catch (error) {
    console.error('Error fetching knowledge suggestions:', error)
    notFound()
  }
}

export const KnowledgeSuggestionsListPage: FC<Props> = async ({
  projectId,
}) => {
  const knowledgeSuggestions = await getKnowledgeSuggestions(projectId)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link
            href={urlgen('projects/[projectId]', {
              projectId,
            })}
            className={styles.backLink}
            aria-label="Back to project details"
          >
            ← Back to Project
          </Link>
          <h1 className={styles.title}>Knowledge Suggestions</h1>
        </div>
      </div>

      <div className={styles.content}>
        {knowledgeSuggestions.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No knowledge suggestions found for this project.</p>
          </div>
        ) : (
          <ul className={styles.suggestionsList}>
            {knowledgeSuggestions.map((suggestion) => (
              <li key={suggestion.id} className={styles.suggestionItem}>
                <Link
                  href={urlgen(
                    'projects/[projectId]/knowledge-suggestions/[id]',
                    {
                      projectId,
                      id: `${suggestion.id}`,
                    },
                  )}
                  className={styles.suggestionLink}
                >
                  <div className={styles.suggestionTitle}>
                    {suggestion.title}
                  </div>
                  <div className={styles.suggestionMeta}>
                    <span className={styles.metaItem}>
                      Type: {suggestion.type}
                    </span>
                    <span className={styles.metaItem}>
                      Path: {suggestion.path}
                    </span>
                    <span
                      className={
                        suggestion.approvedAt ? styles.approved : styles.pending
                      }
                    >
                      Status: {suggestion.approvedAt ? 'Approved' : 'Pending'}
                    </span>
                    <span className={styles.metaItem}>
                      Created:{' '}
                      {suggestion.createdAt.toLocaleDateString('en-US')}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
