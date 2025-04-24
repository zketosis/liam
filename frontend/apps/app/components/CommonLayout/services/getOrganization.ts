import { createClient } from '@/libs/db/server'
import type { QueryData } from '@liam-hq/db'

export async function getOrganization(organizationId: string) {
  const supabase = await createClient()

  return await supabase
    .from('organizations')
    .select('id, name')
    .eq('id', organizationId)
    .single()
}

export type Organization = QueryData<ReturnType<typeof getOrganization>>
