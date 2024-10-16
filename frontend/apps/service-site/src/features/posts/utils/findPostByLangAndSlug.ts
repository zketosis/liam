import type { Lang } from '@/features/i18n'
import { allPosts } from './allPosts'

type Params = {
  slug: string
  lang: Lang
}

export function findPostByLangAndSlug({ slug, lang }: Params) {
  // TODO: 指定された言語の記事がない場合、enの記事を返す
  return allPosts(lang).find((post) => post.slug === slug && post.lang === lang)
}
