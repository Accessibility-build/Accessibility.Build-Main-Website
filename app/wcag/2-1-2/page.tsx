import { Metadata } from 'next'
import { BreadcrumbStructuredData } from '@/components/seo/structured-data'
import WCAGSEOEnhancements from '@/components/wcag/seo-enhancements'
import WCAG212ClientPage from './client-page'
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: 'WCAG 2.1.2 No Keyboard Trap - Interactive Demo',
  description: 'Master WCAG 2.1.2 No Keyboard Trap requirements with interactive demos, keyboard trap detection, and comprehensive implementation examples.',
  keywords: [
    'WCAG 2.1.2',
    'No Keyboard Trap',
    'Level A',
    'keyboard trap',
    'focus management',
    'accessibility compliance',
    'web accessibility',
    'WCAG 2.2',
    'escape key',
    'keyboard navigation'
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
    canonical: 'https://accessibility.build/wcag/2-1-2',
  },
  openGraph: {
    title: 'WCAG 2.1.2 No Keyboard Trap (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.2 No Keyboard Trap with interactive demos and implementation guidance.',
    url: '/wcag/2-1-2',
    siteName: 'Accessibility.build',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/api/og?title=WCAG%202.1.2%20No%20Keyboard%20Trap&section=WCAG',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.1.2 No Keyboard Trap (Level A) - Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.1.2 No Keyboard Trap (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.2 No Keyboard Trap with interactive demos and implementation guidance.',
    images: ['/api/og?title=WCAG%202.1.2%20No%20Keyboard%20Trap&section=WCAG'],
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

export default function WCAG212Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.1.2: No Keyboard Trap"
        description="If keyboard focus can be moved to a component of the page using a keyboard interface, then focus can be moved away from that component using only a keyboard interface."
        criteria="2.1.2"
        level="A"
        principle="Operable"
        guideline="2.1 Keyboard Accessible"
        url="https://accessibility.build/wcag/2-1-2"
        category="Keyboard Accessible"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: 'Home', url: 'https://accessibility.build' },
          { name: 'WCAG Success Criteria', url: 'https://accessibility.build/wcag' },
          { name: '2.1.2 No Keyboard Trap', url: 'https://accessibility.build/wcag/2-1-2' },
        ]}
      />
      <WCAG212ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="2.1.2" />
      </div>
    </>
  )
}
