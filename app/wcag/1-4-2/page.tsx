import { Metadata } from 'next'
import { BreadcrumbStructuredData } from '@/components/seo/structured-data'
import WCAGSEOEnhancements from '@/components/wcag/seo-enhancements'
import WCAG142ClientPage from './client-page'
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: 'WCAG 1.4.2 Audio Control (Level A) - Interactive Demo',
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
  authors: [{ name: 'Accessibility.build Team' }],
  creator: 'Accessibility.build',
  publisher: 'Accessibility.build',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://accessibility.build/wcag/1-4-2',
  },
  openGraph: {
    title: 'WCAG 1.4.2 Audio Control (Level A) - Interactive Demo',
    description: 'Master WCAG 1.4.2 Audio Control with interactive examples, auto-play demonstrations, and implementation guidance.',
    url: '/wcag/1-4-2',
    siteName: 'Accessibility.build',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/api/og?title=WCAG%201.4.2%20Audio%20Control&section=WCAG',
        width: 1200,
        height: 630,
        alt: 'WCAG 1.4.2 Audio Control (Level A) - Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 1.4.2 Audio Control (Level A) - Interactive Demo',
    description: 'Master WCAG 1.4.2 Audio Control with interactive examples and implementation guidance.',
    images: ['/api/og?title=WCAG%201.4.2%20Audio%20Control&section=WCAG'],
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
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.4.2: Audio Control"
        description="If any audio on a web page plays automatically for more than 3 seconds, either a mechanism is available to pause or stop the audio, or a mechanism is available to control audio volume independently from the overall system volume level."
        criteria="1.4.2"
        level="A"
        principle="Perceivable"
        guideline="1.4 Distinguishable"
        url="https://accessibility.build/wcag/1-4-2"
        category="Distinguishable"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: 'Home', url: 'https://accessibility.build' },
          { name: 'WCAG Success Criteria', url: 'https://accessibility.build/wcag' },
          { name: '1.4.2 Audio Control', url: 'https://accessibility.build/wcag/1-4-2' },
        ]}
      />
      <WCAG142ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="1.4.2" />
      </div>
    </>
  )
}
