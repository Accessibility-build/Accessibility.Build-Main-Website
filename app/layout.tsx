import type React from "react"
import type { Metadata, Viewport } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { SkipLink } from "@/components/skip-link"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner"
// Background services disabled for production build
import { AdminLayoutWrapper } from "@/components/admin/admin-layout-wrapper"
import { BrowserSafetyProvider } from "@/components/browser-safety-provider"
import { clerkThemeAppearance } from "@/lib/clerk-auth-appearance"
import { AnalyticsConsent } from "@/components/privacy/analytics-consent"
import { PostHogProvider } from "@/components/analytics/posthog-provider"
import { company, founderCredentialSchema } from "@/lib/company"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  // 'optional' instead of 'swap': the browser never re-renders text in a second
  // font mid-load, so large headings cannot shift layout (CLS). Combined with
  // next/font's automatic fallback metric adjustment, the fallback matches the
  // real font's metrics closely enough that the swap is not worth the shift.
  display: 'optional',
  preload: true,
  adjustFontFallback: true,
})

const verificationOther: Record<string, string> = {}

if (process.env.BING_SITE_VERIFICATION) {
  verificationOther["msvalidate.01"] = process.env.BING_SITE_VERIFICATION
}

const verification: Metadata["verification"] = {
  ...(process.env.GOOGLE_SITE_VERIFICATION && { google: process.env.GOOGLE_SITE_VERIFICATION }),
  ...(process.env.YANDEX_VERIFICATION && { yandex: process.env.YANDEX_VERIFICATION }),
  ...(Object.keys(verificationOther).length > 0 && { other: verificationOther }),
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://accessibility.build"),
  title: {
    default: "Professional Accessibility Tools | Accessibility.build",
    // No brand suffix. It used to be "%s | Accessibility.build", which added 22
    // characters to all 283 child pages and pushed 246 of them past the ~60
    // character mark where Google and Bing truncate (Bing Webmaster Tools flagged
    // this as "Title too long"). The suffix was the first thing cut, so it rarely
    // survived to be read, and both engines now render the site name beside the
    // title anyway, which made it redundant as well as expensive.
    //
    // Pages that genuinely need the brand (short utility and service titles that
    // read as generic on their own, such as "Sitemap") append it themselves.
    template: "%s",
  },
  description:
    "Founder-led accessibility services, practical WCAG 2.2 tools, implementation guides, research, and resources for more inclusive digital products.",
  keywords: [
    "accessibility",
    "a11y",
    "WCAG",
    "WCAG 2.2",
    "WCAG 3.0",
    "APCA",
    "web accessibility",
    "inclusive design",
    "accessibility testing",
    "color contrast checker",
    "alt text generator",
    "accessibility audit",
    "screen reader",
    "accessibility compliance",
    "digital accessibility",
    "accessibility tools",
    "OpenAI alt text",
    "accessibility automation",
    "inclusive UX",
    "accessibility consulting"
  ],
  authors: [
    { name: company.legalOperator, url: company.founderWebsite }
  ],
  creator: company.legalOperator,
  publisher: company.brandName,
  category: "Technology",
  classification: "Accessibility Tools and Resources",
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
  },
  openGraph: {
    type: "website",
    siteName: "Accessibility.build",
    title: "Professional Accessibility Tools | Accessibility.build",
    description: "Founder-led accessibility services, practical WCAG 2.2 tools, implementation guides, and resources for inclusive digital experiences.",
    url: "https://accessibility.build",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Accessibility.build - Professional accessibility tools and resources"
      }
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    // No site/creator handle: the @accessibilitybuild X account does not exist.
    title: "Professional Accessibility Tools | Accessibility.build",
    description: "AI-powered accessibility tools, WCAG compliance testing, and comprehensive resources for inclusive web development.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Accessibility.build',
  },
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
  applicationName: "Accessibility.build",
  generator: "Next.js",
  verification,
  other: {
    'theme-color': '#3b82f6',
    'color-scheme': 'light dark',
    'format-detection': 'telephone=no',
  },
}

