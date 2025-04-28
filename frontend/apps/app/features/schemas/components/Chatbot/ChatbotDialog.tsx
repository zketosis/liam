'use client'

import {
  ModalContent,
  ModalOverlay,
  ModalPortal,
  ModalRoot,
  ModalTitle,
} from '@liam-hq/ui'
import type { FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { SchemaData } from '../../../../app/api/chat/route'
import { ChatInput } from './ChatInput'
import { ChatMessage, type ChatMessageProps } from './ChatMessage'
import styles from './ChatbotDialog.module.css'

interface ChatbotDialogProps {
  isOpen: boolean
  onClose: () => void
  schemaData: SchemaData
}

export const ChatbotDialog: FC<ChatbotDialogProps> = ({
  isOpen,
  onClose,
  schemaData,
}) => {
  const [messages, setMessages] = useState<
    (ChatMessageProps & { id: string })[]
  >([
    {
      id: 'welcome',
      content:
        'Hello! Feel free to ask questions about your schema or consult about database design.',
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      content,
      isUser: true,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Format chat history for API
      const history = messages
        .filter((msg) => msg.id !== 'welcome')
        .map((msg) => [msg.isUser ? 'Human' : 'AI', msg.content])

      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          schemaData,
          history,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          content: data.response.text,
          isUser: false,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error('Error sending message:', error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content: 'Sorry, an error occurred. Please try again.',
          isUser: false,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ModalRoot open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalPortal>
        <ModalOverlay />
        <ModalContent className={styles.dialog}>
          <ModalTitle>Schema Chatbot</ModalTitle>
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && (
              <div className={styles.loadingIndicator}>
                <div className={styles.loadingDot} />
                <div className={styles.loadingDot} />
                <div className={styles.loadingDot} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </ModalContent>
      </ModalPortal>
    </ModalRoot>
  )
}
