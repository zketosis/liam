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
}

export const processCreateKnowledgeSuggestion = async (
  payload: CreateKnowledgeSuggestionPayload,
) => {
  const { projectId, type, title, path, content, branch } = payload

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
      updatedAt: now,
    })
    .select()
    .single()

  if (createError || !knowledgeSuggestion) {
    throw new Error(
      `Failed to create knowledge suggestion: ${JSON.stringify(createError)}`,
    )
  }

  return {
    suggestionId: knowledgeSuggestion.id,
    success: true,
  }
}
