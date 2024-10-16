import type { Lang } from '@/features/i18n'
import type { Post } from 'contentlayer/generated'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { FC } from 'react'
import { createPostDetailLink } from '../../utils'
import styles from './NavNextPost.module.css'

type Props = {
  lang?: Lang | undefined
  post: Post
}

export const NavNextPost: FC<Props> = ({ lang, post }) => {
  return (
    <Link
      href={createPostDetailLink({ lang, slug: post.slug })}
      className={styles.wrapper}
    >
      <span className={styles.label}>Next</span>
      <div className={styles.titleWrapper}>
        <span className={styles.title}>{post.title}</span>
        <ChevronRight className={styles.icon} />
      </div>
    </Link>
  )
}
