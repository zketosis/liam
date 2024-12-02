import type { DBStructure } from '@liam/db-structure'
import { proxy } from 'valtio'

export const dbStructureStore = proxy<DBStructure>({
  tables: {},
  relationships: {},
})
