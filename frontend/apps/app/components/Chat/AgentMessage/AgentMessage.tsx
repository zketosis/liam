'use client'

import { syntaxCodeTagProps, syntaxCustomStyle } from '@liam-hq/ui'
import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import remarkGfm from 'remark-gfm'
import { AskAgent } from '../AgentAvatar/AskAgent'
import { BuildAgent } from '../AgentAvatar/BuildAgent'
import styles from './AgentMessage.module.css'

export type AgentType = 'ask' | 'build'
type AgentMessageState = 'default' | 'generating'

// Define CodeProps interface for markdown code blocks
type CodeProps = ComponentPropsWithoutRef<'code'> & {
  node?: unknown
  inline?: boolean
  className?: string
  children?: ReactNode
}

// Use an empty object for the style prop to avoid type errors
const emptyStyle = {}

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
              <span className={styles.messageText}>
                {typeof message === 'string' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code(props: CodeProps) {
                        const { children, className, ...rest } = props
                        const match = /language-(\w+)/.exec(className || '')
                        const isInline = !match && !className

                        return !isInline && match ? (
                          <SyntaxHighlighter
                            style={emptyStyle}
                            language={match[1]}
                            PreTag="div"
                            customStyle={syntaxCustomStyle}
                            codeTagProps={syntaxCodeTagProps}
                            {...rest}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...rest}>
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {message}
                  </ReactMarkdown>
                ) : (
                  message
                )}
              </span>
              {time && <span className={styles.messageTime}>{time}</span>}
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
