'use client'

import { Button } from '@liam-hq/ui'
import type React from 'react'
import { useState } from 'react'
import styles from './ResolveButton.module.css'

interface ResolveButtonProps {
  issueId: number
  isResolved: boolean
  onResolve: () => void
}

export const ResolveButton: React.FC<ResolveButtonProps> = ({
  issueId,
  isResolved,
  onResolve,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleResolve = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/review-issues/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to resolve issue')
      }

      onResolve()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error resolving issue:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}
      <Button
        size="sm"
        variant={isResolved ? 'outline-secondary' : 'solid-primary'}
        onClick={handleResolve}
        disabled={isLoading || isResolved}
      >
        {isLoading ? 'Resolving...' : isResolved ? 'Resolved' : 'Resolve'}
      </Button>
    </div>
  )
}
