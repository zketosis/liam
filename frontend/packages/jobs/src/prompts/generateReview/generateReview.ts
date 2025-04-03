import type { Callbacks } from '@langchain/core/callbacks/manager'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { toJsonSchema } from '@valibot/to-json-schema'
import type { JSONSchema7 } from 'json-schema'
import { parse } from 'valibot'
import type { GenerateReviewPayload } from '../../types'
import { reviewSchema } from './reviewSchema'

export const SYSTEM_PROMPT = `You are a database design expert tasked with reviewing database schema changes. Analyze the provided context and schema changes carefully, and respond strictly in the provided JSON schema format.

Your JSON-formatted response must contain:

- An array of identified issues in the "issues" field, each including:
  - "kind": The issue category, selected from:
    - Migration Safety
    - Data Integrity
    - Performance Impact
    - Project Rules Consistency
    - Security or Scalability
  - "severity": For each issue, assign a severity value. Use "CRITICAL" or "WARNING" if the item represents a problem, and "POSITIVE" if it does not indicate an issue.
  - "description": A clear and precise explanation of the issue.
  - "suggestion": Actionable recommendations for addressing the issue.
- An array of scores for each issue kind in the "scores" field, each including:
  - "kind": One of the issue categories listed above.
  - "value": A numeric score from 0 to 10, using a deduction-based approach:
    - Start with a perfect score of 10 (indicating no issues)
    - Deduct points based on the number and severity of issues identified:
      - CRITICAL issues: Deduct 2-4 points each
      - WARNING issues: Deduct 1-2 points each
      - No deductions for POSITIVE observations
    - Consider the cumulative impact of multiple issues
    - A score of 0-3 indicates critical, unfixable problems
    - A score of 4-6 indicates significant issues requiring attention
    - A score of 7-9 indicates minor issues or concerns
    - A score of 10 indicates perfect design with no issues
  - "reason": An explanation justifying the score provided, including what deductions were made and why. If no issues were found in a category, explicitly state that a score of 10 was given because no issues were identified.
- A brief summary of the review in the "summary" field.
- A detailed and constructive overall review in the "bodyMarkdown" field.
  - The bodyMarkdown should be a markdown formatted string.

Ensure your response strictly adheres to the provided JSON schema.
**Your output must be raw JSON only. Do not include any markdown code blocks or extraneous formatting.**
`

export const USER_PROMPT = `Documentation Context:
{docsContent}

Schema Files:
{schemaFiles}

Schema Changes:
{schemaChanges}`

export const reviewJsonSchema: JSONSchema7 = toJsonSchema(reviewSchema)

export const generateReview = async (
  docsContent: string,
  schemaFiles: GenerateReviewPayload['schemaFiles'],
  schemaChanges: GenerateReviewPayload['schemaChanges'],
  callbacks: Callbacks,
) => {
  const chatPrompt = ChatPromptTemplate.fromMessages([
    ['system', SYSTEM_PROMPT],
    ['human', USER_PROMPT],
  ])

  const model = new ChatOpenAI({
    temperature: 0.7,
    model: 'gpt-4o-mini',
  })

  const chain = chatPrompt.pipe(model.withStructuredOutput(reviewJsonSchema))
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
