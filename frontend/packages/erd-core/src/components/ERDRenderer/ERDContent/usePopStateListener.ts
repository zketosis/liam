import {
  replaceHiddenNodeIds,
  updateActiveTableName,
  updateIsPopstateInProgress,
  updateShowMode,
} from '@/stores'
import {
  getActiveTableNameFromUrl,
  getHiddenNodeIdsFromUrl,
  getShowModeFromUrl,
} from '@/utils'
import { useEffect } from 'react'

export const usePopStateListener = () => {
  useEffect(() => {
    const handlePopState = async () => {
      const tableName = getActiveTableNameFromUrl()
      const showMode = getShowModeFromUrl()
      const hiddenNodeIds = await getHiddenNodeIdsFromUrl()

      updateIsPopstateInProgress(true)
      updateActiveTableName(tableName ?? undefined)
      replaceHiddenNodeIds(hiddenNodeIds)
      updateShowMode(showMode)

      setTimeout(() => {
        updateIsPopstateInProgress(false)
      }, 0)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])
}
