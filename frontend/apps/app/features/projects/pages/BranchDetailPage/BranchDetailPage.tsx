import { createClient } from '@/libs/db/server'
import { urlgen } from '@/utils/routes'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './BranchDetailPage.module.css'

type Props = {
  projectId: number
  branchOrCommit: string
}

async function getBranchDetails(projectId: number) {
  const supabase = await createClient()
  const { data: project, error } = await supabase
    .from('Project')
    .select(`
      *,
      ProjectRepositoryMapping!inner (
        Repository (
          id,
          name,
          owner
        )
      )
    `)
    .eq('id', projectId)
    .single()

  if (error || !project) {
    console.error('Error fetching project:', error)
    notFound()
  }

  const { data: patterns, error: patternsError } = await supabase
    .from('WatchSchemaFilePattern')
    .select('pattern')
    .eq('projectId', projectId)

  if (patternsError) {
    console.error('Error fetching schema patterns:', patternsError)
  }

  const { data: docPaths, error: docPathsError } = await supabase
    .from('GitHubDocFilePath')
    .select('path')
    .eq('projectId', projectId)

  if (docPathsError) {
    console.error('Error fetching doc paths:', docPathsError)
  }

  const transformedPatterns =
    patterns?.map((pattern) => ({
      pattern: pattern.pattern,
    })) || []

  const transformedDocPaths =
    docPaths?.map((docPath) => ({
      path: docPath.path,
    })) || []

  return {
    ...project,
    repository: project.ProjectRepositoryMapping[0].Repository,
    schemaPatterns: transformedPatterns,
    docPaths: transformedDocPaths,
  }
}

export const BranchDetailPage = async ({
  projectId,
  branchOrCommit,
}: Props) => {
  const project = await getBranchDetails(projectId)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link
            href={`/app/projects/${projectId}/branches`}
            className={styles.backLink}
          >
            ← Back to Branches
          </Link>
          <h1 className={styles.title}>
            {project.name} / {branchOrCommit}
          </h1>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.infoCard}>
          <h2 className={styles.sectionTitle}>Project Resources</h2>
          <div className={styles.resourceGrid}>
            <div className={styles.resourceSection}>
              <h3 className={styles.resourceTitle}>Documentation</h3>
              {project.docPaths?.map((docPath) => (
                <Link
                  key={docPath.path}
                  href={urlgen(
                    'projects/[projectId]/ref/[branchOrCommit]/docs/[docFilePath]',
                    {
                      projectId: String(projectId),
                      branchOrCommit,
                      docFilePath: docPath.path,
                    },
                  )}
                  className={styles.resourceLink}
                >
                  View Documentation for {docPath.path}
                  <span className={styles.linkArrow}>→</span>
                </Link>
              ))}
              {(!project.docPaths || project.docPaths.length === 0) && (
                <div className={styles.noPatterns}>
                  No documentation paths configured for this project
                </div>
              )}
            </div>

            <div className={styles.resourceSection}>
              <h3 className={styles.resourceTitle}>ERD Diagrams</h3>
              {project.schemaPatterns?.map((pattern) => (
                <Link
                  key={pattern.pattern}
                  href={urlgen(
                    'projects/[projectId]/ref/[branchOrCommit]/schema/[...schemaFilePath]',
                    {
                      projectId: String(projectId),
                      branchOrCommit,
                      schemaFilePath: pattern.pattern,
                    },
                  )}
                  className={styles.resourceLink}
                >
                  View ERD for {pattern.pattern}
                  <span className={styles.linkArrow}>→</span>
                </Link>
              ))}
              {(!project.schemaPatterns ||
                project.schemaPatterns.length === 0) && (
                <div className={styles.noPatterns}>
                  No schema file patterns configured for this project
                </div>
              )}
            </div>

            <div className={styles.resourceSection}>
              <h3 className={styles.resourceTitle}>Knowledge Suggestions</h3>
              <Link
                href={urlgen(
                  'projects/[projectId]/ref/[branchOrCommit]/knowledge-suggestions',
                  {
                    projectId: String(projectId),
                    branchOrCommit,
                  },
                )}
                className={styles.resourceLink}
              >
                View Knowledge Suggestions
                <span className={styles.linkArrow}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
