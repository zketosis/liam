import { fallbackLang, getTranslation } from '@/features/i18n'
import { filterPostsByLang } from '@/features/posts'
import type { Post } from 'contentlayer/generated'
import { compareDesc, format, parseISO } from 'date-fns'
import { useMDXComponent } from 'next-contentlayer/hooks'
import Link from 'next/link'

function PostCard(post: Post) {
  const MDXContent = useMDXComponent(post.body.code)

  return (
    <div>
      <h2>
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <time dateTime={post.date}>
        {format(parseISO(post.date), 'LLLL d, yyyy')}
      </time>
      <MDXContent />
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
