import type { MergeDeep } from 'type-fest'
import type { Database as DatabaseGenerated } from '../../../supabase/database.types'
import type { DocFilePathsOverride } from './doc_file_paths'
import type { GithubPullRequestsOverride } from './github_pull_requests'
import type { KnowledgeSuggestionsOverride } from './knowledge_suggestions'
import type { MigrationsOverride } from './migrations'
import type { OverallReviewKnowledgeSuggestionMappingsOverride } from './overall_review_knowledge_suggestion_mappings'
import type { ProjectRepositoryMappingsOverride } from './project_repository_mappings'
import type { ReviewFeedbackKnowledgeSuggestionMappingsOverride } from './review_feedback_knowledge_suggestion_mappings'
import type { SchemaFilePathsOverride } from './schema_file_paths'

export type AppDatabaseOverrides = MergeDeep<
  DatabaseGenerated,
  KnowledgeSuggestionsOverride &
    ReviewFeedbackKnowledgeSuggestionMappingsOverride &
    OverallReviewKnowledgeSuggestionMappingsOverride &
    OverallReviewKnowledgeSuggestionMappingsOverride &
    SchemaFilePathsOverride &
    DocFilePathsOverride &
    ProjectRepositoryMappingsOverride &
    MigrationsOverride &
    GithubPullRequestsOverride
>
