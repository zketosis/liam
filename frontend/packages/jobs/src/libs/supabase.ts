import { type Database, createClient as _createClient } from '@liam-hq/db'

export type SupabaseClient<T = Database> = ReturnType<typeof _createClient<T>>

export function createClient<T = Database>(): ReturnType<
  typeof _createClient<T>
> {
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY']

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return _createClient<T>(supabaseUrl, supabaseKey)
}
