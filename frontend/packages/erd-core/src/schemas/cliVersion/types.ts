import type { InferOutput } from 'valibot'
import type { cliVersionSchema } from './schemas'

export type CliVersion = InferOutput<typeof cliVersionSchema>
