import type { PageProps } from '@/app/types'
import { langSchema, langs } from '@/features/i18n'
import { findPostByLangAndSlug } from '@/features/posts'
import { MDXContent } from '@packages/mdx-components'
import { allPosts } from 'contentlayer/generated'
import { format, parseISO } from 'date-fns'
import { notFound } from 'next/navigation'
import { object, parse, string } from 'valibot'

export const generateStaticParams = async () => {
  return langs.map((lang) => {
    return allPosts.map((post) => ({ slug: post.slug, lang }))
  })
}

export const generateMetadata = ({ params }: PageProps) => {
  const { lang, slug } = parse(paramsSchema, params)
  const post = findPostByLangAndSlug({ lang, slug })

  if (!post) notFound()

  return { title: post.title }
}

const paramsSchema = object({
  lang: langSchema,
  slug: string(),
})

export default function Page({ params }: PageProps) {
  const { lang, slug } = parse(paramsSchema, params)

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
