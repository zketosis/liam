import { createClient } from '@/libs/db/server'
import { urlgen } from '@/utils/routes'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { FC } from 'react'

type Props = {
  projectId: string
  branchOrCommit: string
}

async function getKnowledgeSuggestions(
  projectId: string,
  branchOrCommit: string,
) {
  const projectId_num = Number(projectId)
  const supabase = await createClient()

  const { data: knowledgeSuggestions, error } = await supabase
    .from('KnowledgeSuggestion')
    .select(
      'id, type, title, path, approvedAt, createdAt, updatedAt, branchName',
    )
    .eq('projectId', projectId_num)
    .eq('branchName', branchOrCommit)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching knowledge suggestions:', error)
    notFound()
  }

  return knowledgeSuggestions || []
}

export const KnowledgeSuggestionsListPage: FC<Props> = async ({
  projectId,
  branchOrCommit,
}) => {
  const knowledgeSuggestions = await getKnowledgeSuggestions(
    projectId,
    branchOrCommit,
  )

  return (
    <div>
      <div>
        <div>
          <Link
            href={urlgen('projects/[projectId]/ref/[branchOrCommit]', {
              projectId,
              branchOrCommit,
            })}
            aria-label="Back to branch details"
          >
            ← Back to Branch Details
          </Link>
          <h1>Knowledge Suggestions for {branchOrCommit}</h1>
        </div>
      </div>

      <div>
        {knowledgeSuggestions.length === 0 ? (
          <div>
            <p>No knowledge suggestions found for this branch.</p>
          </div>
        ) : (
          <ul>
            {knowledgeSuggestions.map((suggestion) => (
              <li key={suggestion.id}>
                <Link
                  href={urlgen(
                    'projects/[projectId]/ref/[branchOrCommit]/knowledge-suggestions/[id]',
                    {
                      projectId,
                      branchOrCommit,
                      id: `${suggestion.id}`,
                    },
                  )}
                >
                  <div>{suggestion.title}</div>
                  <div>
                    <span>Type: {suggestion.type}</span>
                    <span>Path: {suggestion.path}</span>
                    <span>
                      Status: {suggestion.approvedAt ? 'Approved' : 'Pending'}
                    </span>
                    <span>
                      Created:{' '}
                      {new Date(suggestion.createdAt).toLocaleDateString(
                        'en-US',
                      )}
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
