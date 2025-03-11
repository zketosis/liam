import { createClient } from '@/libs/db/server'
import { notFound, redirect } from 'next/navigation'
import { migrationFlag } from '../../libs'

export default async function Page() {
  const migrationEnabled = await migrationFlag()

  if (!migrationEnabled) {
    notFound()
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/app/login')
  }

  return (
    <main>
      <p>Migration feature enabled</p>
      <p>Hello {data.user.email}</p>
    </main>
  )
}
