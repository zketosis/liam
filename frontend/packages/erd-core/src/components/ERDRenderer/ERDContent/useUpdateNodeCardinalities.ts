import type { Relationships } from '@liam-hq/db-structure'
import type { Node } from '@xyflow/react'
import { useEffect } from 'react'
import { isTableNode } from './TableNode'

export const useUpdateNodeCardinalities = (
  nodes: Node[],
  relationships: Relationships,
  setNodes: (nodes: Node[]) => void,
) => {
  useEffect(() => {
    const visibleNodes = nodes.filter((n) => !n.hidden && isTableNode(n))
    const hiddenNodes = nodes.filter((n) => n.hidden && isTableNode(n))

    const updatedNodes = nodes.map((node) => {
      if (!isTableNode(node)) return node
      const tableName = node.data.table.name
      const targetColumnCardinalities = node.data.targetColumnCardinalities

      if (!targetColumnCardinalities) return node

      for (const relationship of Object.values(relationships)) {
        if (relationship.foreignTableName !== tableName) continue

        const isPrimaryTableHidden = hiddenNodes.some(
          (hiddenNode) => hiddenNode.id === relationship.primaryTableName,
        )

        targetColumnCardinalities[relationship.foreignColumnName] =
          isPrimaryTableHidden ? undefined : relationship.cardinality
      }

      const primaryRelationships = Object.values(relationships).filter(
        (relationship) => relationship.primaryTableName === tableName
      )

      const visibleForeignRelationship = primaryRelationships.find((relationship) =>
        visibleNodes.some((visibleNode) => visibleNode.id === relationship.foreignTableName)
      )

      const updatedSourceColumnName = visibleForeignRelationship
        ? visibleForeignRelationship.primaryColumnName
        : undefined

      return {
        ...node,
        data: {
          ...node.data,
          sourceColumnName: updatedSourceColumnName,
          targetColumnCardinalities,
        },
      }
    })

    setNodes(updatedNodes)
  }, [nodes, relationships, setNodes])
}
