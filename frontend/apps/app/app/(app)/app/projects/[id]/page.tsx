import { ProjectDetailPage } from '@/features/projects/pages'
import { migrationFlag } from '@/libs'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function Page({ params }: { params: { id: string } }) {
  const migrationEnabled = await migrationFlag()

  if (!migrationEnabled) {
    notFound()
  }

  return <ProjectDetailPage projectId={params.id} />
}
