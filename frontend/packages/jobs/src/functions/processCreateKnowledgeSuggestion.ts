import { prisma } from '@liam-hq/db'
import { getFileContent } from '@liam-hq/github'

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

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      repositoryMappings: {
        include: {
          repository: true,
        },
        take: 1,
      },
    },
  })

  if (!project || !project.repositoryMappings[0]?.repository) {
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
  const knowledgeSuggestion = await prisma.knowledgeSuggestion.create({
    data: {
      type,
      title,
      path,
      content,
      fileSha,
      projectId,
      branchName: branch,
    },
  })

  return {
    suggestionId: knowledgeSuggestion.id,
    success: true,
  }
}
