import type { Lang } from '@/i18n'
import type { Post } from 'contentlayer/generated'
import Image from 'next/image'
import Link from 'next/link'
import styles from './TopCards.module.css'
interface TopCardsProps {
  posts: Post[]
  lang?: Lang
}

export function TopCards({ posts, lang }: TopCardsProps) {
  return (
    <div className={styles.topCards}>
      {posts.map((post) => (
        <Link
          href={lang ? `/${lang}/posts/${post.slug}` : `/posts/${post.slug}`}
          key={post.slug}
        >
          <div className={styles.topCard}>
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
              <p className={styles.writer}>Text by {post.writer}</p>
              <div className={styles.introduction}>{post.introduction}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
