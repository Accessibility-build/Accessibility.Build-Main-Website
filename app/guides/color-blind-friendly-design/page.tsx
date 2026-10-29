import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  ListChecks,
  Palette,
  ShieldCheck,
  XCircle,
} from "lucide-react"
import { PageByline } from "@/components/seo/page-byline"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { clampDescription } from "@/lib/metadata"
import { cn } from "@/lib/utils"

const ROUTE = "/guides/color-blind-friendly-design"
const pageTitle = "Colour Blind Friendly Website Design: A Practical Guide"
const pageDescription =
  "Make your website colour blind friendly: never rely on colour alone, fix links, form errors, status and charts, pick palettes that hold up, and test them."

const ogImage = `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "color blind friendly website",
    "colour blind friendly website",
    "is my website color blind friendly",
    "colour blind friendly design",
    "color blind friendly design",
    "designing for color blindness",
    "designing for colour blindness",
    "what colors are colorblind friendly",
    "colorblind friendly colors",
    "color blindness guidelines",
    "color blind accessibility",
    "colour blindness accessibility",
    "color vision deficiency web design",
    "colorblind friendly palette",
    "okabe ito palette",
    "color blind safe colors",
    "red green color blindness design",
    "wcag 1.4.1 use of color",
    "use of color accessibility",
    "link underline accessibility",
    "color blind friendly charts",
  ],
  alternates: {
    canonical: ROUTE,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "article",
    siteName: "Accessibility.build",
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Colour Blind Friendly Design",
    url: `https://accessibility.build${ROUTE}`,
  },
]

const linkClass =
  "text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2"

const faqs = [
  {
    question: "What colours are colour blind friendly?",
    answer:
      "No single colour is colour blind friendly on its own; what matters is how colours are combined. The most reliable pairing is blue with orange, because the common red-green deficiencies leave the blue to yellow difference largely intact. Beyond that, choose colours that differ clearly in lightness, not just in hue, so they stay apart for every type of colour vision and in greyscale. For charts, the eight-colour set published by Masataka Okabe and Kei Ito is a well-tested starting point. Whatever palette you use, never let colour be the only way to tell two things apart: add a label, an icon, a pattern or an underline.",
  },
  {
    question: "How do I check if my website is colour blind friendly?",
    answer:
      "Load the page in a vision simulator and look at it as protanopia, deuteranopia, tritanopia and achromatopsia, side by side with the original. Anything you can no longer tell apart, such as links in text, error fields, status badges, selected tabs or chart lines, depends on colour alone and needs a second cue. Then switch your screen to greyscale using the colour filter in macOS or Windows settings and repeat the check, and measure text and control colours with a contrast checker, because a simulation cannot measure contrast. Finally, ask people with colour vision deficiency to try your key pages.",
  },
  {
    question: "Which colour combinations are hardest for colour blind people?",
    answer:
      "For the common red-green types: red with green, green with brown, green with orange, blue with purple, pink with grey, light green with yellow, and black next to very dark reds, greens or blues. For the rare tritan types, blue with green and yellow with pink. The underlying problem is the same in every case: the two colours differ mainly in hue while having similar lightness. Colours that differ strongly in lightness stay distinguishable even when their hues collapse together.",
  },
  {
    question: "How many people are colour blind?",
    answer:
      "Colour Blind Awareness estimates about 1 in 12 men and 1 in 200 women have a colour vision deficiency, around 3 million people in the UK. Those headline figures match large surveys of people of European ancestry, and rates vary between populations. A 2012 meta-analysis by Birch in the Journal of the Optical Society of America A found red-green deficiency in about 8% of European Caucasian men and 0.4% of women, and in 4% to 6.5% of Chinese and Japanese men. Most affected people have a red-green type; blue-yellow types and complete colour blindness are rare.",
  },
  {
    question: "Does WCAG require colour blind friendly design?",
    answer:
      "Yes, in effect. WCAG 2.2 success criterion 1.4.1 Use of Color (Level A) says colour must not be the only visual means of conveying information, indicating an action, prompting a response or distinguishing an element. Two Level AA criteria support it: 1.4.3 Contrast (Minimum) sets 4.5:1 for normal text and 3:1 for large text, and 1.4.11 Non-text Contrast sets 3:1 for controls, focus indicators and graphics needed to understand the content. WCAG does not require any particular palette; it requires that meaning never depends on telling colours apart.",
  },
  {
    question: "Do links have to be underlined for colour blind users?",
    answer:
      "Not strictly, but underlining links in running text is the simplest way to meet WCAG 1.4.1. The alternative WCAG technique, G183, lets a link rely on colour only if the link colour has at least 3:1 contrast against the surrounding text and both colours still meet text contrast against the background. That leaves very few usable colours: with dark grey body text such as #333333 on white, no colour can satisfy both conditions. Links in navigation bars, buttons and card titles are already identified by their position and shape, so the rule matters most for links inside paragraphs.",
  },
  {
    question: "Can I still use red and green in my design?",
    answer:
      "Yes. WCAG does not ban any colour, and red and green carry useful meaning for many people. The rule is that they must not be the only signal. Pair a red error with an error icon and the word Error, pair a green success state with a tick and a message, and choose shades that also differ in lightness, such as a dark green with a lighter orange-red, so the difference survives for people who cannot see the hue.",
  },
]

