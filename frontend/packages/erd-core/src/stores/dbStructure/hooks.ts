import type { DBStructure } from '@liam/db-structure'
import { useSnapshot } from 'valtio'
import { dbStructureStore } from './store'

export const useDBStructureStore = () =>
  useSnapshot(dbStructureStore) as DBStructure
