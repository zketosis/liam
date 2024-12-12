import type { ShowMode } from '@/schemas/showMode'
import type { DBStructure } from '@liam-hq/db-structure'
import type { Edge, Node } from '@xyflow/react'

type Params = {
  dbStructure: DBStructure
  showMode: ShowMode
}

export const convertDBStructureToNodes = ({
  dbStructure,
  showMode,
}: Params): {
  nodes: Node[]
  edges: Edge[]
} => {
  const tables = Object.values(dbStructure.tables)
  const relationships = Object.values(dbStructure.relationships)

  const nodes: Node[] = tables.map((table) => {
    return {
      id: table.name,
      type: 'table',
      data: {
        table,
      },
      position: { x: 0, y: 0 },
      style: {
        opacity: 0,
      },
      zIndex: 1,
    }
  })

  const edges: Edge[] = relationships.map((rel) => ({
    id: rel.name,
    type: 'relationship',
    source: rel.primaryTableName,
    target: rel.foreignTableName,
    sourceHandle:
      showMode === 'TABLE_NAME'
        ? null
        : `${rel.primaryTableName}-${rel.primaryColumnName}`,
    targetHandle:
      showMode === 'TABLE_NAME'
        ? null
        : `${rel.foreignTableName}-${rel.foreignColumnName}`,
    data: { relationship: rel },
    style: {
      opacity: 0,
    },
  }))

  return { nodes, edges }
}
