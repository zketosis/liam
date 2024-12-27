// biome-ignore lint/correctness/noNodejsModules: This file is used to generate the sitemap and is executed on the server-side only, requiring Node.js modules.
import fs from 'node:fs'
// biome-ignore lint/correctness/noNodejsModules: This file is used to generate the sitemap and is executed on the server-side only, requiring Node.js modules.
import path from 'node:path'
import type { MetadataRoute } from 'next'

const getDocsPaths = (dir: string, basePath = '/docs'): string[] => {
  const docsDir = path.join(process.cwd(), dir)
  const files = fs.readdirSync(docsDir)

  let paths: string[] = []

  for (const file of files) {
    const filePath = path.join(docsDir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      paths = paths.concat(
        getDocsPaths(path.join(dir, file), path.join(basePath, file)),
      )
    } else if (file.endsWith('.mdx')) {
      paths.push(`${basePath}/${file.replace(/\.mdx?$/, '')}`)
    }
  }

  return paths
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['/docs']
  const docPaths = getDocsPaths('../docs/content/docs')

  const allPaths = [...staticPaths, ...docPaths]

  return allPaths.map((path) => ({
    url: `https://liam-docs-sigma.vercel.app${path}`,
    lastModified: new Date().toISOString(),
  }))
}
