import { createClient } from '@/libs/db/server'
import { urlgen } from '@/utils/routes'
import Link from 'next/link'
import type { FC } from 'react'
import styles from './MigrationsListPage.module.css'

type Props = {
  projectId: string
  branchOrCommit: string
}

async function getMigrationsList(projectId: string) {
  const supabase = await createClient()

  // Get repository related to the project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select(`
      id,
      project_repository_mappings!inner (
        github_repositories!inner (
          id,
          name,
          owner
        )
      )
    `)
    .eq('id', projectId)
    .single()

  if (projectError || !project) {
    console.error('Error fetching project:', projectError)
    return { migrations: [] }
  }

  const repositoryId =
    project.project_repository_mappings[0].github_repositories.id

  // Get PRs related to the repository and fetch migrations related to those PRs
  // Note: We're not filtering by branch here as the database doesn't store branch information directly
  // In a real implementation, we would need to fetch PRs associated with the specific branch

  const { data: migrations, error: migrationsError } = await supabase
    .from('github_pull_requests')
    .select(`
      id,
      pull_number,
      created_at,
      repository_id,
      migrations (
        id,
        title,
        created_at
      )
    `)
    .eq('repository_id', repositoryId)
    .order('created_at', { ascending: false })

  if (migrationsError) {
    console.error('Error fetching migrations:', migrationsError)
    return { migrations: [] }
  }

  // Filter only PRs that have migrations
  const migrationsWithData = migrations
    .filter((pr) => pr.migrations && pr.migrations.length > 0)
    .map((pr) => ({
      id: pr.migrations[0].id,
      title: pr.migrations[0].title,
      pullNumber: pr.pull_number,
      createdAt: pr.migrations[0].created_at,
    }))

  return { migrations: migrationsWithData }
}

export const MigrationsListPage: FC<Props> = async ({
  projectId,
  branchOrCommit,
}) => {
  // Note: In a real implementation, we would use the branchOrCommit parameter to filter migrations
  const { migrations } = await getMigrationsList(projectId)

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Migrations for {branchOrCommit}</h1>
      </div>

      {migrations.length > 0 ? (
        <div className={styles.migrationsList}>
          {migrations.map((migration) => (
            <Link
              key={migration.id}
              href={urlgen(
                'projects/[projectId]/ref/[branchOrCommit]/migrations/[migrationId]',
                {
                  projectId,
                  branchOrCommit,
                  migrationId: migration.id,
                },
              )}
              className={styles.migrationItem}
            >
              <div className={styles.migrationTitle}>{migration.title}</div>
              <div className={styles.migrationMeta}>
                <span>PR #{migration.pullNumber}</span>
                <span>
                  {new Date(migration.createdAt).toLocaleDateString('en-US')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No migrations found for this branch.</p>
        </div>
      )}
    </main>
  )
}
