import { aTable } from '@liam-hq/db-structure'
import type { Edge } from '@xyflow/react'
import { describe, expect, it } from 'vitest'
import type { Data, TableNodeType } from './TableNode'
import { highlightNodesAndEdges } from './highlightNodesAndEdges'

const aTableData = (name: string, override?: Partial<Data>): Data => ({
  table: aTable({ name }),
  isActiveHighlighted: false,
  isHighlighted: false,
  isRelated: false,
  highlightedHandles: [],
  sourceColumnName: undefined,
  ...override,
})

const aTableNode = (
  name: string,
  override?: Partial<TableNodeType>,
): TableNodeType => ({
  id: name,
  type: 'table',
  position: { x: 0, y: 0 },
  ...override,
  data: aTableData(name, override?.data),
})

const anEdge = (
  source: string,
  target: string,
  override?: Partial<Edge>,
): Edge => ({
  id: `${source}-${target}`,
  source,
  target,
  animated: false,
  data: { isHighlighted: false, ...override?.data },
  ...override,
})

describe(highlightNodesAndEdges, () => {
  const nodes: TableNodeType[] = [
    aTableNode('users'),
    aTableNode('posts'),
    aTableNode('comments'),
    aTableNode('comment_users'),
  ]

  const edges: Edge[] = [
    anEdge('users', 'posts'),
    anEdge('users', 'comment_users'),
    anEdge('comments', 'comment_users'),
  ]

  it('When the users is active, the users and related tables are highlighted', () => {
    const { nodes: updatedNodes } = highlightNodesAndEdges(nodes, edges, 'users')

    expect(updatedNodes).toEqual([
      aTableNode('users', {
        data: aTableData('users', { isActiveHighlighted: true }),
      }),
      aTableNode('posts'),
      aTableNode('comments'),
      aTableNode('comment_users'),
    ])
  })
})
