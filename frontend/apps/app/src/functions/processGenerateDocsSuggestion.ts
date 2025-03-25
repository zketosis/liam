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
// Each item: { id: string | null, title: string, content: string }

---

Return your output in the following JSON format:

[
  {
    "docId": "<string | null>",             // null if this is a new doc
    "new": <true | false>,                  // true if this is a new doc
    "original": "<string>",                 // the existing sentence or paragraph ("" if new)
    "revised": "<string>"                   // your improved or new version
  },
  ...
]`

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
      model: 'gpt-4-turbo-preview',
    })

    const chain = prompt.pipe(model)
    const response = await chain.invoke(
      {
        reviewResult: payload.reviewComment,
        docsArray: JSON.stringify(docsArray),
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
