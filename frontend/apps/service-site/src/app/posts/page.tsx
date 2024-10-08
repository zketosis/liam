import { fallbackLang } from '@/features/i18n'
import { PostListPage } from '@/features/posts'

export default function Page() {
  return <PostListPage lang={fallbackLang} />
}
