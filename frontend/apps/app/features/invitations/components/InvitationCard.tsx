'use client'

import { acceptInvitation } from '@/features/invitations/actions'
import { LiamLogoMark } from '@/logos'
import { Button } from '@liam-hq/ui'
import { useState } from 'react'
import styles from './InvitationCard.module.css'

interface InvitationCardProps {
  organizationName: string | null
  token: string
  currentUser: {
    id: string
    email: string | undefined
  }
}

export function InvitationCard({
  organizationName,
  token,
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
          {organizationName && (
            <>
              <div className={styles.logo}>
                <LiamLogoMark />
              </div>

              <h1 className={styles.greeting}>
                [temp components] Hi, {currentUser.email}!
              </h1>

              <p className={styles.description}>
                You've been invited to join {organizationName} organization on
                Liam Migration.
                <br />
                <br />
                Please accept the invitation below to join.
              </p>
            </>
          )}
        </div>

        <div className={styles.actions}>
          {organizationName && (
            <form action={handleAccept}>
              <input type="hidden" name="token" value={token} />

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
          )}

          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  )
}
