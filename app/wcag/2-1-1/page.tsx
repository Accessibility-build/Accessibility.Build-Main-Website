import { Metadata } from 'next'
import WCAG211ClientPage from './client-page'

export const metadata: Metadata = {
  title: 'WCAG 2.1.1 Keyboard (Level A) - Interactive Demo | AccessibilityBuild',
  description: 'Master WCAG 2.1.1 Keyboard requirements with interactive navigation demos, focus indicators, and comprehensive implementation examples.',
  keywords: [
    'WCAG 2.1.1',
    'Keyboard',
    'Level A',
    'keyboard navigation',
    'focus indicators',
    'accessibility compliance',
    'web accessibility',
    'WCAG 2.2',
    'tab order',
    'keyboard accessibility'
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
    canonical: '/wcag/2-1-1',
  },
  openGraph: {
    title: 'WCAG 2.1.1 Keyboard (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.1 Keyboard with interactive navigation demos and implementation guidance.',
    url: '/wcag/2-1-1',
    siteName: 'AccessibilityBuild',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/images/wcag-2-1-1-og.png',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.1.1 Keyboard Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.1.1 Keyboard (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.1 Keyboard with interactive navigation demos and implementation guidance.',
    images: ['/images/wcag-2-1-1-twitter.png'],
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

export default function WCAG211Page() {
  return <WCAG211ClientPage />
} 