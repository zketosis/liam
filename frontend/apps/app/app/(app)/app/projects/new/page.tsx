import { ProjectNewPage } from '@/features/projects/pages'
import { createClient } from '@/libs/db/server'
import { getInstallations } from '@liam-hq/github'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()

  if (data.session === null) {
    // TODO: Review the behavior when the session cannot be obtained.
    return notFound()
  }

  const { installations } = await getInstallations(data.session)

  return <ProjectNewPage installations={installations} />
}
