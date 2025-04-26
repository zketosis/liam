import { createClient } from '@/libs/db/server'
import type { QueryData } from '@liam-hq/db'

async function query(organizationId: string) {
  const supabase = await createClient()

  return await supabase
    .from('projects')
    .select('id, name')
    .eq('organization_id', organizationId)
}

export async function getProjects(organizationId: string | null) {
  if (!organizationId) {
    return { data: null, error: null }
  }

  return query(organizationId)
}

export type Projects = QueryData<ReturnType<typeof query>>
