import { Callout } from '@/contents/components'
import type { MDXComponents } from 'mdx/types'
// eslint-disable-next-line no-restricted-imports
import { useMDXComponent } from 'next-contentlayer2/hooks'
import type { FC } from 'react'

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
