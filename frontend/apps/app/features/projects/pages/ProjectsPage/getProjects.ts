import { createClient } from '@/libs/db/server'

export const getProjects = async (organizationId?: string) => {
  const supabase = await createClient()

  let query = supabase
    .from('projects')
    .select('id, name, created_at, updated_at, organization_id')
    .order('id', { ascending: false })

  if (organizationId) {
    query = query.eq('organization_id', organizationId)
  }

  const { data: projects, error } = await query

  if (error) {
    console.error('Error fetching projects:', error)
    return null
  }

  return projects
}
