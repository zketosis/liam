import type { PageProps } from '@/app/types'
import { fallbackLang } from '@/features/i18n'
import { PostDetailPage, findPostByLangAndSlug } from '@/features/posts'
import { allPosts } from 'contentlayer/generated'
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

  return <PostDetailPage lang={fallbackLang} slug={slug} />
}
