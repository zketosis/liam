import { useNodesInitialized, useReactFlow } from '@xyflow/react'
import { useCallback, useEffect } from 'react'
import { useERDContentContext } from '../ERDContentContext'
import { getElkLayout } from './getElkLayout'

export const useAutoLayout = () => {
  const nodesInitialized = useNodesInitialized()
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow()
  const {
    actions: { setLoading },
  } = useERDContentContext()

  const handleLayout = useCallback(async () => {
    setLoading(true)
    const nodes = getNodes()
    const edges = getEdges()

    const newNodes = await getElkLayout({
      nodes,
      edges,
    })

    setNodes(newNodes)
    setLoading(false)
    setTimeout(() => fitView(), 0)
  }, [getNodes, setNodes, getEdges, fitView, setLoading])

  useEffect(() => {
    if (nodesInitialized) {
      handleLayout()
    }
  }, [nodesInitialized, handleLayout])
}
