'use client'

import type { FC, ReactNode } from 'react'
import { AskAgent } from '../AgentAvatar/AskAgent'
import { BuildAgent } from '../AgentAvatar/BuildAgent'
import styles from './AgentMessage.module.css'

export type AgentType = 'ask' | 'build'
type AgentMessageState = 'default' | 'generating'

type AgentMessageProps = {
  /**
   * The type of agent
   */
  agent: AgentType
  /**
   * The state of the message
   */
  state?: AgentMessageState
  /**
   * The message content (can be text or ReactNode for rich content)
   */
  message?: ReactNode
  /**
   * The timestamp to display
   */
  time?: string
  /**
   * Optional children to render below the message
   */
  children?: ReactNode
}

export const AgentMessage: FC<AgentMessageProps> = ({
  agent,
  state = 'default',
  message = '',
  time = '',
  children,
}) => {
  const isGenerating = state === 'generating'
  const isAsk = agent === 'ask'
  const _isBuild = agent === 'build'

  return (
    <div className={styles.container}>
      <div className={styles.avatarContainer}>
        {isAsk ? <AskAgent /> : <BuildAgent />}
      </div>
      <div className={styles.contentContainer}>
        {isGenerating ? (
          <div
            className={`${styles.messageWrapper} ${
              isAsk ? styles.messageWrapperAsk : styles.messageWrapperBuild
            } ${styles.generatingContainer}`}
          >
            <span className={styles.generatingText}>Generating</span>
          </div>
        ) : (
          <div
            className={`${styles.messageWrapper} ${
              isAsk ? styles.messageWrapperAsk : styles.messageWrapperBuild
            }`}
          >
            <div className={styles.messageContent}>
              <span className={styles.messageText}>{message}</span>
              {time && <span className={styles.messageTime}>{time}</span>}
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
