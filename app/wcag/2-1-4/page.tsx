import { Metadata } from 'next'
import { BreadcrumbStructuredData } from '@/components/seo/structured-data'
import WCAGSEOEnhancements from '@/components/wcag/seo-enhancements'
import WCAG214ClientPage from './client-page'
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: 'WCAG 2.1.4 Character Key Shortcuts - Interactive Demo',
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
  authors: [{ name: 'Accessibility.build Team' }],
  creator: 'Accessibility.build',
  publisher: 'Accessibility.build',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://accessibility.build/wcag/2-1-4',
  },
  openGraph: {
    title: 'WCAG 2.1.4 Character Key Shortcuts (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.4 Character Key Shortcuts with interactive demos and implementation guidance.',
    url: '/wcag/2-1-4',
    siteName: 'Accessibility.build',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/api/og?title=WCAG%202.1.4%20Character%20Key%20Shortcuts&section=WCAG',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.1.4 Character Key Shortcuts (Level A) - Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.1.4 Character Key Shortcuts (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.4 Character Key Shortcuts with interactive demos and implementation guidance.',
    images: ['/api/og?title=WCAG%202.1.4%20Character%20Key%20Shortcuts&section=WCAG'],
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
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.1.4: Character Key Shortcuts"
        description="If a keyboard shortcut is implemented in content using only letter, punctuation, number, or symbol characters, then a mechanism is available to turn the shortcut off, remap it, or make it active only on focus."
        criteria="2.1.4"
        level="A"
        principle="Operable"
        guideline="2.1 Keyboard Accessible"
        url="https://accessibility.build/wcag/2-1-4"
        category="Keyboard Accessible"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: 'Home', url: 'https://accessibility.build' },
          { name: 'WCAG Success Criteria', url: 'https://accessibility.build/wcag' },
          { name: '2.1.4 Character Key Shortcuts', url: 'https://accessibility.build/wcag/2-1-4' },
        ]}
      />
      <WCAG214ClientPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CriterionLinks number="2.1.4" />
      </div>
    </>
  )
}
