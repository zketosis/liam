import { useSnapshot } from 'valtio'
import { userEditingStore } from './store'

export const useUserEditingStore = () => useSnapshot(userEditingStore)
export const useUserEditingActiveStore = () =>
  useSnapshot(userEditingStore.active)
