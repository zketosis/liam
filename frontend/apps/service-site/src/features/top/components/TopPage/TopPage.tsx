import { TopCards } from '@/components'
import type { Lang } from '@/features/i18n'
import { filterPostsByLang } from '@/features/posts'
import { compareDesc } from 'date-fns'
import type { FC } from 'react'

type Props = {
  lang: Lang
}

export const TopPage: FC<Props> = ({ lang }) => {
  const posts = filterPostsByLang(lang)
  const sortedPosts = posts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  )

  return <TopCards posts={sortedPosts.slice(0, 14)} />
}