const checklist = [
  {
    title: "No colour-only meaning.",
    text: "Every link, error, status, selected state, chart series and map class has a second cue: text, an icon shape, a pattern, an underline or a clear lightness difference (1.4.1).",
  },
  {
    title: "Links in text are underlined.",
    text: "Or, if you rely on G183, the link colour has 3:1 against the body text and both meet 4.5:1 against the background. Hover and focus change something other than colour.",
  },
  {
    title: "Errors say what is wrong in words.",
    text: "Error fields get a text message, an icon and a thicker border, not just a red outline; required fields are marked with a word or an explained asterisk.",
  },
  {
    title: "Status uses shape and text.",
    text: "Badges, dots and traffic-light indicators carry a label and a distinct icon; selected tabs and toggles show their state with weight, position or a marker.",
  },
  {
    title: "Charts are directly labelled.",
    text: "Series are named on the chart, lines use dash patterns or marker shapes, and a data table gives the same values.",
  },
  {
    title: "Colours that must differ, differ in lightness.",
    text: "Pairs such as red and green, blue and purple or green and brown are never the only distinction; aim for around 3:1 between colours that must be told apart.",
  },
  {
    title: "The palette is checked, not assumed.",
    text: "Even a colour-blind-safe set such as Okabe and Ito's can fail 1.4.11 on white, and some of its colours merge in greyscale.",
  },
  {
    title: "Contrast is measured.",
    text: "Text meets 4.5:1 (3:1 when large) and meaningful graphics and control boundaries meet 3:1 (1.4.3, 1.4.11).",
  },
  {
    title: "The page passes the simulator and greyscale tests.",
    text: "Nothing that matters disappears under protan, deutan, tritan or achromatopsia simulation, or with the screen in greyscale.",
  },
  {
    title: "Real people have tried it.",
    text: "People with colour vision deficiency have used your key flows, because a simulation is a model, not their eyes.",
  },
]

function Swatch({ hex, label }: { hex: string; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span
        aria-hidden="true"
        className="inline-block h-4 w-4 shrink-0 rounded-sm border border-slate-400 dark:border-slate-500"
        style={{ backgroundColor: hex }}
      />
      <span>
        {label ? `${label} ` : null}
        <code className="text-xs">{hex}</code>
      </span>
    </span>
  )
}

