import type { Plugin } from 'unified'
import type { Node, Parent } from 'unist'
import { visit } from 'unist-util-visit'
import type { LinkBlockNodeInParagraph } from './types'
import { extractDomain, fetchMeta, hasLinkBlock } from './utils'

export const remarkLinkCard: Plugin = () => {
  return async (tree: Node) => {
    const promises: (() => Promise<void>)[] = []

    visit(
      tree,
      hasLinkBlock,
      (
        node: LinkBlockNodeInParagraph,
        index: number | undefined,
        parent: Parent,
      ) => {
        if (!index) return

        const linkNode = node.children[0]

        promises.push(async () => {
          const meta = await fetchMeta(linkNode.url)
          if (!meta) return

          // NOTE: convert a into <LinkCard />
          const linkCardElement = {
            type: 'mdxJsxFlowElement',
            name: 'LinkCard',
            attributes: [
              {
                type: 'mdxJsxAttribute',
                name: 'href',
                value: meta.url,
              },
              {
                type: 'mdxJsxAttribute',
                name: 'title',
                value: meta.title,
              },
              {
                type: 'mdxJsxAttribute',
                name: 'image',
                value: meta.image,
              },
              {
                type: 'mdxJsxAttribute',
                name: 'domain',
                value: extractDomain(linkNode.url),
              },
            ],
            children: [],
          }

          parent.children[index] = linkCardElement
        })
      },
    )

    await Promise.all(promises.map((t) => t()))
  }
}
