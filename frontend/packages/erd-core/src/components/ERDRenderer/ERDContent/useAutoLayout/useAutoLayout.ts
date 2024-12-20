import { useReactFlow } from '@xyflow/react'
import type { FitViewOptions, Node } from '@xyflow/react'
import { useCallback } from 'react'
import { useERDContentContext } from '../ERDContentContext'
import { getElkLayout } from './getElkLayout'

export const useAutoLayout = () => {
  const { setNodes, getEdges, fitView } = useReactFlow()
  const {
    actions: { setLoading, setInitializeComplete },
  } = useERDContentContext()

  const handleLayout = useCallback(
    async (nodes: Node[], fitViewOptions: FitViewOptions = {}) => {
      setLoading(true)
      const edges = getEdges()

      const hiddenNodes: Node[] = []
      const visibleNodes: Node[] = []
      for (const node of nodes) {
        if (node.hidden) {
          hiddenNodes.push(node)
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
    [setNodes, getEdges, fitView, setLoading, setInitializeComplete],
  )

  return { handleLayout }
}
