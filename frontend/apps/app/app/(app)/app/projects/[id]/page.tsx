import { ProjectDetailPage } from '@/features/projects/pages'
import { migrationFlag } from '@/libs'
import { notFound } from 'next/navigation'
import React from 'react'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return <ProjectDetailPage projectId={id} />
}
