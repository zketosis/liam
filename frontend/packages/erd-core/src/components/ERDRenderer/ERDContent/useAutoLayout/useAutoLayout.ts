import { useReactFlow } from '@xyflow/react'
import type { Node } from '@xyflow/react'
import { useCallback } from 'react'
import { getElkLayout } from './getElkLayout'

export const useAutoLayout = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow()

  const handleLayout = useCallback(async () => {
    const nodes = getNodes()
    const edges = getEdges()
    const visibleNodes: Node[] = nodes.filter((node) => !node.hidden)
    const hiddenNodes: Node[] = nodes.filter((node) => node.hidden)

    // NOTE: Only include edges where both the source and target are in the nodes
    const nodeMap = new Map(visibleNodes.map((node) => [node.id, node]))
    const visibleEdges = edges.filter((edge) => {
      return nodeMap.get(edge.source) && nodeMap.get(edge.target)
    })

    const newNodes = await getElkLayout({
      nodes: visibleNodes,
      edges: visibleEdges,
    })

    setNodes([...hiddenNodes, ...newNodes])
    setTimeout(() => fitView(), 0)
  }, [getNodes, setNodes, getEdges, fitView])

  return { handleLayout }
}
