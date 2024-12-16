import { useNodesInitialized } from '@xyflow/react'
import { useEffect } from 'react'
import { useAutoLayout } from './useAutoLayout'

export const useInitialAutoLayout = () => {
  const nodesInitialized = useNodesInitialized()
  const { handleLayout } = useAutoLayout()

  useEffect(() => {
    if (nodesInitialized) {
      handleLayout()
    }
  }, [nodesInitialized, handleLayout])
}
