import { NON_RELATED_TABLE_GROUP_NODE_ID } from '@/features/erd/constants'
import type { Node } from '@xyflow/react'

type Params = {
  nodes: Node[]
  hiddenNodeIds: string[]
  shouldHideGroupNodeId: boolean
}

export function updateNodesHiddenState({
  nodes,
  hiddenNodeIds,
  shouldHideGroupNodeId,
}: Params): Node[] {
  return nodes.map((node) => ({
    ...node,
    hidden:
      hiddenNodeIds.includes(node.id) ||
      (shouldHideGroupNodeId && node.id === NON_RELATED_TABLE_GROUP_NODE_ID),
  }))
}
