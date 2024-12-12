import type { ShowMode } from '@/schemas/showMode'
import { proxy } from 'valtio'

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
