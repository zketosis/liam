import { createClient } from '@/libs/db/server'
import { redirect } from 'next/navigation'

export default async function Page() {
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
