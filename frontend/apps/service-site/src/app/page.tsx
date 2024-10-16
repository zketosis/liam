import { fallbackLang } from '@/features/i18n'
import { allPosts } from '@/features/posts'
import { TopPage } from '@/features/top'

export const revalidate = 60

export default function Page() {
  const posts = allPosts(fallbackLang)

  return <TopPage posts={posts} />
}
