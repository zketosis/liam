import { baseOptions } from '@/app/layout.config'
import { HomeLayout } from 'fumadocs-ui/layouts/home'
import type { ReactElement, ReactNode } from 'react'

export default function Layout({
  children,
}: {
  children: ReactNode
}): ReactElement {
  return <HomeLayout {...baseOptions}>{children}</HomeLayout>
}
