import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Noto_Sans_JP } from 'next/font/google'

const notoSansJP = Noto_Sans_JP({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GIF Creator',
  description: '簡単にGIFを作成できるアプリケーション',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${notoSansJP.className} ${inter.className}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}