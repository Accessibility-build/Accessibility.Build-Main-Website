import { Metadata } from 'next'
import Base64Converter from '@/components/tools/base64-converter'
import { ToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: 'Base64 Encoder/Decoder - Convert Text & Files | A11y Helper',
  description: 'Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 back to text. Support for file uploads and instant conversion.',
  keywords: [
    'base64 encoder',
    'base64 decoder',
    'base64 converter',
    'encode base64',
    'decode base64',
    'text to base64',
    'base64 to text',
    'file to base64',
    'online converter',
    'data encoding'
  ],
  openGraph: {
    title: 'Base64 Encoder/Decoder - Convert Text & Files',
    description: 'Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 back to text.',
    type: 'website',
    url: "https://accessibility.build/tools/base64-converter",
    images: [
      {
        url: "https://accessibility.build/images/tools/base64-converter-og.png",
        width: 1200,
        height: 630,
        alt: "Base64 Converter Tool"
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 Encoder/Decoder - Convert Text & Files',
    description: 'Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 back to text.',
    images: ["https://accessibility.build/images/tools/base64-converter-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/tools/base64-converter"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Base64 Converter", url: "https://accessibility.build/tools/base64-converter" }
]

export default function Base64ConverterPage() {
  return (
    <>
      <ToolStructuredData
        name="Base64 Converter"
        description="Free online Base64 encoder and decoder. Convert text to Base64 and decode Base64 back to text."
        url="https://accessibility.build/tools/base64-converter"
        applicationCategory="DeveloperApplication"
        operatingSystem="Any"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.8",
          reviewCount: "150"
        }}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container-wide py-12">
          <Base64Converter />

          <div className="mt-16">
            <RelatedContent
              content="data encoding developer tools web utilities base64"
              title="Related Tools & Resources"
              maxItems={3}
              showDescriptions={true}
            />
          </div>
        </div>
      </div>
    </>
  )
}

