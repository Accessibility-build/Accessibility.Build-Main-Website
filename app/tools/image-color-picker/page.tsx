import { Metadata } from 'next'
import ImageColorPicker from '@/components/tools/image-color-picker'
import { ToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: 'Image Color Picker - Extract Colors from Images | A11y Helper',
  description: 'Upload images and extract color palettes with precision. Get HEX, RGB, and HSL values instantly. Export color palettes in multiple formats for your design projects.',
  keywords: [
    'image color picker',
    'color extraction',
    'color palette generator',
    'hex color picker',
    'rgb color picker',
    'hsl color picker',
    'color palette export',
    'design tools',
    'color analysis',
    'web design tools'
  ],
  openGraph: {
    title: 'Image Color Picker - Extract Colors from Images',
    description: 'Upload images and extract color palettes with precision. Get HEX, RGB, and HSL values instantly.',
    type: 'website',
    url: "https://accessibility.build/tools/image-color-picker",
    images: [
      {
        url: "https://accessibility.build/images/tools/image-color-picker-og.png",
        width: 1200,
        height: 630,
        alt: "Image Color Picker Tool"
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Color Picker - Extract Colors from Images',
    description: 'Upload images and extract color palettes with precision. Get HEX, RGB, and HSL values instantly.',
    images: ["https://accessibility.build/images/tools/image-color-picker-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/tools/image-color-picker"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Image Color Picker", url: "https://accessibility.build/tools/image-color-picker" }
]

export default function ImageColorPickerPage() {
  return (
    <>
      <ToolStructuredData
        name="Image Color Picker"
        description="Upload images and extract color palettes with precision. Get HEX, RGB, and HSL values instantly."
        url="https://accessibility.build/tools/image-color-picker"
        applicationCategory="DesignApplication"
        operatingSystem="Any"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.7",
          reviewCount: "230"
        }}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container-wide py-12">
          <ImageColorPicker />

          <div className="mt-16">
            <RelatedContent
              content="color picker image extraction design tools palette generator"
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

