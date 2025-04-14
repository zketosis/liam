import path from 'node:path'
import {
  type DBOverride,
  type DBStructure,
  applyOverrides,
  dbOverrideSchema,
} from '@liam-hq/db-structure'
import { parse, setPrismWasmUrl } from '@liam-hq/db-structure/parser'
import { getFileContent } from '@liam-hq/github'
import { safeParse } from 'valibot'
import { fetchSchemaFileContent } from './githubFileUtils'

const OVERRIDE_SCHEMA_FILE_PATH = '.liam/schema-meta.json'

export type SchemaInfo = {
  dbStructure: DBStructure // Original database structure
  overriddenDbStructure: DBStructure // Database structure with overrides applied
  currentSchemaMeta: DBOverride | null // Current schema metadata
}

/**
 * Fetches schema information and applies overrides
 *
 * @param projectId - The project ID
 * @param branchName - The branch name
 * @param repositoryFullName - The repository full name (owner/name)
 * @param installationId - The installation ID
 * @returns The schema information including original and overridden database structure
 */
export const fetchSchemaInfoWithOverrides = async (
  projectId: number,
  branchName: string,
  repositoryFullName: string,
  installationId: number,
): Promise<SchemaInfo> => {
  // Fetch the current schema metadata file from GitHub
  const { content: currentSchemaMetaContent } = await getFileContent(
    repositoryFullName,
    OVERRIDE_SCHEMA_FILE_PATH,
    branchName,
    installationId,
  )

  // Parse and validate the current schema metadata if it exists
  let currentSchemaMeta: DBOverride | null = null
  if (currentSchemaMetaContent) {
    const parsedJson = JSON.parse(currentSchemaMetaContent)
    const result = safeParse(dbOverrideSchema, parsedJson)

    if (result.success) {
      currentSchemaMeta = result.output
    }
  }

  // Fetch the schema file content
  const { content, format } = await fetchSchemaFileContent(
    projectId,
    branchName,
    repositoryFullName,
    installationId,
  )

  // Parse the schema file
  setPrismWasmUrl(path.resolve(process.cwd(), 'prism.wasm'))
  const { value: dbStructure, errors } = await parse(content, format)

  if (errors.length > 0) {
    console.warn('Errors parsing schema file:', errors)
  }

  // Apply overrides to dbStructure if currentSchemaMeta exists
  const overriddenDbStructure = currentSchemaMeta
    ? applyOverrides(dbStructure, currentSchemaMeta).dbStructure
    : dbStructure

  return {
    dbStructure,
    overriddenDbStructure,
    currentSchemaMeta,
  }
}
