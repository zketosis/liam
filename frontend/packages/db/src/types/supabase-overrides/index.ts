import type { MergeDeep } from 'type-fest'
import type { Database as DatabaseGenerated } from '../../../supabase/database.types'
import type { KnowledgeSuggestionsOverride } from './knowledge_suggestions'
import type { MigrationsOverride } from './migrations'
import type { OverallReviewKnowledgeSuggestionMappingsOverride } from './overall_review_knowledge_suggestion_mappings'
import type { OverallReviewsOverride } from './overall_reviews'
import type { ProjectRepositoryMappingsOverride } from './project_repository_mappings'
import type { ReviewFeedbacksOverride } from './review_feedbacks'

export type AppDatabaseOverrides = MergeDeep<
  DatabaseGenerated,
  KnowledgeSuggestionsOverride &
    OverallReviewKnowledgeSuggestionMappingsOverride &
    OverallReviewsOverride &
    ReviewFeedbacksOverride &
    ProjectRepositoryMappingsOverride &
    MigrationsOverride
>
