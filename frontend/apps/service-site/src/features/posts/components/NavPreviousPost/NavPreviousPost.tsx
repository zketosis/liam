import type { Post } from 'contentlayer/generated'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import type { FC } from 'react'
import styles from './NavPreviousPost.module.css'

type Props = {
  post: Post
}

export const NavPreviousPost: FC<Props> = ({ post }) => {
  return (
    <Link href="/" className={styles.wrapper}>
      <span className={styles.label}>Previous</span>
      <div className={styles.titleWrapper}>
        <ChevronLeft className={styles.icon} />
        <span className={styles.title}>{post.title}</span>
      </div>
    </Link>
  )
}
