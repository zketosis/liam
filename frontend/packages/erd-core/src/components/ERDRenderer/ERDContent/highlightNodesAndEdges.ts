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

const isRelatedNodeToTarget = (
  targetTableName: string | undefined,
  edgeMap: EdgeMap,
  node: TableNodeType,
): boolean => {
  if (!targetTableName) {
    return false
  }

  return edgeMap.get(targetTableName)?.includes(node.data.table.name) ?? false
}

const isHoveredNode = (
  hoverTableName: string | undefined,
  node: TableNodeType,
): boolean => {
  return node.data.table.name === hoverTableName
}

const isActivelyRelatedEdge = (
  activeTableName: string | undefined,
  edge: Edge,
): boolean => {
  return edge.source === activeTableName || edge.target === activeTableName
}

const getHighlightedHandlesForRelatedNode = (
  targetTableName: string | undefined,
  edges: Edge[],
  node: TableNodeType,
): string[] => {
  if (!targetTableName) {
    return []
  }

  const handles: string[] = []
  for (const edge of edges) {
    if (
      edge.targetHandle !== undefined &&
      edge.targetHandle !== null &&
      edge.source === targetTableName &&
      edge.target === node.data.table.name
    ) {
      handles.push(edge.targetHandle)
    }

    if (
      edge.sourceHandle !== undefined &&
      edge.sourceHandle !== null &&
      edge.source === node.data.table.name &&
      edge.target === targetTableName
    ) {
      handles.push(edge.sourceHandle)
    }
  }

  return handles
}

const activeHighlightNode = (node: TableNodeType): TableNodeType => ({
  ...node,
  data: {
    ...node.data,
    isActiveHighlighted: true,
  },
})

const highlightNode = (
  node: TableNodeType,
  handles: string[],
): TableNodeType => ({
  ...node,
  data: {
    ...node.data,
    isHighlighted: true,
    highlightedHandles: handles,
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

const highlightEdge = (edge: Edge): Edge => ({
  ...edge,
  animated: true,
  data: { ...edge.data, isHighlighted: true },
})

const unhighlightEdge = (edge: Edge): Edge => ({
  ...edge,
  animated: false,
  data: { ...edge.data, isHighlighted: false },
})

export const highlightNodesAndEdges = (
  nodes: Node[],
  edges: Edge[],
  trigger: {
    activeTableName?: string | undefined
    hoverTableName?: string | undefined
  },
): { nodes: Node[]; edges: Edge[] } => {
  const { activeTableName, hoverTableName } = trigger
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

    if (
      isRelatedNodeToTarget(activeTableName, edgeMap, node) ||
      isHoveredNode(hoverTableName, node) ||
      isRelatedNodeToTarget(hoverTableName, edgeMap, node)
    ) {
      const highlightedHandles = getHighlightedHandlesForRelatedNode(
        activeTableName ?? hoverTableName,
        edges,
        node,
      )
      return highlightNode(node, highlightedHandles)
    }

    return unhighlightNode(node)
  })

  const updatedEdges = edges.map((edge) => {
    if (isActivelyRelatedEdge(activeTableName, edge)) {
      return highlightEdge(edge)
    }

    return unhighlightEdge(edge)
  })

  return { nodes: updatedNodes, edges: updatedEdges }
}
