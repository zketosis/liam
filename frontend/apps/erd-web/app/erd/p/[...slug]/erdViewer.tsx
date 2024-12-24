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
}

export default function ERDViewer({ dbStructure }: ERDViewerProps) {
  useEffect(() => {
    initDBStructureStore(dbStructure)
  }, [dbStructure])

  // TODO: Implement version data
  const cliVersionData = {
    version: '0.0.0',
    gitHash: '0000000',
    envName: 'development',
    isReleasedGitHash: false,
    date: '2021-01-01T00:00:00Z',
  }
  const cliVersion = v.parse(cliVersionSchema, cliVersionData)

  return (
    <div style={{ height: '100vh' }}>
      <CliVersionProvider cliVersion={cliVersion}>
        <ERDRenderer />
      </CliVersionProvider>
    </div>
  )
}
