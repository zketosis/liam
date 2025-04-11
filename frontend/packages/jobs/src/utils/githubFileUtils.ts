import { getFileContent } from '@liam-hq/github'
import { createClient } from '../libs/supabase'

/**
 * Provides schema file content for AI context enrichment, enabling more accurate
 * metadata generation by giving the AI model visibility into the actual schema structure.
 */
export const fetchSchemaFileContent = async (
  projectId: number,
  branchName: string,
  repositoryFullName: string,
  installationId: number,
): Promise<string> => {
  try {
    const supabase = createClient()

    const { data: schemaPath, error: pathError } = await supabase
      .from('GitHubSchemaFilePath')
      .select('path')
      .eq('projectId', projectId)
      .single()

    if (pathError) {
      console.warn(
        `No schema path found for project ${projectId}: ${JSON.stringify(pathError)}`,
      )
      return ''
    }

    try {
      const fileData = await getFileContent(
        repositoryFullName,
        schemaPath.path,
        branchName,
        installationId,
      )

      if (!fileData.content) {
        console.warn(`No content found for ${schemaPath.path}`)
        return ''
      }

      return `# ${schemaPath.path}\n\n${fileData.content}`
    } catch (error) {
      console.error(`Error fetching content for ${schemaPath.path}:`, error)
      return ''
    }
  } catch (error) {
    console.error('Error fetching schema file content:', error)
    throw error
  }
}
