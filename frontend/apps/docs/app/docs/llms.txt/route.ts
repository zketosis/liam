import fs from 'node:fs'
import path from 'node:path'
import { NextResponse } from 'next/server'

// This is a static route, so it will be rendered at build time
export const dynamic = 'force-static'

interface MDXFile {
  title: string
  url: string
  description?: string
}

interface Frontmatter {
  title: string
  description?: string
}

const extractFrontmatter = (content: string): Frontmatter | null => {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) return null

  const frontmatter = frontmatterMatch[1]
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m)
  const descriptionMatch = frontmatter.match(/^description:\s*(.+)$/m)

  if (!titleMatch) return null

  return {
    title: titleMatch[1],
    description: descriptionMatch?.[1],
  }
}

const getContents = (dirPath: string): MDXFile[] => {
  const results: MDXFile[] = []
  const list = fs.readdirSync(dirPath)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002'

  for (const file of list) {
    const filePath = path.resolve(dirPath, file)
    const stat = fs.statSync(filePath)

    if (stat?.isDirectory()) {
      results.push(...getContents(filePath))
    } else if (file.endsWith('.mdx')) {
      const content = fs.readFileSync(filePath, 'utf8')
      const frontmatter = extractFrontmatter(content)

      if (!frontmatter) {
        continue
      }

      const relativePath = path.relative(
        path.resolve(process.cwd(), 'content/docs'),
        filePath,
      )
      const url = `${baseUrl}/docs/${relativePath.replace('.mdx', '').replace(/\/index$/, '')}`

      results.push({
        title: frontmatter.title,
        url,
        ...(frontmatter.description && {
          description: frontmatter.description,
        }),
      })
    }
  }

  return results
}

export function GET() {
  const contents = getContents(path.resolve(process.cwd(), 'content/docs'))

  const llmsText = `
# Liam ERD

## Docs

${contents
  .map((file) => {
    const base = `- [${file.title}](${file.url})`
    return file.description ? `${base}: ${file.description}` : base
  })
  .join('\n')}

## Optional

- [Website](https://liambx.com/)
- [Open Source](https://github.com/liam-hq/liam)
`

  return new NextResponse(llmsText, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
