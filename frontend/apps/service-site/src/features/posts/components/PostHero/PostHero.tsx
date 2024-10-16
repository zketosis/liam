import type { Lang } from '@/features/i18n'
import type { Post } from 'contentlayer/generated'
import { format, parseISO } from 'date-fns'
import Image from 'next/image'
import type { FC } from 'react'
import { ShareDropdownMenu } from '../ShareDropdownMenu'
import styles from './PostHero.module.css'

type Props = {
  lang: Lang
  post: Post
}

export const PostHero: FC<Props> = ({ post, lang }) => {
  return (
    <div className={styles.postHero}>
      {post.image && (
        <div className={styles.imageContainer}>
          <Image
            src={post.image}
            alt={`Image of ${post.title}`}
            width={300}
            height={200}
            className={styles.image}
            quality={100}
          />
        </div>
      )}
      <div className={styles.textContainer}>
        <div className={styles.tags}>
          {post.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              ( {tag} )
            </span>
          ))}
        </div>
        <h2 className={styles.title}>{post.title}</h2>
        <div className={styles.writerAndDate}>
          <p className={styles.writer}>
            <span className={styles.writerText}>Text by</span> {post.writer}
            {/* FIXME: After the writer single page is implemented, replace this with a link */}
          </p>
          <div className={styles.dateAndShare}>
            <p className={styles.dateAndShareText}>
              <span className={styles.dateText}>Published</span>
              <time dateTime={post.publishedAt} className={styles.date}>
                {format(parseISO(post.publishedAt), 'MMM d, yyyy')}
              </time>
            </p>
            <ShareDropdownMenu lang={lang} />
          </div>
        </div>
        <div className={styles.introduction}>{post.introduction}</div>
      </div>
    </div>
  )
}
