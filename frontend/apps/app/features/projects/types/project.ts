import type { Tables } from '@liam-hq/db/supabase/database.types'

/**
 * Extended project type with last commit date
 */
export type ProjectWithLastCommit = Tables<'projects'> & {
  lastCommitDate?: string
  project_repository_mappings?: Array<{
    repository: Tables<'github_repositories'>
  }>
}

/**
 * Type predicate to check if a project has the properties of a ProjectWithLastCommit
 */
export const isProjectWithLastCommit = (
  project: Tables<'projects'> | ProjectWithLastCommit,
): project is ProjectWithLastCommit => {
  return 'lastCommitDate' in project
}
