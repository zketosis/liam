import { TopCards } from '@/components'
import { langSchema } from '@/i18n'
import { filterPostsByLang } from '@/utils/posts'
import { compareDesc } from 'date-fns'
import { object, parse } from 'valibot'
import type { PageProps } from '../types'

const paramsSchema = object({
  lang: langSchema,
})

export default function Page({ params }: PageProps) {
  const { lang } = parse(paramsSchema, params)

  const posts = filterPostsByLang(lang)
  const sortedPosts = posts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  )

  return <TopCards posts={sortedPosts.slice(0, 14)} lang={lang} />
}
