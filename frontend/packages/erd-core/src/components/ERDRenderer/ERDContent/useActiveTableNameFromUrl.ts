import type { QueryParam } from '@/schemas/queryParam'
import { updateActiveTableName } from '@/stores'
import { useEffect } from 'react'

export const useActiveTableNameFromUrl = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const activeQueryParam: QueryParam = 'active'
    const tableFromUrl = urlParams.get(activeQueryParam)

    if (!tableFromUrl) return

    updateActiveTableName(tableFromUrl)
  }, [])
}
