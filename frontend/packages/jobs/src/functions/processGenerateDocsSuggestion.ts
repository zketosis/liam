import { prisma } from '@liam-hq/db'
import { getFileContent } from '@liam-hq/github'
import { Langfuse } from 'langfuse'
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
}): Promise<Record<string, string>> {
  try {
    // Get repository information from prisma
    const projectRepo = await prisma.projectRepositoryMapping.findFirst({
      where: {
        projectId: payload.projectId,
      },
      include: {
        repository: true,
      },
    })

    if (!projectRepo?.repository) {
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
        title: filename.replace('.md', ''),
        content: fileData.content || '',
      }
    })

    const docsArray = await Promise.all(docsPromises)
    const docsArrayString =
      docsArray.length > 0
        ? JSON.stringify(docsArray)
        : 'No existing docs found'

    const langfuse = new Langfuse({
      publicKey: process.env['LANGFUSE_PUBLIC_KEY'] ?? '',
      secretKey: process.env['LANGFUSE_SECRET_KEY'] ?? '',
      baseUrl: process.env['LANGFUSE_BASE_URL'] ?? 'https://cloud.langfuse.com',
    })

    const trace = langfuse.trace({
      name: 'knowledge-suggestion-generation',
      userId: `project-${payload.projectId}`,
    })

    const traceId = trace.id
    console.log('Generated traceId for knowledge suggestion:', traceId)

    const callbacks = [langfuseLangchainHandler]
    const result = await generateDocsSuggestion(
      payload.reviewComment,
      docsArrayString,
      callbacks,
    )
    
    await prisma.knowledgeSuggestion.updateMany({
      where: {
        projectId: payload.projectId,
        branchName: payload.branchOrCommit || 'main',
      },
      data: {
        traceId,
      },
    })

    // Filter out undefined values and return
    return Object.fromEntries(
      Object.entries(result).filter(([_, value]) => value !== undefined),
    ) as Record<string, string>
  } catch (error) {
    console.error('Error generating docs suggestions:', error)
    throw error
  }
}
