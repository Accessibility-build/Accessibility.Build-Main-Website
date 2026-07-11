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
  BookOpen,
  CheckCircle,
  Eye,
  FileCheck,
  Layers,
  Sparkles,
  Type as TypeIcon,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Accessible Typography Guide | WCAG 2.2 + 3 Modular Type Scale",
  description:
    "A complete guide to building accessible typography systems: modular type scales, fluid clamp() sizing, WCAG 1.4.4 / 1.4.8 / 1.4.12 compliance, dyslexia and cognitive disability research, Flesch-Kincaid readability, and design-token exports.",
  keywords: [
    "accessible typography",
    "WCAG typography",
    "modular type scale",
    "fluid typography clamp",
    "WCAG 1.4.12 text spacing",
    "dyslexia friendly typography",
    "Atkinson Hyperlegible",
    "Lexend",
    "Flesch Kincaid readability",
    "accessible font size",
    "type scale generator",
    "design system typography",
    "typography accessibility guide",
  ],
  alternates: {
    canonical: "https://accessibility.build/guides/accessible-typography-wcag",
  },
  openGraph: {
    title: "Accessible Typography — the complete WCAG guide",
    description:
      "Modular type scales, WCAG 1.4.12 text spacing, dyslexia research, and design-token exports.",
    url: "https://accessibility.build/guides/accessible-typography-wcag",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "Accessible typography guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessible Typography — the complete WCAG guide",
    description:
      "Modular type scales, WCAG 1.4.12 text spacing, dyslexia research, and design-token exports.",
  },
}

const workflow = [
  {
    name: "Set the body first",
    text: "Pick a base body size (typically 16px or 17px). Everything in the system derives from this. If the body is wrong, no amount of heading hierarchy will save you.",
  },
  {
    name: "Choose a modular ratio",
    text: "1.125 for subtle SaaS dashboards, 1.2 for general product UI, 1.25 as a versatile default, 1.333 for confident hierarchy, 1.5 for editorial, 1.618 for display-heavy marketing. Stick to one ratio across the whole system.",
  },
  {
    name: "Wrap each stop in clamp() for fluid sizing",
    text: "Define a min size (computed at the smallest viewport) and a max size (computed at the largest). The clamp() function linearly interpolates between them with no media queries. Body usually stays constant; headings shrink at narrow widths to avoid awkward line breaks.",
  },
  {
    name: "Recommend line-height per role",
    text: "Body 1.5–1.65, lead 1.4, h6 1.35, h5 1.3, h4 1.25, h3 1.2, h2 1.15, h1 1.1, display 1.05. Smaller sizes need looser leading; larger sizes get tighter as letterforms gain visual mass.",
  },
  {
    name: "Pin line length between 45 and 80 characters",
    text: "Set body max-width to roughly 65ch. Anything narrower forces too many returns; anything wider makes the eye lose track of the next line. WCAG 1.4.8 requires no more than 80 characters wide for body text.",
  },
  {
    name: "Verify under the WCAG 1.4.12 override",
    text: "Apply line-height ≥ 1.5×, letter-spacing ≥ 0.12em, word-spacing ≥ 0.16em, paragraph-spacing ≥ 2× the font size. The page must still work — nothing clipped, nothing overlapped, nothing inaccessible. This is the most-failed WCAG 2.1 criterion.",
  },
  {
    name: "Grade contrast per role against the palette",
    text: "Body text against page background and surface, large text against same, muted text against background, code against surface. Pass WCAG 1.4.3 for the legal floor and target APCA Lc ≥ 75 for fluent reading.",
  },
  {
    name: "Run reading-level analysis on actual copy",
    text: "Aim for Flesch Reading Ease ≥ 60 and Flesch-Kincaid Grade Level ≤ 8 for general audiences. Long sentences and 3+ syllable words are the two biggest drivers of unreadable copy.",
  },
  {
    name: "Export tokens for every consumer",
    text: "Tailwind v4 @theme, Tailwind v3 config, CSS variables with utility classes, W3C DTCG composite typography tokens, Tokens Studio JSON for Figma, Swift UIFont, Compose TextStyle. Single source of truth, every platform.",
  },
]

