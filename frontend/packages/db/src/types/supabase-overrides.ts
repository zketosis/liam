import type { Database } from '../../supabase/database.types'

export type MergeDeep<T, U> = {
  [K in keyof T & keyof U]: MergeDeep<T[K], U[K]>
} & Omit<T, keyof U> &
  Omit<U, keyof T & keyof U>

export type KnowledgeSuggestionsTableOverrides = {
  Tables: {
    knowledge_suggestions: {
      Insert: {
        organization_id?: string | null
      }
    }
  }
}

export type DatabaseWithOverrides = MergeDeep<
  Database,
  {
    public: KnowledgeSuggestionsTableOverrides
  }
>
