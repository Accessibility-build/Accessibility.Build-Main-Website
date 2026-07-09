import { Metadata } from 'next'
import { BreadcrumbStructuredData } from '@/components/seo/structured-data'
import WCAGSEOEnhancements from '@/components/wcag/seo-enhancements'
import WCAG221ClientPage from './client-page'
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: 'WCAG 2.2.1 Timing Adjustable - Interactive Demo',
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
  authors: [{ name: 'Accessibility.build Team' }],
  creator: 'Accessibility.build',
  publisher: 'Accessibility.build',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://accessibility.build/wcag/2-2-1',
  },
  openGraph: {
    title: 'WCAG 2.2.1 Timing Adjustable (Level A) - Interactive Demo',
    description: 'Master WCAG 2.2.1 Timing Adjustable with interactive timing controls and implementation guidance.',
    url: '/wcag/2-2-1',
    siteName: 'Accessibility.build',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/api/og?title=WCAG%202.2.1%20Timing%20Adjustable&section=WCAG',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.2.1 Timing Adjustable (Level A) - Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.2.1 Timing Adjustable (Level A) - Interactive Demo',
    description: 'Master WCAG 2.2.1 Timing Adjustable with interactive timing controls and implementation guidance.',
    images: ['/api/og?title=WCAG%202.2.1%20Timing%20Adjustable&section=WCAG'],
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
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.2.1: Timing Adjustable"
        description="For each time limit that is set by the content, the user can turn off, adjust, or extend the time limit."
        criteria="2.2.1"
        level="A"
        principle="Operable"
        guideline="2.2 Enough Time"
        url="https://accessibility.build/wcag/2-2-1"
        category="Enough Time"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: 'Home', url: 'https://accessibility.build' },
          { name: 'WCAG Success Criteria', url: 'https://accessibility.build/wcag' },
          { name: '2.2.1 Timing Adjustable', url: 'https://accessibility.build/wcag/2-2-1' },
        ]}
      />
      <WCAG221ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="2.2.1" />
      </div>
    </>
  )
}
