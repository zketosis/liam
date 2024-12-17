import type { QueryParam } from '@/schemas/queryParam'
import type { ShowMode } from '@/schemas/showMode'
import { proxy, subscribe } from 'valtio'

type UserEditingStore = {
  active: {
    tableName: string | undefined
  }
  showMode: ShowMode
}

export const userEditingStore = proxy<UserEditingStore>({
  active: {
    tableName: undefined,
  },
  showMode: 'TABLE_NAME',
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
