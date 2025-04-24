import type { LayoutProps } from '@/app/types'
import { TabsContent, TabsRoot } from '@liam-hq/ui'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { safeParse } from 'valibot'
import * as v from 'valibot'
import { ProjectHeader } from './components/ProjectHeader'
import {
  PROJECT_TAB,
  ProjectTabSchema,
  type ProjectTabValue,
} from './components/ProjectHeader/projectConstants'
import styles from './layout.module.css'

const paramsSchema = v.object({
  projectId: v.string(),
})

const getDefaultTabFromPath = async (): Promise<
  ProjectTabValue | undefined
> => {
  const headersList = await headers()
  const urlPath = headersList.get('x-url-path') || ''
  const pathSegments = urlPath.split('/')
  const lastSegment = pathSegments[pathSegments.length - 1]

  const result = safeParse(ProjectTabSchema, lastSegment)

  return result.success ? result.output : undefined
}

export default async function ProjectLayout({ children, params }: LayoutProps) {
  const defaultTabFromPath = await getDefaultTabFromPath()
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()

  // Extract branchOrCommit from the URL path
  const headersList = await headers()
  const urlPath = headersList.get('x-url-path') || ''
  const pathSegments = urlPath.split('/')

  // Find the index of 'ref' in the path and get the next segment as branchOrCommit
  const refIndex = pathSegments.findIndex(
    (segment: string) => segment === 'ref',
  )
  const branchOrCommit =
    refIndex !== -1 && pathSegments.length > refIndex + 1
      ? pathSegments[refIndex + 1]
      : 'main' // TODO: get default branch from API(using currentOrganization)

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <h1 className={styles.heading}>Project</h1>

        <TabsRoot defaultValue={defaultTabFromPath || PROJECT_TAB.PROJECT}>
          <ProjectHeader
            projectId={parsedParams.output.projectId}
            branchOrCommit={branchOrCommit}
          />
          <TabsContent
            value={PROJECT_TAB.PROJECT}
            className={styles.tabContent}
          >
            {children}
          </TabsContent>
          <TabsContent value={PROJECT_TAB.SCHEMA} className={styles.tabContent}>
            {children}
          </TabsContent>
          <TabsContent
            value={PROJECT_TAB.MIGRATIONS}
            className={styles.tabContent}
          >
            {children}
          </TabsContent>
          <TabsContent value={PROJECT_TAB.DOCS} className={styles.tabContent}>
            {children}
          </TabsContent>
          <TabsContent value={PROJECT_TAB.RULE} className={styles.tabContent}>
            {children}
          </TabsContent>
          <TabsContent
            value={PROJECT_TAB.SETTINGS}
            className={styles.tabContent}
          >
            {children}
          </TabsContent>
        </TabsRoot>
      </div>
    </div>
  )
}