const faqItems = [
  {
    question: "What's the minimum body font size for accessibility?",
    answer:
      "16px is the practical minimum for body text on desktop. Below 14px, even good typefaces start failing for users with mild low vision. The Studio passes anything at or above 16px (after fluid clamp at the smallest viewport), warns between 14–16px, and fails below 14px. Compact data dashboards sometimes ship at 14px — that's defensible if the contrast and zoom support are otherwise excellent, but it's a stretch.",
  },
  {
    question: "What is the WCAG 1.4.12 text-spacing override test?",
    answer:
      "WCAG Success Criterion 1.4.12 (Text Spacing, level AA) requires that pages still function correctly when users apply text-spacing overrides via their browser or assistive tech. The required minimums: line-height ≥ 1.5× font size, letter-spacing ≥ 0.12em, word-spacing ≥ 0.16em, paragraph-spacing ≥ 2× font size. The Studio's override toggle simulates these forced values so you can spot clipped text, overlapping elements, and cramped components before users complain.",
  },
  {
    question: "Why does a modular scale matter for accessibility?",
    answer:
      "A modular scale produces a hierarchy where each size step is mathematically related to the next — base × ratio^n. The result feels coherent to users with cognitive disabilities (predictability), large-print needs (consistent stepping), and screen readers (heading levels match visual hierarchy). An arbitrary mix of 18px, 22px, 28px, 31px, 38px breaks the implicit promise of visual rhythm.",
  },
  {
    question: "Which fonts are most accessible?",
    answer:
      "Atkinson Hyperlegible (Braille Institute, 2020) and Lexend (Bonnie Shaver-Troup, 2020) are designed specifically for accessibility — Atkinson maximizes letterform distinction for low-vision readers, Lexend reduces visual stress and improves reading proficiency in research trials. For general accessibility, modern sans-serifs like Inter, Geist, and IBM Plex Sans hold up well. OpenDyslexic specifically targets dyslexic readers with weighted letterforms; it works for some readers and not others.",
  },
  {
    question: "What is fluid typography with clamp() and why use it?",
    answer:
      "Fluid typography wraps each size in CSS clamp(min, preferred, max) so the size interpolates linearly between a small and large viewport with no media queries. At 360px viewport you get the min size; at 1280px you get the max; everywhere in between is a smooth ramp. The math: clamp(min, intercept + slope × 100vw, max) where slope = (max−min)/(maxVw−minVw) × 100. Headings benefit most — shrinking h1 on small screens avoids ugly line breaks while keeping body text constant.",
  },
  {
    question: "What is Flesch Reading Ease and how do I use it?",
    answer:
      "Flesch Reading Ease (Rudolf Flesch, 1948) scores text on a 0-100 scale based on average sentence length and average syllables per word. Higher is easier. 60-69 is &ldquo;standard&rdquo; (8th-9th grade). Marketing and product copy should aim for ≥ 60. Long-form content can go lower if the audience is technical. The Studio's analyzer pairs the score with Flesch-Kincaid Grade Level (US school grade equivalent) and flags long-sentence patterns.",
  },
  {
    question: "How do I handle typography accessibility for users with dyslexia?",
    answer:
      "The British Dyslexia Association recommends: 18px+ body, generous line-height (≥ 1.5), looser letter-spacing (+0.03em or more), tighter line length (≤ 60ch), sans-serif typefaces with distinctive letterforms (Atkinson Hyperlegible, Lexend, or Open Sans). Avoid italics for long passages. Avoid all-caps. The Studio's &ldquo;Dyslexia-friendly&rdquo; preset applies all of this in one click.",
  },
  {
    question: "Can I pair this with a color palette?",
    answer:
      "Yes — paste a palette's primary hex into the Studio (or share a URL between the Typography Studio and the Palette Studio) and the typography report grades each text role's contrast against the palette's derived background and surface tokens using both WCAG 2.2 ratios and APCA Lc. The two studios together produce a complete design-system-in-a-box.",
  },
  {
    question: "How do I export typography tokens?",
    answer:
      "Same story as colors. Use W3C DTCG composite typography tokens as your source of truth; transform to Tailwind v4 @theme blocks, v3 config, CSS variables with utility classes, Tokens Studio JSON for Figma, Swift UIFont extensions, and Jetpack Compose TextStyle objects. The Studio outputs all of these in one click.",
  },
]

