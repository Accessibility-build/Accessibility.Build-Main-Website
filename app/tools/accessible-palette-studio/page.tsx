import type { Metadata } from "next"
import Link from "next/link"
import AccessiblePaletteStudio from "@/components/tools/accessible-palette-studio"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Layers,
  Palette,
  Sparkles,
  FileCheck,
  Code2,
  Download,
} from "lucide-react"
import {
  AccessibilityToolStructuredData,
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "Accessible Palette Studio | OKLCH + APCA",
  description:
    "Build an OKLCH color system with WCAG 2.2 checks, experimental APCA estimates, color-vision simulations, state previews, and design-token exports.",
  keywords: [
    "accessible palette studio",
    "OKLCH color generator",
    "APCA color palette",
    "experimental APCA color system",
    "design system color generator",
    "Tailwind color generator",
    "Figma variables generator",
    "design tokens generator",
    "color blindness simulator palette",
    "state aware color contrast",
    "iOS color palette generator",
    "Jetpack Compose color palette",
  ],
  openGraph: {
    title: "Accessible Palette Studio — OKLCH + APCA color system builder",
    description:
      "Eleven-stop OKLCH scales, state-aware WCAG + APCA grading, color-blindness simulation, and exports to Tailwind, Figma, CSS, Swift, and Kotlin.",
    type: "website",
    url: "https://accessibility.build/tools/accessible-palette-studio",
    images: [
      {
        url: "https://accessibility.build/images/tools/palette-studio-og.png",
        width: 1200,
        height: 630,
        alt: "Accessible Palette Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessible Palette Studio — OKLCH + APCA color system builder",
    description:
      "Eleven-stop OKLCH scales, state-aware contrast grading, color-blindness simulation, and design-token exports.",
    images: ["https://accessibility.build/images/tools/palette-studio-og.png"],
  },
  alternates: {
    canonical: "/tools/accessible-palette-studio",
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  {
    name: "Accessible Palette Studio",
    url: "https://accessibility.build/tools/accessible-palette-studio",
  },
]

const faqs = [
  {
    question: "What is APCA and how does it differ from WCAG 2.2 contrast?",
    answer:
      "APCA (Accessible Perceptual Contrast Algorithm) is an experimental perceptual contrast model. It produces a signed Lc estimate that reflects polarity and is interpreted with text size and weight. The Studio shows APCA beside the normative WCAG 2.2 luminance ratio for design exploration; APCA results are not a WCAG conformance claim.",
  },
  {
    question: "Why OKLCH instead of HSL?",
    answer:
      "HSL is mathematically convenient but not perceptually uniform — two HSL colors with the same lightness can look very different in brightness. OKLCH (a perceptual color space) keeps lightness consistent across hues, so an 11-stop scale generated in OKLCH actually steps evenly to the human eye. This is what makes the scales feel coherent across primary, secondary, and accent families.",
  },
  {
    question: "Which color-blindness simulations are supported?",
    answer:
      "Protanopia (no red cones), deuteranopia (no green cones), tritanopia (no blue cones), and achromatopsia (full grayscale). The simulation uses the Machado, Oliveira & Fernandes (2009) transforms applied to linear sRGB, which is the model used by Chrome DevTools' vision deficiency emulator.",
  },
  {
    question: "What does state-aware grading check?",
    answer:
      "Every interactive token (primary, secondary, accent, danger, etc.) is tested in its rest, hover, active, focus, and disabled states. Focus rings are graded against the 3:1 WCAG 1.4.11 non-text contrast requirement. Disabled states are flagged informationally — WCAG 2.2 exempts them, but APCA still surfaces unreadable combinations.",
  },
  {
    question: "Can I export to Tailwind v4 and v3 at the same time?",
    answer:
      "Yes. The Studio generates a Tailwind v4 @theme block and a v3 tailwind.config.ts side-by-side, plus W3C Design Tokens Community Group (DTCG) JSON, Tokens Studio JSON for Figma, a Swift UIColor extension for iOS, and a Jetpack Compose Color object for Android. Pick any combination — your palette state is persisted in the URL so you can share it with your team.",
  },
  {
    question: "Does the palette state save anywhere?",
    answer:
      "Your palette is encoded directly into the URL hash, so copying the address bar shares the exact palette with anyone. Nothing is sent to a server. Click \"Share URL\" to copy a ready-to-send link.",
  },
]

export default function AccessiblePaletteStudioPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="Accessible Palette Studio"
        description="OKLCH 11-stop color system builder with APCA + WCAG 2.2 grading, color-blindness simulation, and design-token exports for Tailwind, Figma, CSS, iOS, and Android."
        url="https://accessibility.build/tools/accessible-palette-studio"
        applicationCategory="DesignApplication"
        operatingSystem="Any"
        offers={{ price: "0", priceCurrency: "USD" }}
        accessibilityFeatures={[
          "highContrastDisplay",
          "colorContrastAnalysis",
          "visualAlternatives",
          "alternativeText",
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container-wide py-12 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="p-2.5 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs font-medium">
                  Advanced · OKLCH · APCA · CVD · Design Tokens
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Accessible Palette Studio
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                Eleven-stop OKLCH scales, state-aware WCAG&nbsp;2.2 + APCA grading, color-blindness simulation,
                and one-click exports for Tailwind, Figma, CSS, iOS, and Android.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-blue-600" /> 11-stop OKLCH
                </span>
                <span className="flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4 text-green-600" /> WCAG&nbsp;2.2 + APCA
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-purple-600" /> CVD simulation
                </span>
                <span className="flex items-center gap-1.5">
                  <Code2 className="h-4 w-4 text-orange-600" /> Tailwind · Figma · iOS · Android
                </span>
              </div>

              <p className="mt-6 text-xs text-muted-foreground">
                Need a quick palette instead?{" "}
                <Link
                  href="/tools/color-palette-generator"
                  className="font-medium underline underline-offset-4"
                >
                  Use the simple Color Palette Generator →
                </Link>
                {" · "}
                Set the matching type system in the{" "}
                <Link
                  href="/tools/accessible-typography-studio"
                  className="font-medium underline underline-offset-4"
                >
                  Accessible Typography Studio →
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Tool */}
        <div className="container-wide pb-16">
          <AccessiblePaletteStudio />

          {/* What makes it advanced */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Layers}
              iconColor="text-blue-600 dark:text-blue-400"
              bgColor="bg-blue-100 dark:bg-blue-950"
              title="11-stop OKLCH scales"
              description="Perceptually-uniform shade systems — 50 through 950 — across primary, secondary, accent, neutral, success, warning, danger, and info. Light/dark mirror automatically."
            />
            <FeatureCard
              icon={FileCheck}
              iconColor="text-green-600 dark:text-green-400"
              bgColor="bg-green-100 dark:bg-green-950"
              title="WCAG 2.2 + APCA, side-by-side"
              description="Every pairing includes the normative WCAG 2.2 luminance ratio and an experimental APCA Lc estimate for additional design context."
            />
            <FeatureCard
              icon={Eye}
              iconColor="text-purple-600 dark:text-purple-400"
              bgColor="bg-purple-100 dark:bg-purple-950"
              title="Color-blindness simulation"
              description="Toggle protanopia, deuteranopia, tritanopia, or achromatopsia and watch the entire UI preview re-render through the lens. Machado 2009 matrices."
            />
            <FeatureCard
              icon={Sparkles}
              iconColor="text-rose-600 dark:text-rose-400"
              bgColor="bg-rose-100 dark:bg-rose-950"
              title="State-aware grading"
              description="Rest, hover, active, focus, disabled, and translucent-overlay scoring. Focus rings are tested against the 3:1 WCAG 1.4.11 requirement automatically."
            />
            <FeatureCard
              icon={Palette}
              iconColor="text-amber-600 dark:text-amber-400"
              bgColor="bg-amber-100 dark:bg-amber-950"
              title="Real UI previews"
              description="Dashboard, buttons, forms, tables, cards, charts, toasts, and marketing — your palette tested in production-shaped UI instead of abstract swatches."
            />
            <FeatureCard
              icon={Download}
              iconColor="text-cyan-600 dark:text-cyan-400"
              bgColor="bg-cyan-100 dark:bg-cyan-950"
              title="Design-token exports"
              description="Tailwind v4 @theme, Tailwind v3 config, CSS variables, W3C Design Tokens JSON, Figma / Tokens Studio JSON, Swift UIColor, and Jetpack Compose Color."
            />
          </div>

          {/* Long-form / SEO */}
          <section className="mt-16 rounded-lg border bg-background/80 p-6 md:p-8">
            <div className="max-w-4xl">
              <Badge variant="outline" className="mb-4">
                Color systems for production design teams
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">
                Beyond one-off contrast checks: a complete color-system workspace
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Most color tools stop at a contrast ratio between two hex codes. Production design
                systems need full 50–950 scales that hold up under hover, focus, disabled, and
                translucent overlay states; that work in light and dark mode; that survive
                deuteranopia; and that drop straight into Tailwind, Figma, iOS, and Android without
                hand-tuning. The Accessible Palette Studio builds that system from a single base
                color in one pass, then compares every pairing with WCAG 2.2 requirements and
                experimental APCA estimates so teams can make better-informed design decisions.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg border p-5">
                <h3 className="font-semibold">For design systems</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Generate 88 OKLCH stops (8 families × 11 steps) plus semantic tokens for
                  background, surface, foreground, border, primary, focus, danger, and more —
                  ready for Tokens Studio or Style Dictionary.
                </p>
              </div>
              <div className="rounded-lg border p-5">
                <h3 className="font-semibold">For engineering teams</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  One click exports a working Tailwind v4 @theme block, a v3 config, CSS custom
                  properties with dark mode, a Swift UIColor extension, and a Compose Color
                  object. No copy-paste-fix loops.
                </p>
              </div>
              <div className="rounded-lg border p-5">
                <h3 className="font-semibold">For accessibility reviews</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Every state of every interactive token is graded by both contrast models. The
                  report card pinpoints exactly which pairing fails, in which state, under which
                  scoring model — and tells you whether a CVD simulation breaks it further.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tools/contrast-checker"
                className="inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-2 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Spot-check one pair → Contrast Checker
              </Link>
              <Link
                href="/tools/color-palette-generator"
                className="inline-flex min-h-11 items-center justify-center rounded-md border px-5 py-2 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Need something simpler? → Color Palette Generator
              </Link>
            </div>
          </section>

          {/* About / explanation */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                How the Studio builds an accessible color system
              </CardTitle>
              <CardDescription>The science under the hood</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">OKLCH lightness curve</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Each stop targets a perceptually-uniform L* value, with chroma peaking around the
                  500 stop and tapering at the extremes so 50 stays subtle and 950 stays inky.
                  Every stop is then gamut-mapped into displayable sRGB.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">APCA Lc scoring</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  APCA computes a signed Lc estimate that respects polarity. The Studio uses
                  configurable target bands to help compare text and interface colors. Treat
                  these bands as experimental design guidance, not WCAG conformance thresholds.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Machado CVD transforms</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Color-blindness simulations use 3×3 matrices from Machado, Oliveira &amp;
                  Fernandes (2009) applied in linear sRGB. The CSS filter is generated from the
                  same matrices via SVG <code>&lt;feColorMatrix&gt;</code>, so every preview pixel —
                  text, borders, charts — re-renders through the simulated lens.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Best practices</h3>
                <ul className="space-y-2 text-muted-foreground text-sm list-disc pl-6">
                  <li>Don't rely on color alone — pair it with icons, text, or shape</li>
                  <li>Verify the report card in both light and dark mode</li>
                  <li>If any state-aware row falls into "Caution" under both WCAG and APCA, fix it</li>
                  <li>Treat the focus-on-surface row as load-bearing — many sites miss this</li>
                  <li>Spot-check at least one CVD simulation before shipping</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <section id="palette-studio-faq" className="mt-16">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-bold tracking-tight">
                Accessible Palette Studio FAQ
              </h2>
              <p className="mt-3 text-muted-foreground">
                APCA, OKLCH, CVD, and design-token exports — answered.
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
              content="color palette contrast design system accessibility WCAG APCA OKLCH design tokens"
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
    <Card className="border-2 hover:border-primary/20 transition-colors h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
