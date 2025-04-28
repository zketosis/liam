'use client'

import type { FC } from 'react'
import styles from './ChatMessage.module.css'

export interface ChatMessageProps {
  content: string
  isUser: boolean
  timestamp?: Date
}

export const ChatMessage: FC<ChatMessageProps> = ({
  content,
  isUser,
  timestamp = new Date(),
}) => {
  const formattedTime = timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`${styles.messageContainer} ${
        isUser ? styles.userMessage : styles.botMessage
      }`}
    >
      <div className={styles.messageContent}>
        <div className={styles.messageText}>{content}</div>
        <div className={styles.messageTime}>{formattedTime}</div>
      </div>
    </div>
  )
}
