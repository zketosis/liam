import { useReactFlow } from '@xyflow/react'
import type { FitViewOptions, Node } from '@xyflow/react'
import { useCallback } from 'react'
import { useERDContentContext } from '../ERDContentContext'
import { getElkLayout } from './getElkLayout'

export const useAutoLayout = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow()
  const {
    actions: { setLoading, setInitializeComplete },
  } = useERDContentContext()

  const handleLayout = useCallback(
    async (
      fitViewOptions: FitViewOptions = {},
      initialHiddenNodeIds: string[] = [],
    ) => {
      setLoading(true)
      const nodes = getNodes()
      const edges = getEdges()

      const hiddenNodes: Node[] = []
      const visibleNodes: Node[] = []
      for (const node of nodes) {
        if (initialHiddenNodeIds.includes(node.id) || node.hidden) {
          hiddenNodes.push({ ...node, hidden: true })
        } else {
          visibleNodes.push(node)
        }
      }

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
      setTimeout(() => {
        fitView(fitViewOptions)
        setLoading(false)
        setInitializeComplete(true)
      }, 0)
    },
    [getNodes, setNodes, getEdges, fitView, setLoading, setInitializeComplete],
  )

  return { handleLayout }
}
