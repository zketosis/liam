import type { PageProps } from '@/app/types'
import { fallbackLang } from '@/features/i18n'
import { findPostByLangAndSlug } from '@/features/posts'
import { allPosts } from 'contentlayer/generated'
import { format, parseISO } from 'date-fns'
import { useMDXComponent } from 'next-contentlayer/hooks'
import { notFound } from 'next/navigation'
import { object, parse, string } from 'valibot'

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post.slug }))

export const generateMetadata = ({ params }: PageProps) => {
  const { slug } = parse(paramsSchema, params)
  const post = findPostByLangAndSlug({ lang: fallbackLang, slug })

  if (!post) notFound()

  return { title: post.title }
}

const paramsSchema = object({
  slug: string(),
})

export default function Page({ params }: PageProps) {
  const { slug } = parse(paramsSchema, params)

  const post = findPostByLangAndSlug({ lang: fallbackLang, slug })
  if (!post) notFound()

  const MDXContent = useMDXComponent(post.body.code)

  return (
    <article>
      <div>
        <time dateTime={post.date}>
          {format(parseISO(post.date), 'LLLL d, yyyy')}
        </time>
        <h1>{post.title}</h1>
      </div>
      <MDXContent />
    </article>
  )
}
