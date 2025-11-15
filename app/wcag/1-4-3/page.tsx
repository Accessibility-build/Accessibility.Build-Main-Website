import { Metadata } from 'next'
import WCAG143ClientPage from './client-page'

export const metadata: Metadata = {
  title: 'WCAG 1.4.3 Contrast (Minimum) (Level AA) - Interactive Demo | AccessibilityBuild',
  description: 'Master WCAG 1.4.3 Contrast (Minimum) with interactive contrast checker, real-time analysis, and comprehensive implementation examples.',
  keywords: [
    'WCAG 1.4.3',
    'Contrast Minimum',
    'Level AA',
    'color contrast',
    'contrast ratio',
    'accessibility compliance',
    'web accessibility',
    'WCAG 2.2',
    'text readability',
    'color accessibility'
  ],
  authors: [{ name: 'AccessibilityBuild Team' }],
  creator: 'AccessibilityBuild',
  publisher: 'AccessibilityBuild',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://accessibilitybuild.com'),
  alternates: {
    canonical: '/wcag/1-4-3',
  },
  openGraph: {
    title: 'WCAG 1.4.3 Contrast (Minimum) (Level AA) - Interactive Demo',
    description: 'Master WCAG 1.4.3 Contrast (Minimum) with interactive contrast checker and real-time analysis.',
    url: '/wcag/1-4-3',
    siteName: 'AccessibilityBuild',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/images/wcag-1-4-3-og.png',
        width: 1200,
        height: 630,
        alt: 'WCAG 1.4.3 Contrast (Minimum) Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 1.4.3 Contrast (Minimum) (Level AA) - Interactive Demo',
    description: 'Master WCAG 1.4.3 Contrast (Minimum) with interactive contrast checker and implementation guidance.',
    images: ['/images/wcag-1-4-3-twitter.png'],
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

export default function WCAG143Page() {
  return <WCAG143ClientPage />
} 