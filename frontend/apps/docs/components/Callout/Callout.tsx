'use client'

import { AlertTriangle, Info, XCircle } from '@liam-hq/ui'
import type { FC, PropsWithChildren } from 'react'
import { tv } from 'tailwind-variants'
import { match } from 'ts-pattern'

type Props = PropsWithChildren & {
  type?: 'info' | 'warn' | 'error'
  title: string
}

export const Callout: FC<Props> = ({ type = 'info', title, children }) => {
  const icon = match(type)
    .with('info', () => <Info className="w-5 h-5 text-fd-primary" />)
    .with('warn', () => <AlertTriangle className="w-5 h-5 text-warn" />)
    .with('error', () => <XCircle className="w-5 h-5 text-danger" />)
    .exhaustive()

  const wrapper = tv({
    base: 'my-6 p-4 flex items-start gap-2 rounded-lg border',
    variants: {
      type: {
        info: 'border-fd-primary/20 bg-primary-background',
        warn: 'border-warn/20 bg-warn/10',
        error: 'border-danger/20 bg-danger/10',
      },
    },
  })

  return (
    <div className={wrapper({ type })}>
      {icon}
      <div className="grid gap-2">
        <span className="text-fd-card-foreground text-sm font-medium leading-5">
          {title}
        </span>
        <p className="text-fd-muted-foreground text-sm leading-5 m-0">
          {children}
        </p>
      </div>
    </div>
  )
}
