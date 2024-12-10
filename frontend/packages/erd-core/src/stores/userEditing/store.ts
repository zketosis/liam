import { proxy } from 'valtio'

type UserEditingStore = {
  active: {
    tableId: string | undefined
  }
}

export const userEditingStore = proxy<UserEditingStore>({
  active: {
    tableId: undefined,
  },
})
