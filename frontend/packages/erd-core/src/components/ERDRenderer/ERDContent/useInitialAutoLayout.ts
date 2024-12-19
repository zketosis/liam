import type { QueryParam } from '@/schemas/queryParam'
import { addHiddenNodeIds, updateActiveTableName } from '@/stores'
import { decompressFromEncodedURIComponent } from '@/utils'
import { useNodesInitialized } from '@xyflow/react'
import { useEffect } from 'react'
import { useERDContentContext } from './ERDContentContext'
import { useAutoLayout } from './useAutoLayout'

const getActiveTableNameFromUrl = (): string | undefined => {
  const urlParams = new URLSearchParams(window.location.search)
  const activeQueryParam: QueryParam = 'active'
  const tableName = urlParams.get(activeQueryParam)

  return tableName || undefined
}

const getHiddenNodeIdsFromUrl = async (): Promise<string[]> => {
  const urlParams = new URLSearchParams(window.location.search)
  const hiddenQueryParam: QueryParam = 'hidden'
  const compressed = urlParams.get(hiddenQueryParam)
  const hiddenNodeIds = compressed
    ? await decompressFromEncodedURIComponent(compressed).catch(() => undefined)
    : undefined

  return hiddenNodeIds ? hiddenNodeIds.split(',') : []
}

export const useInitialAutoLayout = () => {
  const nodesInitialized = useNodesInitialized()
  const {
    state: { initializeComplete },
  } = useERDContentContext()
  const { handleLayout } = useAutoLayout()

  useEffect(() => {
    const initialize = async () => {
      if (initializeComplete) {
        return
      }

      const tableNameFromUrl = getActiveTableNameFromUrl()
      updateActiveTableName(tableNameFromUrl)
      const hiddenNodeIds = await getHiddenNodeIdsFromUrl()
      addHiddenNodeIds(hiddenNodeIds)

      const fitViewOptions = tableNameFromUrl
        ? { maxZoom: 1, duration: 300, nodes: [{ id: tableNameFromUrl }] }
        : undefined

      if (nodesInitialized) {
        handleLayout(fitViewOptions, hiddenNodeIds)
      }
    }

    initialize()
  }, [nodesInitialized, initializeComplete, handleLayout])
}
