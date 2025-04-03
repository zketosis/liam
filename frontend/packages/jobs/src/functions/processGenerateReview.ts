import { prisma } from '@liam-hq/db'
import { getFileContent } from '@liam-hq/github'
import { Langfuse } from 'langfuse'
import { v4 as uuidv4 } from 'uuid'
import { generateReview } from '../prompts/generateReview/generateReview'
import type { GenerateReviewPayload } from '../types'
import { langfuseLangchainHandler } from './langfuseLangchainHandler'

export const processGenerateReview = async (
  payload: GenerateReviewPayload,
): Promise<{ reviewComment: string; traceId: string }> => {
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
      docPaths.map(async (docPath: { path: string }) => {
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

    const predefinedRunId = uuidv4()

    const langfuse = new Langfuse({
      publicKey: process.env['LANGFUSE_PUBLIC_KEY'] ?? '',
      secretKey: process.env['LANGFUSE_SECRET_KEY'] ?? '',
      baseUrl: process.env['LANGFUSE_BASE_URL'] ?? 'https://cloud.langfuse.com',
    })

    const trace = langfuse.trace({
      name: 'overall-review-generation',
      userId: `project-${payload.projectId}`,
      id: predefinedRunId,
    })

    const traceId = trace.id

    const callbacks = [langfuseLangchainHandler]
    const review = await generateReview(
      docsContent,
      payload.schemaFiles,
      payload.schemaChanges,
      callbacks,
      predefinedRunId,
    )

    await prisma.overallReview.updateMany({
      where: {
        pullRequestId: payload.pullRequestId,
        branchName: payload.branchName,
      },
      data: {
        traceId,
      },
    })

    return { reviewComment: review.bodyMarkdown, traceId }
  } catch (error) {
    console.error('Error generating review:', error)
    throw error
  }
}
