import type { Post } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'

export function sortPostsByDate(posts: Post[]) {
  return posts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
}
