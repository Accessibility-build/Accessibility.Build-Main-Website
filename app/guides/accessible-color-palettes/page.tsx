import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
  FAQStructuredData,
  HowToStructuredData,
} from "@/components/seo/structured-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Eye,
  Layers,
  Moon,
  Palette,
  Sun,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Accessible Color Palette Guide | WCAG Color Systems for UI",
  description:
    "Learn how to create WCAG-accessible color palettes for buttons, cards, forms, alerts, links, charts, focus states, hover states, disabled states, and dark mode.",
  keywords: [
    "accessible color palette guide",
    "WCAG color palette",
    "accessible color system",
    "design system colors",
    "dark mode accessibility",
    "focus state color contrast",
    "button color contrast",
    "accessible chart colors",
    "WCAG 2.2 color contrast",
  ],
  alternates: {
    canonical: "https://accessibility.build/guides/accessible-color-palettes",
  },
  openGraph: {
    title: "Accessible Color Palette Guide for UI Design Systems",
    description:
      "Create WCAG-accessible color palettes for real interface states, not just swatches.",
    url: "https://accessibility.build/guides/accessible-color-palettes",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "Accessible color palette guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessible Color Palette Guide for UI Design Systems",
    description:
      "Create WCAG-accessible color palettes for real interface states, not just swatches.",
  },
}

const workflowSteps = [
  {
    name: "Start with real UI roles",
    text: "Define background, foreground, primary, secondary, accent, border, focus, success, warning, and destructive colors before naming decorative swatches.",
  },
  {
    name: "Test foreground and background pairs",
    text: "Check the actual text and component pairings that will appear in the interface, including normal text, large text, buttons, links, and form labels.",
  },
  {
    name: "Preview component states",
    text: "Review hover, active, disabled, selected, warning, error, and focus states because state colors often fail even when default colors pass.",
  },
  {
    name: "Validate light and dark mode separately",
    text: "Create separate surface, border, and text choices for dark mode instead of simply inverting a light mode palette.",
  },
  {
    name: "Document token usage",
    text: "Write clear rules for which tokens can be used together so designers and developers do not create inaccessible combinations later.",
  },
]

const faqItems = [
  {
    question: "Is a color palette itself WCAG compliant?",
    answer:
      "Not by itself. WCAG contrast depends on the foreground and background colors used together, the text size, and the component context. A palette can support accessibility, but the pairings must still be tested.",
  },
  {
    question: "What contrast ratios should UI teams target?",
    answer:
      "Use at least 4.5:1 for normal text, 3:1 for large text, and 3:1 for non-text UI components such as borders, focus indicators, icons, and chart elements. Use 7:1 for normal text when targeting WCAG AAA.",
  },
  {
    question: "Why do disabled states still matter?",
    answer:
      "Disabled controls are often exempt from some contrast requirements, but extremely faint disabled states can confuse users. They should be visibly different while still understandable in the overall layout.",
  },
  {
    question: "Do charts need accessible colors?",
    answer:
      "Yes. Chart colors should have enough contrast against their background and should not rely on color alone. Use labels, patterns, ordering, or legends so information remains clear for color blind users.",
  },
]

