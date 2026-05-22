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
  Code2,
  Eye,
  FileCheck,
  Layers,
  Palette,
  Sparkles,
  TrendingUp,
} from "lucide-react"

export const metadata: Metadata = {
  title: "OKLCH + APCA Color Systems for Accessible Design Systems",
  description:
    "A complete guide to building WCAG 2.2 + APCA-aware color systems in OKLCH. Why perceptual lightness matters, how APCA differs from WCAG ratios, how to design 11-stop scales that hold up under color-blindness, and how to export tokens to Tailwind, Figma, iOS, and Android.",
  keywords: [
    "OKLCH color system",
    "APCA color contrast",
    "WCAG 3 color",
    "11 stop color scale",
    "perceptual color space",
    "design tokens",
    "color blindness simulation",
    "Tailwind OKLCH",
    "Figma color tokens",
    "accessible color system",
    "color system design guide",
    "Inclusive Colors alternative",
  ],
  alternates: {
    canonical: "https://accessibility.build/guides/oklch-apca-color-systems",
  },
  openGraph: {
    title: "OKLCH + APCA Color Systems for Accessible Design Systems",
    description:
      "Why OKLCH beats HSL, how APCA improves on WCAG 2.2, and how to ship a token-ready 11-stop palette in any platform.",
    url: "https://accessibility.build/guides/oklch-apca-color-systems",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "OKLCH + APCA color systems guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OKLCH + APCA Color Systems for Accessible Design Systems",
    description:
      "Why OKLCH beats HSL, how APCA improves on WCAG 2.2, and how to ship a token-ready 11-stop palette.",
  },
}

const workflow = [
  {
    name: "Pick a base color in OKLCH, not HSL",
    text: "Convert your brand hex to OKLCH. Note the L (lightness), C (chroma), and H (hue). OKLCH lightness is perceptually uniform — two colors at L=0.6 look equally bright to the human eye regardless of hue.",
  },
  {
    name: "Generate 11 stops with a curved lightness ramp",
    text: "Target L values that step evenly through the perceptual range — roughly 0.985, 0.965, 0.925, 0.870, 0.780, 0.680, 0.585, 0.500, 0.420, 0.340, 0.230 for stops 50 through 950. Chroma peaks around the middle stops and tapers at extremes.",
  },
  {
    name: "Gamut-map each stop to displayable sRGB",
    text: "OKLCH can describe colors outside the sRGB gamut. Use chroma clamping to bring each generated stop back into a renderable color while preserving lightness and hue.",
  },
  {
    name: "Derive semantic tokens from scales",
    text: "Map primary-600 to the rest-state of buttons, primary-700 to hover, primary-100 to soft surfaces. Define background, foreground, border, focus, success, warning, danger, and info as token references — never raw hex.",
  },
  {
    name: "Grade every pairing with both WCAG and APCA",
    text: "Body text on background, button text on button, focus ring on adjacent surface, disabled state, alert filled, alert tinted. Pass WCAG 2.2 contractually and check APCA Lc as forward-compatibility insurance.",
  },
  {
    name: "Verify under color-vision deficiency",
    text: "Run the palette through protanopia, deuteranopia, tritanopia, and grayscale simulations. Watch especially for success/danger collapse — that's the classic red-green failure.",
  },
  {
    name: "Export tokens to every consumer",
    text: "Ship the same source of truth as Tailwind theme, CSS variables, W3C DTCG JSON, Tokens Studio JSON for Figma, Swift UIColor, and Compose Color. Token references — not hex strings — keep all platforms in sync.",
  },
]

