import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Digital Library - کتابخانه دیجیتال',
  description: 'Modern digital library management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className={outfit.variable}>
      <body className="font-display antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

