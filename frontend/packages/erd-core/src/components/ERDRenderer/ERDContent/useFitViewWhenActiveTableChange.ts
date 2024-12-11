import { useUserEditingStore } from '@/stores'
import { useReactFlow } from '@xyflow/react'
import { useEffect } from 'react'

export const useFitViewWhenActiveTableChange = (enabled: boolean) => {
  const {
    active: { tableName },
  } = useUserEditingStore()
  const { fitView } = useReactFlow()

  useEffect(() => {
    if (!enabled || !tableName) return

    fitView({
      maxZoom: 1,
      duration: 300,
      nodes: [{ id: tableName }],
    })
  }, [enabled, tableName, fitView])
}
