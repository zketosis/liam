import { TopCards } from '@/components'
import { type Lang, fallbackLang } from '@/features/i18n'
import { filterPostsByLang, sortPostsByDate } from '@/features/posts'
import type { FC } from 'react'

type Props = {
  lang?: Lang
}

export const TopPage: FC<Props> = ({ lang }) => {
  const posts = filterPostsByLang(lang ?? fallbackLang)
  const sortedPosts = sortPostsByDate(posts)

  return <TopCards lang={lang} posts={sortedPosts.slice(0, 14)} />
}
