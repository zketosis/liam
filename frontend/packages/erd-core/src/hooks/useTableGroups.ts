import type { TableGroup } from '@liam-hq/db-structure'
import { useCallback, useState } from 'react'

export function useTableGroups(initialGroups: Record<string, TableGroup> = {}) {
  const [tableGroups, setTableGroups] =
    useState<Record<string, TableGroup>>(initialGroups)

  const addTableGroup = useCallback(({ name, tables, comment }: TableGroup) => {
    setTableGroups((prev) => ({
      ...prev,
      [name]: { name, tables, comment },
    }))

    return { name, tables, comment }
  }, [])

  return {
    tableGroups,
    addTableGroup,
  }
}
