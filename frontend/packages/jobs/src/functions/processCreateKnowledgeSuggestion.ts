import { getFileContent } from '@liam-hq/github'
import { createClient } from '../libs/supabase'

type KnowledgeType = 'SCHEMA' | 'DOCS'

type CreateKnowledgeSuggestionPayload = {
  projectId: number
  type: KnowledgeType
  title: string
  path: string
  content: string
  branch: string
  traceId?: string
}

export const processCreateKnowledgeSuggestion = async (
  payload: CreateKnowledgeSuggestionPayload,
) => {
  const { projectId, type, title, path, content, branch, traceId } = payload

  const supabase = createClient()

  // Get project with repository mappings
  const { data: project, error } = await supabase
    .from('Project')
    .select(`
      *,
      repositoryMappings:ProjectRepositoryMapping(
        *,
        repository:Repository(*)
      )
    `)
    .eq('id', projectId)
    .single()

  if (error || !project || !project.repositoryMappings?.[0]?.repository) {
    throw new Error('Repository information not found for the project')
  }

  const repository = project.repositoryMappings[0].repository
  const repositoryOwner = repository.owner
  const repositoryName = repository.name
  const installationId = Number(repository.installationId)

  const repositoryFullName = `${repositoryOwner}/${repositoryName}`
  let fileSha: string | null = null

  // First, try to get the SHA of the existing file
  const existingFile = await getFileContent(
    repositoryFullName,
    path,
    branch,
    installationId,
  )

  if (existingFile.sha) {
    fileSha = existingFile.sha
  } else {
    fileSha = null
  }

  // Create the knowledge suggestion with the file SHA
  const now = new Date().toISOString()
  const { data: knowledgeSuggestion, error: createError } = await supabase
    .from('KnowledgeSuggestion')
    .insert({
      type,
      title,
      path,
      content,
      fileSha,
      projectId,
      branchName: branch,
      traceId: traceId || null,
      updatedAt: now,
    })
    .select()
    .single()

  if (createError || !knowledgeSuggestion) {
    throw new Error(
      `Failed to create knowledge suggestion: ${JSON.stringify(createError)}`,
    )
  }

  // If this is a DOCS type suggestion, check if there's a corresponding GitHubDocFilePath entry
  if (type === 'DOCS') {
    // Check if there's a GitHubDocFilePath entry for this path
    const { data: docFilePath } = await supabase
      .from('GitHubDocFilePath')
      .select('id')
      .eq('projectId', projectId)
      .eq('path', path)
      .maybeSingle()

    // If a GitHubDocFilePath entry exists, create a mapping
    if (docFilePath) {
      const { error: mappingError } = await supabase
        .from('KnowledgeSuggestionDocMapping')
        .insert({
          knowledgeSuggestionId: knowledgeSuggestion.id,
          gitHubDocFilePathId: docFilePath.id,
          updatedAt: now,
        })

      if (mappingError) {
        console.error('Failed to create mapping:', mappingError)
        // We don't throw an error here as the suggestion was created successfully
      }
    }
  }

  return {
    suggestionId: knowledgeSuggestion.id,
    success: true,
  }
}
