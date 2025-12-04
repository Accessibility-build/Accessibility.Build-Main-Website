import { Metadata } from 'next'
import URLEncoderDecoder from '@/components/tools/url-encoder-decoder'
import { ToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: 'URL Encoder/Decoder by Alaikas - Encode & Decode URLs Online | Free Tool',
  description: 'Free online URL encoder and decoder by Alaikas. Handle special characters, spaces, and international characters in URLs and query parameters safely. Professional web development tool.',
  keywords: [
    'url encoder decoder by alaikas',
    'url encoder',
    'url decoder',
    'url encoding',
    'percent encoding',
    'url escape',
    'query parameters',
    'special characters',
    'international characters',
    'web development',
    'online converter',
    'alaikas url tool'
  ],
  openGraph: {
    title: 'URL Encoder/Decoder - Encode & Decode URLs Online',
    description: 'Free online URL encoder and decoder. Handle special characters safely in URLs.',
    type: 'website',
    url: "https://accessibility.build/tools/url-encoder-decoder",
    images: [
      {
        url: "https://accessibility.build/images/tools/url-encoder-og.png",
        width: 1200,
        height: 630,
        alt: "URL Encoder/Decoder Tool"
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URL Encoder/Decoder - Encode & Decode URLs Online',
    description: 'Free online URL encoder and decoder. Handle special characters safely in URLs.',
    images: ["https://accessibility.build/images/tools/url-encoder-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/tools/url-encoder-decoder"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "URL Encoder/Decoder", url: "https://accessibility.build/tools/url-encoder-decoder" }
]

export default function URLEncoderDecoderPage() {
  return (
    <>
      <ToolStructuredData
        name="URL Encoder/Decoder by Alaikas"
        description="Free online URL encoder and decoder by Alaikas. Handle special characters, spaces, and international characters in URLs and query parameters safely."
        url="https://accessibility.build/tools/url-encoder-decoder"
        applicationCategory="DeveloperApplication"
        operatingSystem="Any"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.8",
          reviewCount: "340"
        }}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container-wide py-12">
          <URLEncoderDecoder />

          <div className="mt-16">
            <RelatedContent
              content="url encoding decoding web development tools query parameters"
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

