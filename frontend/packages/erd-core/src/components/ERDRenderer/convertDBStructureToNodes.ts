import type { DBStructure } from '@liam-hq/db-structure'
import type { Edge, Node } from '@xyflow/react'
import type { Relationship } from './types'

export const convertDBStructureToNodes = (
  dbStructure: DBStructure,
): { nodes: Node[]; edges: Edge[] } => {
  const tables = Object.values(dbStructure.tables)
  const relations = Object.values(dbStructure.relationships)

  const relationships: Relationship[] = relations.map((rel) => ({
    id: rel.name,
    source: rel.primaryTableName,
    target: rel.foreignTableName,
    sourceHandle: `${rel.primaryTableName}-${rel.primaryColumnName}`,
    targetHandle: `${rel.foreignTableName}-${rel.foreignColumnName}`,
  }))

  const nodes = tables.map((table, index) => {
    const relatedRelationships = relationships.filter(
      (rel) => rel.source === table.name || rel.target === table.name,
    )

    return {
      id: table.name,
      type: 'table',
      data: {
        table,
        relationships: relatedRelationships,
      },
      position: { x: index * 300, y: 50 },
    }
  })

  const edges = relationships.map((rel) => ({
    id: rel.id,
    type: 'relationship',
    source: rel.source,
    target: rel.target,
    sourceHandle: rel.sourceHandle,
    targetHandle: rel.targetHandle,
    data: { relationship: rel },
  }))

  return { nodes, edges }
}
