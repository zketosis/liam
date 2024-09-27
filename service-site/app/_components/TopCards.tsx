import { Post } from "@/.contentlayer/generated";
import Link from "next/link";
import styles from "./TopCards.module.css";
interface TopCardsProps {
  posts: Post[];
}

export function TopCards({ posts }: TopCardsProps) {
  return (
    <div className={styles.topCards}>
      {posts.map((post) => (
        <Link href={post.href} key={post.href}>
          <div className={styles.topCard}>
            {post.image && (
              <div className={styles.imageContainer}>
                <img
                  src={post.image}
                  alt={`Image of ${post.title}`}
                  width={300}
                  height={200}
                  className={styles.image}
                />
              </div>
            )}
            <div className={styles.textContainer}>
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>( {tag} )</span>
                ))}
              </div>
              <h2 className={styles.title}>
                {post.title}
              </h2>
              <p className={styles.writer}>
                Text by {post.writer}
              </p>
              <div className={styles.introduction}>
                {post.introduction}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
