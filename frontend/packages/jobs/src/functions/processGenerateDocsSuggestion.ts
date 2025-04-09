import { getFileContent } from '@liam-hq/github'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '../libs/supabase'
import { generateDocsSuggestion } from '../prompts/generateDocsSuggestion/generateDocsSuggestion'
import { langfuseLangchainHandler } from './langfuseLangchainHandler'

export const DOC_FILES = [
  'schemaPatterns.md',
  'schemaContext.md',
  'migrationPatterns.md',
  'migrationOpsContext.md',
  '.liamrules',
] as const

export async function processGenerateDocsSuggestion(payload: {
  reviewComment: string
  projectId: number
  branchOrCommit?: string
}): Promise<{ suggestions: Record<string, string>; traceId: string }> {
  try {
    const supabase = createClient()

    // Get repository information from supabase
    const { data: projectRepo, error } = await supabase
      .from('ProjectRepositoryMapping')
      .select(`
        *,
        repository:Repository(*)
      `)
      .eq('projectId', payload.projectId)
      .limit(1)
      .maybeSingle()

    if (error || !projectRepo?.repository) {
      throw new Error('Repository information not found')
    }

    const { repository } = projectRepo
    const repositoryFullName = `${repository.owner}/${repository.name}`
    const branch = payload.branchOrCommit || 'main'

    // Fetch all doc files from GitHub
    const docsPromises = DOC_FILES.map(async (filename) => {
      const filePath = `docs/${filename}`
      const fileData = await getFileContent(
        repositoryFullName,
        filePath,
        branch,
        Number(repository.installationId),
      )

      return {
        id: filename,
        title: filename,
        content: fileData.content
          ? Buffer.from(fileData.content, 'base64')
              .toString('utf-8')
              .replace(/\\/g, '\\\\')
              .replace(/\n/g, '\\n')
              .replace(/\r/g, '\\r')
              .replace(/\t/g, '\\t')
              .replace(/"/g, '\\"')
          : '',
      }
    })

    const docsArray = await Promise.all(docsPromises)
    const docsArrayString =
      docsArray.length > 0
        ? JSON.stringify(docsArray)
        : 'No existing docs found'

    const predefinedRunId = uuidv4()

    const callbacks = [langfuseLangchainHandler]
    const result = await generateDocsSuggestion(
      payload.reviewComment,
      docsArrayString,
      callbacks,
      predefinedRunId,
    )

    // Filter out undefined values and add .md extension to keys if not already present
    // TODO: This is a hacky solution. Ideally, we should handle file extensions properly in the LangChain prompt
    // to ensure consistent naming conventions between the input docs and output suggestions.
    const suggestions = Object.fromEntries(
      Object.entries(result)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => {
          const newKey = key.endsWith('.md') ? key : `${key}.md`
          return [newKey, value]
        }),
    ) as Record<string, string>

    // Return a properly structured object
    return {
      suggestions,
      traceId: predefinedRunId,
    }
  } catch (error) {
    console.error('Error generating docs suggestions:', error)
    throw error
  }
}
