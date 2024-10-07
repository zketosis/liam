import { useCallback } from 'react'
import { enDictionary, jaDictionary } from '../locales'
import type { Dictionary, Lang } from '../types'

const resources: Record<Lang, Dictionary> = {
  en: enDictionary,
  ja: jaDictionary,
}

export function useTranslation(lang: Lang) {
  const t = useCallback(
    <K extends keyof Dictionary>(key: K): string => {
      const resource = resources[lang]

      return resource[key]
    },
    [lang],
  )

  return {
    t,
  }
}
