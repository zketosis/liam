'use client'

import { CookieConsent } from '@/components/CookieConsent'
import type { DBStructure, ProcessError } from '@liam-hq/db-structure'
import {
  ERDRenderer,
  VersionProvider,
  initDBStructureStore,
  versionSchema,
} from '@liam-hq/erd-core'
import { useEffect, useState } from 'react'
import * as v from 'valibot'

type ErrorObject = {
  name: string
  message: string
  instruction?: string
}

type ERDViewerProps = {
  dbStructure: DBStructure
  errorObjects: ErrorObject[]
  defaultSidebarOpen: boolean
  defaultPanelSizes?: number[]
}

export default function ERDViewer({
  dbStructure,
  errorObjects,
  defaultSidebarOpen,
  defaultPanelSizes = [20, 80],
}: ERDViewerProps) {
  const [isShowCookieConsent, setShowCookieConsent] = useState(false)

  useEffect(() => {
    initDBStructureStore(dbStructure)
    setShowCookieConsent(window === window.parent)
  }, [dbStructure])

  // Update your versionData to match exactly what versionSchema expects
  const versionData = {
    version: '0.1.0',
    gitHash: process.env.NEXT_PUBLIC_GIT_HASH ?? 'unknown',
    envName: process.env.NEXT_PUBLIC_ENV_NAME ?? 'development',
    date: process.env.NEXT_PUBLIC_RELEASE_DATE ?? new Date().toISOString(),
    displayedOn: 'web',
    // Add any other required fields from the schema
  }
  const version = v.parse(versionSchema, versionData)

  return (
    <div style={{ height: '100dvh' }}>
      <VersionProvider version={version}>
        <ERDRenderer
          defaultSidebarOpen={defaultSidebarOpen}
          defaultPanelSizes={defaultPanelSizes}
          errorObjects={errorObjects}
        />
      </VersionProvider>
      {isShowCookieConsent && <CookieConsent />}
    </div>
  )
}
