import { Metadata } from 'next'
import { BreadcrumbStructuredData } from '@/components/seo/structured-data'
import WCAGSEOEnhancements from '@/components/wcag/seo-enhancements'
import WCAG143ClientPage from './client-page'
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: 'WCAG 1.4.3 Contrast (Minimum) - Interactive Demo',
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
  authors: [{ name: 'Accessibility.build Team' }],
  creator: 'Accessibility.build',
  publisher: 'Accessibility.build',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://accessibility.build/wcag/1-4-3',
  },
  openGraph: {
    title: 'WCAG 1.4.3 Contrast (Minimum) (Level AA) - Interactive Demo',
    description: 'Master WCAG 1.4.3 Contrast (Minimum) with interactive contrast checker and real-time analysis.',
    url: '/wcag/1-4-3',
    siteName: 'Accessibility.build',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/api/og?title=WCAG%201.4.3%20Contrast%20(Minimum)&section=WCAG',
        width: 1200,
        height: 630,
        alt: 'WCAG 1.4.3 Contrast (Minimum) (Level AA) - Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 1.4.3 Contrast (Minimum) (Level AA) - Interactive Demo',
    description: 'Master WCAG 1.4.3 Contrast (Minimum) with interactive contrast checker and implementation guidance.',
    images: ['/api/og?title=WCAG%201.4.3%20Contrast%20(Minimum)&section=WCAG'],
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
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.4.3: Contrast (Minimum)"
        description="The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, with a 3:1 ratio for large-scale text."
        criteria="1.4.3"
        level="AA"
        principle="Perceivable"
        guideline="1.4 Distinguishable"
        url="https://accessibility.build/wcag/1-4-3"
        category="Distinguishable"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: 'Home', url: 'https://accessibility.build' },
          { name: 'WCAG Success Criteria', url: 'https://accessibility.build/wcag' },
          { name: '1.4.3 Contrast (Minimum)', url: 'https://accessibility.build/wcag/1-4-3' },
        ]}
      />
      <WCAG143ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="1.4.3" />
      </div>
    </>
  )
}