export default function AccessibleColorPalettesGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Guides", url: "https://accessibility.build/guides" },
          {
            name: "Accessible Color Palettes",
            url: "https://accessibility.build/guides/accessible-color-palettes",
          },
        ]}
      />

      <ArticleStructuredData
        headline="Accessible Color Palette Guide for UI Design Systems"
        description="Learn how to create WCAG-accessible color palettes for real interface states including buttons, cards, forms, alerts, links, charts, focus states, hover states, disabled states, and dark mode."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-04-27"
        dateModified="2026-04-27"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/guides/accessible-color-palettes"
        wordCount={1900}
        keywords={[
          "accessible color palette",
          "WCAG color contrast",
          "design system colors",
          "dark mode accessibility",
          "focus indicators",
        ]}
      />

      <HowToStructuredData
        name="How to Create an Accessible Color Palette"
        description="A practical workflow for creating WCAG-aware color palettes for product interfaces and design systems."
        totalTime="PT20M"
        tool={["Accessible Color Palette Generator", "Contrast Checker", "Design system documentation"]}
        steps={workflowSteps}
      />

      <FAQStructuredData faqs={faqItems} />

      <main className="min-h-screen bg-background">
        <section className="border-b bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="container-wide py-16 md:py-24">
            <div className="max-w-4xl">
              <Badge variant="secondary" className="mb-5">
                WCAG Color Systems
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white md:text-6xl">
                Accessible Color Palettes for UI Design Systems
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-700 dark:text-slate-300 md:text-xl">
                Accessible color work starts when colors are tested in context.
                This guide shows how to move from isolated swatches to practical
                UI tokens for text, backgrounds, buttons, forms, alerts, links,
                charts, focus indicators, hover states, disabled states, and
                dark mode.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/tools/color-palette-generator">
                    Open the palette generator
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/tools/contrast-checker">
                    Check a color pair
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container-wide py-14 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="space-y-4">
              <div className="rounded-lg border bg-card p-5">
                <Palette className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="mt-3 text-xl font-semibold">Quick checklist</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                    Test the exact foreground and background pair.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                    Include hover, focus, selected, disabled, and error states.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                    Validate light mode and dark mode independently.
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                    Avoid color-only meaning in alerts, charts, and status labels.
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border bg-card p-5">
                <AlertTriangle className="h-6 w-6 text-amber-600" aria-hidden="true" />
                <h2 className="mt-3 text-xl font-semibold">Common mistake</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Teams often approve a palette because the brand colors look
                  good together. The accessibility risk appears later when a
                  bright accent becomes small button text, a pale border becomes
                  the only input boundary, or a dark-mode surface loses visible
                  separation from the page background.
                </p>
              </div>
            </aside>

            <article className="space-y-12">
              <section>
                <div className="flex items-center gap-3">
                  <Layers className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    Start with roles, not color names
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  A design system needs color roles that describe purpose:
                  background, foreground, surface, border, primary action,
                  primary text, focus ring, success, warning, and destructive.
                  Names like blue, teal, and lavender are useful for designers,
                  but they do not tell developers which combinations are safe.
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {["primary + primary foreground", "surface + body text", "border + adjacent surface", "focus ring + page background"].map((pair) => (
                    <div key={pair} className="rounded-lg border p-4 text-sm font-medium">
                      {pair}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    Preview the palette in real components
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Buttons, cards, forms, alerts, links, charts, and focus
                  indicators all use color differently. A preview catches the
                  decisions that a static swatch board hides: whether link text
                  is distinguishable, whether a focus indicator is visible,
                  whether chart bars remain readable, and whether error states
                  have enough contrast against the surface behind them.
                </p>
              </section>

              <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border bg-white p-6 text-slate-950 shadow-sm dark:border-slate-700">
                  <Sun className="h-6 w-6 text-amber-600" aria-hidden="true" />
                  <h2 className="mt-3 text-2xl font-bold">Light mode</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">
                    Light mode usually needs darker foreground colors, visible
                    borders, and accent colors that remain readable on white or
                    near-white surfaces.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-950 p-6 text-white shadow-sm">
                  <Moon className="h-6 w-6 text-blue-300" aria-hidden="true" />
                  <h2 className="mt-3 text-2xl font-bold">Dark mode</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    Dark mode needs larger visual separation between surfaces.
                    Borders, muted text, and focus rings often need to be
                    lighter than their light-mode equivalents.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-3xl font-bold tracking-tight">
                  Accessible palette workflow
                </h2>
                <div className="mt-6 space-y-4">
                  {workflowSteps.map((step, index) => (
                    <div key={step.name} className="rounded-lg border p-5">
                      <div className="flex items-start gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold">{step.name}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {step.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="faq">
                <h2 className="text-3xl font-bold tracking-tight">
                  Accessible Color FAQ
                </h2>
                <div className="mt-6 space-y-5">
                  {faqItems.map((faq) => (
                    <div key={faq.question} className="rounded-lg border p-5">
                      <h3 className="font-semibold">{faq.question}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
