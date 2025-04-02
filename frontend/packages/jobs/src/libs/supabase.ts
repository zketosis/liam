import { createClient as _createClient } from '@liam-hq/db'

export function createClient(): ReturnType<typeof _createClient> {
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return _createClient(supabaseUrl, supabaseKey)
}
