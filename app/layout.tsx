import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Thai } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist'
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
})

const notoSansThai = Noto_Sans_Thai({ 
  subsets: ["thai", "latin"],
  variable: '--font-noto-sans-thai',
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: 'Smart School - ระบบจัดการโรงเรียนอัจฉริยะ',
  description: 'ระบบจัดการโรงเรียนออนไลน์ ตารางเรียน ห้องว่าง หนังสือเรียน และประกาศข่าวสาร',
  generator: 'v0.app',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f4ff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1f35' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} ${notoSansThai.variable} font-sans antialiased bg-background`}>
        {children}
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
