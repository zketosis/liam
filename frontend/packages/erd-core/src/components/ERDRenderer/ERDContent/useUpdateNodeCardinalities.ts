import type { Relationships } from '@liam-hq/db-structure'
import type { Node } from '@xyflow/react'
import { useEffect } from 'react'
import type { TableNodeType } from './TableNode'

export const useUpdateNodeCardinalities = (
  nodes: Node[],
  relationships: Relationships,
) => {
  useEffect(() => {
    const hiddenNodes = nodes.filter((n) => n.hidden)

    for (const node of nodes) {
      const nodeData = node as TableNodeType
      const tableName = nodeData.data.table.name
      const targetColumnCardinalities = nodeData.data.targetColumnCardinalities

      if (!tableName || !targetColumnCardinalities) continue

      for (const relationship of Object.values(relationships)) {
        if (relationship.foreignTableName !== tableName) continue

        const isPrimaryTableHidden = hiddenNodes.some(
          (hiddenNode) => hiddenNode.id === relationship.primaryTableName,
        )

        targetColumnCardinalities[relationship.foreignColumnName] =
          isPrimaryTableHidden ? undefined : relationship.cardinality
      }
    }
  }, [nodes, relationships])
}
