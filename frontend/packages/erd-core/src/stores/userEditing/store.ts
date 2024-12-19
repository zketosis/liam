import type { QueryParam } from '@/schemas/queryParam'
import type { ShowMode } from '@/schemas/showMode'
import { proxy, subscribe } from 'valtio'
import { proxySet } from 'valtio/utils'

type UserEditingStore = {
  active: {
    tableName: string | undefined
  }
  showMode: ShowMode
  hiddenNodeIds: Set<string>
}

export const userEditingStore = proxy<UserEditingStore>({
  active: {
    tableName: undefined,
  },
  showMode: 'TABLE_NAME',
  hiddenNodeIds: proxySet<string>(),
})

subscribe(userEditingStore.active, () => {
  const newTableName = userEditingStore.active.tableName
  const url = new URL(window.location.href)
  const activeQueryParam: QueryParam = 'active'

  if (newTableName) {
    url.searchParams.set(activeQueryParam, newTableName)
  } else {
    url.searchParams.delete(activeQueryParam)
  }

  window.history.pushState({}, '', url)
})

subscribe(userEditingStore.hiddenNodeIds, () => {
  const url = new URL(window.location.href)
  const activeQueryParam: QueryParam = 'hidden'
  const hiddenNodeIds = Array.from(userEditingStore.hiddenNodeIds).join(',')

  url.searchParams.delete(activeQueryParam)
  if (hiddenNodeIds) {
    url.searchParams.set(activeQueryParam, hiddenNodeIds)
  }

  window.history.pushState({}, '', url)
})
