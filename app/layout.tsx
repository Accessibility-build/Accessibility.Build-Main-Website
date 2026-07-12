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
import { company } from "@/lib/company"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
  preload: true,
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
    template: "%s | Accessibility.build",
  },
  description:
    "Professional accessibility platform with AI-powered alt text generation, WCAG 2.2 & 3.0 compliance testing, color contrast analysis, and comprehensive accessibility resources for developers and designers.",
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
  referrer: "origin-when-cross-origin",
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
  manifest: "/site.webmanifest",
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
    description: "Professional accessibility platform with AI-powered tools, WCAG compliance testing, and comprehensive resources for building inclusive digital experiences.",
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
    site: "@accessibilitybuild",
    creator: "@accessibilitybuild",
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
        "https://github.com/accessibility-build"
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
      url: company.founderWebsite,
      jobTitle: "Founder and Accessibility Consultant",
      image: `${company.website}/images/authors/khushwant-parihar.jpeg`,
      mainEntityOfPage: `${company.website}/authors/khushwant-parihar`,
      sameAs: [company.founderWebsite, company.founderLinkedin],
      worksFor: {
        "@id": "https://accessibility.build/#organization"
      },
      knowsAbout: [
        "Web accessibility",
        "WCAG 2.2",
        "Section 508",
        "Accessibility auditing",
        "Screen reader testing",
        "Accessible frontend development"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://accessibility.build/#website",
      url: "https://accessibility.build",
      name: "Accessibility.build",
      description: "Professional accessibility platform with AI-powered tools, WCAG 2.2 & 3.0 testing, and comprehensive resources for building inclusive digital experiences.",
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
          "@type": "CollectionPage",
          "@id": "https://accessibility.build/case-studies#collection",
          name: "Accessibility Case Studies",
          url: "https://accessibility.build/case-studies"
        },
        {
          "@type": "Blog",
          "@id": "https://accessibility.build/blog#blog",
          name: "Accessibility Blog",
          url: "https://accessibility.build/blog"
        }
      ]
    },
    {
      "@type": "WebApplication",
      "@id": "https://accessibility.build/#webapp",
      name: "Accessibility Testing Suite",
      url: "https://accessibility.build/tools",
      description: "Professional accessibility testing tools including AI-powered alt text generation and WCAG compliance testing",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript. Supported browsers: Chrome, Firefox, Safari, Edge.",
      isAccessibleForFree: true,
      publisher: {
        "@id": "https://accessibility.build/#organization"
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free accessibility tools with premium features available"
      },
      featureList: [
        "AI-powered alt text generation",
        "WCAG 2.2 & 3.0 contrast testing",
        "Real-time accessibility analysis",
        "Professional compliance reporting"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://accessibility.build/#software",
      name: "Alt Text Generator",
      url: "https://accessibility.build/tools/alt-text-generator",
      description: "AI-powered alt text generator using OpenAI GPT-4 Vision for professional accessibility compliance",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      softwareVersion: "2.0",
      releaseNotes: "Enhanced with OpenAI GPT-4 Vision and WCAG 2.2 compliance",
      offers: {
        "@type": "Offer",
        price: "0.10",
        priceCurrency: "USD",
        description: "Pay per use with 100 free credits for new users"
      }
    }
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
          {/* Preconnect to external domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://api.openai.com" />
          <link rel="preconnect" href="https://clerk.com" />

          {/* DNS prefetch for performance */}
          <link rel="dns-prefetch" href="//images.clerk.dev" />
          <link rel="dns-prefetch" href="//clerk.com" />
          <link rel="dns-prefetch" href="//api.openai.com" />
          <link rel="dns-prefetch" href="//vercel.com" />
          <link rel="dns-prefetch" href="//vitals.vercel-insights.com" />
          <link rel="dns-prefetch" href="//analytics.ahrefs.com" />
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />

          {/* Content discovery */}
          <link rel="alternate" type="application/rss+xml" title="Accessibility.build Blog RSS Feed" href="/feed.xml" />
          <link rel="alternate" type="application/atom+xml" title="Accessibility.build Blog Atom Feed" href="/atom.xml" />
          <link rel="alternate" type="text/plain" title="Accessibility.build LLMs.txt" href="/llms.txt" />

          {/* Critical resource hints */}
          <link rel="prefetch" href="/tools" />
          <link rel="prefetch" href="/blog" />
          <link rel="prefetch" href="/faq" />

          {/* Security and performance headers */}
          <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
          <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
          <meta httpEquiv="X-DNS-Prefetch-Control" content="on" />

          {/* Performance optimization hints */}
          <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />

          {/* Eliminate render-blocking for non-critical CSS */}
          <link rel="preload" href="/api/health" as="fetch" crossOrigin="anonymous" />

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
        </body>
      </html>
    </ClerkProvider>
  )
}
