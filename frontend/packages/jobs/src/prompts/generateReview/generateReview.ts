import type { Callbacks } from '@langchain/core/callbacks/manager'
import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { toJsonSchema } from '@valibot/to-json-schema'
import { parse } from 'valibot'
import type { GenerateReviewPayload } from '../../types'
import { reviewSchema } from './reviewSchema'

const REVIEW_TEMPLATE = `
You are a database design expert tasked with reviewing database schema changes. Analyze the provided context and schema changes carefully, and respond strictly in the provided JSON schema format.

Documentation Context:
{docsContent}

Schema Files:
{schemaFiles}

Schema Changes:
{schemaChanges}

Your JSON-formatted response must contain:

- An array of identified issues in the "issues" field, each including:
  - "kind": The issue category, selected from:
    - Migration Safety
    - Data Integrity
    - Performance Impact
    - Project Rules Consistency
    - Security or Scalability
  - "severity": "high", "medium", or "low" depending on impact.
  - "description": A clear and precise explanation of the issue.
  - "suggestion": Actionable recommendations for addressing the issue.
- An array of scores for each issue kind in the "scores" field, each including:
  - "kind": One of the issue categories listed above.
  - "value": A numeric score from 0 to 10, with 10 being the highest.
  - "reason": An explanation justifying the score provided.
- A brief summary of the review in the "summary" field.
- A detailed and constructive overall review in the "bodyMarkdown" field.
  - The bodyMarkdown should be a markdown formatted string.

Ensure your response strictly adheres to the provided JSON schema.
`

const reviewJsonSchema = toJsonSchema(reviewSchema)

export const generateReview = async (
  docsContent: string,
  schemaFiles: GenerateReviewPayload['schemaFiles'],
  schemaChanges: GenerateReviewPayload['schemaChanges'],
  callbacks: Callbacks,
) => {
  const prompt = PromptTemplate.fromTemplate(REVIEW_TEMPLATE)
  const model = new ChatOpenAI({
    temperature: 0.7,
    model: 'gpt-4o-mini',
  })
  const chain = prompt.pipe(model.withStructuredOutput(reviewJsonSchema))
  const response = await chain.invoke(
    {
      docsContent,
      schemaFiles,
      schemaChanges,
    },
    {
      callbacks,
    },
  )
  const parsedResponse = parse(reviewSchema, response)
  return parsedResponse
}
