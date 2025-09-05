// src\app\layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'World\'s Biggest Married Couple Photo Wall',
  description: 'Join 10,000+ couples celebrating love around the world. Add your wedding photo to our massive heart-shaped grid!',
  keywords: 'wedding photos, couples, love, photo wall, marriage celebration',
  openGraph: {
    title: 'World\'s Biggest Married Couple Photo Wall',
    description: 'Join 10,000+ couples celebrating love around the world',
    type: 'website',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World\'s Biggest Married Couple Photo Wall',
    description: 'Join 10,000+ couples celebrating love around the world',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ec4899',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}

