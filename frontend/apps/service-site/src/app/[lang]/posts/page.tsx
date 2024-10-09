import type { PageProps } from '@/app/types'
import { langSchema, langs } from '@/features/i18n'
import { PostListPage } from '@/features/posts'
import { object, parse } from 'valibot'

export const generateStaticParams = async () => {
  return langs.map((lang) => ({ lang }))
}

const paramsSchema = object({
  lang: langSchema,
})

export default function Page({ params }: PageProps) {
  const { lang } = parse(paramsSchema, params)

  return <PostListPage lang={lang} />
}
