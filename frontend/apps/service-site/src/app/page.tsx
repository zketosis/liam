import { fallbackLang } from '@/features/i18n'
import { TopPage } from '@/features/top'

export default function Page() {
  return <TopPage lang={fallbackLang} />
}
