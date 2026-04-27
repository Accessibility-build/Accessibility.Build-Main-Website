import type { Metadata } from "next"
import Link from "next/link"
import ColorPaletteGenerator from "@/components/tools/color-palette-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Palette,
  Eye,
  CheckCircle,
  Target,
  Paintbrush,
  Download,
  Sparkles
} from "lucide-react"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "Accessible Color Palette Generator | WCAG 2.2 UI Color Preview | Free Tool",
  description:
    "Generate WCAG-aware color palettes and preview buttons, cards, forms, alerts, links, charts, hover states, disabled states, and focus states in light and dark mode.",
  keywords: [
    "accessible color palette generator",
    "WCAG color palette generator",
    "WCAG 2.2 colors",
    "accessible UI colors",
    "color contrast palette",
    "design system color tokens",
    "dark mode accessible colors",
    "button color contrast",
    "focus state color",
    "accessible design system"
  ],
  openGraph: {
    title: "Accessible Color Palette Generator with Live UI Preview",
    description: "Generate WCAG-aware palettes and preview real UI states in light and dark mode.",
    type: "website",
    url: "https://accessibility.build/tools/color-palette-generator",
    images: [
      {
        url: "https://accessibility.build/images/tools/color-palette-og.png",
        width: 1200,
        height: 630,
        alt: "Accessible Color Palette Generator"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessible Color Palette Generator with Live UI Preview",
    description: "Generate WCAG-aware palettes and preview real UI states in light and dark mode.",
    images: ["https://accessibility.build/images/tools/color-palette-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/tools/color-palette-generator"
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Color Palette Generator", url: "https://accessibility.build/tools/color-palette-generator" }
]

const colorPaletteFaqs = [
  {
    question: "What makes a color palette accessible?",
    answer:
      "An accessible color palette includes foreground and background combinations that meet WCAG contrast requirements, supports visible focus indicators, avoids color-only meaning, and works across light mode, dark mode, hover states, disabled states, and error states."
  },
  {
    question: "What contrast ratio does WCAG 2.2 require?",
    answer:
      "WCAG 2.2 Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. Level AAA requires 7:1 for normal text and 4.5:1 for large text. UI components and graphical objects should have at least 3:1 contrast against adjacent colors."
  },
  {
    question: "Why should I preview colors on buttons, forms, cards, and charts?",
    answer:
      "A swatch can look good in isolation but fail when used as button text, card borders, form focus rings, alerts, links, or chart colors. Live previews reveal whether the palette works in real interface states before it becomes part of a design system."
  },
  {
    question: "Can one palette be fully WCAG compliant?",
    answer:
      "A palette itself is not automatically compliant. Compliance depends on specific color pairings, text size, component state, and context. The safest workflow is to generate colors, preview real UI pairings, then verify important combinations with a contrast checker."
  },
  {
    question: "Should accessible palettes include dark mode?",
    answer:
      "Yes. Dark mode often needs different surface, border, text, focus, and accent choices because colors that pass in light mode can become muddy or too low contrast on dark surfaces."
  }
]

export default function ColorPaletteGeneratorPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="Accessible Color Palette Generator"
        description="Generate WCAG-aware color palettes and preview real UI states including buttons, forms, cards, alerts, links, charts, hover states, disabled states, and focus states."
        url="https://accessibility.build/tools/color-palette-generator"
        applicationCategory="DesignApplication"
        operatingSystem="Any"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.9",
          reviewCount: "850"
        }}
        accessibilityFeatures={[
          "highContrastDisplay",
          "colorContrastAnalysis",
          "visualAlternatives"
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <FAQStructuredData faqs={colorPaletteFaqs} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container-wide py-16 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                  <Palette className="h-8 w-8 text-primary" />
                </div>
                <Badge variant="secondary" className="text-sm font-medium">
                  Free Tool • No Credits Required
                </Badge>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Accessible Color Palette Generator
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Generate WCAG-aware palettes and preview real UI states instantly.
                <br className="hidden md:block" />
                Test buttons, cards, forms, alerts, links, charts, focus states, and dark mode.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">WCAG Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Live UI Preview</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Download className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Export Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Component */}
        <div className="container-wide pb-16">
          <ColorPaletteGenerator />

          {/* Benefits Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">WCAG Compliance</CardTitle>
                    <CardDescription>Meets Accessibility Standards</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Preview generated colors against WCAG 2.2 contrast thresholds for text,
                  UI components, focus indicators, and common interface states.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                    <Paintbrush className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Design System Ready</CardTitle>
                    <CardDescription>Perfect for UI/UX Teams</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Generate complete color palettes with primary, secondary, accent, and neutral colors.
                  Use the live preview to decide which colors should become design tokens.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                    <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Multiple Export Formats</CardTitle>
                    <CardDescription>Ready for Any Tool</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Export your palettes in CSS, SCSS, Figma, Adobe Swatches, and more.
                  Seamlessly integrate with your existing design and development workflow.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                About Accessible Color Palettes
              </CardTitle>
              <CardDescription>
                Understanding color harmony and accessibility in design
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Why Accessibility Matters
                </h3>
                <ul className="space-y-2 text-muted-foreground list-disc pl-6">
                  <li>15% of the global population has some form of visual impairment</li>
                  <li>Good contrast improves readability for everyone, not just those with disabilities</li>
                  <li>Accessible design is often required by law (ADA, AODA, etc.)</li>
                  <li>Better contrast can improve conversion rates and user engagement</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  Color Theory Basics
                </h3>
                <ul className="space-y-2 text-muted-foreground list-disc pl-6">
                  <li><strong>Complementary:</strong> Colors opposite on the color wheel (high contrast)</li>
                  <li><strong>Analogous:</strong> Colors next to each other (harmonious)</li>
                  <li><strong>Triadic:</strong> Three colors evenly spaced on the wheel</li>
                  <li><strong>Monochromatic:</strong> Different shades of the same hue</li>
                  <li><strong>Split-Complementary:</strong> Base color plus two adjacent to its complement</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  Best Practices
                </h3>
                <ul className="space-y-2 text-muted-foreground list-disc pl-6">
                  <li>Test your colors with actual users, including those with visual impairments</li>
                  <li>Use tools like this generator to ensure WCAG compliance from the start</li>
                  <li>Consider how colors will appear in different lighting conditions</li>
                  <li>Don't rely solely on color to convey important information</li>
                  <li>Create a consistent color system across your entire product</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* SEO Content Section */}
          <section className="mt-16 rounded-lg border bg-background/80 p-6 md:p-8">
            <div className="max-w-4xl">
              <Badge variant="outline" className="mb-4">Accessible Design Systems</Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                Build WCAG color palettes for real UI states
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                A useful accessible color palette is more than a row of attractive swatches.
                Product teams need to know how colors behave in buttons, cards, form fields,
                links, alerts, charts, disabled controls, hover styles, focus rings, and dark mode.
                This generator turns color harmony into a practical UI preview so designers and
                developers can choose safer color pairings before shipping.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border p-5">
                <h3 className="font-semibold">For designers</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Explore accessible color combinations for brand palettes, product themes,
                  dashboard UI, and component libraries without guessing how states will look.
                </p>
              </div>
              <div className="rounded-lg border p-5">
                <h3 className="font-semibold">For developers</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Export CSS, SCSS, or JSON values and map them into tokens like background,
                  foreground, primary, border, focus, success, warning, and destructive.
                </p>
              </div>
              <div className="rounded-lg border p-5">
                <h3 className="font-semibold">For accessibility reviews</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Catch risky combinations early, then verify production-critical pairings with
                  the contrast checker and manual testing across real content.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/guides/accessible-color-palettes" className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                Read the accessible color guide
              </Link>
              <Link href="/tools/contrast-checker" className="inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-2 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                Check individual color pairs
              </Link>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="accessible-color-palette-faq" className="mt-16">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight">Accessible Color Palette FAQ</h2>
              <p className="mt-3 text-muted-foreground">
                Short answers for teams using WCAG color palettes in websites, apps, and design systems.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {colorPaletteFaqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border bg-background p-5">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Content */}
          <div className="mt-16">
            <RelatedContent
              content="color palette contrast design system accessibility"
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
