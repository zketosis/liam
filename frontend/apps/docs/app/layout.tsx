import { Banner } from '@/components'
import './global.css'
import { RootProvider } from 'fumadocs-ui/provider'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'

const inter = Inter({
  subsets: ['latin'],
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            options: {
              api: '/docs/api/search',
            },
          }}
        >
          {/* TODO: set a link to the Release Blog */}
          <Banner id="banner-dark" variant="dark" link="/">
            {"We're launched Liam ERD!"}
          </Banner>
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
