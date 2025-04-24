import type { MergeDeep } from 'type-fest'
import type { Database as DatabaseGenerated } from '../../../supabase/database.types'
import type { KnowledgeSuggestionsOverride } from './knowledge_suggestions'

export type AppDatabaseOverrides = MergeDeep<
  DatabaseGenerated,
  KnowledgeSuggestionsOverride
>
