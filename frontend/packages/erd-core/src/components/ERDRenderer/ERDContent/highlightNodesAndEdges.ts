import type { Edge, Node } from '@xyflow/react'
import { type TableNodeType, isTableNode } from './TableNode'

type SourceTableName = string
type TargetTableName = string
type EdgeMap = Map<SourceTableName, TargetTableName[]>

const isActiveNode = (
  activeTableName: string | undefined,
  node: TableNodeType,
): boolean => {
  return node.data.table.name === activeTableName
}

const isActivelyRelatedNode = (
  activeTableName: string | undefined,
  edgeMap: EdgeMap,
  node: TableNodeType,
): boolean => {
  if (!activeTableName) {
    return false
  }

  return edgeMap.get(activeTableName)?.includes(node.data.table.name) ?? false
}

const activeHighlightNode = (node: TableNodeType): TableNodeType => ({
  ...node,
  data: {
    ...node.data,
    isActiveHighlighted: true,
  },
})

const highlightNode = (node: TableNodeType): TableNodeType => ({
  ...node,
  data: {
    ...node.data,
    isHighlighted: true,
  },
})

const unhighlightNode = (node: TableNodeType): TableNodeType => ({
  ...node,
  data: {
    ...node.data,
    isActiveHighlighted: false,
    isHighlighted: false,
    highlightedHandles: [],
  },
})

export const highlightNodesAndEdges = (
  nodes: Node[],
  edges: Edge[],
  activeTableName?: string | undefined,
): { nodes: Node[]; edges: Edge[] } => {
  const edgeMap: EdgeMap = new Map()
  for (const edge of edges) {
    const sourceTableName = edge.source
    const targetTableName = edge.target
    if (!edgeMap.has(sourceTableName)) {
      edgeMap.set(sourceTableName, [])
    }
    edgeMap.get(sourceTableName)?.push(targetTableName)
  }

  const updatedNodes = nodes.map((node) => {
    if (!isTableNode(node)) {
      return node
    }

    if (isActiveNode(activeTableName, node)) {
      return activeHighlightNode(node)
    }

    if (isActivelyRelatedNode(activeTableName, edgeMap, node)) {
      return highlightNode(node)
    }

    return unhighlightNode(node)
  })

  return { nodes: updatedNodes, edges: [] }
}
