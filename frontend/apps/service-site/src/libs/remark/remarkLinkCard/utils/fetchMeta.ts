import type { MetaData } from 'metadata-scraper'
import getMetaData from 'metadata-scraper'

export const fetchMeta = async (url: string): Promise<MetaData | null> => {
  return await getMetaData(url)
    .then((meta) => {
      return {
        url,
        title: meta.title ?? '',
        image: meta.image ?? '',
      }
    })
    .catch(() => {
      return null
    })
}
