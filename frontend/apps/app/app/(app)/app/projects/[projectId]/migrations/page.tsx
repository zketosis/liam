import type { PageProps } from '@/app/types'
import { notFound } from 'next/navigation'
import * as v from 'valibot'

// Define schema for validation
const paramsSchema = v.object({
  projectId: v.string('Project ID must be a string'),
})

export default async function Page({ params }: PageProps) {
  // Validate and parse params
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()

  const { projectId } = parsedParams.output

  return (
    <div>
      <h2>Project Migrations</h2>
      <p>This is a placeholder for the project migrations page.</p>
      <p>Project ID: {projectId}</p>
    </div>
  )
}
