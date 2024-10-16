import type React from 'react'
import type { HTMLAttributes } from 'react'
import styles from './Blockquote.module.css'

type BlockquoteProps = HTMLAttributes<HTMLQuoteElement> & {
  children: React.ReactNode
}

export const Blockquote: React.FC<BlockquoteProps> = ({
  children,
  ...props
}) => {
  return (
    <div className={styles.wrapper}>
      <blockquote {...props} className={styles.blockquote}>
        {children}
      </blockquote>
    </div>
  )
}
