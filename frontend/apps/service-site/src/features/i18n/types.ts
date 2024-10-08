import type { InferOutput } from 'valibot'
import type { enDictionary, jaDictionary } from './locales'
import type { langSchema } from './schema'

export type Lang = InferOutput<typeof langSchema>

export type Dictionary = typeof enDictionary | typeof jaDictionary
