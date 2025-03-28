import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { prisma } from '@liam-hq/db'
import { getFileContent } from '@liam-hq/github'
import { langfuseLangchainHandler } from './langfuseLangchainHandler'

export const MIGRATION_DOCS_REVIEW_TEMPLATE = `
You are Liam, an expert in schema design and migration strategy for this project.

Your task is to analyze migration reviews and update the internal documentation files in docs/ to maintain accurate, structured, and reusable knowledge.

🎯 Goal:
Extract project-specific conventions, constraints, and patterns from the migration review that inform future schema design and migration practices.

## 📁 Documentation Structure

The following files need to be maintained:

schemaPatterns.md:
- Reusable patterns and rules for database schema design
- Structural modeling patterns, naming conventions, preferred types
- Canonical design choices specific to this project

schemaContext.md:
- Project-specific constraints that shape schema design
- Technical assumptions, ORM limitations, domain modeling needs
- Only schema-wide policies (no specific fields/models)

migrationPatterns.md:
- Safe and consistent migration strategies
- Sequencing rules, rollout patterns, reversibility requirements
- Implementation standards for this project

migrationOpsContext.md:
- Operational constraints on executing migrations
- Timing, tooling, deployment risks, safety strategies

.liamrules:
- Informal but recurring knowledge
- Field/model specific patterns
- One-time decisions that may inform future work

---

Migration Review:
{reviewResult}

Current Documentation:
{docsArray}

---

Please analyze the migration review and:
1. Identify any new project-specific patterns or constraints
2. Update relevant documentation files with new knowledge
3. Add field/model specific insights to .liamrules
4. Return the complete updated content for any modified files

Remember:
- Only include project-specific insights
- Be precise and intentional
- Focus on reusable knowledge
- Maintain accuracy and clarity
`

const DOC_FILES = [
  'schemaPatterns.md',
  'schemaContext.md',
  'migrationPatterns.md',
  'migrationOpsContext.md',
  '.liamrules',
]

export async function processGenerateDocsSuggestion(payload: {
  reviewComment: string
  projectId: number
  branchOrCommit?: string
}): Promise<string> {
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

    const prompt = PromptTemplate.fromTemplate(MIGRATION_DOCS_REVIEW_TEMPLATE)

    const model = new ChatOpenAI({
      temperature: 0.7,
      model: 'gpt-4o-mini',
    })

    const chain = prompt.pipe(model)
    const response = await chain.invoke(
      {
        reviewResult: payload.reviewComment,
        docsArray:
          docsArray.length > 0
            ? JSON.stringify(docsArray)
            : 'No existing docs found',
      },
      {
        callbacks: [langfuseLangchainHandler],
      },
    )

    return response.content.toString()
  } catch (error) {
    console.error('Error generating docs suggestions:', error)
    throw error
  }
}
