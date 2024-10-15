import { type Lang, fallbackLang } from '@/features/i18n'
import { LinkHeading } from '@/features/posts/components/LinkHeading'
import { PostCategories } from '@/features/posts/components/PostCategories'
import { PostHero } from '@/features/posts/components/PostHero'
import { MDXContent } from '@/libs/contentlayer'
import { notFound } from 'next/navigation'
import type { FC } from 'react'
import { findPostByLangAndSlug, getNextPost, getPrevPost } from '../../utils'
import { NavNextPost } from '../NavNextPost'
import { NavPreviousPost } from '../NavPreviousPost'
import { TableOfContents } from '../TableOfContents'
import styles from './PostDetailPage.module.css'

const TOC_TARGET_CLASS_NAME = 'target-toc'

type Props = {
  lang?: Lang
  slug: string
}

export const PostDetailPage: FC<Props> = ({ lang, slug }) => {
  const post = findPostByLangAndSlug({ lang: lang ?? fallbackLang, slug })
  if (!post) notFound()

  const prevPost = getPrevPost({ lang: lang ?? fallbackLang, targetPost: post })
  const nextPost = getNextPost({ lang: lang ?? fallbackLang, targetPost: post })

  return (
    <article className={TOC_TARGET_CLASS_NAME}>
      <PostHero post={post} />
      <TableOfContents contentSelector={TOC_TARGET_CLASS_NAME} />
      {/* FIXME: Add href props after implementing categories single page */}
      <LinkHeading href="/">Categories</LinkHeading>
      <MDXContent code={post.body.code} />
      <div className={styles.navPostWrapper}>
        {prevPost && (
          <div className={styles.navPrev}>
            <NavPreviousPost lang={lang} post={prevPost} />
          </div>
        )}
        {nextPost && (
          <div className={styles.navNext}>
            <NavNextPost lang={lang} post={nextPost} />
          </div>
        )}
      <div className={styles.container}>
        <div className={styles.left}>
          <TableOfContents contentSelector={TOC_TARGET_CLASS_NAME} />
        </div>
        <div className={styles.center}>
          <MDXContent code={post.body.code} />
        </div>
        <div className={styles.right}>
          <PostCategories
            categories={post.categories.map((category) => ({ name: category }))}
          />
        </div>
      </div>
    </article>
  )
}
