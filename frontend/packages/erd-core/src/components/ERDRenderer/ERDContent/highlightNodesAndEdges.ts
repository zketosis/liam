import type { Edge, Node } from '@xyflow/react'
import { type TableNodeType, isTableNode } from './TableNode'

const isActiveNode = (
  activeTableName: string | undefined,
  node: TableNodeType,
): boolean => {
  return node.data.table.name === activeTableName
}

const activeHighlightNode = (node: TableNodeType): TableNodeType => ({
  ...node,
  data: {
    ...node.data,
    isActiveHighlighted: true,
  },
})

const unhighlightNode = (node: TableNodeType): TableNodeType => ({
  ...node,
  data: {
    ...node.data,
    isActiveHighlighted: false,
    isHighlighted: false,
    isRelated: false,
    highlightedHandles: [],
  },
})

export const highlightNodesAndEdges = (
  nodes: Node[],
  _edges: Edge[],
  activeTableName?: string | undefined,
): { nodes: Node[]; edges: Edge[] } => {
  const updatedNodes = nodes.map((node) => {
    if (!isTableNode(node)) {
      return node
    }

    if (isActiveNode(activeTableName, node)) {
      return activeHighlightNode(node)
    }

    return unhighlightNode(node)
  })

  return { nodes: updatedNodes, edges: [] }
}
