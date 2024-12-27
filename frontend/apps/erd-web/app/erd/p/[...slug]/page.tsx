// biome-ignore lint/correctness/noNodejsModules: Required for the server component to read the wasm file
import path from 'node:path'
import type { PageProps } from '@/app/types'
import {
  detectFormat,
  parse,
  setPrismWasmUrl,
} from '@liam-hq/db-structure/parser'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import * as v from 'valibot'
import ERDViewer from './erdViewer'

const paramsSchema = v.object({
  slug: v.array(v.string()),
})

export default async function Page({ params }: PageProps) {
  const parsed = v.safeParse(paramsSchema, await params)
  if (!parsed.success) {
    notFound()
  }

  const joinedPath = parsed.output.slug.join('/')
  if (!joinedPath) {
    notFound()
  }

  const contentUrl = `https://${joinedPath}`

  const res = await fetch(contentUrl, { cache: 'no-store' })
  if (!res.ok) {
    notFound()
  }

  const input = await res.text()

  setPrismWasmUrl(path.resolve(process.cwd(), 'prism.wasm'))

  const format = detectFormat(contentUrl)
  if (format === undefined) {
    // TODO: Show error message in the UI
    notFound()
  }

  const { value: dbStructure, errors } = await parse(input, format)
  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error)
    }
  }

  const cookieStore = await cookies()
  const defaultSidebarOpen = cookieStore.get('sidebar:state')?.value === 'true'

  return (
    <ERDViewer
      dbStructure={dbStructure}
      defaultSidebarOpen={defaultSidebarOpen}
    />
  )
}
