import type { LayoutProps } from '@/app/types'
import { TabsContent, TabsRoot } from '@liam-hq/ui'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { safeParse } from 'valibot'
import * as v from 'valibot'
import { SettingsHeader } from './components/SettingsHeader'
import {
  SETTINGS_TAB,
  SettingsTabSchema,
  type SettingsTabValue,
} from './constants'
import styles from './layout.module.css'

const paramsSchema = v.object({
  organizationId: v.string(),
})

const getDefaultTabFromPath = async (): Promise<
  SettingsTabValue | undefined
> => {
  const headersList = await headers()
  const urlPath = headersList.get('x-url-path') || ''
  const pathSegments = urlPath.split('/')
  const lastSegment = pathSegments[pathSegments.length - 1]

  const result = safeParse(SettingsTabSchema, lastSegment)

  return result.success ? result.output : undefined
}

export default async function OrganizationSettingsLayout({
  children,
  params,
}: LayoutProps) {
  const defaultTabFromPath = await getDefaultTabFromPath()
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <h1 className={styles.heading}>Settings</h1>

        <TabsRoot defaultValue={defaultTabFromPath}>
          <SettingsHeader />
          <TabsContent
            value={SETTINGS_TAB.GENERAL}
            className={styles.tabContent}
          >
            {children}
          </TabsContent>
          <TabsContent
            value={SETTINGS_TAB.MEMBERS}
            className={styles.tabContent}
          >
            {children}
          </TabsContent>
          <TabsContent
            value={SETTINGS_TAB.BILLING}
            className={styles.tabContent}
          >
            {children}
          </TabsContent>
          <TabsContent
            value={SETTINGS_TAB.PROJECTS}
            className={styles.tabContent}
          >
            {children}
          </TabsContent>
        </TabsRoot>
      </div>
    </div>
  )
}
