import type { Paragraph } from 'mdast'
import type { Node } from 'unist'
import type { LinkBlockNodeInParagraph } from '../types'

const isNode = (node: unknown): node is Node => {
  return typeof node === 'object' && node !== null && 'type' in node
}

const isParagraph = (node: unknown): node is Paragraph => {
  return isNode(node) && node.type === 'paragraph'
}

export const hasLinkBlock = (
  node: unknown,
): node is LinkBlockNodeInParagraph => {
  if (!isParagraph(node)) {
    return false
  }

  //  NOTE: Skip inline links
  return node.children.length === 1 && node.children[0]?.type === 'link'
}
