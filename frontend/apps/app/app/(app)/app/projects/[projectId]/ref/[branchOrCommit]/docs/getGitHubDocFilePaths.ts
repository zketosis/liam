import { createClient } from '@/libs/db/server'

export const getGitHubDocFilePaths = async (projectId: string) => {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('github_doc_file_paths')
      .select('*')
      .eq('project_id', projectId)

    return data || []
  } catch (error) {
    console.error('Error fetching GitHub doc file paths:', error)
    return []
  }
}
