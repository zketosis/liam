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
  showMode: 'ALL_FIELDS',
})

subscribe(userEditingStore.active, () => {
  const newTableName = userEditingStore.active.tableName
  const url = new URL(window.location.href)

  if (newTableName) {
    url.searchParams.set('active', newTableName)
  } else {
    url.searchParams.delete('active')
  }

  window.history.pushState({}, '', url)
})
