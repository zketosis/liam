import { dbStructureSchema } from '@liam-hq/db-structure'
import {
  CliVersionProvider,
  ERDRenderer,
  cliVersionSchema,
  initDBStructureStore,
} from '@liam-hq/erd-core'
import * as v from 'valibot'

async function loadSchemaContent() {
  try {
    const response = await fetch('./schema.json')
    if (!response.ok) {
      throw new Error(`Failed to fetch schema: ${response.statusText}`)
    }
    const data = await response.json()
    const result = v.safeParse(dbStructureSchema, data)
    result.success
      ? initDBStructureStore(result.output)
      : console.info(result.issues)
  } catch (error) {
    console.error('Error loading schema content:', error)
  }
}

loadSchemaContent()

const cliVersionData = {
  version: import.meta.env.VITE_CLI_VERSION_VERSION,
  gitHash: import.meta.env.VITE_CLI_VERSION_GIT_HASH,
  envName: import.meta.env.VITE_CLI_VERSION_ENV_NAME,
  isReleasedGitHash:
    import.meta.env.VITE_CLI_VERSION_IS_RELEASED_GIT_HASH === '1',
  date: import.meta.env.VITE_CLI_VERSION_DATE,
}
const cliVersion = v.parse(cliVersionSchema, cliVersionData)

function App() {
  return (
    <CliVersionProvider cliVersion={cliVersion}>
      <ERDRenderer />
    </CliVersionProvider>
  )
}

export default App
