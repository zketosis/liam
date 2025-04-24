import type { MergeDeep } from 'type-fest'
import type { Database as DatabaseGenerated } from '../../supabase/database.types'

export type KnowledgeSuggestionsTableOverrides = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        knowledge_suggestions: {
          Insert: {
            organization_id?: string | null
          }
        }
      }
    }
  }
>
