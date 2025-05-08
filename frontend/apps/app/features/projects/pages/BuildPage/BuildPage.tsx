'use client'

import { ERDRenderer } from '@/features'
import { ChatbotButton } from '@/features/schemas/components/Chatbot'
import type { ERDSchema } from '@/features/schemas/components/Chatbot/utils'
import { useTableGroups } from '@/hooks'
import { createClient } from '@/libs/db/server'
import { VersionProvider } from '@/providers'
import { versionSchema } from '@/schemas'
import { initSchemaStore } from '@/stores'
import { parse } from '@liam-hq/db-structure/parser'
import { getFileContent } from '@liam-hq/github'
import { type FC, useEffect, useState } from 'react'
import * as v from 'valibot'
import styles from './BuildPage.module.css'

type ErrorObject = {
  name: string
  message: string
  instruction?: string
}

type Props = {
  projectId: string
  branchOrCommit: string
}

async function getGithubSchemaFilePath(projectId: string) {
  const supabase = await createClient()
  const { data: gitHubSchemaFilePath, error } = await supabase
    .from('schema_file_paths')
    .select('*')
    .eq('project_id', projectId)
    .single()

  if (error || !gitHubSchemaFilePath) {
    throw new Error('Schema file path not found')
  }

  return gitHubSchemaFilePath
}

async function getGithubRepositoryInfo(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      project_repository_mappings(
        github_repositories(*)
      )
    `)
    .eq('id', projectId)
    .single()

  if (error || !data) {
    throw new Error('Project not found')
  }

  const repository = data.project_repository_mappings[0]?.github_repositories
  if (!repository) {
    throw new Error('Repository not found')
  }

  return repository
}

export async function BuildPage({ projectId, branchOrCommit }: Props) {
  const githubSchemaFilePath = await getGithubSchemaFilePath(projectId)
  const repository = await getGithubRepositoryInfo(projectId)
  const repositoryFullName = `${repository.owner}/${repository.name}`

  const { content } = await getFileContent(
    repositoryFullName,
    githubSchemaFilePath.path,
    branchOrCommit,
    Number(repository.github_installation_identifier),
  )

  const { value: schema, errors } =
    content !== null && githubSchemaFilePath.format !== undefined
      ? await parse(content, githubSchemaFilePath.format)
      : { value: undefined, errors: [] }

  if (!schema) {
    throw new Error('Schema could not be parsed')
  }

  return (
    <BuildPageClient schema={schema} errors={errors || []} tableGroups={{}} />
  )
}

type ClientProps = {
  schema: ERDSchema
  errors: ErrorObject[]
  tableGroups: Record<
    string,
    { name: string; tables: string[]; comment: string | null }
  >
}

const BuildPageClient: FC<ClientProps> = ({
  schema,
  errors,
  tableGroups: initialTableGroups = {},
}) => {
  const [isSchemaDataReady, setSchemaDataReady] = useState(false)
  const { tableGroups, addTableGroup } = useTableGroups(initialTableGroups)

  useEffect(() => {
    initSchemaStore(schema)
    setSchemaDataReady(true)
  }, [schema])

  const versionData = {
    version: '0.1.0',
    gitHash: process.env.NEXT_PUBLIC_GIT_HASH,
    envName: process.env.NEXT_PUBLIC_ENV_NAME,
    date: process.env.NEXT_PUBLIC_RELEASE_DATE,
    displayedOn: 'web',
  }
  const version = v.parse(versionSchema, versionData)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Build</h1>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.columns}>
          <div className={styles.chatSection}>
            {isSchemaDataReady && (
              <ChatbotButton schemaData={schema} tableGroups={tableGroups} />
            )}
          </div>

          <div className={styles.erdSection}>
            <VersionProvider version={version}>
              <ERDRenderer
                defaultSidebarOpen={false}
                defaultPanelSizes={[20, 80]}
                errorObjects={errors}
                tableGroups={tableGroups}
                onAddTableGroup={addTableGroup}
              />
            </VersionProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
