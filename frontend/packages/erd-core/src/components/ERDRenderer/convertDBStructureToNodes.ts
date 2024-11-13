import type { DBStructure } from '@liam/db-structure'
import type { Node } from '@xyflow/react'

export const convertDBStructureToNodes = (dbStructure: DBStructure): Node[] => {
  // TODO: Implement this function
  const tableNames = dbStructure.tables.slice(0, 4).map((table) => table.name)

  return [
    {
      id: '1',
      data: { label: tableNames[0] || 'A table node' },
      position: { x: 0, y: 50 },
    },
    {
      id: '2',
      data: { label: tableNames[1] || 'A table node' },
      style: { border: '1px solid #777', padding: 10 },
      position: { x: 300, y: 50 },
    },
    {
      id: '3',
      data: { label: tableNames[2] || 'A table node' },
      position: { x: 650, y: 25 },
    },
    {
      id: '4',
      data: { label: tableNames[3] || 'A table node' },
      position: { x: 650, y: 100 },
    },
  ]
}
