import { getFileContent } from '@liam-hq/github'
import { createClient } from '../libs/supabase'

/**
 * Provides schema file contents for AI context enrichment, enabling more accurate
 * metadata generation by giving the AI model visibility into the actual schema structure.
 */
export const fetchSchemaFilesContent = async (
  projectId: number,
  branchName: string,
  repositoryFullName: string,
  installationId: number,
): Promise<string> => {
  try {
    const supabase = createClient()

    const { data: schemaPaths, error: pathsError } = await supabase
      .from('GitHubSchemaFilePath')
      .select('path')
      .eq('projectId', projectId)

    if (pathsError) {
      throw new Error(
        `Error fetching schema paths: ${JSON.stringify(pathsError)}`,
      )
    }

    if (!schemaPaths || schemaPaths.length === 0) {
      console.warn(`No schema paths found for project ${projectId}`)
      return ''
    }

    const schemaFilesContent = await Promise.all(
      schemaPaths.map(async (schemaPath: { path: string }) => {
        try {
          const fileData = await getFileContent(
            repositoryFullName,
            schemaPath.path,
            branchName,
            installationId,
          )

          if (!fileData.content) {
            console.warn(`No content found for ${schemaPath.path}`)
            return null
          }

          return `# ${schemaPath.path}\n\n${fileData.content}`
        } catch (error) {
          console.error(`Error fetching content for ${schemaPath.path}:`, error)
          return null
        }
      }),
    )

    return schemaFilesContent.filter(Boolean).join('\n\n---\n\n')
  } catch (error) {
    console.error('Error fetching schema files content:', error)
    throw error
  }
}
