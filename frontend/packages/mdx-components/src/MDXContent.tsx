import type { MDXComponents } from 'mdx/types'
import { useMDXComponent } from 'next-contentlayer/hooks'
import type { FC } from 'react'
import { Callout } from './Callout'

const mdxComponents: MDXComponents = {
  Callout: (props) => <Callout {...props} />,
}

type Props = {
  code: string
}

export const MDXContent: FC<Props> = ({ code }) => {
  const Content = useMDXComponent(code)

  return <Content components={mdxComponents} />
}
