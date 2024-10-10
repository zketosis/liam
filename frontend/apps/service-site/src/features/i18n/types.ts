import type { InferOutput } from 'valibot'
import type { langSchema } from './schema'

export type Lang = InferOutput<typeof langSchema>

export type Dictionary = Record<
  | 'posts.title'
  | 'posts.share.copyLink'
  | 'posts.share.x'
  | 'posts.share.facebook'
  | 'posts.share.linkedin',
  string
>

export type TranslationFn = <K extends keyof Dictionary>(key: K) => string