// Enhanced structured data for better SEO
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://accessibility.build/#organization",
      name: "Accessibility.build",
      legalName: company.legalName,
      alternateName: "Accessibility Build",
      url: "https://accessibility.build",
      description:
        "A founder-owned accessibility consultancy and platform operated by Khushwant Parihar, providing WCAG testing, remediation support, training, tools, and implementation guidance.",
      logo: {
        "@type": "ImageObject",
        url: "https://accessibility.build/android-chrome-512x512.png",
        width: 512,
        height: 512
      },
      // Topic entities the site demonstrates expertise in — helps search and
      // generative engines understand what this source is authoritative about.
      knowsAbout: [
        "Web accessibility",
        "WCAG 2.2",
        "WCAG 3.0",
        "Web Content Accessibility Guidelines",
        "ADA compliance",
        "Section 508",
        "European Accessibility Act",
        "Assistive technology",
        "Screen readers",
        "Color contrast",
        "Accessible design",
        "Digital accessibility law",
      ],
      sameAs: [
        company.linkedin,
        company.founderWebsite,
        company.founderLinkedin,
        company.organizationGithub,
      ],
      founder: {
        "@id": "https://accessibility.build/#founder"
      },
      foundingDate: String(company.foundedYear),
      areaServed: "Worldwide",
      taxID: company.gstin,
      identifier: {
        "@type": "PropertyValue",
        propertyID: "GSTIN",
        value: company.gstin,
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: `${company.registeredOffice.addressLine1}, ${company.registeredOffice.addressLine2}`,
        addressLocality: company.registeredOffice.locality,
        addressRegion: company.registeredOffice.region,
        postalCode: company.registeredOffice.postalCode,
        addressCountry: company.registeredOffice.countryCode
      },
      publishingPrinciples: "https://accessibility.build/trust",
      contactPoint: {
        "@type": "ContactPoint",
        email: company.email,
        contactType: "customer service",
        availableLanguage: "English"
      }
    },
    {
      "@type": "Person",
      "@id": "https://accessibility.build/#founder",
      name: company.legalOperator,
      // The author page is the entity's home on this site; the personal site
      // is a sameAs, not the canonical URL.
      url: `${company.website}/authors/khushwant-parihar`,
      jobTitle: "Founder and Accessibility Consultant",
      description:
        "Founder of Accessibility.build. IAAP Certified Professional in Accessibility Core Competencies (CPACC) and DHS Trusted Tester for Section 508.",
      image: `${company.website}/images/authors/khushwant-parihar.jpeg`,
      mainEntityOfPage: `${company.website}/authors/khushwant-parihar`,
      sameAs: [company.founderWebsite, company.founderLinkedin, company.founderGithub],
      worksFor: {
        "@id": "https://accessibility.build/#organization"
      },
      homeLocation: {
        "@type": "Place",
        name: `${company.location.city}, ${company.location.region}, ${company.location.country}`,
      },
      // Same list as /about and /authors so the entity reads identically everywhere.
      knowsAbout: [
        "Web accessibility",
        "WCAG 2.2",
        "Section 508",
        "Accessibility auditing",
        "Screen reader testing",
        "NVDA",
        "JAWS",
        "VoiceOver",
        "Accessible frontend development"
      ],
      hasCredential: founderCredentialSchema,
    },
    {
      "@type": "WebSite",
      "@id": "https://accessibility.build/#website",
      url: "https://accessibility.build",
      name: "Accessibility.build",
      description: "Founder-led accessibility services, practical WCAG 2.2 tools, implementation guides, research, and resources for inclusive digital experiences.",
      inLanguage: "en-US",
      publisher: {
        "@id": "https://accessibility.build/#organization"
      },
      about: [
        { "@type": "Thing", name: "Web accessibility" },
        { "@type": "Thing", name: "WCAG 2.2" },
        { "@type": "Thing", name: "Accessibility compliance" },
        { "@type": "Thing", name: "Assistive technology" }
      ],
      audience: {
        "@type": "Audience",
        audienceType: "Developers, designers, accessibility specialists, and compliance teams"
      },
      hasPart: [
        {
          "@type": "CollectionPage",
          "@id": "https://accessibility.build/tools#collection",
          name: "Accessibility Tools",
          url: "https://accessibility.build/tools"
        },
        {
          "@type": "CollectionPage",
          "@id": "https://accessibility.build/wcag#collection",
          name: "WCAG Success Criteria Guides",
          url: "https://accessibility.build/wcag"
        },
        {
          "@type": "CollectionPage",
          "@id": "https://accessibility.build/guides#collection",
          name: "Accessibility Guides",
          url: "https://accessibility.build/guides"
        },
        {
          "@type": "CollectionPage",
          "@id": "https://accessibility.build/compliance#collection",
          name: "Accessibility Compliance",
          url: "https://accessibility.build/compliance"
        },
        {
          "@type": "CollectionPage",
          "@id": "https://accessibility.build/research#collection",
          name: "Accessibility Research",
          url: "https://accessibility.build/research"
        },
        {
          "@type": "Blog",
          "@id": "https://accessibility.build/blog#blog",
          name: "Accessibility Blog",
          url: "https://accessibility.build/blog"
        }
      ]
    },
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/welcome"
      appearance={clerkThemeAppearance}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Fonts are self-hosted by next/font, so no font preconnect is needed.
              Security headers live in next.config.mjs (meta http-equiv copies are
              ignored by browsers), and nothing is preloaded or prefetched here:
              a previous /api/health preload cost a serverless call per pageview. */}

          {/* DNS prefetch for performance */}
          <link rel="dns-prefetch" href="//images.clerk.dev" />
          <link rel="dns-prefetch" href="//clerk.com" />
          <link rel="dns-prefetch" href="//vercel.com" />
          <link rel="dns-prefetch" href="//vitals.vercel-insights.com" />

          {/* Content discovery */}
          <link rel="alternate" type="application/rss+xml" title="Accessibility.build Blog RSS Feed" href="/feed.xml" />
          <link rel="alternate" type="application/atom+xml" title="Accessibility.build Blog Atom Feed" href="/atom.xml" />
          <link rel="alternate" type="text/plain" title="Accessibility.build LLMs.txt" href="/llms.txt" />

          {/* Critical inline CSS for above-the-fold content */}
          <style dangerouslySetInnerHTML={{
            __html: `
              .min-h-screen{min-height:100vh}
              .flex{display:flex}
              .flex-col{flex-direction:column}
              .flex-1{flex:1 1 0%}
              .antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
              .font-sans{font-family:var(--font-sans),ui-sans-serif,system-ui,sans-serif}
              .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0}
            `
          }} />
        </head>
        <body className={cn("min-h-screen font-sans antialiased", fontSans.variable)}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <BrowserSafetyProvider />
            {/* Loads PostHog (and identifies the user) only after consent. */}
            <PostHogProvider />
            <SkipLink />
            <AdminLayoutWrapper>
              {children}
            </AdminLayoutWrapper>
            <Toaster />
            <AnalyticsConsent />
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
          <script
            async
            src="https://docaccessible.com/site/v1.js"
            data-site-key="site_pk_peMrEUBgXgeHh-6UXiSc2AQehswRWGUR"
          />
        </body>
      </html>
    </ClerkProvider>
  )
}
