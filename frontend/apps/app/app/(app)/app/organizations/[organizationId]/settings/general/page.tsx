import type { PageProps } from '@/app/types'
import { notFound } from 'next/navigation'
import * as v from 'valibot'
import { GeneralPage } from './GeneralPage'

// Define schema for validation
const paramsSchema = v.object({
  organizationId: v.string('Organization ID must be a string'),
})

export default async function Page({ params, searchParams }: PageProps) {
  // Validate and parse params
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()

  const { organizationId } = parsedParams.output

  // Await searchParams before passing to component
  const awaitedSearchParams = await searchParams

  return (
    <GeneralPage
      organizationId={organizationId}
      searchParams={awaitedSearchParams}
    />
  )
}
