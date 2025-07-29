import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { BottomNav } from '@/components/layout/bottom-nav'
import { PowerSyncProvider } from '@/context/powersync-context'
import { ScoringProvider } from '@/context/scoring-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ScoreMyClays - Clay Shooting Scorer',
  description: 'Offline-first clay pigeon shooting score tracking for Sporting Clays',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['clay shooting', 'sporting clays', 'score tracking', 'offline scoring'],
  authors: [{ name: 'ScoreMyClays Team' }],
  icons: [
    { rel: 'apple-touch-icon', url: '/icons/icon-192.png' },
    { rel: 'icon', url: '/icons/icon-192.png' },
  ],
}

export const viewport: Viewport = {
  minimumScale: 1,
  initialScale: 1,
  width: 'device-width',
  viewportFit: 'cover',
  themeColor: '#2C5530',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-clay-bg antialiased`}>
        <PowerSyncProvider>
          <ScoringProvider>
            <div className="min-h-full pb-20">
              {children}
              <BottomNav />
            </div>
          </ScoringProvider>
        </PowerSyncProvider>
      </body>
    </html>
  )
}