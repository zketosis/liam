'use client'

import { source } from '@/lib/source'
import { findNeighbour } from 'fumadocs-core/server'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { FC } from 'react'
import { tv } from 'tailwind-variants'

export const FooterNavi: FC = () => {
  const pathname = usePathname()
  const neighbours = findNeighbour(source.pageTree, pathname)

  const linkStyle = tv({
    base: 'flex w-full flex-col gap-2 rounded-lg border bg-fd-card p-4 text-sm transition-colors hover:text-fd-primary hover:bg-transparent hover:border-fd-primary',
    variants: {
      direction: {
        previous: '',
        next: 'col-start-2 text-end',
      },
    },
  })

  const itemLabelStyle = tv({
    base: 'inline-flex items-center gap-0.5 text-fd-muted-foreground',
    variants: {
      direction: {
        previous: '',
        next: 'flex-row-reverse',
      },
    },
  })

  return (
    <div className="grid grid-cols-2 gap-4 pb-6">
      {neighbours.previous && (
        <Link href={neighbours.previous.url} className={linkStyle()}>
          <div className={itemLabelStyle()}>
            <ChevronLeft className="-ms-1 size-4 shrink-0 rtl:rotate-180" />
            <p>Previous</p>
          </div>
          <p>{neighbours.previous.name}</p>
        </Link>
      )}
      {neighbours.next && (
        <Link
          href={neighbours.next.url}
          className={linkStyle({ direction: 'next' })}
        >
          <div className={itemLabelStyle({ direction: 'next' })}>
            <ChevronRight className="-me-1 size-4 shrink-0 rtl:rotate-180" />
            <p>Next</p>
          </div>
          <p>{neighbours.next.name}</p>
        </Link>
      )}
    </div>
  )
}
