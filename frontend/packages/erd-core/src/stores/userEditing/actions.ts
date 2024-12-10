import { userEditingStore } from './store'

export const updateActiveTableId = (tableId: string | undefined) => {
  userEditingStore.active.tableId = tableId
}
