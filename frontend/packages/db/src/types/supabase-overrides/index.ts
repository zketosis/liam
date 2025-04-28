import type { MergeDeep } from 'type-fest'
import type { Database as DatabaseGenerated } from '../../../supabase/database.types'
import type { KnowledgeSuggestionDocMappingsOverride } from './knowledge_suggestion_doc_mappings'
import type { KnowledgeSuggestionsOverride } from './knowledge_suggestions'
import type { MigrationsOverride } from './migrations'
import type { OverallReviewKnowledgeSuggestionMappingsOverride } from './overall_review_knowledge_suggestion_mappings'
import type { ProjectRepositoryMappingsOverride } from './project_repository_mappings'

export type AppDatabaseOverrides = MergeDeep<
  DatabaseGenerated,
  KnowledgeSuggestionsOverride &
    KnowledgeSuggestionDocMappingsOverride &
    OverallReviewKnowledgeSuggestionMappingsOverride &
    ProjectRepositoryMappingsOverride &
    MigrationsOverride
>
