'use client'

import React, { useState } from 'react'
import { getLangfuseWeb, generateTraceId } from '../lib/langfuseWeb'
import styles from './UserFeedbackComponent.module.css'

type UserFeedbackComponentProps = {
  entityType: string
  entityId: string | number
}

export const UserFeedbackComponent = ({ entityType, entityId }: UserFeedbackComponentProps) => {
  const [feedback, setFeedback] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUserFeedback = async (value: number) => {
    try {
      setIsSubmitting(true)
      const langfuseWeb = getLangfuseWeb()
      if (!langfuseWeb) return

      const traceId = generateTraceId(entityType, entityId)
      await langfuseWeb.score({
        traceId,
        name: 'user_feedback',
        value,
      })
      setFeedback(value)
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.feedbackContainer}>
      <span className={styles.feedbackLabel}>Was this helpful?</span>
      <div className={styles.buttonContainer}>
        <button
          onClick={() => handleUserFeedback(1)}
          className={`${styles.feedbackButton} ${feedback === 1 ? styles.selected : ''}`}
          disabled={isSubmitting || feedback !== null}
          aria-label="Thumbs up"
        >
          👍
        </button>
        <button
          onClick={() => handleUserFeedback(0)}
          className={`${styles.feedbackButton} ${feedback === 0 ? styles.selected : ''}`}
          disabled={isSubmitting || feedback !== null}
          aria-label="Thumbs down"
        >
          👎
        </button>
      </div>
      {feedback !== null && (
        <div className={styles.thankYouMessage}>Thank you for your feedback!</div>
      )}
    </div>
  )
}
