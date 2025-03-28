import { createClient } from '@/libs/db/server'
import { urlgen } from '@/utils/routes'
import { prisma } from '@liam-hq/db'
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect(urlgen('login'))
  }

  const projects = await prisma.project.findMany({
    select: {
      id: true,
    },
    take: 1,
  })

  if (projects.length > 0) {
    redirect(urlgen('projects'))
  }

  redirect(urlgen('projects/new'))
}
