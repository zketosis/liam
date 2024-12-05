import type { FC } from 'react'
import styles from './Comment.module.css'

type Props = {
  comment: string
}

export const Comment: FC<Props> = ({ comment }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.text}>{comment}</p>
    </div>
  )
}
