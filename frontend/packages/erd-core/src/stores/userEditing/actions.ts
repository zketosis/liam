import type { ShowMode } from '@/schemas/showMode'
import { userEditingStore } from './store'

export const updateActiveTableName = (tableName: string | undefined) => {
  userEditingStore.active.tableName = tableName
}

export const updateShowMode = (showMode: ShowMode) => {
  userEditingStore.showMode = showMode
}
