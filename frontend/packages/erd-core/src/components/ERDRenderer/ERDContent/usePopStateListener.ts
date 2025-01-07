import { updateActiveTableName } from '@/stores'
import { useEffect } from 'react'

export const usePopStateListener = () => {
  useEffect(() => {
    const handlePopState = async () => {
      const url = new URL(window.location.href)
      const tableName = url.searchParams.get('active')

      updateActiveTableName(tableName ?? undefined)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])
}
