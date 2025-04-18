import { createClient } from '@/libs/db/server'

export interface ProjectRepository {
  repository: {
    name: string
    owner: string
    installation_id: number
  }
}

export const getProjectRepository = async (
  projectId: string,
): Promise<ProjectRepository | null> => {
  try {
    const supabase = await createClient()
    const { data: project, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_repository_mappings(
          *,
          repositories(
            name, owner, installation_id
          )
        )
      `)
      .eq('id', projectId)
      .single()

    if (error) {
      return null
    }

    const repository = project?.project_repository_mappings[0]?.repositories
    if (!repository?.installation_id || !repository.owner || !repository.name) {
      console.error('Repository information not found')
      return null
    }

    return {
      repository: {
        name: repository.name,
        owner: repository.owner,
        installation_id: repository.installation_id,
      },
    }
  } catch (error) {
    console.error('Error in getProjectRepository:', error)
    return null
  }
}
