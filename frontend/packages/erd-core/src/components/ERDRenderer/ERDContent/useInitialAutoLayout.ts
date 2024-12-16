import { useNodesInitialized } from '@xyflow/react'
import { useEffect } from 'react'
import { useERDContentContext } from './ERDContentContext'
import { useAutoLayout } from './useAutoLayout'

export const useInitialAutoLayout = () => {
  const nodesInitialized = useNodesInitialized()
  const {
    state: { initializeComplete },
  } = useERDContentContext()
  const { handleLayout } = useAutoLayout()

  useEffect(() => {
    if (initializeComplete) {
      return
    }

    if (nodesInitialized) {
      handleLayout()
    }
  }, [nodesInitialized, initializeComplete, handleLayout])
}
