import { createClient } from '@/libs/db/server'

export async function getProject(projectId: string) {
  try {
    const supabase = await createClient()
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        created_at,
        organization_id,
        updated_at,
        project_repository_mappings(
          github_repositories(
            github_pull_requests(
              id,
              pull_number,
              migrations(
                id,
                title
              )
            )
          )
        )
      `)
      .eq('id', projectId)
      .single()

    if (error || !project) {
      console.error('Error fetching project:', error)
      return null
    }

    // Extract migrations from the nested structure
    const migrations = project.project_repository_mappings.flatMap((mapping) =>
      mapping.github_repositories.github_pull_requests
        .filter((pr) => pr.migrations !== null)
        .map((pr) => {
          // Handle case where migration might be an array due to Supabase's return format
          const migration = Array.isArray(pr.migrations)
            ? pr.migrations[0]
            : pr.migrations
          return {
            id: migration.id,
            title: migration.title,
            pullNumber: pr.pull_number,
          }
        }),
    )

    return {
      id: project.id,
      name: project.name,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      organizationId: project.organization_id,
      migrations,
    }
  } catch (error) {
    console.error('Error in getProject:', error)
    return null
  }
}
