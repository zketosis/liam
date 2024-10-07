import type { Lang } from '@/features/i18n'
import { allPosts } from 'contentlayer/generated'

export function filterPostsByLang(lang: Lang) {
  return allPosts.filter((p) => p.lang === lang)
}
