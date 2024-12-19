import { aTable } from '@liam-hq/db-structure'
import type { Edge } from '@xyflow/react'
import { describe, expect, it } from 'vitest'
import type { Data, TableNodeType } from './TableNode'
import { highlightNodesAndEdges } from './highlightNodesAndEdges'

const aTableData = (name: string, override?: Partial<Data>): Data => ({
  table: aTable({ name }),
  isActiveHighlighted: false,
  isHighlighted: false,
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
  sourceHandle: string | null,
  targetHandle: string | null,
  override?: Partial<Edge>,
): Edge => ({
  id: `${source}-${target}`,
  source,
  sourceHandle,
  target,
  targetHandle,
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
    anEdge('users', 'posts', 'users-id', 'posts-user_id'),
    anEdge('users', 'comment_users', 'users-id', 'comment_users-user_id'),
    anEdge(
      'comments',
      'comment_users',
      'comments-id',
      'comment_users-comment_id',
    ),
  ]

  describe('nodes', () => {
    it('When the users is active, the users and related tables are highlighted', () => {
      const { nodes: updatedNodes } = highlightNodesAndEdges(nodes, edges, {
        activeTableName: 'users',
      })

      expect(updatedNodes).toEqual([
        aTableNode('users', {
          data: aTableData('users', { isActiveHighlighted: true }),
        }),
        aTableNode('posts', {
          data: aTableData('posts', {
            isHighlighted: true,
            highlightedHandles: ['posts-user_id'],
          }),
        }),
        aTableNode('comments'),
        aTableNode('comment_users', {
          data: aTableData('comment_users', {
            isHighlighted: true,
            highlightedHandles: ['comment_users-user_id'],
          }),
        }),
      ])
    })

    it('When no active table, no tables are highlighted', () => {
      const { nodes: updatedNodes } = highlightNodesAndEdges(nodes, edges, {
        activeTableName: undefined,
      })

      expect(updatedNodes).toEqual([
        aTableNode('users', {
          data: aTableData('users', { isActiveHighlighted: false }),
        }),
        aTableNode('posts', {
          data: aTableData('posts', {
            isHighlighted: false,
            highlightedHandles: [],
          }),
        }),
        aTableNode('comments'),
        aTableNode('comment_users', {
          data: aTableData('comment_users', {
            isHighlighted: false,
            highlightedHandles: [],
          }),
        }),
      ])
    })
    it('When the users is hovered, the users and related tables are highlighted', () => {
      const { nodes: updatedNodes } = highlightNodesAndEdges(nodes, edges, {
        hoverTableName: 'users',
      })

      expect(updatedNodes).toEqual([
        aTableNode('users', {
          data: aTableData('users', { isHighlighted: true }),
        }),
        aTableNode('posts', {
          data: aTableData('posts', {
            isHighlighted: true,
            highlightedHandles: ['posts-user_id'],
          }),
        }),
        aTableNode('comments'),
        aTableNode('comment_users', {
          data: aTableData('comment_users', {
            isHighlighted: true,
            highlightedHandles: ['comment_users-user_id'],
          }),
        }),
      ])
    })
  })

  describe('edges', () => {
    it('When the users is active, the users and related edges are highlighted', () => {
      const { edges: updatedEdges } = highlightNodesAndEdges(nodes, edges, {
        activeTableName: 'users',
      })

      expect(updatedEdges).toEqual([
        anEdge('users', 'posts', 'users-id', 'posts-user_id', {
          animated: true,
          data: { isHighlighted: true },
        }),
        anEdge('users', 'comment_users', 'users-id', 'comment_users-user_id', {
          animated: true,
          data: { isHighlighted: true },
        }),
        anEdge(
          'comments',
          'comment_users',
          'comments-id',
          'comment_users-comment_id',
        ),
      ])
    })

    it('When no active table, no edges are highlighted', () => {
      const { edges: updatedEdges } = highlightNodesAndEdges(nodes, edges, {
        activeTableName: undefined,
      })

      expect(updatedEdges).toEqual([
        anEdge('users', 'posts', 'users-id', 'posts-user_id', {
          animated: false,
          data: { isHighlighted: false },
        }),
        anEdge('users', 'comment_users', 'users-id', 'comment_users-user_id', {
          animated: false,
          data: { isHighlighted: false },
        }),
        anEdge(
          'comments',
          'comment_users',
          'comments-id',
          'comment_users-comment_id',
        ),
      ])
    })
  })
})
