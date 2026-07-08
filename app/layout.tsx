import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const mono  = JetBrains_Mono({ variable: '--font-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title:       { default: 'DevPulse', template: '%s | DevPulse' },
  description: 'GitHub activity dashboard for developers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} antialiased`}>
          <Navbar />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {children}
          </main>
      </body>
    </html>
  )
}