const faqItems = [
  {
    question: "Why OKLCH instead of HSL?",
    answer:
      "HSL is mathematically convenient but not perceptually uniform — two HSL colors with the same L value can look dramatically different in actual brightness. OKLCH (Björn Ottosson, 2020) is a perceptual color space derived from OKLab. An 11-stop scale generated in OKLCH steps evenly to the human eye across all hues; the same scale in HSL produces obvious bright spots and dark spots.",
  },
  {
    question: "What is APCA and how does it differ from WCAG 2.2?",
    answer:
      "APCA (Accessible Perceptual Contrast Algorithm) is the contrast model proposed for WCAG 3. It computes Lc, a signed value typically between −108 and +106, that accounts for font size, font weight, and polarity (dark text on light vs light text on dark). WCAG 2.2 uses a luminance ratio (4.5:1 for body text) that does not distinguish polarity, so combinations that score 4.7:1 can still fail readability in dark mode — a problem APCA explicitly addresses.",
  },
  {
    question: "Should I ship APCA today?",
    answer:
      "Use APCA as a secondary check, not a primary contractual baseline. WCAG 2.2 is the legal floor in most jurisdictions (Section 508, ADA Title II in the United States; EAA in Europe; AODA in Canada). APCA Bronze Simple thresholds (Lc ≥ 75 body, Lc ≥ 60 large, Lc ≥ 45 non-text) are the forward-compatible target that future-proofs your palette.",
  },
  {
    question: "Why 11 stops? Why not 10 or 12?",
    answer:
      "Eleven stops (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) align with Tailwind, Radix, and shadcn conventions, so the output drops into existing ecosystems without renaming. The extra 50 and 950 stops give you a near-white tint and an inky deep stop without forcing you to choose between them.",
  },
  {
    question: "How do I handle dark mode without inverting?",
    answer:
      "Don't invert. Use lighter stops (400–500) for primary surfaces in dark mode, darker stops (50–100) for the corresponding foregrounds. Each role — primary, secondary, accent, success, warning, danger, info — needs its own light-mode and dark-mode pair. Both should pass WCAG and APCA independently. Inverting a light palette produces dark mode that looks correct in marketing screenshots but fails real reading sessions.",
  },
  {
    question: "What about color-vision deficiency?",
    answer:
      "Around 8% of men and 0.5% of women have some form of color-vision deficiency. The most common is deuteranopia (no green cones). Test your palette under all three dichromacies using Machado et al. (2009) matrices: protanopia, deuteranopia, and tritanopia. The classic failure is success (green) collapsing into danger (red) under deutan or protan. Pair color with iconography, text, or shape to satisfy WCAG 1.4.1 (Use of Color).",
  },
  {
    question: "How do I export tokens once and use them everywhere?",
    answer:
      "Start with W3C Design Tokens Community Group JSON (DTCG) as your source of truth. From there, transform into platform-specific formats: Tailwind config (or v4 @theme block), CSS variables, Tokens Studio JSON for Figma, Swift UIColor extension, Kotlin Color object for Compose. Build the transform into your design-system release pipeline so every consumer gets the same hex value from a single edit.",
  },
  {
    question: "Where does this end up under WCAG 3?",
    answer:
      "WCAG 3 is still a working draft. APCA is currently the contrast model under consideration, but the final spec may change. The safe strategy: pass WCAG 2.2 today, design with OKLCH and APCA so you're ready for whichever direction WCAG 3 goes, and version your design tokens so you can re-grade if requirements shift.",
  },
]

export default function OklchApcaColorSystemsGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Guides", url: "https://accessibility.build/guides" },
          {
            name: "OKLCH + APCA Color Systems",
            url: "https://accessibility.build/guides/oklch-apca-color-systems",
          },
        ]}
      />

      <ArticleStructuredData
        headline="OKLCH + APCA Color Systems for Accessible Design Systems"
        description="A complete guide to building WCAG 2.2 + APCA-aware color systems in OKLCH. Why perceptual lightness matters, how APCA differs from WCAG ratios, how to design 11-stop scales, and how to export tokens to Tailwind, Figma, iOS, and Android."
        author={{ name: "Accessibility.build Team", url: "https://accessibility.build/about" }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-05-23"
        dateModified="2026-05-23"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/guides/oklch-apca-color-systems"
        wordCount={2600}
        keywords={["OKLCH", "APCA", "design tokens", "accessible colors", "WCAG 3"]}
      />

      <HowToStructuredData
        name="How to Build an OKLCH + APCA Color System"
        description="A step-by-step workflow for building an accessible color system with OKLCH scales, APCA grading, and design-token exports."
        totalTime="PT45M"
        tool={["Accessible Palette Studio", "Contrast Checker", "Tokens Studio for Figma"]}
        steps={workflow}
      />

      <FAQStructuredData faqs={faqItems} />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b bg-gradient-to-br from-slate-50 via-white to-fuchsia-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="container-wide py-16 md:py-24">
            <div className="max-w-4xl">
              <Badge variant="secondary" className="mb-5">
                Design system color · WCAG 2.2 · APCA
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white md:text-6xl">
                OKLCH + APCA color systems, end to end
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-700 dark:text-slate-300 md:text-xl">
                The complete blueprint for shipping a color system that's
                perceptually consistent, accessible under both WCAG 2.2 and the
                APCA draft, survives color-vision deficiency, and exports to
                every platform you ship to.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/tools/accessible-palette-studio">
                    Open the Palette Studio
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/tools/accessible-typography-studio">
                    Pair with Typography Studio
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                ~12 min read · Updated May 2026
              </p>
            </div>
          </div>
        </section>

        <section className="container-wide py-14 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-lg border bg-card p-5">
                <Palette className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="mt-3 text-xl font-semibold">Quick checklist</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {[
                    "Generate scales in OKLCH, not HSL",
                    "11 stops per family (50 → 950)",
                    "Grade with WCAG 2.2 + APCA",
                    "Test protan / deutan / tritan",
                    "Export DTCG → all platforms",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border bg-card p-5">
                <AlertTriangle className="h-6 w-6 text-amber-600" aria-hidden="true" />
                <h2 className="mt-3 text-xl font-semibold">Common mistake</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Generating scales by linearly stepping HSL lightness. The
                  result <em>looks</em> right in a row of swatches but produces
                  uneven jumps when applied to real UI — yellows feel too bright,
                  blues feel too dark, and the 500 stops across families don't
                  feel like they belong together.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-5">
                <Sparkles className="h-6 w-6 text-fuchsia-500" aria-hidden="true" />
                <h2 className="mt-3 text-xl font-semibold">Companion tool</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The{" "}
                  <Link
                    href="/tools/accessible-palette-studio"
                    className="font-semibold underline underline-offset-4"
                  >
                    Accessible Palette Studio
                  </Link>{" "}
                  implements every workflow step in this guide and ships the
                  resulting tokens to your stack of choice.
                </p>
              </div>
            </aside>

            <article className="space-y-12">
              <section>
                <div className="flex items-center gap-3">
                  <Layers className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    OKLCH solves what HSL never could
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  HSL has been the workhorse of color manipulation on the web
                  since the late 1990s. It's mathematically simple — a hue angle,
                  a saturation percentage, a lightness percentage — and it powers
                  virtually every &ldquo;lighten 10%&rdquo; preprocessor function
                  ever shipped. It has one flaw that everyone ignores: HSL
                  lightness is not perceptually uniform.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Plot HSL <code>hsl(60, 80%, 50%)</code> (yellow) next to{" "}
                  <code>hsl(240, 80%, 50%)</code> (blue) at the same lightness
                  value. They look nothing alike in brightness — the yellow burns
                  your retinas while the blue retreats into the page. This is the
                  same reason a Tailwind v3 palette generated naïvely in HSL
                  produced inconsistent middle stops across hues, which is
                  exactly why Tailwind v4 moved to OKLCH.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  OKLCH (Björn Ottosson, 2020) is a transform of OKLab into
                  cylindrical lightness-chroma-hue coordinates. Crucially, its
                  lightness channel maps to perceived brightness — two OKLCH
                  colors with the same L value <em>look</em> equally bright
                  regardless of hue. The 500 stops across primary, secondary,
                  accent, success, warning, danger, and info all feel like they
                  belong on the same step of the same staircase.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    The 11-stop perceptual scale
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Eleven stops (50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
                  950) is the de-facto modern standard. It aligns with Tailwind,
                  Radix Colors, shadcn/ui, and most design-system token
                  libraries. Each stop targets a specific OKLCH L value drawn
                  from a perceptually-curved ramp:
                </p>
                <div className="mt-6 overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left">Stop</th>
                        <th className="px-3 py-2 text-right">OKLCH L</th>
                        <th className="px-3 py-2 text-left">Typical role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["50", "0.985", "Subtle tint backgrounds, hover wash"],
                        ["100", "0.965", "Soft surfaces, tag fills"],
                        ["200", "0.925", "Disabled fills, divider tints"],
                        ["300", "0.870", "Borders, faint outlines"],
                        ["400", "0.780", "Muted iconography, large display"],
                        ["500", "0.680", "Mid-tone — brand anchor"],
                        ["600", "0.585", "Default primary button (light mode)"],
                        ["700", "0.500", "Hover state for primary buttons"],
                        ["800", "0.420", "Active / pressed states"],
                        ["900", "0.340", "Dark foreground text"],
                        ["950", "0.230", "Inky deep mode background"],
                      ].map(([stop, l, role], i) => (
                        <tr key={stop} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                          <td className="px-3 py-2 font-mono">{stop}</td>
                          <td className="px-3 py-2 text-right font-mono">{l}</td>
                          <td className="px-3 py-2 text-muted-foreground">{role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Chroma follows a separate curve — it peaks around the middle
                  stops (400–500) where saturation reads strongest, and tapers
                  toward the extremes so 50 doesn't blow out and 950 doesn't
                  feel muddy. Every generated stop is then gamut-mapped into
                  displayable sRGB so the browser actually renders the color
                  the math produced.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <FileCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    APCA vs WCAG 2.2 — what to grade against
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  WCAG 2.2's contrast ratio (1.4.3, 1.4.6) is the legal baseline.
                  Body text needs 4.5:1, large text needs 3:1, non-text UI
                  components need 3:1. The model is the same for dark text on
                  light backgrounds as it is for light text on dark — a single
                  symmetric luminance ratio.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  That symmetry is APCA's biggest objection. Light text on dark
                  backgrounds is perceived differently from dark on light
                  (Stevens' power law, irradiance asymmetry, decades of human
                  factors research). APCA computes Lc — a signed value
                  approximately between −108 and +106 — that respects polarity.
                  Negative Lc means light text on dark; positive means dark on
                  light. The absolute value gets checked against thresholds:
                </p>
                <div className="mt-6 overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left">Use case</th>
                        <th className="px-3 py-2 text-right">APCA Lc minimum</th>
                        <th className="px-3 py-2 text-right">Equivalent WCAG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Body text (fluent reading)", "75", "4.5 : 1"],
                        ["Body text (preferred)", "90", "7 : 1"],
                        ["Large text (24px+ or 18.66px bold)", "60", "3 : 1"],
                        ["UI components (buttons, fields)", "60", "3 : 1"],
                        ["Focus rings, dividers, icons", "45", "3 : 1"],
                        ["Spot text / decorative", "30", "no minimum"],
                      ].map(([role, apca, wcag], i) => (
                        <tr key={role} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                          <td className="px-3 py-2">{role}</td>
                          <td className="px-3 py-2 text-right font-mono">{apca}</td>
                          <td className="px-3 py-2 text-right font-mono text-muted-foreground">{wcag}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Our recommendation: pass WCAG 2.2 contractually, target APCA
                  Bronze Simple as a forward-compatible bonus. The Studio
                  displays both side-by-side so any pairing that's marginal in
                  one model gets flagged.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    Color-vision deficiency — the collapse you can't see
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Approximately 8% of men and 0.5% of women have some form of
                  color-vision deficiency. The three dichromacies — protanopia
                  (no red cones), deuteranopia (no green cones), and tritanopia
                  (no blue cones) — collapse hue differences that look obvious
                  to typical vision. Success-green and danger-red are the
                  textbook example: in deuteranopia, both reduce to muddy
                  brown-yellow tones that are nearly indistinguishable.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  The fix is twofold. First, never rely on color alone to convey
                  information (WCAG 1.4.1) — pair the color with an icon, text
                  label, or shape. Second, run your semantic colors through the
                  Machado, Oliveira &amp; Fernandes (2009) transforms and check
                  that the pairs that need to be distinguishable still are,
                  computed as ΔE-OK perceptual distance. The Palette Studio runs
                  this check automatically and surfaces a warning when any
                  semantic pair collapses below the distinguishability threshold.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <Code2 className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    One source of truth, every platform
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Design tokens exist to keep the same hex value flowing through
                  Figma, Tailwind, vanilla CSS, iOS, and Android. The W3C Design
                  Tokens Community Group (DTCG) format is the emerging standard
                  for that source of truth. From DTCG JSON you can transform to:
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  {[
                    ["Tailwind v4", "@theme block with --color-* custom properties"],
                    ["Tailwind v3", "tailwind.config.ts with theme.extend.colors"],
                    ["Vanilla CSS", ":root variables plus [data-theme=\"dark\"] override"],
                    ["Tokens Studio", "Figma plugin import for design parity"],
                    ["Swift", "UIColor extension for UIKit / SwiftUI"],
                    ["Kotlin Compose", "Color object for Android Jetpack"],
                  ].map(([format, desc]) => (
                    <li key={format} className="flex gap-3 rounded-lg border p-3 text-sm">
                      <code className="shrink-0 font-mono text-xs font-semibold uppercase tracking-wide text-primary">
                        {format}
                      </code>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Build the transforms into your design-system release pipeline.
                  When a color shifts, every consumer updates from the same
                  commit. The Studio's export panel produces all of the above in
                  one click.
                </p>
              </section>

              <section>
                <h2 className="text-3xl font-bold tracking-tight">
                  Step-by-step workflow
                </h2>
                <div className="mt-6 space-y-4">
                  {workflow.map((step, index) => (
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
                <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
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

              <section className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-fuchsia-50/40 p-8 dark:to-fuchsia-950/20">
                <h2 className="text-2xl font-bold tracking-tight">
                  Build your color system in the Studio
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Apply every step of this guide in one click: OKLCH 11-stop
                  scales, WCAG + APCA grading, color-blindness simulation,
                  state-aware report, and token exports to every platform.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/tools/accessible-palette-studio">
                      Open Palette Studio
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/guides/accessible-typography-wcag">
                      Read the typography companion
                    </Link>
                  </Button>
                </div>
              </section>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}
