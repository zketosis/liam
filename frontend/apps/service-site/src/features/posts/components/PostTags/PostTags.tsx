import { Badge } from '@/components/Badge'
import type { PropsWithChildren } from 'react'
import styles from './PostTags.module.css'

type Props = PropsWithChildren<{
  href?: string | undefined
  tags: Array<{ name: string }>
}>

export const PostTags = ({ tags }: Props) => {
  return (
    <div>
      <p className={styles.title}>Tags</p>
      <ul className={styles.list}>
        {tags.map((tag) => (
          <li key={tag.name}>
            <Badge type="outline">{tag.name}</Badge>
          </li>
        ))}
      </ul>
    </div>
  )
}
