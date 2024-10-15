import { Badge } from '@/components/Badge'
import type { PropsWithChildren } from 'react'
import { LinkHeading } from '../LinkHeading'
import styles from './PostCategories.module.css'

type Props = PropsWithChildren<{
  href?: string | undefined
  categories: Array<{ name: string }>
}>

export const PostCategories = ({ href = '/', categories }: Props) => {
  return (
    <div>
      {/* FIXME: Add href props after implementing categories single page */}
      <LinkHeading href={href}>Categories</LinkHeading>
      <ul className={styles.list}>
        {categories?.map((category) => (
          <li key={category.name}>
            <Badge type="default">{category.name}</Badge>
          </li>
        ))}
      </ul>
    </div>
  )
}
