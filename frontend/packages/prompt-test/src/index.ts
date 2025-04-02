import { PromptTemplate } from '@langchain/core/prompts'
import { SYSTEM_PROMPT, USER_PROMPT, reviewJsonSchema } from '@liam-hq/jobs'
import * as dotenv from 'dotenv'
import promptfoo from 'promptfoo'

dotenv.config({ path: '.env.local' })

interface SchemaFile {
  filename: string
  content: string
}

interface SchemaChange {
  filename: string
  status: string
  changes: number
  patch: string
}

interface PromptVars {
  docsContent: string
  schemaFiles: SchemaFile[]
  schemaChanges: SchemaChange[]
}

const systemPrompt = (_vars: PromptVars) => {
  return SYSTEM_PROMPT
}

const userPrompt = async (vars: PromptVars) => {
  const template = PromptTemplate.fromTemplate(USER_PROMPT)
  const promptString = (
    await template.formatPromptValue({
      docsContent: vars.docsContent,
      schemaFiles: vars.schemaFiles,
      schemaChanges: vars.schemaChanges,
    })
  ).value
  return promptString
}

const promptFunction = async ({ vars }: { vars: PromptVars }) => [
  {
    role: 'system',
    content: systemPrompt(vars),
  },
  {
    role: 'user',
    content: await userPrompt(vars),
  },
]

const tests = [
  'file://src/fixtures/github.com/liam-hq/liam/pull/1033/fixture.yaml',
  'file://src/fixtures/github.com/liam-hq/liam/pull/1055/fixture.yaml',
]

async function main() {
  const results = await promptfoo.evaluate(
    {
      prompts: [promptFunction],
      defaultTest: {
        options: {
          // this is for llm-rubric
          provider: 'openai:gpt-4o-mini',
        },
      },
      providers: [
        {
          id: 'openai:gpt-4o-mini',
          config: {
            responseFormat: {
              type: 'json_schema',
              schema: reviewJsonSchema,
              strict: true,
            },
            temperature: 0.7,
          },
        },
      ],
      tests,
      writeLatestResults: true,
    },
    {
      maxConcurrency: 4,
      // NOTE: if you want to test the prompt without caching, set this to false
      // cache: false,
    },
  )
  // exit with 0 if all results are successful
  process.exit(results.results.every((r) => r.success) ? 0 : 1)
}

main().catch(console.error)
