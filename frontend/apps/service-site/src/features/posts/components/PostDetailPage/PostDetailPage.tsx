import { ShareIconButton } from '@/components/ShareIconButton'
import type { Lang } from '@/features/i18n'
import { LinkHeading } from '@/features/posts/components/LinkHeading'
import { MDXContent } from '@/libs/contentlayer'
import { format, parseISO } from 'date-fns'
import { notFound } from 'next/navigation'
import type { FC } from 'react'
import { findPostByLangAndSlug } from '../../utils'

type Props = {
  lang: Lang
  slug: string
}

export const PostDetailPage: FC<Props> = ({ lang, slug }) => {
  const post = findPostByLangAndSlug({ lang, slug })
  if (!post) notFound()

  return (
    <article style={{ padding: '0 120px' }}>
      <div>
        <time dateTime={post.date}>
          {format(parseISO(post.date), 'LLLL d, yyyy')}
        </time>
        <h1>{post.title}</h1>
        <ShareIconButton />
      </div>

      {/* FIXME: Add href props after implementing categories single page */}
      <LinkHeading>Categories</LinkHeading>

      <MDXContent code={post.body.code} />
    </article>
  )
}
