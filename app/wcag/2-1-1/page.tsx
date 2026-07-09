import { Metadata } from 'next'
import { BreadcrumbStructuredData } from '@/components/seo/structured-data'
import WCAGSEOEnhancements from '@/components/wcag/seo-enhancements'
import WCAG211ClientPage from './client-page'
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: 'WCAG 2.1.1 Keyboard (Level A) - Interactive Demo',
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
  authors: [{ name: 'Accessibility.build Team' }],
  creator: 'Accessibility.build',
  publisher: 'Accessibility.build',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://accessibility.build/wcag/2-1-1',
  },
  openGraph: {
    title: 'WCAG 2.1.1 Keyboard (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.1 Keyboard with interactive navigation demos and implementation guidance.',
    url: '/wcag/2-1-1',
    siteName: 'Accessibility.build',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/api/og?title=WCAG%202.1.1%20Keyboard&section=WCAG',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.1.1 Keyboard (Level A) - Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.1.1 Keyboard (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.1 Keyboard with interactive navigation demos and implementation guidance.',
    images: ['/api/og?title=WCAG%202.1.1%20Keyboard&section=WCAG'],
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
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.1.1: Keyboard"
        description="All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes."
        criteria="2.1.1"
        level="A"
        principle="Operable"
        guideline="2.1 Keyboard Accessible"
        url="https://accessibility.build/wcag/2-1-1"
        category="Keyboard Accessible"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: 'Home', url: 'https://accessibility.build' },
          { name: 'WCAG Success Criteria', url: 'https://accessibility.build/wcag' },
          { name: '2.1.1 Keyboard', url: 'https://accessibility.build/wcag/2-1-1' },
        ]}
      />
      <WCAG211ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="2.1.1" />
      </div>
    </>
  )
}
