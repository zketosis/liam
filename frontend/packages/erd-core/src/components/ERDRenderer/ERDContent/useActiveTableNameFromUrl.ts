import { updateActiveTableName } from '@/stores'
import { useEffect } from 'react'

export const useActiveTableNameFromUrl = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tableFromUrl = urlParams.get('active')

    if (!tableFromUrl) return

    updateActiveTableName(tableFromUrl)
  }, [])
}
