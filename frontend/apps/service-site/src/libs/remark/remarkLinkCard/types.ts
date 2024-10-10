import type { Paragraph } from 'mdast'
import type { Parent, Position } from 'unist'

export type LinkNode = Parent & {
  children: { type: string; value: string; position: Position }[]
  url: string
  title: string | null
}

export type LinkBlockNodeInParagraph = Paragraph & {
  children: [LinkNode]
}
