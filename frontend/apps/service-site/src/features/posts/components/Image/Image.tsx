import type { FC } from 'react'
import styles from './Image.module.css'

type Props = {
  src: string
  alt?: string
}

export const Image: FC<Props> = ({ src, alt }) => {
  return (
    <figure className={styles.figure}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className={styles.image} />
      {alt && <figcaption className={styles.figcaption}>{alt}</figcaption>}
    </figure>
  )
}
