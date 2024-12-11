import { proxy } from 'valtio'

type UserEditingStore = {
  active: {
    tableName: string | undefined
  }
}

export const userEditingStore = proxy<UserEditingStore>({
  active: {
    tableName: undefined,
  },
})
