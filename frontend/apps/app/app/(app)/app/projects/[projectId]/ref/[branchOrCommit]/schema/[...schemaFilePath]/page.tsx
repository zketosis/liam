import path from 'node:path'
import type { PageProps } from '@/app/types'
import { createClient } from '@/libs/db/server'
import { branchOrCommitSchema } from '@/utils/routes'
import {
  type DBStructure,
  applyOverrides,
  dbOverrideSchema,
} from '@liam-hq/db-structure'
import { parse, setPrismWasmUrl } from '@liam-hq/db-structure/parser'
import { getFileContent } from '@liam-hq/github'
import * as Sentry from '@sentry/nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import * as v from 'valibot'
import { parse as parseYaml } from 'yaml'
import { SCHEMA_OVERRIDE_FILE_PATH } from './constants'
import ERDViewer from './erdViewer'

const processOverrideFile = async (
  repositoryFullName: string,
  branchOrCommit: string,
  installationId: number,
  dbStructure: DBStructure,
) => {
  const { content: overrideContent } = await getFileContent(
    repositoryFullName,
    SCHEMA_OVERRIDE_FILE_PATH,
    branchOrCommit,
    installationId,
  )

  if (overrideContent === null) {
    return {
      result: { dbStructure, tableGroups: {} },
      error: null,
    }
  }

  const parsedOverrideContent = v.safeParse(
    dbOverrideSchema,
    parseYaml(overrideContent),
  )

  if (!parsedOverrideContent.success) {
    return {
      result: null,
      error: {
        name: 'ValidationError',
        message: 'Failed to validate schema override file.',
        instruction:
          'Please ensure the override file is in the correct format.',
      },
    }
  }

  return {
    result: applyOverrides(dbStructure, parsedOverrideContent.output),
    error: null,
  }
}

const paramsSchema = v.object({
  projectId: v.string(),
  branchOrCommit: branchOrCommitSchema,
  schemaFilePath: v.array(v.string()),
})

export default async function Page({ params }: PageProps) {
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) throw notFound()

  const { projectId, branchOrCommit, schemaFilePath } = parsedParams.output
  const filePath = schemaFilePath.join('/')

  const blankDbStructure = { tables: {}, relationships: {}, tableGroups: {} }

  try {
    const supabase = await createClient()
    const { data: project } = await supabase
      .from('Project')
      .select(`
        *,
        ProjectRepositoryMapping:ProjectRepositoryMapping(
          *,
          Repository:Repository(
            name, owner, installationId
          )
        )
      `)
      .eq('id', Number(projectId))
      .single()

    const { data: gitHubSchemaFilePath } = await supabase
      .from('GitHubSchemaFilePath')
      .select('path, format')
      .eq('projectId', Number(projectId))
      .eq('path', filePath)
      .single()

    const repository = project?.ProjectRepositoryMapping[0].Repository
    if (!repository?.installationId || !repository.owner || !repository.name) {
      throw new Error('Repository information not found')
    }

    const repositoryFullName = `${repository.owner}/${repository.name}`

    const { content } = await getFileContent(
      repositoryFullName,
      filePath,
      branchOrCommit,
      Number(repository.installationId),
    )

    if (!content) {
      return (
        <ERDViewer
          dbStructure={blankDbStructure}
          defaultSidebarOpen={false}
          errorObjects={[
            {
              name: 'FileNotFound',
              message:
                'The specified file could not be found in the repository.',
              instruction:
                'Please check the file path and branch/commit reference.',
            },
          ]}
        />
      )
    }

    setPrismWasmUrl(path.resolve(process.cwd(), 'prism.wasm'))

    if (!gitHubSchemaFilePath?.format) {
      return (
        <ERDViewer
          dbStructure={blankDbStructure}
          defaultSidebarOpen={false}
          errorObjects={[
            {
              name: 'FormatError',
              message: 'Record not found',
              instruction: 'Please make sure that the schema file exists.',
            },
          ]}
        />
      )
    }

    const format = gitHubSchemaFilePath.format

    const { value: dbStructure, errors } = await parse(content, format)

    for (const error of errors) {
      Sentry.captureException(error)
    }

    const { result, error: overrideError } = await processOverrideFile(
      repositoryFullName,
      branchOrCommit,
      Number(repository.installationId),
      dbStructure,
    )

    if (overrideError) {
      return (
        <ERDViewer
          dbStructure={blankDbStructure}
          defaultSidebarOpen={false}
          errorObjects={[overrideError]}
        />
      )
    }

    const { dbStructure: overriddenDbStructure, tableGroups } = result || {
      dbStructure,
      tableGroups: {},
    }

    const cookieStore = await cookies()
    const defaultSidebarOpen =
      cookieStore.get('sidebar:state')?.value === 'true'
    const layoutCookie = cookieStore.get('panels:layout')
    const defaultPanelSizes = (() => {
      if (!layoutCookie) return [20, 80]
      try {
        const sizes = JSON.parse(layoutCookie.value)
        if (Array.isArray(sizes) && sizes.length >= 2) return sizes
      } catch {}
      return [20, 80]
    })()

    return (
      <ERDViewer
        dbStructure={overriddenDbStructure}
        tableGroups={tableGroups}
        defaultSidebarOpen={defaultSidebarOpen}
        defaultPanelSizes={defaultPanelSizes}
        errorObjects={errors.map((error) => ({
          name: error.name,
          message: error.message,
        }))}
        projectId={projectId}
        branchOrCommit={branchOrCommit}
      />
    )
  } catch (_error) {
    return (
      <ERDViewer
        dbStructure={blankDbStructure}
        defaultSidebarOpen={false}
        errorObjects={[
          {
            name: 'GitHubError',
            message: 'Failed to fetch file content from GitHub',
            instruction:
              'Please check your repository permissions and try again.',
          },
        ]}
      />
    )
  }
}
