import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Footer, Header } from '@/components'
import type { Lang } from '@/i18n'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Liam',
  description: 'Liam blog',
}

export default function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: ReactNode
  params: {
    lang: Lang
  }
}>) {
  return (
    <html lang={lang}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
