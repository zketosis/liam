import type { Callbacks } from '@langchain/core/callbacks/manager'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { type DBOverride, dbOverrideSchema } from '@liam-hq/db-structure'
import { toJsonSchema } from '@valibot/to-json-schema'
import { parse } from 'valibot'

const dbOverrideJsonSchema = toJsonSchema(dbOverrideSchema)

const SCHEMA_META_TEMPLATE = ChatPromptTemplate.fromTemplate(`
You are Liam, an expert in database schema design and optimization for this project.

## Your Task
Analyze the review comments and suggest metadata enhancements that will improve the overall database structure documentation and relationships. Your goal is to abstract valuable insights from the review and propose schema improvements that benefit the entire project.

Key Responsibilities:
1. Abstract patterns and implicit relationships from specific cases
2. Identify opportunities for better documentation
3. Suggest structural improvements that align with the project's domain
4. Ensure backwards compatibility with existing schema
5. Prioritize clarity and maintainability in documentation

## Review Comment for Analysis
{reviewComment}

## Current Schema Metadata
<json>

{currentSchemaMeta}

</json>
## Expected Output Format
Your response must strictly follow this JSON Schema:
{dbOverrideJsonSchema}

## Guidelines
1. Every suggested change must have a clear justification based on the project context
2. Comments should be descriptive and align with the project's domain language
3. New relationships should capture implicit connections in the data model
4. Added columns should support better data modeling without breaking existing functionality
5. All suggestions must maintain backwards compatibility
6. Build upon the current schema metadata when appropriate, don't duplicate existing metadata
7. Focus on incremental improvements rather than wholesale replacement

## Validation Rules
1. Only include sections that have actual changes
2. All referenced tables and columns must exist in the current schema
3. New relationships must reference valid tables and columns
4. All names must follow the project's naming conventions
5. Ensure all required fields are included in the output schema
`)

export const generateSchemaMeta = async (
  reviewComment: string,
  callbacks: Callbacks,
  currentSchemaMeta: DBOverride | null,
) => {
  const model = new ChatOpenAI({
    temperature: 0.7,
    model: 'gpt-4o-mini',
  })

  const chain = SCHEMA_META_TEMPLATE.pipe(
    model.withStructuredOutput(dbOverrideJsonSchema),
  )

  try {
    const response = await chain.invoke(
      {
        reviewComment,
        currentSchemaMeta: currentSchemaMeta
          ? JSON.stringify(currentSchemaMeta, null, 2)
          : '{}',
        dbOverrideJsonSchema: JSON.stringify(dbOverrideJsonSchema, null, 2),
      },
      {
        callbacks,
      },
    )

    return parse(dbOverrideSchema, response)
  } catch (error) {
    console.error('Error generating schema meta:', error)
    throw error
  }
}
