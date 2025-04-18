import { createClient } from '@/libs/db/server'

export async function getProject(projectId: string) {
  try {
    const supabase = await createClient()
    const { data: project, error } = await supabase
      .from('Project')
      .select(`
        id,
        name,
        createdAt,
        organizationId,
        updatedAt,
        ProjectRepositoryMapping:ProjectRepositoryMapping(
          repository:Repository(
            pullRequests:PullRequest(
              id,
              pullNumber,
              migration:Migration(
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
    const migrations = project.ProjectRepositoryMapping.flatMap((mapping) =>
      mapping.repository.pullRequests
        .filter((pr) => pr.migration !== null)
        .map((pr) => {
          // Handle case where migration might be an array due to Supabase's return format
          const migration = Array.isArray(pr.migration)
            ? pr.migration[0]
            : pr.migration
          return {
            id: migration.id,
            title: migration.title,
            pullNumber: pr.pullNumber,
          }
        }),
    )

    return {
      id: project.id,
      name: project.name,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      organizationId: project.organizationId,
      migrations,
    }
  } catch (error) {
    console.error('Error in getProject:', error)
    return null
  }
}
