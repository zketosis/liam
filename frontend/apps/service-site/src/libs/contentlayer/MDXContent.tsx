import { Callout } from '@/contents/components'
import { Code, Heading, LinkCard } from '@/features/posts'
import type { MDXComponents } from 'mdx/types'
// eslint-disable-next-line no-restricted-imports
import { useMDXComponent } from 'next-contentlayer2/hooks'
import { Children, type FC, type ReactElement } from 'react'

const mdxComponents: MDXComponents = {
  h2: ({ children }) => <Heading as="h2">{children}</Heading>,
  h3: ({ children }) => <Heading as="h3">{children}</Heading>,
  h4: ({ children }) => <Heading as="h4">{children}</Heading>,
  h5: ({ children }) => <Heading as="h5">{children}</Heading>,
  pre: (props) => {
    const child = Children.only(props.children) as ReactElement

    return (
      <pre {...props}>
        <code>{child.props.children}</code>
      </pre>
    )
  },
  code: ({ children }) => <Code>{children}</Code>,
  LinkCard: (props) => <LinkCard {...props} />,
  Callout: (props) => <Callout {...props} />,
}

type Props = {
  code: string
}

export const MDXContent: FC<Props> = ({ code }) => {
  const Content = useMDXComponent(code)

  return <Content components={mdxComponents} />
}
