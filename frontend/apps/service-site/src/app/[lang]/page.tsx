import { langSchema, langs } from '@/features/i18n'
import { allPosts } from '@/features/posts'
import { TopPage } from '@/features/top'
import { object, parse } from 'valibot'
import type { PageProps } from '../types'

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

  return <TopPage lang={lang} posts={posts} />
}
