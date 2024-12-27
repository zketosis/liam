// biome-ignore lint/correctness/noNodejsModules: This file is used to generate the sitemap and is executed on the server-side only, requiring Node.js modules.
import fs from 'node:fs'
// biome-ignore lint/correctness/noNodejsModules: This file is used to generate the sitemap and is executed on the server-side only, requiring Node.js modules.
import path from 'node:path'
import { source } from '@/lib/source'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source.getPages()
  const allPaths = pages.map((page) => page.url)

  return allPaths.map((path) => ({
    url: `https://liam-docs-sigma.vercel.app${path}`,
    lastModified: new Date().toISOString(),
  }))
}
