import type { Lang } from '@/features/i18n'
import type { Post } from 'contentlayer/generated'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import type { FC } from 'react'
import { createPostDetailLink } from '../../utils'
import styles from './NavPreviousPost.module.css'

type Props = {
  lang?: Lang | undefined
  post: Post
}

export const NavPreviousPost: FC<Props> = ({ lang, post }) => {
  return (
    <Link
      href={createPostDetailLink({ lang, slug: post.slug })}
      className={styles.wrapper}
    >
      <span className={styles.label}>Previous</span>
      <div className={styles.titleWrapper}>
        <ChevronLeft className={styles.icon} />
        <span className={styles.title}>{post.title}</span>
      </div>
    </Link>
  )
}
