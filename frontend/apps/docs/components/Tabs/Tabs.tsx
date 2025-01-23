'use client'

import {
  type TabsProps as FumadocsTabsProps,
  Primitive,
  // biome-ignore lint/nursery/noRestrictedImports: Make original Tabs/Tab component
} from 'fumadocs-ui/components/tabs'
import type { ComponentProps, PropsWithChildren } from 'react'
import { CopyButton } from '../CopyButton'

type TabsProps = PropsWithChildren<FumadocsTabsProps>

export const Tabs = ({ children, ...props }: TabsProps) => {
  return (
    <Primitive.Tabs {...props} defaultValue={props.items?.[0]}>
      <Primitive.TabsList className="bg-fd-muted">
        {props.items?.map((item) => (
          <Primitive.TabsTrigger key={item} value={item}>
            {item}
          </Primitive.TabsTrigger>
        ))}
      </Primitive.TabsList>
      {children}
    </Primitive.Tabs>
  )
}

type TabProps = PropsWithChildren<
  ComponentProps<typeof Primitive.TabsContent>
> & {
  copyable?: boolean
}

export const Tab = ({ children, copyable, ...props }: TabProps) => {
  return (
    <Primitive.TabsContent {...props} className="relative group">
      {children}
      {copyable && typeof children === 'string' && (
        <CopyButton
          onCopy={() => navigator.clipboard.writeText(children)}
          className="absolute top-3 right-3"
        />
      )}
    </Primitive.TabsContent>
  )
}
