import type { PageProps } from '@/app/types'
import { getInvitationData } from '@/features/invitations/actions'
import { InvitationCard } from '@/features/invitations/components/InvitationCard'
import { notFound } from 'next/navigation'
import * as v from 'valibot'

const paramsSchema = v.object({
  token: v.string(),
})

export default async function Page({ params }: PageProps) {
  const parsedParams = v.safeParse(paramsSchema, await params)
  if (!parsedParams.success) return notFound()

  const { token } = parsedParams.output
  const { organizationName, currentUser } = await getInvitationData(token)

  return (
    <InvitationCard
      token={token}
      organizationName={organizationName}
      currentUser={currentUser}
    />
  )
}
