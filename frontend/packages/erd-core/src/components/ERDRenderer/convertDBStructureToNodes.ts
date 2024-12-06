import type { DBStructure } from '@liam-hq/db-structure'
import type { Edge, Node } from '@xyflow/react'

export const convertDBStructureToNodes = (
  dbStructure: DBStructure,
): { nodes: Node[]; edges: Edge[] } => {
  const tables = Object.values(dbStructure.tables)
  const relationships = Object.values(dbStructure.relationships)

  const nodes = tables.map((table, index) => {
    return {
      id: table.name,
      type: 'table',
      data: {
        table,
      },
      position: { x: index * 300, y: 50 },
    }
  })

  const edges = relationships.map((rel) => ({
    id: rel.name,
    type: 'relationship',
    source: rel.primaryTableName,
    target: rel.foreignTableName,
    sourceHandle: rel.primaryColumnName,
    targetHandle: rel.foreignColumnName,
    data: { relationship: rel },
  }))

  return { nodes, edges }
}
