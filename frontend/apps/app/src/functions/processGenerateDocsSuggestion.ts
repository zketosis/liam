import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { prisma } from '@liam-hq/db'
import { langfuseLangchainHandler } from '../../lib'
import type { DocSuggestion } from '../types'

export const MIGRATION_DOCS_REVIEW_TEMPLATE = `
You are a migration review assistant helping to maintain high-quality documentation (Docs) for database schema changes.

Docs serve as long-term knowledge assets that explain the background, rationale, and implications of schema changes. 
They are written in Markdown format and should be clear, accurate, and helpful for future developers.

Your tasks:
1. For each existing doc, identify any sections that are unclear, outdated, inconsistent with the schema changes, or missing key details. Suggest improvements at the sentence or paragraph level.
2. If documentation is missing or severely lacking, propose new content that should be added.

---

Migration Review Summary:
{reviewResult}

Existing Docs:
{docsArray}

---

Return your output as a JSON array of suggestions.
Each suggestion object must contain these fields:
{
  "docId": "<string or null for new docs>",
  "new": "<boolean - true for new docs>",
  "original": "<string - empty string for new docs>",
  "revised": "<string - your suggested new or improved content>"
}
`

export async function processGenerateDocsSuggestion(payload: {
  reviewComment: string
  projectId: number
}): Promise<DocSuggestion[]> {
  try {
    // Fetch existing docs for the project
    const docs = await prisma.doc.findMany({
      where: {
        projectId: payload.projectId,
      },
      select: {
        id: true,
        title: true,
        content: true,
      },
    })

    const docsArray = docs.map((doc) => ({
      id: doc.id.toString(),
      title: doc.title,
      content: doc.content,
    }))

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

    return JSON.parse(response.content.toString()) as DocSuggestion[]
  } catch (error) {
    console.error('Error generating docs suggestions:', error)
    throw error
  }
}
