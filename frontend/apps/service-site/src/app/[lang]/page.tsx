import { langSchema, langs } from '@/features/i18n'
import { TopPage } from '@/features/top'
import { object, parse } from 'valibot'
import type { PageProps } from '../types'

export const generateStaticParams = async () => {
  return langs.map((lang) => ({ lang }))
}

const paramsSchema = object({
  lang: langSchema,
})

export default function Page({ params }: PageProps) {
  const { lang } = parse(paramsSchema, params)

  return <TopPage lang={lang} />
}
