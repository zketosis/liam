import { Badge } from '@/components/Badge'
import type { PropsWithChildren } from 'react'
import { LinkHeading } from '../LinkHeading'
import styles from './PostTags.module.css'

type Props = PropsWithChildren<{
  href?: string | undefined
  tags: Array<{ name: string }>
}>

export const PostTags = ({ href = '/', tags }: Props) => {
  return (
    <div>
      {/* FIXME: Add href props after implementing tags single page */}
      <LinkHeading href={href}>Tags</LinkHeading>
      <ul className={styles.list}>
        {tags?.map((tag) => (
          <li key={tag.name}>
            <Badge type="outline">{tag.name}</Badge>
          </li>
        ))}
      </ul>
    </div>
  )
}
