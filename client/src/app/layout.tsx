'use client'

import { Inter } from 'next/font/google'
import { ClientOnly } from '@/components/client-only'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body className={inter.className}>
        <ClientOnly>
          <Providers>{children}</Providers>
        </ClientOnly>
      </body>
    </html>
  )
} 