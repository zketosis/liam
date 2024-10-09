import type { Lang } from '@/features/i18n'
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
    <article>
      <div>
        <time dateTime={post.date}>
          {format(parseISO(post.date), 'LLLL d, yyyy')}
        </time>
        <h1>{post.title}</h1>
      </div>
      <MDXContent code={post.body.code} />
    </article>
  )
}
