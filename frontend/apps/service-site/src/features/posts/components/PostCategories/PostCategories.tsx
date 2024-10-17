import { Badge } from '@/components/Badge'
import type { PropsWithChildren } from 'react'
import styles from './PostCategories.module.css'

type Props = PropsWithChildren<{
  href?: string | undefined
  categories: Array<{ name: string }>
}>

export const PostCategories = ({ categories }: Props) => {
  return (
    <div>
      {/* FIXME: Add href props after implementing categories single page */}
      <p className={styles.title}>Categories</p>
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
