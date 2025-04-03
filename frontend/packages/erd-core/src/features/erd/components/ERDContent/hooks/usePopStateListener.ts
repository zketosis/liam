import type { DisplayArea } from '@/features/erd/types'
import { computeAutoLayout, highlightNodesAndEdges } from '@/features/erd/utils'
import { useCustomReactflow } from '@/features/reactflow/hooks'
import {
  replaceHiddenNodeIds,
  updateActiveTableName,
  updateIsPopstateInProgress,
  updateShowMode,
} from '@/stores'
import {
  getActiveTableNameFromUrl,
  getHiddenNodeIdsFromUrl,
  getShowModeFromUrl,
} from '@/utils'
import type { Node } from '@xyflow/react'
import { useCallback, useEffect } from 'react'
import { hasNonRelatedChildNodes, updateNodesHiddenState } from '../utils'

type Params = {
  nodes: Node[]
  displayArea: DisplayArea
}

export const usePopStateListener = ({ nodes, displayArea }: Params) => {
  const { getEdges, setNodes, setEdges, fitView } = useCustomReactflow()

  const handlePopState = useCallback(async () => {
    updateIsPopstateInProgress(true)

    const [tableName, showMode, hiddenNodeIds] = await Promise.all([
      getActiveTableNameFromUrl(),
      getShowModeFromUrl(),
      getHiddenNodeIdsFromUrl(),
    ])

    const updatedNodes = updateNodesHiddenState({
      nodes,
      hiddenNodeIds,
      shouldHideGroupNodeId: !hasNonRelatedChildNodes(nodes),
    })

    await Promise.all([
      new Promise<void>((resolve) => {
        updateActiveTableName(tableName ?? undefined)
        updateShowMode(showMode)
        setTimeout(resolve, 1)
      }),
      new Promise<void>((resolve) => {
        replaceHiddenNodeIds(hiddenNodeIds)
        setTimeout(resolve, 1)
      }),
    ])

    const { nodes: highlightedNodes, edges: highlightedEdges } =
      highlightNodesAndEdges(updatedNodes, getEdges(), {
        activeTableName: tableName,
      })

    const { nodes: layoutedNodes, edges: layoutedEdges } =
      await computeAutoLayout(highlightedNodes, highlightedEdges)

    setNodes(layoutedNodes)
    setEdges(layoutedEdges)

    const fitViewOptions =
      displayArea === 'main' && tableName
        ? { maxZoom: 1, duration: 300, nodes: [{ id: tableName }] }
        : { duration: 0 }
    await fitView(fitViewOptions)

    updateIsPopstateInProgress(false)
  }, [nodes, displayArea, getEdges, setNodes, setEdges, fitView])
  useEffect(() => {
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [handlePopState])
}
