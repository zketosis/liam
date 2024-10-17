import type { Lang } from '@/features/i18n'
import {
  type Post,
  // eslint-disable-next-line no-restricted-imports
  allPosts as allPostsByContentlayer,
} from 'contentlayer/generated'
import { compareDesc, isBefore, parseISO } from 'date-fns'

function sortPostsByDate(posts: Post[]) {
  return posts.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)),
  )
}

export function allPosts(lang: Lang) {
  const currentDate = new Date()

  const posts = allPostsByContentlayer.filter((p) => p.lang === lang)
  const filteredPosts = posts.filter((post) =>
    isBefore(parseISO(post.publishedAt), currentDate),
  )

  return sortPostsByDate(filteredPosts)
}
