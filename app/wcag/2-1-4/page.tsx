import { Metadata } from 'next'
import WCAG214ClientPage from './client-page'

export const metadata: Metadata = {
  title: 'WCAG 2.1.4 Character Key Shortcuts (Level A) - Interactive Demo | AccessibilityBuild',
  description: 'Master WCAG 2.1.4 Character Key Shortcuts with interactive demos, shortcut management, and comprehensive implementation examples.',
  keywords: [
    'WCAG 2.1.4',
    'Character Key Shortcuts',
    'Level A',
    'keyboard shortcuts',
    'single key shortcuts',
    'accessibility compliance',
    'web accessibility',
    'WCAG 2.2',
    'key bindings',
    'shortcut management'
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
    canonical: '/wcag/2-1-4',
  },
  openGraph: {
    title: 'WCAG 2.1.4 Character Key Shortcuts (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.4 Character Key Shortcuts with interactive demos and implementation guidance.',
    url: '/wcag/2-1-4',
    siteName: 'AccessibilityBuild',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/images/wcag-2-1-4-og.png',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.1.4 Character Key Shortcuts Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.1.4 Character Key Shortcuts (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.4 Character Key Shortcuts with interactive demos and implementation guidance.',
    images: ['/images/wcag-2-1-4-twitter.png'],
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

export default function WCAG214Page() {
  return <WCAG214ClientPage />
} 