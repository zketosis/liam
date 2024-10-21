import { ExternalLink } from 'lucide-react'
import type { FC } from 'react'
import styles from './LinkCard.module.css'

type Props = {
  title: string
  href: string
  image: string
  domain: string
}

export const LinkCard: FC<Props> = ({ title, href, image, domain }) => {
  return (
    <a
      href={href}
      target="_blank"
      className={styles.link}
      rel="noopener noreferrer"
    >
      <div className={styles.textWrapper}>
        <p className={styles.title}>{title}</p>
        <div className={styles.domain}>
          <span>{domain}</span>
          <ExternalLink width="0.75rem" height="0.75rem" />
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className={styles.image} />
    </a>
  )
}
