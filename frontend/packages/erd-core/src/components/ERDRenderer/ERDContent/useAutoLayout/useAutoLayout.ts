import { useReactFlow } from '@xyflow/react'
import { useCallback } from 'react'
import { getElkLayout } from './getElkLayout'

export const useAutoLayout = () => {
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

  return { handleLayout }
}
