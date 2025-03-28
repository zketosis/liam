import { prisma } from '@liam-hq/db'
import { createFileContent, getFileContent } from '@liam-hq/github'
import type { KnowledgeType } from '@prisma/client'

type CreateKnowledgeSuggestionPayload = {
  projectId: number
  type: KnowledgeType
  title: string
  path: string
  content: string
  repositoryOwner: string
  repositoryName: string
  installationId: number
  branch: string
}

export const processCreateKnowledgeSuggestion = async (
  payload: CreateKnowledgeSuggestionPayload,
) => {
  const {
    projectId,
    type,
    title,
    path,
    content,
    repositoryOwner,
    repositoryName,
    installationId,
    branch,
  } = payload

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
    // If file doesn't exist, create a new one
    const result = await createFileContent(
      repositoryFullName,
      path,
      content,
      `Create ${title}`,
      installationId,
      branch,
    )

    if (!result.success || !result.sha) {
      throw new Error('Failed to create file in GitHub')
    }

    fileSha = result.sha
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
    },
  })

  return {
    suggestionId: knowledgeSuggestion.id,
    success: true,
  }
}
