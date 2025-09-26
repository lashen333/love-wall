// src\app\layout.tsx
import type { Metadata,Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const viewport: Viewport = {
  width:'device-width',
  initialScale:1,
  viewportFit:'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: 'World\'s Biggest Married Couple Photo Wall',
    template: '%s | Wedding Photo Wall',
  },

  description: 'Join 1,000,000+ couples celebrating love around the world. Add your wedding photo to our massive heart-shaped grid!',
  keywords: 'wedding photos, couples, love, photo wall, marriage celebration',

  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico', // Fallback for older browsers
        sizes: '32x32',
        type: 'image/x-icon',
      }
    ],
    apple: '/og-image.png', // Optional: for iOS devices
  },
  openGraph: {
    title: 'World\'s Biggest Married Couple Photo Wall',
  description: 'Join 1,000,000+ couples celebrating love around the world',
    type: 'website',
    url:'/',
    images: [
      {
        url:'/og-image.png',
        width: 1200,
        height: 630,
        alt: 'World\'s Biggest Married Couple Photo Wall',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'World\'s Biggest Married Couple Photo Wall',
  description: 'Join 1,000,000+ couples celebrating love around the world',
    images: ['/og-image.png'],
  },
  alternates:{canonical: '/'},
  robots:{index:true,follow:true},
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

