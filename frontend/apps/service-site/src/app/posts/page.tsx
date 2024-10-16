import { fallbackLang } from '@/features/i18n'
import { PostListPage, allPosts } from '@/features/posts'

export const revalidate = 60

export default function Page() {
  const posts = allPosts(fallbackLang)

  return <PostListPage posts={posts} />
}
