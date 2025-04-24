'use client'

import { acceptInvitation } from '@/features/invitations/actions'
import { LiamLogoMark } from '@/logos'
import type { Tables } from '@liam-hq/db/supabase/database.types'
import { Button } from '@liam-hq/ui'
import { useState } from 'react'
import styles from './InvitationCard.module.css'

interface InvitationCardProps {
  invitation: Tables<'invitations'> & {
    organizations: { name: string }
  }
  currentUser: {
    id: string
    email: string
  }
}

export function InvitationCard({
  invitation,
  currentUser,
}: InvitationCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAccept = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    // The server action will handle the redirect on success
    const result = await acceptInvitation(formData)

    // If we get a result back, it means there was an error
    // (on success, the action redirects)
    if (result && !result.success) {
      setError(result.error || 'Failed to accept invitation. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <LiamLogoMark />
          </div>

          <h1 className={styles.greeting}>
            [temp components] Hi, {currentUser.email}!
          </h1>

          <p className={styles.description}>
            You've been invited to join {invitation.organizations.name}{' '}
            organization on Liam Migration.
            <br />
            <br />
            Please accept the invitation below to join.
          </p>
        </div>

        <div className={styles.actions}>
          <form action={handleAccept}>
            <input
              type="hidden"
              name="organizationId"
              value={invitation.organization_id}
            />

            <Button
              type="submit"
              className={styles.button}
              disabled={isLoading}
              isLoading={isLoading}
              loadingIndicatorType="content"
            >
              Accept Invite
            </Button>
          </form>

          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  )
}
