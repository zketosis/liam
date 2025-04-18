import { createClient } from '@/libs/db/server'
import { redirect } from 'next/navigation'
import styles from './ProjectsPage.module.css'
import { ProjectsWithCommitData } from './ProjectsWithCommitData'

export const runtime = 'edge'

export async function ProjectsPage({
  organizationId,
}: {
  organizationId?: string
}) {
  const supabase = await createClient()
  let baseQuery = supabase.from('projects').select(
    `
      *,
      project_repository_mappings (
        *,
        repository:repositories(*)
      )
    `,
  )

  if (organizationId) {
    baseQuery = baseQuery.eq('organization_id', organizationId)
  }

  const { data: projects } = await baseQuery

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
    ? params.organizationId
    : undefined

  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()

  if (data.session === null) {
    return redirect('/login')
  }

  return <ProjectsPage organizationId={organizationId} />
}
