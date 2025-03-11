import { NewProjectPage } from '@/features/projects/pages'
import { migrationFlag } from '@/libs'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function Page() {
  const migrationEnabled = await migrationFlag()

  if (!migrationEnabled) {
    notFound()
  }

  return <NewProjectPage />
}
