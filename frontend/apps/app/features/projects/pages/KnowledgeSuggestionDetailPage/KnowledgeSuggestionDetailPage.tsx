import { processOverrideContent } from '@/features/projects/actions/processOverrideContent'
import { createClient } from '@/libs/db/server'
import { urlgen } from '@/utils/routes'
import type { DBStructure } from '@liam-hq/db-structure'
import {
  type SupportedFormat,
  detectFormat,
  parse,
} from '@liam-hq/db-structure/parser'
import { getFileContent } from '@liam-hq/github'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { FC } from 'react'
import { UserFeedbackClient } from '../../../../components/UserFeedbackClient'
import { approveKnowledgeSuggestion } from '../../actions/approveKnowledgeSuggestion'
import { getOriginalDocumentContent } from '../../utils/getOriginalDocumentContent'
import { KnowledgeContentSection } from './KnowledgeContentSection'
import styles from './KnowledgeSuggestionDetailPage.module.css'

type Props = {
  projectId: string
  suggestionId: string
  branchOrCommit: string
}

async function getGithubSchemaFilePath(projectId: string) {
  try {
    const projectId_num = Number(projectId)
    const supabase = await createClient()
    const { data: gitHubSchemaFilePath, error } = await supabase
      .from('GitHubSchemaFilePath')
      .select('*')
      .eq('projectId', projectId_num)
      .single()

    if (error || !gitHubSchemaFilePath) {
      console.error('Error fetching github schema file path:', error)
      notFound()
    }

    return gitHubSchemaFilePath
  } catch (error) {
    console.error('Error fetching github schema file path:', error)
    notFound()
  }
}

async function getKnowledgeSuggestionDetail(
  projectId: string,
  suggestionId: string,
) {
  try {
    const projectId_num = Number(projectId)
    const suggestionId_num = Number(suggestionId)
    const supabase = await createClient()

    // Get the knowledge suggestion with project info
    const { data: suggestion, error } = await supabase
      .from('KnowledgeSuggestion')
      .select(`
        *,
        project:Project(
          id,
          name,
          repositoryMappings:ProjectRepositoryMapping(
            repository:Repository(*)
          )
        )
      `)
      .eq('id', suggestionId_num)
      .eq('projectId', projectId_num)
      .single()

    if (error || !suggestion) {
      console.error('Error fetching knowledge suggestion:', error)
      notFound()
    }

    return suggestion
  } catch (error) {
    console.error('Error fetching knowledge suggestion detail:', error)
    notFound()
  }
}

export const KnowledgeSuggestionDetailPage: FC<Props> = async ({
  projectId,
  suggestionId,
  branchOrCommit,
}) => {
  const suggestion = await getKnowledgeSuggestionDetail(projectId, suggestionId)
  const repository = suggestion.project.repositoryMappings[0]?.repository

  const githubSchemaFilePath = await getGithubSchemaFilePath(projectId)
  const filePath = githubSchemaFilePath.path

  const repositoryFullName = `${repository.owner}/${repository.name}`
  const { content } = await getFileContent(
    repositoryFullName,
    filePath,
    branchOrCommit,
    Number(repository.installationId),
  )

  const format = detectFormat(filePath)
  const { value: dbStructure, errors } =
    content !== null && format !== undefined
      ? await parse(content, format as SupportedFormat)
      : { value: undefined, errors: [] }

  const { result } = dbStructure
    ? await processOverrideContent(suggestion.content, dbStructure)
    : { result: { dbStructure: undefined, tableGroups: {} } }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <Link
            href={urlgen(
              'projects/[projectId]/ref/[branchOrCommit]/knowledge-suggestions',
              {
                projectId,
                branchOrCommit: suggestion.branchName,
              },
            )}
            className={styles.backLink}
            aria-label="Back to knowledge suggestions list"
          >
            ← Back to Knowledge Suggestions
          </Link>
          <h1 className={styles.title}>{suggestion.title}</h1>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.metaSection}>
          <span className={styles.metaItem}>Type: {suggestion.type}</span>
          <span className={styles.metaItem}>Path: {suggestion.path}</span>
          <span
            className={suggestion.approvedAt ? styles.approved : styles.pending}
          >
            Status: {suggestion.approvedAt ? 'Approved' : 'Pending'}
          </span>
          <span className={styles.metaItem}>
            Created:{' '}
            {new Date(suggestion.createdAt).toLocaleString('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short',
              hour12: false,
            })}
          </span>
          {suggestion.approvedAt && (
            <span className={styles.metaItem}>
              Approved:{' '}
              {new Date(suggestion.createdAt).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
                hour12: false,
              })}
            </span>
          )}
        </div>

        {suggestion.reasoning && (
          <div className={styles.reasoningSection}>
            <div className={styles.header}>
              <h2 className={styles.sectionTitle}>Reasoning</h2>
            </div>
            <div className={styles.reasoningContent}>
              {suggestion.reasoning}
            </div>
          </div>
        )}

        <KnowledgeContentSection
          suggestionContent={suggestion.content}
          suggestionId={suggestion.id}
          originalContent={
            !suggestion.approvedAt
              ? await getOriginalDocumentContent(
                  projectId,
                  suggestion.branchName,
                  suggestion.path,
                )
              : null
          }
          isApproved={!!suggestion.approvedAt}
          dbStructure={dbStructure}
          format={format as SupportedFormat | undefined}
          content={content}
          errors={errors || []}
          tableGroups={result?.tableGroups || {}}
        />

        {!suggestion.approvedAt && repository && (
          <div className={styles.actionSection}>
            <form action={approveKnowledgeSuggestion}>
              <input type="hidden" name="suggestionId" value={suggestion.id} />
              <input
                type="hidden"
                name="repositoryOwner"
                value={repository.owner}
              />
              <input
                type="hidden"
                name="repositoryName"
                value={repository.name}
              />
              <input
                type="hidden"
                name="installationId"
                value={repository.installationId.toString()}
              />
              <button type="submit" className={styles.approveButton}>
                Approve
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
