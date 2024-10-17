import type { Lang } from '@/features/i18n'
import { createPostDetailLink } from '@/features/posts'
import type { Post } from 'contentlayer/generated'
import Image from 'next/image'
import Link from 'next/link'
import styles from './TopCards.module.css'
interface TopCardsProps {
  posts: Post[]
  lang?: Lang | undefined
}

export function TopCards({ posts, lang }: TopCardsProps) {
  return (
    <div className={styles.topCards}>
      {posts.map((post) => (
        <Link
          href={createPostDetailLink({ lang, slug: post.slug })}
          key={post.slug}
        >
          <div className={styles.topCard}>
            {post.image && (
              <div>
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
                {post.tags.slice(0, 5).map((tag) => (
                  <span key={tag} className={styles.tag}>
                    ( {tag} )
                  </span>
                ))}
              </div>
              <h2 className={styles.title}>{post.title}</h2>
              <p className={styles.writer}>Text by {post.writer}</p>
              <div className={styles.introduction}>{post.introduction}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
