import { Metadata } from 'next'
import WCAG222ClientPage from './client-page'

export const metadata: Metadata = {
  title: 'WCAG 2.2.2 Pause, Stop, Hide (Level A) - Interactive Demo | AccessibilityBuild',
  description: 'Master WCAG 2.2.2 Pause, Stop, Hide with interactive auto-playing content controls and comprehensive implementation examples.',
  keywords: [
    'WCAG 2.2.2',
    'Pause Stop Hide',
    'Level A',
    'auto-playing content',
    'moving content',
    'accessibility compliance',
    'web accessibility',
    'WCAG 2.2',
    'content control',
    'animation control'
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
    canonical: '/wcag/2-2-2',
  },
  openGraph: {
    title: 'WCAG 2.2.2 Pause, Stop, Hide (Level A) - Interactive Demo',
    description: 'Master WCAG 2.2.2 Pause, Stop, Hide with interactive content controls and implementation guidance.',
    url: '/wcag/2-2-2',
    siteName: 'AccessibilityBuild',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/images/wcag-2-2-2-og.png',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.2.2 Pause, Stop, Hide Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.2.2 Pause, Stop, Hide (Level A) - Interactive Demo',
    description: 'Master WCAG 2.2.2 Pause, Stop, Hide with interactive content controls and implementation guidance.',
    images: ['/images/wcag-2-2-2-twitter.png'],
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

export default function WCAG222Page() {
  return <WCAG222ClientPage />
} 