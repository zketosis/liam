import type { PageProps } from '@/app/types'
import { getTranslation, langSchema, langs } from '@/features/i18n'
import { filterPostsByLang } from '@/features/posts'
import type { Post } from 'contentlayer/generated'
import { compareDesc, format, parseISO } from 'date-fns'
import Link from 'next/link'
import { object, parse } from 'valibot'

function PostCard(post: Post) {
  return (
    <div>
      <h2>
        <Link href={`/${post.lang}/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <time dateTime={post.date}>
        {format(parseISO(post.date), 'LLLL d, yyyy')}
      </time>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: No problem, as it is only via Markdown written by in-house members. */}
      <div dangerouslySetInnerHTML={{ __html: post.body.html }} />
    </div>
  )
}

export const generateStaticParams = async () => {
  return langs.map((lang) => ({ lang }))
}

const paramsSchema = object({
  lang: langSchema,
})

export default function Page({ params }: PageProps) {
  const { lang } = parse(paramsSchema, params)

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
