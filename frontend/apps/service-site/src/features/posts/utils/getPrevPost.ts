import type { Lang } from '@/features/i18n'
import type { Post } from 'contentlayer/generated'
import { allPosts } from './allPosts'

type Params = {
  lang: Lang
  targetPost: Post
}

export function getPrevPost({ lang, targetPost }: Params) {
  const posts = allPosts(lang)

  const targetIndex = posts.findIndex((post) => post._id === targetPost._id)

  if (targetIndex === -1 || targetIndex === 0) {
    return undefined
  }

  return posts[targetIndex - 1]
}
