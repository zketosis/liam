import type { Lang } from '@/features/i18n'
import { LinkHeading } from '@/features/posts/components/LinkHeading'
import { PostHero } from '@/features/posts/components/PostHero'
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
      {/* FIXME: Add href props after implementing categories single page */}
      <LinkHeading href="/">Categories</LinkHeading>
      <MDXContent code={post.body.code} />
    </article>
  )
}
