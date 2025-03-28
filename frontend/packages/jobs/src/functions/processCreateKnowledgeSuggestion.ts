import { prisma } from '@liam-hq/db'
import { getFileContent } from '@liam-hq/github'
import type { KnowledgeType } from '@prisma/client'

type CreateKnowledgeSuggestionPayload = {
  projectId: number
  type: KnowledgeType
  title: string
  path: string
  content: string
}

export const processCreateKnowledgeSuggestion = async (
  payload: CreateKnowledgeSuggestionPayload,
) => {
  const { projectId, type, title, path, content } = payload

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

  // Fetch the current file content and SHA from GitHub
  const { sha } = await getFileContent(
    repositoryFullName,
    path,
    'tmp-knowledge-suggestion', // Use tmp-knowledge-suggestion branch
    installationId,
  )

  if (!sha) {
    throw new Error('Failed to get file SHA from GitHub')
  }

  // Create the knowledge suggestion
  const knowledgeSuggestion = await prisma.knowledgeSuggestion.create({
    data: {
      type,
      title,
      path,
      content,
      fileSha: sha,
      projectId,
    },
  })

  return {
    suggestionId: knowledgeSuggestion.id,
    success: true,
  }
}
