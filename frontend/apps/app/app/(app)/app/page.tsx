import { prisma } from '@liam-hq/db'
import { createClient } from '@/libs/db/server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/app/login')
  }

  const projects = await prisma.project.findMany({
    select: {
      id: true,
    },
    take: 1,
  })

  if (projects.length > 0) {
    redirect('/app/projects')
  }

  redirect('/app/projects/new')
}
