import { TopCards } from '@/components'
import { fallbackLang } from '@/features/i18n'
import { filterPostsByLang } from '@/features/posts'
import { compareDesc } from 'date-fns'

export default function Page() {
  const posts = filterPostsByLang(fallbackLang)
  const sortedPosts = posts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  )

  return <TopCards posts={sortedPosts.slice(0, 14)} />
}
