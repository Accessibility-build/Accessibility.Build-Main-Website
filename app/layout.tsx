import type React from "react"
import type { Metadata, Viewport } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SkipLink } from "@/components/skip-link"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner"
// Background services disabled for production build
import { AdminLayoutWrapper } from "@/components/admin/admin-layout-wrapper"
import { BrowserSafetyProvider } from "@/components/browser-safety-provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
  preload: true,
})

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
    { name: "Accessibility.build Team", url: "https://accessibility.build/about" }
  ],
  creator: "Accessibility.build",
  publisher: "Accessibility.build",
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
  alternates: {
    canonical: "https://accessibility.build",
    languages: {
      'en-US': 'https://accessibility.build',
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    other: {
      'msvalidate.01': process.env.BING_SITE_VERIFICATION || '',
    },
  },
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
      url: "https://accessibility.build",
      logo: {
        "@type": "ImageObject",
        url: "https://accessibility.build/android-chrome-512x512.png",
        width: 512,
        height: 512
      },
      sameAs: [
        "https://twitter.com/accessibilitybuild",
        "https://github.com/accessibility-build"
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+1-555-0199",
        contactType: "customer service",
        availableLanguage: "English"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://accessibility.build/#website",
      url: "https://accessibility.build",
      name: "Accessibility.build",
      description: "Professional accessibility platform with AI-powered tools, WCAG 2.2 & 3.0 testing, and comprehensive resources for building inclusive digital experiences.",
      publisher: {
        "@id": "https://accessibility.build/#organization"
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://accessibility.build/search?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://accessibility.build/#webapp",
      name: "Accessibility Testing Suite",
      url: "https://accessibility.build/tools",
      description: "Professional accessibility testing tools including AI-powered alt text generation and WCAG compliance testing",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
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
    },
    {
      "@type": "FAQPage",
      "@id": "https://accessibility.build/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is WCAG 3.0?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "WCAG 3.0 is the upcoming version of Web Content Accessibility Guidelines that introduces the Advanced Perceptual Contrast Algorithm (APCA) for more accurate contrast testing."
          }
        },
        {
          "@type": "Question",
          name: "How accurate is the AI alt text generator?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our alt text generator uses OpenAI GPT-4 Vision, providing highly accurate and contextually relevant descriptions that meet WCAG 2.2 standards."
          }
        }
      ]
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Google tag (gtag.js) */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-F2G9QQF96G"></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-F2G9QQF96G');
              `,
            }}
          />
          {/* End Google tag (gtag.js) */}

          {/* Google Tag Manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-P22NZK7T');
              `,
            }}
          />
          {/* End Google Tag Manager */}

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
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-P22NZK7T"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          {/* End Google Tag Manager (noscript) */}

          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <BrowserSafetyProvider />
            <SkipLink />
            <AdminLayoutWrapper>
              {children}
            </AdminLayoutWrapper>
            <Toaster />
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