export default function AccessibleTypographyGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Guides", url: "https://accessibility.build/guides" },
          {
            name: "Accessible Typography (WCAG 2.2 + 3)",
            url: "https://accessibility.build/guides/accessible-typography-wcag",
          },
        ]}
      />

      <ArticleStructuredData
        headline="Accessible Typography — the complete WCAG 2.2 + 3 guide"
        description="Modular type scales, fluid clamp() sizing, WCAG 1.4.4 / 1.4.8 / 1.4.12 compliance, dyslexia and cognitive disability research, Flesch-Kincaid readability scoring, and design-token exports."
        author={{ name: "Khushwant Parihar", url: "https://accessibility.build/about" }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-05-23"
        dateModified="2026-05-23"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/guides/accessible-typography-wcag"
        wordCount={2700}
        keywords={[
          "accessible typography",
          "modular type scale",
          "WCAG 1.4.12 text spacing",
          "fluid typography clamp",
          "dyslexia typography",
          "Flesch-Kincaid",
        ]}
      />

      <HowToStructuredData
        name="How to Build an Accessible Typography System"
        description="A step-by-step workflow for designing typography that meets WCAG 2.2 + APCA, scales fluidly, and exports cleanly to every platform."
        totalTime="PT45M"
        tool={["Accessible Typography Studio", "Accessible Palette Studio", "Tokens Studio for Figma"]}
        steps={workflow}
      />

      <FAQStructuredData faqs={faqItems} />

      <main className="min-h-screen bg-background">
        <section className="border-b bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="container-wide py-16 md:py-24">
            <div className="max-w-4xl">
              <Badge variant="secondary" className="mb-5">
                WCAG 2.2 · APCA · Type systems
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white md:text-6xl">
                Accessible typography, end to end
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-700 dark:text-slate-300 md:text-xl">
                The complete blueprint for shipping a typography system that
                meets WCAG 2.2, supports dyslexia and low-vision users, reads
                comfortably under text-spacing overrides, and exports as design
                tokens to every platform you ship to.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/tools/accessible-typography-studio">
                    Open the Typography Studio
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/guides/oklch-apca-color-systems">
                    Pair with OKLCH color guide
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                ~13 min read · Updated May 2026
              </p>
            </div>
          </div>
        </section>

        <section className="container-wide py-14 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-lg border bg-card p-5">
                <TypeIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="mt-3 text-xl font-semibold">Quick checklist</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {[
                    "Body 16px+, line-height ≥ 1.5",
                    "Line length 45–80ch",
                    "Modular scale (one ratio)",
                    "Fluid clamp() sizing",
                    "Pass WCAG 1.4.12 override",
                    "Flesch ≥ 60 on real copy",
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
                  Setting the heading scale first and forgetting that the body —
                  not the h1 — is the contract with the user. Body type is
                  what people <em>read</em>. A perfect display face with a
                  cramped body fails accessibility before the first heading
                  appears on screen.
                </p>
              </div>

              <div className="rounded-lg border bg-card p-5">
                <Sparkles className="h-6 w-6 text-sky-500" aria-hidden="true" />
                <h2 className="mt-3 text-xl font-semibold">Companion tool</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  The{" "}
                  <Link
                    href="/tools/accessible-typography-studio"
                    className="font-semibold underline underline-offset-4"
                  >
                    Accessible Typography Studio
                  </Link>{" "}
                  implements every workflow step in this guide and ships
                  ready-to-paste tokens for Tailwind, Figma, CSS, iOS, and
                  Android.
                </p>
              </div>
            </aside>

            <article className="space-y-12">
              <section>
                <div className="flex items-center gap-3">
                  <Layers className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    Why typography accessibility is the hard problem
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Color contrast gets the most attention because contrast
                  checkers are everywhere. Typography accessibility is the
                  harder problem precisely because no single tool covers it.
                  WCAG splits it across five separate Success Criteria — 1.4.4
                  (resize), 1.4.8 (visual presentation), 1.4.12 (text spacing),
                  1.4.3 (contrast), 1.3.1 (info and relationships) — and most
                  teams audit one or two of them and ship.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Real typography accessibility is the sum of body size,
                  line-height, line length, letter-spacing, paragraph spacing,
                  font choice, heading hierarchy, and the contrast of every
                  text role against every background it can land on — graded
                  under both WCAG 2.2 and the APCA draft, evaluated against
                  the text-spacing overrides that 1.4.12 mandates, and
                  delivered as design tokens so the choices survive past the
                  PR that introduced them.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    The modular scale and the ratios that matter
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  A modular scale is just <code>base × ratio^step</code>. Pick
                  a base (typically 16px for the body), pick a ratio (1.125 to
                  1.618), and every size in the system falls out of that one
                  equation. The Studio supports eight ratios derived from
                  musical intervals — minor second (1.067) at the subtle end
                  through golden ratio (1.618) at the dramatic end.
                </p>
                <div className="mt-6 overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left">Ratio</th>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Best for</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["1.067", "Minor second", "Dense SaaS dashboards"],
                        ["1.125", "Major second", "Calm product UI"],
                        ["1.2", "Minor third", "Versatile default"],
                        ["1.25", "Major third", "Confident hierarchy"],
                        ["1.333", "Perfect fourth", "Marketing landing pages"],
                        ["1.414", "Augmented fourth", "Dramatic display"],
                        ["1.5", "Perfect fifth", "Editorial long-form"],
                        ["1.618", "Golden ratio", "Display-driven sites"],
                      ].map(([ratio, name, role], i) => (
                        <tr key={ratio} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                          <td className="px-3 py-2 font-mono">{ratio}</td>
                          <td className="px-3 py-2">{name}</td>
                          <td className="px-3 py-2 text-muted-foreground">{role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Stick to one ratio across the whole system. Mixing ratios is
                  the design equivalent of switching key signatures mid-song —
                  it works in jazz but it doesn't work in a design system.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <FileCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    Fluid sizing with clamp() — no media queries required
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Each font size wraps in <code>clamp(min, preferred, max)</code>{" "}
                  where <code>preferred</code> is a viewport-linear expression
                  like <code>1.5rem + 1.2vw</code>. Below the minimum viewport
                  the size locks to <code>min</code>; above the maximum it
                  locks to <code>max</code>; in between it interpolates
                  smoothly.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  The math, written out: <code>slope = (maxPx − minPx) / (maxVw − minVw)</code>
                  ; <code>intercept = minPx − slope × minVw</code>; the
                  resulting CSS is <code>clamp(minPx, intercept + slope × 100vw, maxPx)</code>.
                  No media queries, no breakpoint logic, just a smooth ramp
                  from 360px screens to 1280px screens.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Body text usually stays constant — the readable size is the
                  readable size whether the viewport is small or large. Headings
                  benefit most from fluid sizing: an h1 that's 56px on desktop
                  can comfortably shrink to 32px on a 360px phone without
                  breaking the line at an awkward word.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    WCAG 1.4.12 — the override test almost no one runs
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  WCAG 2.1 introduced Success Criterion 1.4.12 (Text Spacing,
                  level AA) and WCAG 2.2 carried it forward. The requirement:
                  users must be able to apply text-spacing overrides without
                  losing functionality. Specifically:
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-3 rounded-lg border p-3">
                    <code className="shrink-0 font-mono text-xs font-semibold text-primary">
                      line-height ≥ 1.5×
                    </code>
                    Line height at least 1.5 times the font size
                  </li>
                  <li className="flex gap-3 rounded-lg border p-3">
                    <code className="shrink-0 font-mono text-xs font-semibold text-primary">
                      letter-spacing ≥ 0.12em
                    </code>
                    Spacing following letters at least 0.12 times the font size
                  </li>
                  <li className="flex gap-3 rounded-lg border p-3">
                    <code className="shrink-0 font-mono text-xs font-semibold text-primary">
                      word-spacing ≥ 0.16em
                    </code>
                    Spacing following words at least 0.16 times the font size
                  </li>
                  <li className="flex gap-3 rounded-lg border p-3">
                    <code className="shrink-0 font-mono text-xs font-semibold text-primary">
                      paragraph-spacing ≥ 2×
                    </code>
                    Spacing following paragraphs at least 2 times the font size
                  </li>
                </ul>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  This is one of the most-failed criteria in WCAG 2.1 audits.
                  Most production sites have <em>some</em> component — a fixed
                  card height, a hardcoded button padding, a header bar with a
                  baked-in font-size — that breaks when these overrides apply.
                  The Studio's override toggle simulates the worst case so you
                  catch it before users do.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    Dyslexia, cognitive load, and the research that matters
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  The British Dyslexia Association style guide and the W3C
                  Cognitive Accessibility Task Force converge on similar
                  recommendations: larger body text (18px+), looser line-height
                  (1.5+), generous letter and word spacing, shorter line length
                  (≤ 60ch), sans-serif typefaces with distinctive letterforms.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Two typefaces deserve specific mention. Atkinson Hyperlegible,
                  released by the Braille Institute in 2020, is specifically
                  designed to maximize letterform distinction for low-vision
                  readers — the <code>b</code> and <code>d</code> are
                  unmistakable, the zero is dotted, the lowercase <code>l</code>{" "}
                  carries an unmistakable curl. Lexend, designed by Bonnie
                  Shaver-Troup with cognitive scientists, demonstrably improves
                  reading speed in research trials, particularly for readers
                  with dyslexia.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  OpenDyslexic targets dyslexic readers specifically with
                  weighted letterforms that anchor characters to the baseline.
                  Research on its effectiveness is mixed — some readers benefit
                  significantly, others see no improvement or prefer Atkinson.
                  Offer it as an option rather than mandating it.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <FileCheck className="h-6 w-6 text-primary" aria-hidden="true" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    Readability scoring and the words themselves
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Type design only goes so far. The words themselves matter.
                  Two metrics are worth tracking on every page of significant
                  body copy:
                </p>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  <li>
                    <strong>Flesch Reading Ease</strong> (Rudolf Flesch, 1948):
                    <code className="ml-1 font-mono text-xs">
                      206.835 − 1.015(words/sentences) − 84.6(syllables/words)
                    </code>
                    . Scores ≥ 60 are recommended for general audiences. 70+ is
                    &ldquo;fairly easy.&rdquo; Below 50 most readers struggle.
                  </li>
                  <li>
                    <strong>Flesch-Kincaid Grade Level</strong> (1975):{" "}
                    <code className="font-mono text-xs">
                      0.39(words/sentences) + 11.8(syllables/words) − 15.59
                    </code>
                    . Returns the approximate US school grade required to read
                    the text. Aim for ≤ 8 in marketing copy, ≤ 10 in product
                    docs, ≤ 12 for technical writing.
                  </li>
                </ul>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Both are imperfect. They miss vocabulary specificity, they
                  reward short sentences regardless of quality, they don't
                  understand cohesion. But they catch the easy failures:
                  35-word sentences, paragraphs of 3+ syllable words, copy
                  written for executives and shipped to consumers.
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

              <section className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-sky-50/40 p-8 dark:to-sky-950/20">
                <h2 className="text-2xl font-bold tracking-tight">
                  Build your typography system in the Studio
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Apply every step of this guide in one click: modular type
                  scale, fluid clamp() sizing, dyslexia / cognitive / low-vision
                  presets, WCAG 1.4.12 override testing, per-role contrast
                  grading, Flesch-Kincaid analyzer, and token exports for every
                  platform.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/tools/accessible-typography-studio">
                      Open Typography Studio
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/guides/oklch-apca-color-systems">
                      Read the color companion
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
