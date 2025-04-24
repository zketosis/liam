import { InvitationCard } from '@/features/invitations/components/InvitationCard'
import { getInvitationData } from '@/features/invitations/actions'
import type { PageProps } from '@/app/types'
import * as v from 'valibot'
import { notFound } from 'next/navigation'

const paramsSchema = v.object({
  organizationId: v.string(),
})

export default async function Page({ params }: PageProps) {
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()

  const { organizationId } = parsedParams.output
  const { invitation, currentUser } = await getInvitationData(organizationId)

  return <InvitationCard invitation={invitation} currentUser={currentUser} />
}
