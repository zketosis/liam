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
      if (!isTableNode(node)) {
        return node
      }

      const { table } = node.data
      const { name: tableName } = table
      const { targetColumnCardinalities } = node.data

      if (!targetColumnCardinalities) {
        return node
      }

      const updatedTargetColumnCardinalities = { ...targetColumnCardinalities }

      for (const relationship of Object.values(relationships)) {
        if (relationship.foreignTableName !== tableName) continue

        const isPrimaryTableHidden = hiddenNodes.some(
          (hiddenNode) => hiddenNode.id === relationship.primaryTableName,
        )

        updatedTargetColumnCardinalities[relationship.foreignColumnName] =
          isPrimaryTableHidden ? undefined : relationship.cardinality
      }

      const primaryRelationships = Object.values(relationships).filter(
        (relationship) => relationship.primaryTableName === tableName,
      )

      const visibleForeignRelationship = primaryRelationships.find(
        (relationship) =>
          visibleNodes.some(
            (visibleNode) => visibleNode.id === relationship.foreignTableName,
          ),
      )

      const updatedSourceColumnName = visibleForeignRelationship
        ? visibleForeignRelationship.primaryColumnName
        : undefined

      const updatedData = {
        ...node.data,
        sourceColumnName: updatedSourceColumnName,
        targetColumnCardinalities: updatedTargetColumnCardinalities,
      }

      return {
        ...node,
        data: updatedData,
      }
    })

    setNodes(updatedNodes)
  }, [nodes, relationships, setNodes])
}
