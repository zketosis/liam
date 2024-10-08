import { fallbackLang, getTranslation } from '@/features/i18n'
import { filterPostsByLang } from '@/features/posts'
import { MDXContent } from '@packages/mdx-components'
import type { Post } from 'contentlayer/generated'
import { compareDesc, format, parseISO } from 'date-fns'
import Link from 'next/link'

function PostCard(post: Post) {
  return (
    <div>
      <h2>
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <time dateTime={post.date}>
        {format(parseISO(post.date), 'LLLL d, yyyy')}
      </time>
      <MDXContent code={post.body.code} />
    </div>
  )
}

export default function Page() {
  const { t } = getTranslation(fallbackLang)

  const posts = filterPostsByLang(fallbackLang)
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
