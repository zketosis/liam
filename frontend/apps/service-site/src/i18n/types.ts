import type { InferOutput } from 'valibot'
import type { langSchema } from './schema'

export type Lang = InferOutput<typeof langSchema>
