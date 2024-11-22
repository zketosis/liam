import type { DBStructure } from '@liam/db-structure'
import type { Node } from '@xyflow/react'

export const convertDBStructureToNodes = (dbStructure: DBStructure): Node[] => {
  const tables = Object.values(dbStructure.tables)
  return tables.map((table, index) => {
    return {
      id: table.name,
      type: 'table',
      data: { table },
      // TODO: layout the nodes
      position: { x: index * 300, y: 50 },
    }
  })
}
