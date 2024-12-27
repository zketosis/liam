import { source } from '@/lib/source'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages()
  const allPaths = pages.map((page) => page.url)

  return allPaths.map((path) => ({
    url: `${process.env.SERVICE_SITE_URL}${path}`,
    lastModified: new Date().toISOString(),
  }))
}
