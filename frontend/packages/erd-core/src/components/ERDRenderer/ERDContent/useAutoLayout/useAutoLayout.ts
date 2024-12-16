import { useNodesInitialized, useReactFlow } from '@xyflow/react'
import { useCallback, useEffect } from 'react'
import { getElkLayout } from './getElkLayout'

export const useAutoLayout = () => {
  const nodesInitialized = useNodesInitialized()
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow()

  const handleLayout = useCallback(async () => {
    const nodes = getNodes()
    const edges = getEdges()

    const newNodes = await getElkLayout({
      nodes,
      edges,
    })

    setNodes(newNodes)
    setTimeout(() => fitView(), 0)
  }, [getNodes, setNodes, getEdges, fitView])

  useEffect(() => {
    if (nodesInitialized) {
      handleLayout()
    }
  }, [nodesInitialized, handleLayout])
}
