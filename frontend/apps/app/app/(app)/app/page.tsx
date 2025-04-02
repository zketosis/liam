import { createClient } from '@/libs/db/server'
import { urlgen } from '@/utils/routes'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect(urlgen('login'))
  }

  const { data: projects } = await supabase
    .from('Project')
    .select('id')
    .limit(1)

  if (projects && projects.length > 0) {
    redirect(urlgen('projects'))
  }

  redirect(urlgen('projects/new'))
}
