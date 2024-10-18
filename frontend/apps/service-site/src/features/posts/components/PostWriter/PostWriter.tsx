import type { Post } from 'contentlayer/generated'
import { format, parseISO } from 'date-fns'
import type { FC } from 'react'
import styles from './PostWriter.module.css'

type Props = {
  post: Post
}

export const PostWriter: FC<Props> = ({ post }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.writer}>
        <span className={styles.writerText}>Text by</span>
        {post.writer}
      </p>
      {post.writerProfile && (
        <p className={styles.writerProfile}>{post.writerProfile}</p>
      )}
      {post.lastEditedAt && (
        <p className={styles.lastEdited}>
          <span>Last edited on</span>
          <time dateTime={post.lastEditedAt}>
            {format(parseISO(post.lastEditedAt), 'MMM d, yyyy')}
          </time>
        </p>
      )}
    </div>
  )
}
