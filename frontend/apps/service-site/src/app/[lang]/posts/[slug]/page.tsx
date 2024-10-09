import type { PageProps } from '@/app/types'
import { langSchema, langs } from '@/features/i18n'
import { PostDetailPage, findPostByLangAndSlug } from '@/features/posts'
import { allPosts } from 'contentlayer/generated'
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

  return <PostDetailPage lang={lang} slug={slug} />
}
