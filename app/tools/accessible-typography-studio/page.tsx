import type { Metadata } from "next"
import Link from "next/link"
import AccessibleTypographyStudio from "@/components/tools/accessible-typography-studio"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Type as TypeIcon,
  Layers,
  Sparkles,
  FileCheck,
  Code2,
  Download,
  BookOpen,
  Eye,
} from "lucide-react"
import {
  AccessibilityToolStructuredData,
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "Accessible Typography Studio | WCAG + APCA",
  description:
    "Build a WCAG 2.2 + APCA-aware typography system: modular OKLCH-quality type scales, dyslexia / cognitive / low-vision presets, fluid clamp() sizing, readability scoring, and exports to Tailwind, Figma, CSS, iOS, and Android.",
  keywords: [
    "accessible typography",
    "WCAG typography",
    "modular type scale generator",
    "fluid typography clamp",
    "Flesch-Kincaid analyzer",
    "dyslexia friendly typography",
    "Atkinson Hyperlegible",
    "Lexend",
    "typography accessibility",
    "design system typography",
    "Tailwind type scale",
    "Figma typography tokens",
    "iOS UIFont generator",
    "Compose Typography generator",
    "WCAG 1.4.12 text spacing",
  ],
  openGraph: {
    title: "Accessible Typography Studio",
    description:
      "Type scale, font stack, line height, and readability — all graded against WCAG 2.2 + APCA. Exports to Tailwind, Figma, CSS, iOS, Android.",
    type: "website",
    url: "https://accessibility.build/tools/accessible-typography-studio",
    images: [
      {
        url: "https://accessibility.build/images/tools/typography-studio-og.png",
        width: 1200,
        height: 630,
        alt: "Accessible Typography Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessible Typography Studio",
    description:
      "Modular type scales, accessibility presets, readability scoring, and design-token exports.",
    images: ["https://accessibility.build/images/tools/typography-studio-og.png"],
  },
  alternates: {
    canonical: "/tools/accessible-typography-studio",
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  {
    name: "Accessible Typography Studio",
    url: "https://accessibility.build/tools/accessible-typography-studio",
  },
]

const faqs = [
  {
    question: "What makes typography accessible under WCAG 2.2?",
    answer:
      "Three things matter most: text remains readable when users resize up to 200% (1.4.4), text-spacing overrides (line-height ≥ 1.5, letter-spacing ≥ 0.12em, word-spacing ≥ 0.16em, paragraph-spacing ≥ 2× font size — WCAG 1.4.12) don't break the layout, and body text meets contrast minimums (4.5:1 for body, 3:1 for large text per 1.4.3). The Studio grades all of these automatically.",
  },
  {
    question: "What is a modular type scale and why use one?",
    answer:
      "A modular scale multiplies a base font size by a ratio (1.125, 1.2, 1.25, 1.333, 1.5, 1.618) to derive every other size in the system. The result is a hierarchy that feels mathematically consistent — h1 to h6 read as steps along the same scale rather than arbitrary numbers. The Studio supports eight common ratios and shows the visual feel of each.",
  },
  {
    question: "How does fluid clamp() sizing work?",
    answer:
      "Each font size is wrapped in clamp(min, preferred, max) so it scales smoothly between a small viewport (360px) and a large one (1280px). Body text generally stays constant; headings shrink on small screens to avoid breaking the line at narrow widths. The math is a linear interpolation between viewport sizes — no media queries needed.",
  },
  {
    question: "Which accessibility presets are available?",
    answer:
      "WCAG 2.2 default, Dyslexia-friendly (Atkinson Hyperlegible, looser tracking, ≤ 60ch), Low-vision (20px body, generous spacing), Cognitive load (Lexend, 1.75 line-height), Editorial / long-form (serif at 19px, ≤ 70ch), and Compact UI (14px dense layouts with extra grading rigor).",
  },
  {
    question: "What is the WCAG 1.4.12 text-spacing override test?",
    answer:
      "WCAG 1.4.12 requires that pages still work when users apply text-spacing overrides — line-height of 1.5× font size, paragraph spacing of 2× font size, letter-spacing of 0.12em, word-spacing of 0.16em. Toggle 'WCAG 1.4.12 override' in the Studio to simulate these overrides in any specimen and watch for clipped or overlapping text.",
  },
  {
    question: "Can I pair this with the Accessible Palette Studio?",
    answer:
      "Yes — that's the point. Paste a palette's primary hex into the Studio (or share a URL between the two) and the typography report grades each text role's contrast against your real background and surface tokens, using both WCAG 2.2 ratios and APCA Lc.",
  },
  {
    question: "What's Flesch Reading Ease?",
    answer:
      "Flesch Reading Ease (1948) scores text from 0 to ~120 based on average sentence length and average syllables per word. Scores ≥ 60 are recommended for general audiences. The Studio also reports Flesch-Kincaid Grade Level (US school grade) and flags overly long sentences or syllable-heavy word patterns.",
  },
]

export default function AccessibleTypographyStudioPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="Accessible Typography Studio"
        description="Modular type scales, accessibility presets, WCAG 2.2 + APCA grading, readability scoring, and design-token exports for Tailwind, Figma, CSS, iOS, and Android."
        url="https://accessibility.build/tools/accessible-typography-studio"
        applicationCategory="DesignApplication"
        operatingSystem="Any"
        offers={{ price: "0", priceCurrency: "USD" }}
        aggregateRating={{ ratingValue: "4.9", reviewCount: "180" }}
        accessibilityFeatures={[
          "largePrint",
          "displayTransformability",
          "structuralNavigation",
          "readingOrder",
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container-wide relative py-12">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-4 flex items-center justify-center gap-2">
                <div className="rounded-full border border-primary/20 bg-primary/10 p-2.5">
                  <TypeIcon className="h-7 w-7 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  Advanced · Modular scale · APCA · WCAG 1.4.12 · Design tokens
                </Badge>
              </div>

              <h1 className="mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                Accessible Typography Studio
              </h1>

              <p className="mb-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
                Build a modular type scale that meets WCAG&nbsp;2.2 + APCA, scales fluidly across
                viewports, and ships with one click to Tailwind, Figma, CSS, iOS, and Android.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-blue-600" /> Modular 12-role scale
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-green-600" /> WCAG 2.2 + APCA
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-purple-600" /> Flesch-Kincaid analyzer
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-amber-600" /> Dyslexia &amp; cognitive presets
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Code2 className="h-4 w-4 text-orange-600" /> Tailwind · Figma · iOS · Android
                </span>
              </div>

              <p className="mt-6 text-xs text-muted-foreground">
                Pairs with the{" "}
                <Link
                  href="/tools/accessible-palette-studio"
                  className="font-medium underline underline-offset-4"
                >
                  Accessible Palette Studio →
                </Link>
                {" "}for a complete design-system-in-a-box.
              </p>
            </div>
          </div>
        </div>

        {/* Tool */}
        <div className="container-wide pb-16">
          <AccessibleTypographyStudio />

          {/* Feature grid */}
          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            <FeatureCard
              icon={Layers}
              iconColor="text-blue-600 dark:text-blue-400"
              bgColor="bg-blue-100 dark:bg-blue-950"
              title="Modular type scale"
              description="Eight ratios from subtle (1.067) to dramatic (1.618 golden), mapped to twelve semantic roles: display, h1–h6, lead, body, small, caption, code."
            />
            <FeatureCard
              icon={Sparkles}
              iconColor="text-purple-600 dark:text-purple-400"
              bgColor="bg-purple-100 dark:bg-purple-950"
              title="Accessibility presets"
              description="WCAG default, dyslexia-friendly (Atkinson Hyperlegible), low-vision, cognitive load (Lexend), editorial, and compact UI — each a one-click starting point."
            />
            <FeatureCard
              icon={FileCheck}
              iconColor="text-green-600 dark:text-green-400"
              bgColor="bg-green-100 dark:bg-green-950"
              title="WCAG 2.2 + APCA grading"
              description="Body size, line-height, line-length, heading hierarchy, paragraph spacing, and per-role contrast against your palette — all graded automatically with deep-links to W3C SC."
            />
            <FeatureCard
              icon={BookOpen}
              iconColor="text-rose-600 dark:text-rose-400"
              bgColor="bg-rose-100 dark:bg-rose-950"
              title="Readability analyzer"
              description="Paste any copy and get Flesch Reading Ease, Flesch-Kincaid Grade Level, average sentence length, and long-word ratio with targeted rewrites suggestions."
            />
            <FeatureCard
              icon={Eye}
              iconColor="text-amber-600 dark:text-amber-400"
              bgColor="bg-amber-100 dark:bg-amber-950"
              title="WCAG 1.4.12 override test"
              description="One toggle simulates the WCAG text-spacing overrides (1.5 line-height, 0.12em letter-spacing, 0.16em word-spacing, 2× paragraph spacing). Catch broken layouts before users do."
            />
            <FeatureCard
              icon={Download}
              iconColor="text-cyan-600 dark:text-cyan-400"
              bgColor="bg-cyan-100 dark:bg-cyan-950"
              title="Design token exports"
              description="Tailwind v4 @theme, Tailwind v3 config, CSS variables + utility classes, W3C DTCG typography tokens, Tokens Studio JSON for Figma, Swift UIFont, Jetpack Compose TextStyle."
            />
          </div>

          {/* SEO long-form */}
          <section className="mt-16 rounded-lg border bg-background/80 p-6 md:p-8">
            <div className="max-w-4xl">
              <Badge variant="outline" className="mb-4">
                Typography for accessible design systems
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                Type is half of every design system — and the half that's almost always shipped
                without an accessibility check.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Color contrast gets all the attention because contrast checkers are easy to find.
                Typography accessibility is harder — it's spread across WCAG 1.4.4 (resize), 1.4.8
                (visual presentation), 1.4.12 (text spacing), 1.4.3 (contrast), and a half-dozen
                cognitive guidelines from WCAG 2.2 and the upcoming WCAG 3. Most teams handle one
                or two and ship anyway. The Studio handles all of them in a single tool, then
                exports the whole system to your stack of choice.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border p-5">
                <h3 className="font-semibold">For design systems</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Generate a complete type scale — 12 roles, fluid clamp() sizing,
                  per-role line height and letter spacing, semantic tokens — ready
                  for Tokens Studio or Style Dictionary.
                </p>
              </div>
              <div className="rounded-lg border p-5">
                <h3 className="font-semibold">For accessibility reviews</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Live WCAG 1.4.12 override toggle, per-role contrast against your
                  palette, and Flesch-Kincaid grade level on real copy. Every report
                  row links to the relevant W3C Success Criterion.
                </p>
              </div>
              <div className="rounded-lg border p-5">
                <h3 className="font-semibold">For engineering</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Export a working Tailwind v4 @theme block, a v3 config, CSS variables
                  with utility classes, a Swift UIFont extension, and a Compose TextStyle
                  object — all in seconds.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools/accessible-palette-studio"
                className="inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-2 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Pair with Accessible Palette Studio →
              </Link>
              <Link
                href="/tools/contrast-checker"
                className="inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-2 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Spot-check one pair → Contrast Checker
              </Link>
            </div>
          </section>

          {/* About */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TypeIcon className="h-5 w-5" />
                What the Studio grades
              </CardTitle>
              <CardDescription>The accessibility checks under the hood</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 font-semibold">Body size (WCAG 1.4.4)</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Body text minimum is 16px on desktop. The Studio passes anything at or above
                  16px (after fluid clamp at the smallest viewport), warns between 14–16px, and
                  fails below 14px.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Line height &amp; spacing (WCAG 1.4.12)</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Body line-height must reach 1.5 — paragraph spacing at least 2× font size,
                  letter-spacing 0.12em, word-spacing 0.16em. Toggle the override switch in any
                  specimen to verify your layout survives the worst-case rendering.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Line length (WCAG 1.4.8)</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Comfortable reading width is 45–80 characters per line. The Studio computes
                  characters per line from your max-width and body font size and warns when the
                  measure goes too narrow or too wide.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Per-role contrast (WCAG 1.4.3 + APCA)</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  When you paste a palette primary, the report grades each text role's contrast
                  against the derived background — body, small, caption, code, all H tags —
                  using both the WCAG luminance ratio and the WCAG 3 APCA Lc model. Catches
                  dark-mode body text that scores 4.7:1 but still fails APCA.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Readability (WCAG 3.1.5)</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Flesch Reading Ease ≥ 60 and Flesch-Kincaid Grade Level ≤ 8 are the
                  recommended targets for general audiences. The analyzer also flags
                  long-sentence patterns and 3+ syllable word density.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <section id="typography-studio-faq" className="mt-16">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight">
                Accessible Typography Studio FAQ
              </h2>
              <p className="mt-3 text-muted-foreground">
                Modular scales, WCAG 1.4.12, APCA, and design-token exports — answered.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border bg-background p-5">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related */}
          <div className="mt-16">
            <RelatedContent
              content="typography accessibility WCAG APCA design tokens type scale fluid clamp"
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

function FeatureCard({
  icon: Icon,
  iconColor,
  bgColor,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  bgColor: string
  title: string
  description: string
}) {
  return (
    <Card className="h-full border-2 transition-colors hover:border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${bgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
