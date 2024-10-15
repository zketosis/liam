import { ShareIconButton } from '@/components/ShareIconButton'
import type { Lang } from '@/features/i18n'
import { MDXContent } from '@/libs/contentlayer'
import { format, parseISO } from 'date-fns'
import { notFound } from 'next/navigation'
import type { FC } from 'react'
import { findPostByLangAndSlug } from '../../utils'
import { TableOfContents } from '../TableOfContents'

const TOC_TARGET_CLASS_NAME = 'target-toc'

type Props = {
  lang: Lang
  slug: string
}

export const PostDetailPage: FC<Props> = ({ lang, slug }) => {
  const post = findPostByLangAndSlug({ lang, slug })
  if (!post) notFound()

  return (
    <article className={TOC_TARGET_CLASS_NAME} style={{ padding: '0 120px' }}>
      <TableOfContents contentSelector={TOC_TARGET_CLASS_NAME} />
      <div>
        <time dateTime={post.date}>
          {format(parseISO(post.date), 'LLLL d, yyyy')}
        </time>
        <h1>{post.title}</h1>
        <ShareIconButton />
      </div>
      <MDXContent code={post.body.code} />
    </article>
  )
}
