import type { MergeDeep } from 'type-fest'
import type { Database as DatabaseGenerated } from '../../../supabase/database.types'
import type { GithubPullRequestsOverride } from './github_pull_requests'
import type { KnowledgeSuggestionsOverride } from './knowledge_suggestions'
import type { MigrationPullRequestMappingsOverride } from './migration_pull_request_mappings'

export type AppDatabaseOverrides = MergeDeep<
  DatabaseGenerated,
  KnowledgeSuggestionsOverride &
    GithubPullRequestsOverride &
    MigrationPullRequestMappingsOverride
>
