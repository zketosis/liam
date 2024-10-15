import type { Post } from 'contentlayer/generated'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { FC } from 'react'
import styles from './NavNextPost.module.css'

type Props = {
  post: Post
}

export const NavNextPost: FC<Props> = ({ post }) => {
  return (
    <Link href="/" className={styles.wrapper}>
      <span className={styles.label}>Next</span>
      <div className={styles.titleWrapper}>
        <span className={styles.title}>{post.title}</span>
        <ChevronRight className={styles.icon} />
      </div>
    </Link>
  )
}
