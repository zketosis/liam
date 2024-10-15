import { TopCards } from '@/components'
import type { Lang } from '@/features/i18n'
import { filterPostsByLang, sortPostsByDate } from '@/features/posts'
import type { FC } from 'react'

type Props = {
  lang: Lang
}

export const TopPage: FC<Props> = ({ lang }) => {
  const posts = filterPostsByLang(lang)
  const sortedPosts = sortPostsByDate(posts)

  return <TopCards posts={sortedPosts.slice(0, 14)} />
}