function Verdict({
  verdict,
  title,
  children,
}: {
  verdict: "fails" | "works"
  title: string
  children: ReactNode
}) {
  const fails = verdict === "fails"
  return (
    <div
      className={cn(
        "min-w-0 rounded-lg border p-4",
        fails
          ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20"
          : "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20"
      )}
    >
      <p
        className={cn(
          "mb-2 flex items-center gap-2 text-sm font-semibold",
          fails ? "text-red-800 dark:text-red-300" : "text-green-800 dark:text-green-300"
        )}
      >
        {fails ? (
          <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
        <span>
          {fails ? "Fails" : "Works"}: {title}
        </span>
      </p>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  )
}

function CodeBlock({ code }: { code: string }) {
  // Each scrollable code region needs its own name; the first line of the code says what it is.
  const firstLine = code.trim().split("\n")[0].replace(/^[/*<!\-\s]+|[*/>\-\s{]+$/g, "").trim()
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label={`Code example: ${firstLine}`}
      className="not-prose my-4 overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-800"
    >
      <pre className="p-4 text-sm text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function SimulatorCallout({ id, text }: { id: string; text: string }) {
  return (
    <div
      role="group"
      aria-labelledby={id}
      className="not-prose my-6 flex flex-col gap-4 rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/20 sm:flex-row sm:items-center"
    >
      <Eye className="h-8 w-8 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
      <div className="flex-1">
        <p id={id} className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-200">
          Free tool: Website Vision Simulator
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
      <Button asChild className="shrink-0 gap-2">
        <Link href="/tools/website-vision-simulator">
          Open the Website Vision Simulator
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  )
}

export default function ColorBlindFriendlyDesignGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema
        route={ROUTE}
        title={pageTitle}
        description={pageDescription}
        datePublished="2026-10-28"
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Colour Blind Friendly Design
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article>
          {/* Hero */}
          <section className="pt-12 pb-8 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                Design Guide
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Colour Blind Friendly Design for Websites
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Most people with colour vision deficiency see plenty of colour.
                What they lose is the ability to tell certain colours apart,
                usually reds from greens. A website is colour blind friendly
                when nothing on it depends on that ability: every link, error,
                status, chart and selected state also has a word, a shape, a
                pattern or a lightness difference. This guide covers who is
                affected, what WCAG asks for, the practical rules with good and
                bad examples, the palettes that hold up, and how to check your
                own pages in a few minutes.
              </p>
              <PageByline
                route={ROUTE}
                variant="hero"
                align="center"
                source={{
                  label: "W3C: Understanding 1.4.1 Use of Color",
                  href: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
                }}
              />
            </div>
          </section>

          <section className="pb-4 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <SimulatorCallout
                id="simulator-callout-top"
                text="Enter a web address or upload a screenshot and see the page with protan, deutan or tritan colour vision deficiency, achromatopsia, blurred vision or low contrast sensitivity, next to the original. It is the fastest way to find links, errors and charts that only colour tells apart."
              />
            </div>
          </section>

          {/* Who is affected */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Colour Vision Deficiency: Types and How Common It Is
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Colour blindness, more accurately called colour vision
                  deficiency (CVD), usually means that one of the three types of
                  cone cell in the eye is missing or responds differently from
                  normal. Very few people see no colour at all. The common forms
                  affect the red and green cones, and because the genes for those
                  cones are carried on the X chromosome, inherited red-green
                  deficiency is far more common in men than in women.{" "}
                  <a
                    href="https://www.colourblindawareness.org/colour-blindness/"
                    className={linkClass}
                  >
                    Colour Blind Awareness
                  </a>{" "}
                  estimates that it affects about 1 in 12 men and 1 in 200
                  women, around 3 million people in the UK.
                </p>
              </div>
              <div tabIndex={0} role="region" aria-label="Types of colour vision deficiency, the cones affected, what people confuse, and approximate prevalence" className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 my-6">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Types of colour vision deficiency, the cones affected, what
                    people confuse, and approximate prevalence
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Type</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Cones affected</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What gets confused</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Approximate prevalence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Deuteranomaly
                      </th>
                      <td className="px-4 py-3 align-top">Green cones shifted</td>
                      <td className="px-4 py-3 align-top">Reds, greens, oranges and browns, from mildly to strongly</td>
                      <td className="px-4 py-3 align-top">About 5% of men, the most common form</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Deuteranopia
                      </th>
                      <td className="px-4 py-3 align-top">Green cones missing</td>
                      <td className="px-4 py-3 align-top">The same colours, more strongly</td>
                      <td className="px-4 py-3 align-top">About 1% of men</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Protanomaly
                      </th>
                      <td className="px-4 py-3 align-top">Red cones shifted</td>
                      <td className="px-4 py-3 align-top">Reds, greens and browns; reds look duller and darker</td>
                      <td className="px-4 py-3 align-top">About 1% of men</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Protanopia
                      </th>
                      <td className="px-4 py-3 align-top">Red cones missing</td>
                      <td className="px-4 py-3 align-top">As above; dark reds can look close to black</td>
                      <td className="px-4 py-3 align-top">About 1% of men</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Tritanomaly and tritanopia
                      </th>
                      <td className="px-4 py-3 align-top">Blue cones shifted or missing</td>
                      <td className="px-4 py-3 align-top">Blues with greens, yellows with pinks</td>
                      <td className="px-4 py-3 align-top" rowSpan={2}>
                        Rare: together perhaps 1 in 30,000 to 50,000 people;
                        achromatopsia about 1 in 33,000
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Achromatopsia
                      </th>
                      <td className="px-4 py-3 align-top">No working colour vision</td>
                      <td className="px-4 py-3 align-top">Every colour of similar lightness; often with light sensitivity and reduced sharpness</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Figures for men are the breakdown by{" "}
                <a
                  href="https://www.colourblindawareness.org/colour-blindness/types-of-colour-blindness/"
                  className={linkClass}
                >
                  Colour Blind Awareness of the main types of colour blindness
                </a>{" "}
                of the 8% of men with inherited red-green deficiency; the rare
                types are its estimates. Dark reds appearing near black for
                protanopes is noted by Okabe and Ito, who are both protanopes
                themselves.
              </p>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Be precise about the headline number
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The &ldquo;1 in 12 men&rdquo; figure matches surveys of people
                  of European ancestry, and the rate varies between populations.
                  Colour Blind Awareness notes it rises to about 10 to 11% of men in
                  Scandinavia. A 2012 meta-analysis by Birch in the{" "}
                  <a
                    href="https://pubmed.ncbi.nlm.nih.gov/22472762/"
                    className={linkClass}
                  >
                    Journal of the Optical Society of America A
                  </a>{" "}
                  put red-green deficiency at about 8% of men and 0.4% of women
                  among European Caucasians, but between 4% and 6.5% among
                  Chinese and Japanese men. So the rate in your audience depends
                  on who your audience is. At any realistic scale, though, it is
                  far too many people to design around.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Colour vision can also change during life. The{" "}
                  <a
                    href="https://www.nhs.uk/conditions/colour-vision-deficiency/"
                    className={linkClass}
                  >
                    NHS page on colour vision deficiency
                  </a>{" "}
                  lists glaucoma, diabetes, multiple sclerosis, a stroke, an eye
                  or head injury and some medicines among the causes, and Colour
                  Blind Awareness suggests acquired deficiencies could affect as
                  many as 3% of people while noting that reliable figures are
                  hard to find. Add everyone reading a phone in bright sunlight
                  or on a greyscale e-reader, and colour-only design fails more
                  people than any prevalence table shows.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                What WCAG Asks For: 1.4.1, 1.4.3 and 1.4.11
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Three WCAG 2.2 success criteria cover colour blind users. Only
                one of them is about colour as such; the other two are about
                lightness contrast, which is the part of colour that colour
                vision deficiency mostly leaves intact.
              </p>
              <div tabIndex={0} role="region" aria-label="WCAG 2.2 success criteria that protect colour blind users, their level, what each requires and what it means in practice" className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that protect colour blind users,
                    their level, what each requires and what it means in practice
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Criterion</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Level</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it requires</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it means for colour blind users</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium align-top">
                        <Link href="/wcag/1-4-1" className={linkClass}>
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3 align-top">A</td>
                      <td className="px-4 py-3 align-top">
                        Colour is not the only visual way of conveying
                        information, indicating an action, prompting a response
                        or distinguishing an element.
                      </td>
                      <td className="px-4 py-3 align-top">
                        The core rule. Colour can stay, but another cue has to
                        carry the same meaning.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium align-top">
                        <Link href="/wcag/1-4-3" className={linkClass}>
                          1.4.3 Contrast (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3 align-top">AA</td>
                      <td className="px-4 py-3 align-top">
                        Text has at least 4.5:1 contrast with its background, or
                        3:1 for large text (18 point, or 14 point bold).
                      </td>
                      <td className="px-4 py-3 align-top">
                        Red or green text stays readable because its lightness,
                        not its hue, sets it apart from the background.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium align-top">
                        <Link href="/wcag/1-4-11" className={linkClass}>
                          1.4.11 Non-text Contrast
                        </Link>
                      </th>
                      <td className="px-4 py-3 align-top">AA</td>
                      <td className="px-4 py-3 align-top">
                        Control boundaries, states, focus indicators and graphics
                        needed to understand the content have at least 3:1
                        against adjacent colours.
                      </td>
                      <td className="px-4 py-3 align-top">
                        Icons, chart marks and input borders remain visible when
                        their hue is lost.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none mt-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The key idea is that{" "}
                  <strong className="text-slate-900 dark:text-white">
                    contrast and colour are different things
                  </strong>
                  . Colour vision deficiency takes away hue differences; lightness
                  differences mostly survive. That is why the W3C&rsquo;s
                  Understanding document for 1.4.1 accepts a lightness difference
                  of at least 3:1 as a cue that does not depend on seeing colour.
                  It is also why passing 1.4.3 is not enough on its own. Red{" "}
                  <code>#D32F2F</code> and green <code>#2E7D32</code>{" "}each have
                  about 5:1 against white, so both are fine as text, yet the
                  contrast between them is only about 1.03:1. Used as the only
                  difference between &ldquo;failed&rdquo; and
                  &ldquo;passed&rdquo;, they fail 1.4.1.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  1.4.1 does not discourage colour. The Understanding document
                  welcomes colour coding as long as something else carries the
                  same meaning. For the full criterion text, techniques and
                  failures, see the{" "}
                  <Link href="/wcag/1-4-1" className={linkClass}>
                    1.4.1 Use of Color reference
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Rule 1 */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. The Core Rule: Never Use Colour Alone
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Every time colour carries meaning, add a second cue that works
                  without colour vision. You have plenty to choose from:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">Text:</strong>{" "}
                    a label, a word such as &ldquo;Error&rdquo; or
                    &ldquo;Required&rdquo;, or a value.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Shape:</strong>{" "}
                    icons that differ in outline, not just fill colour, such as a
                    tick, a cross and a triangle.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Pattern and line style:</strong>{" "}
                    hatching, dots, dashed and dotted lines, marker shapes.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Position and weight:</strong>{" "}
                    a bar under the selected tab, bold text, a border that gets
                    thicker.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Underlines</strong>{" "}
                    for links in running text.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Lightness:</strong>{" "}
                    a clear light-versus-dark difference of around 3:1 between the
                    two colours.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A quick question to ask of any coloured element: if this were
                  printed in black and white, would I still know what it means?
                  If the answer is no, it needs another cue.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 my-6">
                <Verdict verdict="fails" title="instructions that name a colour">
                  <p>&ldquo;Fields shown in red are required.&rdquo;</p>
                  <p>&ldquo;Click the green button to continue.&rdquo;</p>
                </Verdict>
                <Verdict verdict="works" title="instructions that name a cue anyone can see">
                  <p>
                    &ldquo;Required fields are marked with an asterisk (*).&rdquo;
                  </p>
                  <p>&ldquo;Select Continue to go to payment.&rdquo;</p>
                </Verdict>
              </div>
            </div>
          </section>

          {/* Rule 2: links */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. Underline Links in Running Text
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A link inside a paragraph that differs from the words around it
                  only by colour is a classic 1.4.1 problem, and WCAG lists it as
                  failure F73. For many colour blind readers a
                  blue link in dark grey text is just more dark text. The simple,
                  robust fix is an underline.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Why the no-underline option rarely works
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  WCAG technique G183 lets a link rely on colour if the link
                  colour has at least 3:1 contrast with the surrounding text,
                  while both colours still meet the text contrast requirement
                  against the background. Do the arithmetic and the room is
                  tiny. With black body text on white, a link colour needs a
                  relative luminance between about 0.10 and 0.18: mid blues such
                  as <code>#2563EB</code> work (5.17:1 on white, 4.06:1 against
                  black). With the very common <code>#333333</code> body text, no
                  colour works at all, because anything 3:1 lighter than the text
                  drops below 4.5:1 on white. G183 itself notes that dark link
                  colours can be hard to tell from black text even at 3:1.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 my-6">
                <Verdict verdict="fails" title="colour is the only link cue">
                  <p>
                    Body text <code>#333333</code>, links <code>#2563EB</code>{" "}
                    with no underline. The contrast between them is 2.44:1, below
                    the 3:1 G183 needs.
                  </p>
                  <CodeBlock
                    code={`body { color: #333333; }

/* F73: links only differ from text by colour */
p a {
  color: #2563eb;
  text-decoration: none;
}`}
                  />
                </Verdict>
                <Verdict verdict="works" title="an underline that every reader can see">
                  <p>
                    The underline identifies the link for every type of colour
                    vision, and hover and focus change something other than
                    colour.
                  </p>
                  <CodeBlock
                    code={`p a {
  color: #1d4ed8;           /* 6.7:1 on white */
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.15em;
}

p a:hover,
p a:focus-visible {
  text-decoration-thickness: 3px;
}`}
                  />
                </Verdict>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The rule matters most for links inside paragraphs, lists and
                  table cells. Links in a navigation bar, a card title or a button
                  are already identified by their position and shape, so they do
                  not need an underline to meet 1.4.1. The 1.4.1 Understanding
                  document also confirms that visited and unvisited links may
                  differ by colour alone.
                </p>
              </div>
            </div>
          </section>

          {/* Rule 3: forms */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                3. Form Errors and Required Fields
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Turning a field&rsquo;s border red, or a label red, is the
                  classic way to mark an error, and on its own it is WCAG failure
                  F81. To someone with deuteranopia, a red border and a mid-grey
                  border can look like two similar dull outlines. Errors need
                  words, and ideally an icon
                  and a heavier border too, so the state reads in any colour
                  vision and in greyscale.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 my-6">
                <Verdict verdict="fails" title="a red outline is the only signal">
                  <CodeBlock
                    code={`<label for="email">Email address</label>
<input id="email" type="email"
       class="border-red">

<!-- Nothing says what is wrong,
     and only colour says anything is -->`}
                  />
                </Verdict>
                <Verdict verdict="works" title="text, icon and border weight">
                  <CodeBlock
                    code={`<label for="email">Email address (required)</label>
<input id="email" type="email"
       aria-invalid="true"
       aria-describedby="email-error">
<p id="email-error" class="field-error">
  <svg aria-hidden="true"><!-- warning icon --></svg>
  Error: enter an email address
  like name@example.com
</p>`}
                  />
                </Verdict>
              </div>
              <CodeBlock
                code={`/* The state shows in three ways, and colour is only one of them */
input[aria-invalid="true"] {
  border: 2px solid #b91c1c;   /* thicker than the 1px default */
}
.field-error {
  color: #b91c1c;              /* 6.5:1 on white, so it also passes 1.4.3 */
  display: flex;
  gap: 0.5rem;
}`}
              />
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For required fields, put the word &ldquo;required&rdquo; in the
                  label, or use an asterisk and explain it once at the top of the
                  form. The 1.4.1 Understanding document gives exactly this
                  pattern as a passing example: required labels in red that also
                  carry an icon. The error message itself, with{" "}
                  <code>aria-invalid</code> and <code>aria-describedby</code>,
                  also serves screen reader users under{" "}
                  <Link href="/wcag/3-3-1" className={linkClass}>
                    3.3.1 Error Identification
                  </Link>
                  . The{" "}
                  <Link href="/guides/accessible-form-validation" className={linkClass}>
                    accessible form validation guide
                  </Link>{" "}
                  covers timing, error summaries and focus.
                </p>
              </div>
            </div>
          </section>

          {/* Rule 4: status */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. Status Indicators, Badges and Selected States
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Dashboards are full of green, amber and red dots, and they are
                  exactly the colours that red-green colour vision deficiency
                  merges. The same goes for a tab that shows it is selected only
                  by turning blue, or a toggle that goes from grey to green.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 my-6">
                <Verdict verdict="fails" title="status dots that differ only in colour">
                  <CodeBlock
                    code={`<span class="dot dot-green"></span> Payments API
<span class="dot dot-amber"></span> Search
<span class="dot dot-red"></span>   Email`}
                  />
                </Verdict>
                <Verdict verdict="works" title="shape and words carry the status">
                  <CodeBlock
                    code={`<span class="status status-ok">
  <svg aria-hidden="true"><!-- tick --></svg>
  Payments API: Operational
</span>
<span class="status status-warn">
  <svg aria-hidden="true"><!-- triangle --></svg>
  Search: Degraded
</span>
<span class="status status-down">
  <svg aria-hidden="true"><!-- cross --></svg>
  Email: Down
</span>`}
                  />
                </Verdict>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Use icons with different outlines,
                    </strong>{" "}
                    not the same circle in three colours. A tick, a triangle and a
                    cross are told apart by shape alone.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Keep the word.
                    </strong>{" "}
                    &ldquo;Operational&rdquo;, &ldquo;Degraded&rdquo;,
                    &ldquo;Down&rdquo; work for everyone, including screen reader
                    users, and remove any need for a legend.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Show selection with more than colour.
                    </strong>{" "}
                    A selected tab gets a thick bar underneath and bold text; a
                    toggle shows On and Off or moves its thumb; a chosen option
                    gets a tick.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Give icons enough contrast.
                    </strong>{" "}
                    If the icon is what tells people the status, it is a graphic
                    needed to understand the content, and{" "}
                    <Link href="/wcag/1-4-11" className={linkClass}>
                      1.4.11
                    </Link>{" "}
                    asks for 3:1 against its background.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If the status changes while someone is on the page, announce it
                  to screen reader users too; the{" "}
                  <Link href="/guides/accessible-notifications" className={linkClass}>
                    accessible notifications guide
                  </Link>{" "}
                  shows how.
                </p>
              </div>
            </div>
          </section>

          {/* Rule 5: charts and maps */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <BarChart3 className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                5. Charts, Graphs and Maps
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Charts lean on colour harder than anything else on a page. Three
                  habits make them readable without it: label each series directly
                  on the chart instead of in a legend, give each series a second
                  visual property such as a dash pattern or marker shape, and
                  provide the numbers as a table. The{" "}
                  <Link href="/guides/accessible-charts" className={linkClass}>
                    accessible charts guide
                  </Link>{" "}
                  covers the markup, patterns and data table in depth; here is the
                  colour-specific part.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 my-6">
                <Verdict verdict="fails" title="red and green lines with a legend">
                  <p>
                    Two solid lines in <code>#D32F2F</code> and{" "}
                    <code>#388E3C</code>, explained by coloured squares in a
                    legend. With deuteranopia the two lines look the same olive
                    colour, and the legend cannot be matched to either.
                  </p>
                </Verdict>
                <Verdict verdict="works" title="direct labels, line styles and a safe pair">
                  <p>
                    Blue <code>#0072B2</code> solid and vermillion{" "}
                    <code>#D55E00</code> dashed, each named at the end of its line.
                    The labels and dashes carry the meaning; the colours only
                    reinforce it.
                  </p>
                </Verdict>
              </div>
              <CodeBlock
                code={`<svg role="img" aria-labelledby="chart-title" viewBox="0 0 600 300">
  <title id="chart-title">Visits by device, January to June</title>
  <path d="M40 220 L140 200 L240 170 L340 150 L440 120 L540 90"
        fill="none" stroke="#0072B2" stroke-width="3" />
  <path d="M40 240 L140 235 L240 225 L340 210 L440 205 L540 190"
        fill="none" stroke="#D55E00" stroke-width="3"
        stroke-dasharray="8 6" />
  <!-- Direct labels: no legend to decode -->
  <text x="548" y="94">Mobile</text>
  <text x="548" y="194">Desktop</text>
</svg>`}
              />
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Maps and colour scales
                </h3>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Sequential data (low to high):
                    </strong>{" "}
                    use one hue that runs from light to dark, so the order is
                    carried by lightness and survives every type of colour vision
                    and greyscale.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Diverging data (below and above a midpoint):
                    </strong>{" "}
                    run from a dark blue through a light neutral to a dark orange
                    or brown, not from red through yellow to green.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Avoid rainbow colour maps.
                    </strong>{" "}
                    A 2020 paper by Crameri, Shephard and Heron,{" "}
                    <a
                      href="https://www.nature.com/articles/s41467-020-19160-7"
                      className={linkClass}
                    >
                      The misuse of colour in science communication
                    </a>
                    , shows that rainbow and red-green maps distort data through
                    uneven brightness and are unreadable for many people with
                    colour vision deficiency.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Use a tested scheme.
                    </strong>{" "}
                    <a href="https://colorbrewer2.org/" className={linkClass}>
                      ColorBrewer
                    </a>{" "}
                    offers sequential, diverging and qualitative schemes for maps
                    with a filter for colour blind safe options.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Label what matters.
                    </strong>{" "}
                    Put values or class names on regions where space allows, and
                    offer the data as a list or table. The{" "}
                    <Link href="/guides/accessible-maps" className={linkClass}>
                      accessible maps guide
                    </Link>{" "}
                    treats a choropleth as the chart it really is.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  One subtlety from the 1.4.11 Understanding document: series
                  names on the chart solve 1.4.1, but they do not take the marks
                  out of 1.4.11. Only when the chart also shows the values as text,
                  so the bars or slices are no longer needed to read the data, do
                  the marks stop needing 3:1. A labelled pie chart whose slices can
                  only be told apart by faint edges still fails.
                </p>
              </div>
            </div>
          </section>

          {/* Rule 6: lightness */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. Colour Pairs to Avoid, and Why Lightness Matters More Than Hue
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Red-green colour vision deficiency squeezes the red to green
                  difference between colours. What remains is lightness and the
                  blue to yellow difference. So two colours that differ mainly in
                  hue, while sharing a similar lightness, collapse into one. Two
                  colours that differ strongly in lightness stay apart for every
                  type of colour vision, including achromatopsia, and in
                  greyscale print.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The table shows real pairs run through the{" "}
                  <a
                    href="https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html"
                    className={linkClass}
                  >
                    Machado, Oliveira and Fernandes (2009) model
                  </a>{" "}
                  of deuteranopia at full strength, the same model our simulator
                  and Chrome DevTools use. The contrast column
                  is the WCAG ratio between the two colours, which measures their
                  lightness difference.
                </p>
              </div>
              <div tabIndex={0} role="region" aria-label="Colour pairs, the contrast ratio between them, and how they look with simulated deuteranopia" className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 my-6">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Colour pairs, the contrast ratio between them, and how they
                    look with simulated deuteranopia
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Pair</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Contrast between them</th>
                      <th scope="col" className="px-4 py-3 font-semibold">With simulated deuteranopia</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        <div className="flex flex-col gap-1">
                          <Swatch hex="#D32F2F" label="Red" />
                          <Swatch hex="#388E3C" label="Green" />
                        </div>
                      </th>
                      <td className="px-4 py-3 align-top">1.21:1</td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col gap-1">
                          <Swatch hex="#8B7C28" />
                          <Swatch hex="#867A42" />
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">Two near-identical olives</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        <div className="flex flex-col gap-1">
                          <Swatch hex="#7B1FA2" label="Purple" />
                          <Swatch hex="#1565C0" label="Blue" />
                        </div>
                      </th>
                      <td className="px-4 py-3 align-top">1.43:1</td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col gap-1">
                          <Swatch hex="#07519F" />
                          <Swatch hex="#005FBE" />
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">Two similar blues: the red in the purple is lost</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        <div className="flex flex-col gap-1">
                          <Swatch hex="#9E9E9E" label="Grey" />
                          <Swatch hex="#66BB6A" label="Green" />
                        </div>
                      </th>
                      <td className="px-4 py-3 align-top">1.13:1</td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col gap-1">
                          <Swatch hex="#9E9E9E" />
                          <Swatch hex="#B2A56F" />
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">Grey and a greyish khaki, easily confused</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        <div className="flex flex-col gap-1">
                          <Swatch hex="#0072B2" label="Blue" />
                          <Swatch hex="#E69F00" label="Orange" />
                        </div>
                      </th>
                      <td className="px-4 py-3 align-top">2.30:1</td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-col gap-1">
                          <Swatch hex="#3B67B1" />
                          <Swatch hex="#CAB411" />
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">Still a blue and a yellow: different in hue and lightness</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Pairs that need a second cue
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  None of these is banned. Each is unsafe as the{" "}
                  <em>only</em> difference between two things:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>Red and green, the classic pair, at any similar lightness.</li>
                  <li>Green and brown, and green and orange.</li>
                  <li>Blue and purple, because the red in the purple disappears.</li>
                  <li>Pink and grey, and green and grey.</li>
                  <li>Light green and yellow.</li>
                  <li>Black next to very dark reds, greens, blues or purples.</li>
                  <li>For the rare tritan types: blue and green, and yellow and pink.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The working rule:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    vary lightness first and hue second
                  </strong>
                  . Where two colours must be told apart, aim for around 3:1
                  between them, the same figure WCAG uses for non-text contrast.
                  Where your brand colours cannot give you that, add a label, icon
                  or pattern instead. When you need two colours that read as
                  clearly different to almost everyone, blue and orange is the
                  safest pairing.
                </p>
              </div>
            </div>
          </section>

          {/* Rule 7: palettes */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Palette className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                7. Palettes That Stay Distinguishable
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For charts and categories you need several colours that stay
                  apart for colour blind viewers. The best-known set comes from
                  Masataka Okabe and Kei Ito, two researchers who are themselves
                  strong protanopes, in their{" "}
                  <a href="https://jfly.uni-koeln.de/color/" className={linkClass}>
                    Color Universal Design guide
                  </a>{" "}
                  (first published in 2002 and revised in 2008). The hex values
                  below are the ones popularised in Bang Wong&rsquo;s 2011{" "}
                  <a href="https://www.nature.com/articles/nmeth.1618" className={linkClass}>
                    Nature Methods column on colour blindness
                  </a>
                  . Contrast figures are our own calculations.
                </p>
              </div>
              <div tabIndex={0} role="region" aria-label="The Okabe and Ito colour set with hex values, contrast against white, and suitable uses" className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 my-6">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The Okabe and Ito colour set with hex values, contrast against
                    white, and suitable uses
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Colour</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Contrast on white</th>
                      <th scope="col" className="px-4 py-3 font-semibold">On a white background, use it for</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {[
                      { name: "Black", hex: "#000000", ratio: "21:1", use: "Text, lines, any mark" },
                      { name: "Blue", hex: "#0072B2", ratio: "5.19:1", use: "Text, lines, any mark" },
                      { name: "Vermillion", hex: "#D55E00", ratio: "3.87:1", use: "Lines, bars and icons (3:1); large text only" },
                      { name: "Bluish green", hex: "#009E73", ratio: "3.42:1", use: "Lines, bars and icons (3:1); large text only" },
                      { name: "Reddish purple", hex: "#CC79A7", ratio: "3.06:1", use: "Lines, bars and icons (3:1); large text only" },
                      { name: "Sky blue", hex: "#56B4E9", ratio: "2.31:1", use: "Filled areas with a border or a direct label" },
                      { name: "Orange", hex: "#E69F00", ratio: "2.25:1", use: "Filled areas with a border or a direct label" },
                      { name: "Yellow", hex: "#F0E442", ratio: "1.32:1", use: "Filled areas with a dark border, or dark backgrounds" },
                    ].map((row) => (
                      <tr key={row.hex}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          <Swatch hex={row.hex} label={row.name} />
                        </th>
                        <td className="px-4 py-3 align-top">{row.ratio}</td>
                        <td className="px-4 py-3 align-top">{row.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Colour blind safe is not the same as contrast safe
                </h3>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    Three of the eight colours fall below 3:1 on white, so as the
                    only way to see a bar or a line they would fail{" "}
                    <Link href="/wcag/1-4-11" className={linkClass}>
                      1.4.11
                    </Link>
                    . Give them a dark outline, label them directly, or save them
                    for dark backgrounds.
                  </li>
                  <li>
                    Orange and sky blue have almost exactly the same lightness
                    (about 1.02:1 between them). They are easy to tell apart by hue
                    for red-green colour blind viewers, but they merge in greyscale
                    and for people with achromatopsia. Do not put them side by side
                    without a pattern or label.
                  </li>
                  <li>
                    Okabe and Ito recommend the darker blue and orange, rather than
                    sky blue and yellow, for thin lines and small objects.
                  </li>
                  <li>
                    Only black and blue reach 4.5:1 for normal-size text on white.
                  </li>
                </ul>
              </div>
              <CodeBlock
                code={`:root {
  /* Okabe and Ito colour set, hex values as published by Wong (2011) */
  --cud-black:          #000000;
  --cud-orange:         #e69f00;
  --cud-sky-blue:       #56b4e9;
  --cud-bluish-green:   #009e73;
  --cud-yellow:         #f0e442;
  --cud-blue:           #0072b2;
  --cud-vermillion:     #d55e00;
  --cud-reddish-purple: #cc79a7;
}`}
              />
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Your interface palette, and the tools to build it
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You do not have to swap your brand for the Okabe and Ito set.
                  Interface colours mostly need contrast and a second cue; the
                  categorical palette matters most for charts. To build or check
                  an interface palette:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    The{" "}
                    <Link href="/tools/accessible-palette-studio" className={linkClass}>
                      Accessible Palette Studio
                    </Link>{" "}
                    builds 11-step OKLCH colour scales, grades every token and
                    state against WCAG 2.2 (with experimental APCA estimates beside
                    it), and has a vision simulation switch that shows its live
                    interface preview as protan, deutan, tritan or monochrome.
                    Contrast scores stay computed on the real values.
                  </li>
                  <li>
                    The{" "}
                    <Link href="/tools/color-palette-generator" className={linkClass}>
                      Color Palette Generator
                    </Link>{" "}
                    is the quick option: it generates a WCAG-aware palette and
                    previews it on buttons, forms, alerts, links and charts in
                    light and dark mode. It has no colour blindness simulation, so
                    screenshot the preview and run it through the vision simulator.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For turning colours into design tokens with states and dark mode,
                  see the{" "}
                  <Link href="/guides/accessible-color-palettes" className={linkClass}>
                    accessible colour palettes guide
                  </Link>
                  ; for perceptual colour maths, the{" "}
                  <Link href="/guides/oklch-apca-color-systems" className={linkClass}>
                    OKLCH and APCA guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Eye className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                Is My Website Colour Blind Friendly? How to Check
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can get a reliable first answer in about fifteen minutes.
                  Pick your home page, one form and one page with a chart or
                  status display, and work through these checks.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  1. Run each page through a vision simulator
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The{" "}
                  <Link href="/tools/website-vision-simulator" className={linkClass}>
                    Website Vision Simulator
                  </Link>{" "}
                  takes a public web address or an uploaded screenshot (use a
                  screenshot for pages behind a login) and shows it with protan,
                  deutan or tritan simulation, with a severity slider from the
                  milder anomalous forms up to the full loss of one cone type. It
                  also covers achromatopsia, blurred vision and low contrast
                  sensitivity, in a split or side-by-side view against the
                  original. Look for:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>links in paragraphs that disappear into the text;</li>
                  <li>error and required fields you can no longer pick out;</li>
                  <li>status dots, badges and traffic-light indicators that look alike;</li>
                  <li>selected tabs, toggles and filters whose state vanishes;</li>
                  <li>chart lines, bars or map regions you can no longer match to a legend;</li>
                  <li>pale text and borders that fade first under low contrast sensitivity.</li>
                </ul>
              </div>
              <SimulatorCallout
                id="simulator-callout-test"
                text="Check a page now: compare the original with deuteranopia, the simulation that catches the most problems, then switch to achromatopsia for the strictest test."
              />
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  2. Do a greyscale test
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Greyscale removes every hue, so anything that still reads in
                  greyscale is safe for every type of colour vision. Turn your
                  whole screen grey and use your site for a few minutes:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">macOS:</strong>{" "}
                    System Settings, Accessibility, Display, then turn on Color
                    filters and choose Grayscale.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Windows 11:</strong>{" "}
                    Settings, Accessibility, Color filters, then turn on color
                    filters and choose Grayscale. You can also enable a keyboard
                    shortcut there (Windows logo key + Ctrl + C) to switch the
                    filter on and off.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Just one page:</strong>{" "}
                    paste the line below into the browser console.
                  </li>
                </ul>
              </div>
              <CodeBlock
                code={`// Greyscale the current page (reload to undo)
document.documentElement.style.filter = "grayscale(1)"`}
              />
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  3. Use the emulation in browser developer tools
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  While you build, check pages in place. In Chrome and Edge, open
                  DevTools, open the Command Menu (Ctrl+Shift+P, or Cmd+Shift+P on
                  a Mac), run &ldquo;Show Rendering&rdquo;, and use{" "}
                  <strong className="text-slate-900 dark:text-white">
                    Emulate vision deficiencies
                  </strong>{" "}
                  for blurred vision, reduced contrast, protanopia, deuteranopia,
                  tritanopia and achromatopsia. In Firefox, the Accessibility panel
                  has a <strong className="text-slate-900 dark:text-white">Simulate</strong>{" "}
                  menu with the same colour vision types plus contrast loss. Both
                  browsers base their colour simulations on the Machado, Oliveira
                  and Fernandes model, as{" "}
                  <a
                    href="https://developer.chrome.com/docs/chromium/cvd"
                    className={linkClass}
                  >
                    Chrome&rsquo;s write-up of its implementation
                  </a>{" "}
                  explains.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  4. Measure contrast
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A simulation shows what fades; it cannot tell you whether a
                  colour pair passes. Check text with the{" "}
                  <Link href="/tools/contrast-checker" className={linkClass}>
                    contrast checker
                  </Link>{" "}
                  (4.5:1, or 3:1 for large text), check icons, borders and chart
                  marks against 3:1, and check text over photos with the{" "}
                  <Link href="/tools/text-over-image-contrast-checker" className={linkClass}>
                    text over image contrast checker
                  </Link>
                  . The{" "}
                  <Link href="/guides/text-over-images" className={linkClass}>
                    text over images guide
                  </Link>{" "}
                  shows how to fix text that fails over a photo.
                  To check G183 links, measure the link colour against the body
                  text colour as well as against the background.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  5. Fix the palette, then retest
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Where a pair collapses, first add the missing cue (underline,
                  icon, label, pattern). Then, if you want the colours themselves
                  to hold up, adjust lightness in the{" "}
                  <Link href="/tools/accessible-palette-studio" className={linkClass}>
                    Accessible Palette Studio
                  </Link>{" "}
                  with its vision simulation switched on, and run the page through
                  the simulator again.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  6. Ask colour blind people
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The last and most valuable check is people. Ask colour blind
                  colleagues or users to complete your key tasks and say where they
                  hesitated. They will find the problems a model misses, and they
                  will tell you which of your fixes actually helped.
                </p>
              </div>
            </div>
          </section>

          {/* Simulation limits */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                What Simulations Can and Cannot Tell You
              </h2>
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    What they are good at
                  </h3>
                  <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                    <li>
                      Finding information carried by colour alone, quickly and
                      across a whole page.
                    </li>
                    <li>
                      Showing a typical result for each type, based on a published
                      model of how cone loss changes colour signals.
                    </li>
                    <li>
                      Making the problem visible to colleagues who have never
                      thought about it, which is often what gets a fix approved.
                    </li>
                    <li>
                      Comparing before and after, so you can see that a fix
                      worked.
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    What they cannot do
                  </h3>
                  <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                    <li>
                      Show what a particular person sees. Two people with the same
                      diagnosis can see differently, and the anomalous forms vary
                      widely in strength.
                    </li>
                    <li>
                      Account for the screen, the room lighting, or the cues a
                      person has learned to rely on over a lifetime.
                    </li>
                    <li>
                      Measure contrast. Passing a simulation is not passing 1.4.3
                      or 1.4.11.
                    </li>
                    <li>
                      Represent other low vision, such as field loss or glare
                      sensitivity, which a screenshot filter cannot show.
                    </li>
                    <li>Prove that a design works. Only people can do that.</li>
                  </ul>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Okabe and Ito make the same point in their own guide: their
                simulated proofs are not a true picture of colour blind vision,
                and not every colour blind person sees what a simulation shows.
                Treat a simulation as a way to find problems, never as proof that
                they are solved.
              </p>
            </div>
          </section>

          {/* Checklist */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                Colour Blind Friendly Design Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                {checklist.map((item) => (
                  <li key={item.title}>
                    <strong className="text-slate-900 dark:text-white">{item.title}</strong>{" "}
                    {item.text}
                  </li>
                ))}
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Then verify the rest of your colour and contrast work against the{" "}
                <Link href="/checklists/wcag-2-2" className={linkClass}>
                  WCAG 2.2 checklist
                </Link>
                .
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  See Your Page Without Colour
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Run your most important page through the simulator, fix anything
                  that disappears, then confirm the numbers with a contrast check.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/website-vision-simulator">
                      Try the Website Vision Simulator
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/tools/contrast-checker">Check a colour pair</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <FaqSection faqs={faqs} />
            </div>
          </section>

          {/* Related Content */}
          <section className="pb-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <RelatedContent
                content="color blind colour blindness color vision deficiency deuteranopia protanopia tritanopia achromatopsia use of color 1.4.1 contrast 1.4.3 non-text contrast 1.4.11 vision simulator palette okabe ito accessible color palette charts maps link underline form errors status indicators"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
