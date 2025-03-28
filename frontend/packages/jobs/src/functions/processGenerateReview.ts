import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { prisma } from '@liam-hq/db'
import { getFileContent } from '@liam-hq/github'
import type { GenerateReviewPayload } from '../types'
import { langfuseLangchainHandler } from './langfuseLangchainHandler'

const REVIEW_TEMPLATE = `
You are a database design expert.
Please analyze the following schema changes and provide a detailed review.

Documentation Context:
{docsContent}

Schema Files:
{schemaFiles}

Schema Changes:
{schemaChanges}

Please provide a comprehensive review of the database schema changes. Your review should be detailed and constructive.
The response must be a single string containing your detailed review.
`

export const processGenerateReview = async (
  payload: GenerateReviewPayload,
): Promise<string> => {
  try {
    // Get repository installationId
    const repository = await prisma.repository.findUnique({
      where: {
        id: payload.repositoryId,
      },
      select: {
        installationId: true,
      },
    })

    if (!repository) {
      throw new Error(`Repository with ID ${payload.repositoryId} not found`)
    }

    // Get review-enabled doc paths
    const docPaths = await prisma.gitHubDocFilePath.findMany({
      where: {
        projectId: payload.projectId,
        isReviewEnabled: true,
      },
    })

    // Fetch content for each doc path
    const docsContentArray = await Promise.all(
      docPaths.map(async (docPath) => {
        try {
          const fileData = await getFileContent(
            `${payload.owner}/${payload.name}`,
            docPath.path,
            payload.branchName,
            Number(repository.installationId),
          )

          if (!fileData.content) {
            console.warn(`No content found for ${docPath.path}`)
            return null
          }

          return `# ${docPath.path}\n\n${fileData.content}`
        } catch (error) {
          console.error(`Error fetching content for ${docPath.path}:`, error)
          return null
        }
      }),
    )

    // Filter out null values and join content
    const docsContent = docsContentArray.filter(Boolean).join('\n\n---\n\n')
    const prompt = PromptTemplate.fromTemplate(REVIEW_TEMPLATE)

    const model = new ChatOpenAI({
      temperature: 0.7,
      model: 'gpt-4o-mini',
    })

    const chain = prompt.pipe(model)
    const response = await chain.invoke(
      {
        docsContent,
        schemaFiles: payload.schemaFiles,
        schemaChanges: payload.schemaChanges,
      },
      {
        callbacks: [langfuseLangchainHandler],
      },
    )

    return response.content.toString()
  } catch (error) {
    console.error('Error generating review:', error)
    throw error
  }
}
