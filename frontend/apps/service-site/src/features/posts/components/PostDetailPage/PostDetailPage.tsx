import { PostHero } from '@/components/PostHero'
import type { Lang } from '@/features/i18n'
import { MDXContent } from '@/libs/contentlayer'
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
      <PostHero post={post} />
      <TableOfContents contentSelector={TOC_TARGET_CLASS_NAME} />
      <MDXContent code={post.body.code} />
    </article>
  )
}
