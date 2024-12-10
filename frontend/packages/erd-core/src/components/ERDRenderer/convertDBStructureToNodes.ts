import type { DBStructure, Table } from '@liam-hq/db-structure'
import type { Edge, Node } from '@xyflow/react'

type Data = {
  table: Table
}

type TableNodeType = Node<Data, 'table'>

const getCategory = (
  score: { primary: number; foreign: number } | undefined,
): number => {
  if (!score) return 4
  if (score.foreign === 0 && score.primary > 0) return 1
  if (score.primary > 0) return 2
  if (score.foreign > 0) return 3
  return 4
}

const sortNodes = (
  nodes: TableNodeType[],
  dbStructure: DBStructure,
): TableNodeType[] => {
  const relationships = Object.values(dbStructure.relationships)
  const tableScore: Record<string, { primary: number; foreign: number }> = {}

  for (const node of nodes) {
    tableScore[node.data.table.name] = { primary: 0, foreign: 0 }
  }

  for (const { primaryTableName, foreignTableName } of relationships) {
    if (tableScore[primaryTableName]) {
      tableScore[primaryTableName].primary++
    }
    if (tableScore[foreignTableName]) {
      tableScore[foreignTableName].foreign++
    }
  }

  return nodes.sort((a, b) => {
    const scoreA = tableScore[a.data.table.name]
    const scoreB = tableScore[b.data.table.name]

    const categoryA = getCategory(scoreA)
    const categoryB = getCategory(scoreB)

    if (categoryA !== categoryB) {
      return categoryA - categoryB
    }

    const primaryA = scoreA?.primary ?? 0
    const primaryB = scoreB?.primary ?? 0
    if (primaryA !== primaryB) {
      return primaryB - primaryA
    }

    const foreignA = scoreA?.foreign ?? 0
    const foreignB = scoreB?.foreign ?? 0
    if (foreignA !== foreignB) {
      return foreignA - foreignB
    }

    return a.data.table.name.localeCompare(b.data.table.name)
  })
}

export const convertDBStructureToNodes = (
  dbStructure: DBStructure,
): { nodes: Node[]; edges: Edge[] } => {
  const tables = Object.values(dbStructure.tables)
  const relationships = Object.values(dbStructure.relationships)

  const nodes: TableNodeType[] = tables.map((table) => {
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
    }
  })
  const sortedNodes = sortNodes(nodes, dbStructure)

  const edges = relationships.map((rel) => ({
    id: rel.name,
    type: 'relationship',
    source: rel.primaryTableName,
    target: rel.foreignTableName,
    sourceHandle: `${rel.primaryTableName}-${rel.primaryColumnName}`,
    targetHandle: `${rel.foreignTableName}-${rel.foreignColumnName}`,
    data: { relationship: rel },
    style: {
      opacity: 0,
    },
  }))

  return { nodes: sortedNodes, edges }
}
