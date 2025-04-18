import { createClient } from '@/libs/db/server'
import type { Tables } from '@liam-hq/db/supabase/database.types'
import { redirect } from 'next/navigation'
import styles from './ProjectsPage.module.css'
import { ProjectsWithCommitData } from './ProjectsWithCommitData'

export const runtime = 'edge'

export async function ProjectsPage({
  projects,
  organizationId,
}: {
  projects: Tables<'Project'>[] | null
  organizationId?: number
}) {
  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <h1 className={styles.heading}>Projects</h1>
        <ProjectsWithCommitData
          projects={projects}
          organizationId={organizationId}
        />
      </div>
    </div>
  )
}

export default async function ProjectsPageRoute({
  params,
}: {
  params: { organizationId?: string }
}) {
  const organizationId = params.organizationId
    ? Number.parseInt(params.organizationId)
    : undefined

  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()

  if (data.session === null) {
    return redirect('/login')
  }

  let baseQuery = supabase.from('Project').select(
    `
      *,
      ProjectRepositoryMapping (
        *,
        repository:Repository(*)
      )
    `,
  )

  if (organizationId) {
    baseQuery = baseQuery.eq('organizationId', organizationId)
  }

  const { data: projects } = await baseQuery

  return (
    <ProjectsPage
      projects={projects as Tables<'Project'>[] | null}
      organizationId={organizationId}
    />
  )
}
