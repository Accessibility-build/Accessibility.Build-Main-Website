import { Metadata } from 'next'
import WCAG142ClientPage from './client-page'

export const metadata: Metadata = {
  title: 'WCAG 1.4.2 Audio Control (Level A) - Interactive Demo | AccessibilityBuild',
  description: 'Learn WCAG 1.4.2 Audio Control requirements with interactive audio controls, auto-play demonstrations, and real-world implementation examples.',
  keywords: [
    'WCAG 1.4.2',
    'Audio Control',
    'Level A',
    'auto-play audio',
    'audio controls',
    'accessibility compliance',
    'web accessibility',
    'WCAG 2.2',
    'audio pause',
    'volume control'
  ],
  authors: [{ name: 'AccessibilityBuild Team' }],
  creator: 'AccessibilityBuild',
  publisher: 'AccessibilityBuild',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://accessibility.build'),
  alternates: {
    canonical: 'https://accessibility.build/wcag/1-4-2',
  },
  openGraph: {
    title: 'WCAG 1.4.2 Audio Control (Level A) - Interactive Demo',
    description: 'Master WCAG 1.4.2 Audio Control with interactive examples, auto-play demonstrations, and implementation guidance.',
    url: '/wcag/1-4-2',
    siteName: 'AccessibilityBuild',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/images/wcag-1-4-2-og.png',
        width: 1200,
        height: 630,
        alt: 'WCAG 1.4.2 Audio Control Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 1.4.2 Audio Control (Level A) - Interactive Demo',
    description: 'Master WCAG 1.4.2 Audio Control with interactive examples and implementation guidance.',
    images: ['/images/wcag-1-4-2-twitter.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function WCAG142Page() {
  return <WCAG142ClientPage />
} 