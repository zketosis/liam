import { useTableSelection } from '@/features/erd/hooks'
import type { DisplayArea } from '@/features/erd/types'
import { selectTableLogEvent } from '@/features/gtm/utils'
import { repositionTableLogEvent } from '@/features/gtm/utils/repositionTableLogEvent'
import { MAX_ZOOM, MIN_ZOOM } from '@/features/reactflow/constants'
import { useVersion } from '@/providers'
import { useUserEditingActiveStore, useUserEditingStore } from '@/stores'
import type { TableGroup } from '@liam-hq/db-structure'
import {
  Background,
  BackgroundVariant,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type OnNodeDrag,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react'
import clsx from 'clsx'
import { type FC, useCallback } from 'react'
import { highlightNodesAndEdges, isTableNode } from '../../utils'
import styles from './ERDContent.module.css'
import { ERDContentProvider, useERDContentContext } from './ERDContentContext'
import {
  NonRelatedTableGroupNode,
  RelationshipEdge,
  Spinner,
  TableGroupBoundingBox,
  TableGroupNode,
  TableNode,
} from './components'
import { useInitialAutoLayout, usePopStateListener } from './hooks'
import { useTableGroupBoundingBox } from './hooks/useTableGroupBoundingBox'

const nodeTypes = {
  table: TableNode,
  nonRelatedTableGroup: NonRelatedTableGroupNode,
  tableGroup: TableGroupNode,
}

const edgeTypes = {
  relationship: RelationshipEdge,
}

type Props = {
  nodes: Node[]
  edges: Edge[]
  displayArea: DisplayArea
  hoverColumn?: string | undefined
  onAddTableGroup?: ((props: TableGroup) => void) | undefined
}

export type HoverInfo = {
  tableName: string | undefined
  columnName: string | undefined
  columnType: boolean
}

export const ERDContentInner: FC<Props> = ({
  nodes: _nodes,
  edges: _edges,
  displayArea,
  onAddTableGroup,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    displayArea === 'relatedTables'
      ? _nodes.map((node) =>
          isTableNode(node)
            ? { ...node, data: { ...node.data, showMode: 'TABLE_NAME' } }
            : node,
        )
      : _nodes,
  )

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(_edges)
  const {
    state: { loading },
  } = useERDContentContext()
  const { isTableGroupEditMode } = useUserEditingStore()
  const { tableName: activeTableName } = useUserEditingActiveStore()

  const { selectTable, deselectTable } = useTableSelection()

  useInitialAutoLayout({
    nodes,
    displayArea,
  })
  usePopStateListener({ displayArea })

  const {
    containerRef,
    currentBox,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useTableGroupBoundingBox({
    nodes,
    onAddTableGroup,
  })

  const { version } = useVersion()
  const handleNodeClick = useCallback(
    (tableId: string) => {
      selectTable({
        tableId,
        displayArea,
      })

      selectTableLogEvent({
        ref: 'mainArea',
        tableId,
        platform: version.displayedOn,
        gitHash: version.gitHash,
        ver: version.version,
        appEnv: version.envName,
      })
    },
    [version, displayArea, selectTable],
  )

  const handlePaneClick = useCallback(() => {
    deselectTable()
  }, [deselectTable])

  const handleMouseEnterNode: NodeMouseHandler<Node> = useCallback(
    (_e, { id }, hoverInfo?: HoverInfo) => {
      const filteredEdges =
        hoverInfo?.columnName !== undefined && hoverInfo.columnType
          ? _edges.filter((edge) => {
              if (hoverInfo.columnName === 'id') {
                const edgSourceId = `${hoverInfo.tableName}_id`
                return edge.id.includes(edgSourceId)
              }
              return edge.targetHandle?.split('-')[1] === hoverInfo.columnName
            })
          : _edges

      const { nodes: updatedNodes, edges: updatedEdges } =
        highlightNodesAndEdges(nodes, filteredEdges, {
          activeTableName,
          hoverTableName: id,
        })

      setEdges(updatedEdges)
      setNodes(updatedNodes)
    },
    [_edges, nodes, setNodes, setEdges, activeTableName],
  )

  const handleMouseLeaveNode: NodeMouseHandler<Node> = useCallback(() => {
    const { nodes: updatedNodes, edges: updatedEdges } = highlightNodesAndEdges(
      nodes,
      edges,
      {
        activeTableName,
        hoverTableName: undefined,
      },
    )

    setEdges(updatedEdges)
    setNodes(updatedNodes)
  }, [edges, nodes, setNodes, setEdges, activeTableName])

  const handleDragStopNode: OnNodeDrag<Node> = useCallback(
    (_event, _node, nodes) => {
      const operationId = `id_${new Date().getTime()}`
      for (const node of nodes) {
        const tableId = node.id
        repositionTableLogEvent({
          tableId,
          operationId,
          platform: version.displayedOn,
          gitHash: version.gitHash,
          ver: version.version,
          appEnv: version.envName,
        })
      }
    },
    [version],
  )

  const panOnDrag = [1, 2]

  const nodeWithEvent = nodes.map(
    (node: Node): Node => ({
      ...node,
      data: {
        ...node.data,
        onTableColumnMouseEnter: handleMouseEnterNode,
      },
    }),
  )

  return (
    <div
      className={clsx(
        styles.wrapper,
        isTableGroupEditMode && styles.groupEditMode,
      )}
      data-loading={loading}
    >
      {loading && <Spinner className={styles.loading} />}
      <ReactFlow
        ref={containerRef}
        colorMode="dark"
        nodes={nodeWithEvent}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        edgesFocusable={false}
        edgesReconnectable={false}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => handleNodeClick(node.id)}
        onPaneClick={handlePaneClick}
        onNodeMouseEnter={handleMouseEnterNode}
        onNodeMouseLeave={handleMouseLeaveNode}
        onNodeDragStop={handleDragStopNode}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        panOnScroll
        panOnDrag={panOnDrag}
        deleteKeyCode={null} // Turn off because it does not want to be deleted
        attributionPosition="bottom-left"
        nodesConnectable={false}
      >
        <Background
          color="var(--color-gray-600)"
          variant={BackgroundVariant.Dots}
          size={1}
          gap={16}
        />
        {currentBox && (
          <TableGroupBoundingBox
            left={Math.min(currentBox.x, currentBox.x + currentBox.width)}
            top={Math.min(currentBox.y, currentBox.y + currentBox.height)}
            width={Math.abs(currentBox.width)}
            height={Math.abs(currentBox.height)}
          />
        )}
      </ReactFlow>
    </div>
  )
}

export const ERDContent: FC<Props> = (props) => {
  return (
    <ERDContentProvider>
      <ERDContentInner {...props} />
    </ERDContentProvider>
  )
}
