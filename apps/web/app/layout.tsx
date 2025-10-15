/**
 * GalaxyCo.ai Root Layout
 * Next.js 14 App Router root layout with Clerk authentication
 * October 15, 2025
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import '@/styles/globals.css'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/providers/theme-provider'

// Configure Inter font
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

// Metadata for SEO
export const metadata: Metadata = {
  title: 'GalaxyCo.ai - Make Multi-Agent AI Useful in Minutes',
  description: 'A platform where users get personalized dashboards with AI agent "Packs" that deliver measurable outcomes from Day 1.',
  keywords: [
    'AI automation',
    'multi-agent AI',
    'business intelligence',
    'lead generation',
    'email outreach',
    'CRM integration',
    'workflow automation'
  ],
  authors: [{ name: 'GalaxyCo.ai' }],
  creator: 'GalaxyCo.ai',
  publisher: 'GalaxyCo.ai',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://galaxyco.ai',
    siteName: 'GalaxyCo.ai',
    title: 'GalaxyCo.ai - Make Multi-Agent AI Useful in Minutes',
    description: 'Transform your business with AI agent automation that delivers real results.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GalaxyCo.ai - AI Automation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GalaxyCo.ai - Make Multi-Agent AI Useful in Minutes',
    description: 'Transform your business with AI agent automation that delivers real results.',
    images: ['/og-image.png'],
    creator: '@galaxyco_ai',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#111827',
          borderRadius: '0.5rem',
        },
        elements: {
          formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white',
          card: 'shadow-lg border-0',
        },
      }}
    >
      <html lang="en" className={cn(inter.variable)} suppressHydrationWarning>
        <body className={cn(
          'min-h-screen bg-background font-sans antialiased',
          'selection:bg-primary-100 selection:text-primary-900'
        )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Skip to main content for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-primary-600 text-white px-4 py-2 rounded-md"
            >
              Skip to main content
            </a>
            
            {/* Main App Content */}
            <div id="main-content">
              {children}
            </div>
            
            {/* Toast Notifications Container */}
            <div id="toast-container" className="fixed top-0 right-0 z-[200] p-4" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}