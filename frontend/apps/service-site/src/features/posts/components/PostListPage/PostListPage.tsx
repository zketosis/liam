import { type Lang, fallbackLang, getTranslation } from '@/features/i18n'
import { MDXContent } from '@/libs/contentlayer'
import type { Post } from 'contentlayer/generated'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import type { FC } from 'react'
import { createPostDetailLink } from '../../utils'

function PostCard(post: Post, lang?: Lang) {
  return (
    <div>
      <h2>
        <Link href={createPostDetailLink({ lang, slug: post.slug })}>
          {post.title}
        </Link>
      </h2>
      <time dateTime={post.publishedAt}>
        {format(parseISO(post.publishedAt), 'LLLL d, yyyy')}
      </time>
      <MDXContent code={post.body.code} />
    </div>
  )
}

type Props = {
  lang?: Lang
  posts: Post[]
}

export const PostListPage: FC<Props> = ({ lang, posts }) => {
  const { t } = getTranslation(lang ?? fallbackLang)

  return (
    <div>
      <h1>{t('posts.title')}</h1>
      {posts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  )
}
