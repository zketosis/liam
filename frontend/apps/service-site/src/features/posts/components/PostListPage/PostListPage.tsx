import { type Lang, getTranslation } from '@/features/i18n'
import { MDXContent } from '@packages/mdx-components'
import type { Post } from 'contentlayer/generated'
import { compareDesc, format, parseISO } from 'date-fns'
import Link from 'next/link'
import type { FC } from 'react'
import { filterPostsByLang } from '../../utils'

function PostCard(post: Post) {
  return (
    <div>
      <h2>
        <Link href={`/${post.lang}/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <time dateTime={post.date}>
        {format(parseISO(post.date), 'LLLL d, yyyy')}
      </time>
      <MDXContent code={post.body.code} />
    </div>
  )
}

type Props = {
  lang: Lang
}

export const PostListPage: FC<Props> = ({ lang }) => {
  const { t } = getTranslation(lang)

  const posts = filterPostsByLang(lang)
  const sortedPosts = posts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  )

  return (
    <div>
      <h1>{t('posts.title')}</h1>
      {sortedPosts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  )
}
