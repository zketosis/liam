'use client'

import type React from 'react'
import { useState } from 'react'
import styles from './CopyButton.module.css'

// Define the CSS module types
type Styles = {
  copyButton: string
  icon: string
  text: string
}

// Cast the imported styles to the defined type
const typedStyles = styles as Styles

interface CopyButtonProps {
  text: string
  className?: string
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text, className }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${typedStyles.copyButton} ${className || ''}`}
      aria-label="Copy to clipboard"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <span className={typedStyles.icon}>✓</span>
          <span className={typedStyles.text}>Copied!</span>
        </>
      ) : (
        <>
          <span className={typedStyles.icon}>📋</span>
          <span className={typedStyles.text}>Copy</span>
        </>
      )}
    </button>
  )
}
