'use client'

import { UserMessage } from '@/components/Chat/UserMessage'
import { AgentMessage } from '@/components/Chat/AgentMessage'
import type { AgentType } from '@/components/Chat/AgentMessage'
import type { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './ChatMessage.module.css'

export interface ChatMessageProps {
  content: string
  isUser: boolean
  timestamp?: Date
  avatarSrc?: string
  avatarAlt?: string
  initial?: string
  /**
   * The type of agent to display for bot messages
   * @default 'build'
   */
  agentType?: AgentType
  /**
   * Whether the bot is generating a response
   * @default false
   */
  isGenerating?: boolean
}

export const ChatMessage: FC<ChatMessageProps> = ({
  content,
  isUser,
  timestamp,
  avatarSrc,
  avatarAlt,
  initial,
  agentType = 'build',
  isGenerating = false,
}) => {
  // Only format and display timestamp if it exists
  const formattedTime = timestamp
    ? timestamp.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  // For bot messages, we'll render the markdown content
  const markdownContent = !isUser ? (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  ) : null

  return (
    <div
      className={`${styles.messageContainer} ${
        isUser ? styles.userMessage : styles.botMessage
      }`}
    >
      {isUser ? (
        <UserMessage
          content={content}
          timestamp={timestamp}
          avatarSrc={avatarSrc}
          avatarAlt={avatarAlt}
          initial={initial}
        />
      ) : (
        <div className={styles.messageContent}>
          <div className={styles.messageText}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        <div className={styles.messageContent}>
          <div className={styles.messageText}>{content}</div>
          {formattedTime && (
            <div className={styles.messageTime}>{formattedTime}</div>
          )}
        </div>
      ) : (
        <AgentMessage
          agent={agentType}
          state={isGenerating ? 'generating' : 'default'}
          message={markdownContent}
          time={formattedTime || ''}
        >
          {/* We're not using children for now, but could be used for additional components */}
        </AgentMessage>
      )}
    </div>
  )
}
