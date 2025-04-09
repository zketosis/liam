import type { Callbacks } from '@langchain/core/callbacks/manager'
import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { toJsonSchema } from '@valibot/to-json-schema'
import { parse } from 'valibot'
import { docsSuggestionSchema } from './docsSuggestionSchema'

const MIGRATION_DOCS_REVIEW_TEMPLATE = `
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

Return your analysis as a JSON object with the following keys:
// schemaPatterns
// schemaContext
// migrationPatterns
// migrationOpsContext
// liamrules

Each key should contain the full updated content for the respective file, or be left unchanged.

Remember:
- Only include project-specific insights
- Be precise and intentional
- Focus on reusable knowledge
- Maintain accuracy and clarity
- Return valid JSON format
`

const docsSuggestionJsonSchema = toJsonSchema(docsSuggestionSchema)

export const generateDocsSuggestion = async (
  reviewResult: string,
  docsArray: string,
  callbacks: Callbacks,
  predefinedRunId: string,
) => {
  const prompt = PromptTemplate.fromTemplate(MIGRATION_DOCS_REVIEW_TEMPLATE)
  const model = new ChatOpenAI({
    model: 'o3-mini-2025-01-31',
  })

  const chain = prompt.pipe(
    model.withStructuredOutput(docsSuggestionJsonSchema),
  )
  const response = await chain.invoke(
    {
      reviewResult,
      docsArray,
    },
    {
      callbacks,
      runId: predefinedRunId,
      tags: ['generateDocsSuggestion'],
    },
  )

  const parsedResponse = parse(docsSuggestionSchema, response)
  return parsedResponse
}
