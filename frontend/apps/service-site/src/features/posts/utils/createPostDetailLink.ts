import type { Lang } from '@/features/i18n'

type Params = {
  lang: Lang | undefined
  slug: string
}

export function createPostDetailLink({ lang, slug }: Params) {
  if (lang) {
    return `/${lang}/posts/${slug}`
  }

  return `/posts/${slug}`
}
