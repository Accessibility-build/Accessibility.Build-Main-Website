import { Metadata } from 'next'
import { BreadcrumbStructuredData } from '@/components/seo/structured-data'
import WCAGSEOEnhancements from '@/components/wcag/seo-enhancements'
import WCAG222ClientPage from './client-page'
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: 'WCAG 2.2.2 Pause, Stop, Hide - Interactive Demo',
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
  authors: [{ name: 'Accessibility.build Team' }],
  creator: 'Accessibility.build',
  publisher: 'Accessibility.build',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://accessibility.build/wcag/2-2-2',
  },
  openGraph: {
    title: 'WCAG 2.2.2 Pause, Stop, Hide (Level A) - Interactive Demo',
    description: 'Master WCAG 2.2.2 Pause, Stop, Hide with interactive content controls and implementation guidance.',
    url: '/wcag/2-2-2',
    siteName: 'Accessibility.build',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/api/og?title=WCAG%202.2.2%20Pause%2C%20Stop%2C%20Hide&section=WCAG',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.2.2 Pause, Stop, Hide (Level A) - Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.2.2 Pause, Stop, Hide (Level A) - Interactive Demo',
    description: 'Master WCAG 2.2.2 Pause, Stop, Hide with interactive content controls and implementation guidance.',
    images: ['/api/og?title=WCAG%202.2.2%20Pause%2C%20Stop%2C%20Hide&section=WCAG'],
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
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.2.2: Pause, Stop, Hide"
        description="For moving, blinking, scrolling, or auto-updating information that starts automatically and lasts more than five seconds, a mechanism is available for the user to pause, stop, or hide it."
        criteria="2.2.2"
        level="A"
        principle="Operable"
        guideline="2.2 Enough Time"
        url="https://accessibility.build/wcag/2-2-2"
        category="Enough Time"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: 'Home', url: 'https://accessibility.build' },
          { name: 'WCAG Success Criteria', url: 'https://accessibility.build/wcag' },
          { name: '2.2.2 Pause, Stop, Hide', url: 'https://accessibility.build/wcag/2-2-2' },
        ]}
      />
      <WCAG222ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="2.2.2" />
      </div>
    </>
  )
}
