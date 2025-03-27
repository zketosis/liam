import { createClient } from '@/libs/db/server'

export const getProjects = async () => {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from('Project')
    .select('id, name, createdAt')
    .order('id', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return null
  }

  return projects
}
