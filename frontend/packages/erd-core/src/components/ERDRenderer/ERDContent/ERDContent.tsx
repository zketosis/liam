import { useDBStructureStore } from '@/stores'
import type { Relationships } from '@liam-hq/db-structure'
import {
  Background,
  BackgroundVariant,
  type Edge,
  type EdgeMouseHandler,
  type Node,
  type NodeMouseHandler,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'
import { type FC, useCallback, useEffect } from 'react'
import styles from './ERDContent.module.css'
import { RelationshipEdge } from './RelationshipEdge'
import { TableNode } from './TableNode'
import { useActiveTableNameFromUrl } from './useActiveTableNameFromUrl'
import { useAutoLayout } from './useAutoLayout'
import { useFitViewWhenActiveTableChange } from './useFitViewWhenActiveTableChange'

const nodeTypes = {
  table: TableNode,
}

const edgeTypes = {
  relationship: RelationshipEdge,
}

type Props = {
  nodes: Node[]
  edges: Edge[]
  enabledFeatures?:
    | {
        fitViewWhenActiveTableChange?: boolean | undefined
      }
    | undefined
}

export const isRelatedToTable = (
  relationships: Relationships,
  tableName: string,
  targetTableName: string | undefined,
) => {
  if (!targetTableName) {
    return false
  }
  return Object.values(relationships).some(
    (relationship) =>
      (relationship.primaryTableName === tableName ||
        relationship.foreignTableName === tableName) &&
      (relationship.primaryTableName === targetTableName ||
        relationship.foreignTableName === targetTableName),
  )
}

export const ERDContent: FC<Props> = ({
  nodes: _nodes,
  edges: _edges,
  enabledFeatures,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const { relationships } = useDBStructureStore()
  const { updateEdgeData, updateEdge } = useReactFlow()

  useEffect(() => {
    setNodes(_nodes)
    setEdges(_edges)
  }, [_nodes, _edges, setNodes, setEdges])

  useAutoLayout()
  useActiveTableNameFromUrl()
  useFitViewWhenActiveTableChange(
    enabledFeatures?.fitViewWhenActiveTableChange ?? true,
  )

  const handleMouseEnterNode: NodeMouseHandler<Node> = useCallback(
    (_, { id }) => {
      const relatedEdges = edges.filter(
        (e) => e.source === id || e.target === id,
      )

      const updatedEdges = edges.map((e) =>
        relatedEdges.includes(e)
          ? { ...e, animated: true, data: { ...e.data, isHighlighted: true } }
          : e,
      )

      const updatedNodes = nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, isHighlighted: true } }
        }

        const isRelated = isRelatedToTable(relationships, node.id, id)

        const highlightedTargetHandles = relatedEdges
          .filter((edge) => edge.source === id && edge.target === node.id)
          .map((edge) => edge.targetHandle)

        const highlightedSourceHandles = relatedEdges
          .filter((edge) => edge.target === id && edge.source === node.id)
          .map((edge) => edge.sourceHandle)

        return {
          ...node,
          data: {
            ...node.data,
            isRelated: isRelated,
            highlightedHandles:
              highlightedTargetHandles.concat(highlightedSourceHandles) || [],
          },
        }
      })

      setEdges(updatedEdges)
      setNodes(updatedNodes)
    },
    [edges, nodes, setNodes, setEdges, relationships],
  )

  const handleMouseLeaveNode: NodeMouseHandler<Node> = useCallback(
    (_, { id }) => {
      const updatedEdges = edges.map((e) =>
        e.source === id || e.target === id
          ? {
              ...e,
              animated: false,
              data: { ...e.data, isHighlighted: false },
            }
          : e,
      )

      const updatedNodes = nodes.map((node) => {
        return {
          ...node,
          data: {
            ...node.data,
            isRelated: false,
            highlightedHandles: [],
            isHighlighted: false,
          },
        }
      })

      setEdges(updatedEdges)
      setNodes(updatedNodes)
    },
    [edges, nodes, setNodes, setEdges],
  )

  const handleMouseEnterEdge: EdgeMouseHandler<Edge> = useCallback(
    (_, { id }) => {
      updateEdge(id, { animated: true })
      updateEdgeData(id, { isHighlighted: true })
    },
    [updateEdge, updateEdgeData],
  )

  const handleMouseLeaveEdge: EdgeMouseHandler<Edge> = useCallback(
    (_, { id }) => {
      updateEdge(id, { animated: false })
      updateEdgeData(id, { isHighlighted: false })
    },
    [updateEdge, updateEdgeData],
  )

  const panOnDrag = [1, 2]

  return (
    <div className={styles.wrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        minZoom={0.1}
        maxZoom={2}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeMouseEnter={handleMouseEnterNode}
        onNodeMouseLeave={handleMouseLeaveNode}
        onEdgeMouseEnter={handleMouseEnterEdge}
        onEdgeMouseLeave={handleMouseLeaveEdge}
        panOnScroll
        panOnDrag={panOnDrag}
        selectionOnDrag
        deleteKeyCode={null} // Turn off because it does not want to be deleted
      >
        <Background
          color="var(--color-gray-600)"
          variant={BackgroundVariant.Dots}
          size={1}
          gap={16}
        />
      </ReactFlow>
    </div>
  )
}
