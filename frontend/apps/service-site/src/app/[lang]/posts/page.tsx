import type { PageProps } from '@/app/types'
import { langSchema, langs } from '@/features/i18n'
import { PostListPage, allPosts } from '@/features/posts'
import { object, parse } from 'valibot'

export const revalidate = 60

export const generateStaticParams = async () => {
  return langs.map((lang) => ({ lang }))
}

const paramsSchema = object({
  lang: langSchema,
})

export default function Page({ params }: PageProps) {
  const { lang } = parse(paramsSchema, params)
  const posts = allPosts(lang)

  return <PostListPage lang={lang} posts={posts} />
}
