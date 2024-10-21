import type { ComponentProps, FC, PropsWithChildren } from 'react'
import styles from './CodeBlock.module.css'

type Props = PropsWithChildren & ComponentProps<'code'>

export const CodeBlock: FC<Props> = ({ children, ...props }) => {
  return (
    <figure {...props} className={styles.wrapper}>
      {children}
    </figure>
  )
}
