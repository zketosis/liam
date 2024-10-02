import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Footer, Header } from '@/components'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Liam',
  description: 'Liam blog',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
