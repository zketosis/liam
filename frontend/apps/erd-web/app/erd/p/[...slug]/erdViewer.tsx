'use client'

import type { DBStructure } from '@liam-hq/db-structure'
import {
  CliVersionProvider,
  ERDRenderer,
  cliVersionSchema,
  initDBStructureStore,
} from '@liam-hq/erd-core'
import { useEffect } from 'react'
import * as v from 'valibot'

type ERDViewerProps = {
  dbStructure: DBStructure
  defaultSidebarOpen: boolean
}

export default function ERDViewer({
  dbStructure,
  defaultSidebarOpen,
}: ERDViewerProps) {
  useEffect(() => {
    initDBStructureStore(dbStructure)
  }, [dbStructure])

  const cliVersionData = {
    version: '',
    gitHash: process.env.NEXT_PUBLIC_GIT_HASH,
    envName: '',
    isReleasedGitHash: false,
    date: process.env.NEXT_PUBLIC_RELEASE_DATE,
    displayedOn: 'web',
  }
  const cliVersion = v.parse(cliVersionSchema, cliVersionData)

  return (
    <div style={{ height: '100vh' }}>
      <CliVersionProvider cliVersion={cliVersion}>
        <ERDRenderer defaultSidebarOpen={defaultSidebarOpen} />
      </CliVersionProvider>
    </div>
  )
}
