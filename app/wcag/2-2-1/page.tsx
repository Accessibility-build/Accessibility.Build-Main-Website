import { Metadata } from 'next'
import WCAG221ClientPage from './client-page'

export const metadata: Metadata = {
  title: 'WCAG 2.2.1 Timing Adjustable (Level A) - Interactive Demo | AccessibilityBuild',
  description: 'Master WCAG 2.2.1 Timing Adjustable with interactive timing controls, session extensions, and comprehensive implementation examples.',
  keywords: [
    'WCAG 2.2.1',
    'Timing Adjustable',
    'Level A',
    'time limits',
    'session timeout',
    'accessibility compliance',
    'web accessibility',
    'WCAG 2.2',
    'user control',
    'timing control'
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
    canonical: 'https://accessibility.build/wcag/2-2-1',
  },
  openGraph: {
    title: 'WCAG 2.2.1 Timing Adjustable (Level A) - Interactive Demo',
    description: 'Master WCAG 2.2.1 Timing Adjustable with interactive timing controls and implementation guidance.',
    url: '/wcag/2-2-1',
    siteName: 'AccessibilityBuild',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/images/wcag-2-2-1-og.png',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.2.1 Timing Adjustable Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.2.1 Timing Adjustable (Level A) - Interactive Demo',
    description: 'Master WCAG 2.2.1 Timing Adjustable with interactive timing controls and implementation guidance.',
    images: ['/images/wcag-2-2-1-twitter.png'],
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

export default function WCAG221Page() {
  return <WCAG221ClientPage />
} 