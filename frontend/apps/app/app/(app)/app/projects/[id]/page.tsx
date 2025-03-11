import { ProjectDetailPage } from '@/features/projects/pages'
import { migrationFlag } from '@/libs'
import { notFound } from 'next/navigation'
import React from 'react'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function Page({ params }: PageProps) {
  const migrationEnabled = await migrationFlag()

  if (!migrationEnabled) {
    notFound()
  }

  return <ProjectDetailPage projectId={params.id} />
}
