import { enDictionary, jaDictionary } from '../locales'
import type { Dictionary, Lang } from '../types'

const resources: Record<Lang, Dictionary> = {
  en: enDictionary,
  ja: jaDictionary,
}

export function getTranslation(lang: Lang) {
  const t = <K extends keyof Dictionary>(key: K): string => {
    const resource = resources[lang]
    return resource[key]
  }

  return {
    t,
  }
}
