import type { Lang } from '@/features/i18n'
import type { Post } from 'contentlayer/generated'
import { filterPostsByLang } from './filterPostsByLang'
import { sortPostsByDate } from './sortPostsByDate'

type Params = {
  lang: Lang
  targetPost: Post
}

export function getNextPost({ lang, targetPost }: Params) {
  const posts = filterPostsByLang(lang)
  const sortedPosts = sortPostsByDate(posts)

  const targetIndex = sortedPosts.findIndex(
    (post) => post._id === targetPost._id,
  )

  if (targetIndex === -1 || targetIndex === sortedPosts.length - 1) {
    return undefined
  }

  return sortedPosts[targetIndex + 1]
}
