import type { Metadata } from "next"
import Link from "next/link"
import {
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  ListChecks,
  Database,
  Shapes,
  Tags,
  Table2,
  Palette,
  Type,
  Keyboard,
  Library,
  Code2,
  AlertTriangle,
  Sparkles,
} from "lucide-react"

const pageTitle =
  "Accessible Charts & Data Visualization Guide (SVG, WCAG 2.2)"
const pageDescription =
  "Make charts, graphs, and dashboards accessible: why the data table is the load-bearing text alternative, choosing between SVG, canvas, and images, labelling an SVG with role=img and aria-labelledby, never encoding a series by colour alone, keeping axis labels as real scalable text, keyboard-navigable interactive charts and hover-or-focus tooltips, what charting libraries do and don't give you, and React — mapped to WCAG 2.2 (1.1.1, 1.4.1, 1.4.5, 1.4.11, 1.4.13, 4.1.3)."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible charts",
    "accessible data visualization",
    "accessible graphs",
    "chart accessibility",
    "svg accessibility",
    "screen reader charts",
    "accessible bar chart",
    "chart alt text",
    "accessible data table chart",
    "color blind friendly charts",
    "chart aria label",
    "svg role img",
    "svg title desc accessibility",
    "canvas chart accessibility",
    "accessible chart colors",
    "d3 accessibility",
    "chart.js accessibility",
    "recharts accessibility",
    "highcharts accessibility module",
    "figure figcaption chart",
    "wcag charts",
    "accessible dashboard",
  ],
  alternates: {
    canonical: "/guides/accessible-charts",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-charts",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Charts & Data Visualization")}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Charts & Data Visualization")}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Accessible Charts & Data Visualization",
    url: "https://accessibility.build/guides/accessible-charts",
  },
]

const faqs = [
  {
    question: "How do I make a chart accessible to screen readers?",
    answer:
      "Give the chart a text alternative that carries the same information the picture does, because a screen reader cannot see shapes and colours. For a simple chart with one clear takeaway, that can be a short text summary that states the trend — \"Revenue rose from $12k in January to $47k in June, with a dip in April.\" For anything with more than a handful of data points, the real alternative is an accessible data table holding the numbers, placed near the chart or revealed by a toggle, because a table is the one format that gives a screen reader user the same random access to individual values that a sighted user gets from reading the chart. Then make sure the visual itself is not a black hole in the accessibility tree: an inline SVG needs role=\"img\" and a label, a canvas chart needs fallback content, and a chart image needs real alt text. The picture is the enhancement; the text alternative is the part that has to work.",
  },
  {
    question: "Do I need a data table for every chart?",
    answer:
      "No — match the treatment to the complexity. A sparkline that only reinforces a number already stated in text is decorative; hide it with aria-hidden=\"true\" and let the text carry the meaning. A single chart with one insight can be served by a concise text summary that states the takeaway. But once a chart has multiple series, many categories, or values a user would reasonably want to read individually, a text summary cannot substitute for the numbers, and you owe an accessible data table. The table does not have to be visible by default — a \"Show data table\" toggle built from a details/summary element or a button is a common, tidy pattern — but it must be reachable. The test: could a screen reader user answer the same questions from your alternative that a sighted user can answer from the chart? If the chart invites comparison of specific values, only a table lets them.",
  },
  {
    question: "Should I use an image, inline SVG, or canvas for an accessible chart?",
    answer:
      "All three can be made accessible, but they start from very different places. An <img> pointing at an SVG or PNG is the simplest robust option: give it real alt text (a summary, not \"chart\") and, for anything non-trivial, an accompanying data table — the image itself exposes nothing else to assistive technology. An inline <svg> is the richest: it lives in the DOM, so you can label it with role=\"img\" and aria-labelledby, keep axis text as real selectable text, and even make individual data points focusable for an interactive chart. A <canvas> is the trap: it paints pixels and produces no accessible DOM for what it draws, so a canvas chart with nothing else is completely invisible to a screen reader. If you use canvas, you must supply fallback content inside the element and, in practice, an adjacent data table. For most charts, prefer SVG (or an SVG-rendering library) precisely because the accessibility hooks come built in.",
  },
  {
    question: "How do I write good alt text or a text description for a chart?",
    answer:
      "Describe what the chart shows, not what it is. \"Bar chart\" tells a screen reader user nothing they could not guess; \"Support tickets by month: a steady rise from 40 in January to 210 in June\" tells them the actual finding. Lead with the takeaway — the trend, the outlier, the comparison the chart was drawn to make — because that is the insight a sighted reader extracts at a glance. Keep the short alternative short; do not try to read out every data point in an alt attribute, because that is unbearable to listen to and it is what the data table is for. So the pattern for a complex chart is two layers: a short text alternative (or aria-label) that gives the summary, and a longer alternative — the data table, or a paragraph below the figure — that holds the detail. The W3C's complex-images tutorial calls this the short-description-plus-long-description model, and it is the right mental model for charts.",
  },
  {
    question: "Are SVG <title> and <desc> reliably announced by screen readers?",
    answer:
      "Not on their own, which surprises people. The SVG <title> and <desc> elements are the semantically correct way to name and describe a graphic, but historically screen readers and browsers have exposed them inconsistently — a bare <svg> with a <title> is often announced as nothing, or as a group of shapes. The reliable pattern is to add role=\"img\" to the <svg> so the browser treats it as a single image, and then point aria-labelledby at the ids of your <title> and <desc> (or use a plain aria-label for the short version). role=\"img\" also collapses the SVG's internal shapes so assistive technology reads only your label rather than announcing every <path> and <rect>, which is exactly what you want for a static chart. Keep the <title>/<desc> elements — they are good practice and help other tools — but do not rely on them being read without the ARIA wiring, and always verify in your target screen readers.",
  },
  {
    question: "How do I make chart colours accessible and colour-blind friendly?",
    answer:
      "Two rules. First, never let colour be the only thing that distinguishes one series or category from another — that fails WCAG 1.4.1 Use of Color and leaves colour-blind users and anyone viewing in greyscale unable to tell your lines apart. Add a second cue: label lines directly at their end rather than relying on a legend, give each series a distinct pattern or texture, use different dash styles for lines and different marker shapes for points, and order stacked segments meaningfully. Second, give chart elements enough contrast — WCAG 1.4.11 Non-text Contrast asks for at least 3:1 between adjacent colours that carry meaning and against the background, so a pale bar on a white background fails even if its hue is distinct. Choosing a colour-blind-safe categorical palette helps, but it does not remove the need for a non-colour cue: the safest charts are readable in black and white. Our accessible colour palettes guide covers building such a palette.",
  },
  {
    question: "How do I make an interactive chart keyboard accessible?",
    answer:
      "There are two honest paths, and the pragmatic one is often best. The pragmatic path is to expose the underlying data table as the keyboard-and-screen-reader route into the data: sighted mouse users get the interactive chart, everyone else gets a fully navigable table with the same values, and you have satisfied the requirement without rebuilding a charting engine as a keyboard widget. The richer path — worth it for genuine data-exploration tools — is to make each data point focusable, with tabindex, a role, and an aria-label announcing its value, and to wire arrow keys to move between points the way a grid does. Whichever you choose, two rules apply: any information shown in a hover tooltip must also appear on keyboard focus and be dismissible (WCAG 1.4.13 Content on Hover or Focus), and as focus moves between points, announce the focused value through a live region so a screen reader user hears it change (WCAG 4.1.3). Never make the values available on hover only.",
  },
  {
    question: "What is the most accessible charting library?",
    answer:
      "Among mainstream libraries, Highcharts has the most complete built-in accessibility: an accessibility module that adds keyboard navigation, screen-reader descriptions of the chart and each series, a data-table view, and even audio sonification — you enable it and write meaningful series descriptions. ECharts has an aria option that generates a text description and can render as SVG. Chart.js renders to canvas, so it exposes nothing by default; you need an accessibility plugin or you must provide your own fallback table and an aria-label. D3 gives you total control and zero defaults — you own every role, label, and the data table. React libraries that output SVG, such as Recharts, Nivo, and Victory, give you a DOM you can annotate, but their built-in ARIA is minimal, so you still add role=\"img\", a label, and a table yourself. The honest summary: either choose a library with a real accessibility module and configure it, or accept that you are responsible for the text alternative, the colours, and the keyboard path. No library makes an inaccessible chart accessible for free.",
  },
]

const antiPatterns = [
  {
    bad: "The chart ships as an <img> with alt=\"chart\" or an empty alt.",
    why: "None of the data reaches assistive technology; a screen reader user learns only that an image exists (1.1.1).",
    fix: "Write alt text that states the chart's takeaway, and add an accessible data table for the underlying numbers when the chart has more than a trivial amount of data.",
  },
  {
    bad: "Series are told apart only by colour, decoded through a legend.",
    why: "Colour-blind users and anyone in greyscale cannot map colours back to names, and matching a legend to the chart is extra cognitive load for everyone (1.4.1, 1.4.11).",
    fix: "Label series directly at the data, add patterns, dash styles, or marker shapes as a second cue, and keep 3:1 contrast between adjacent colours.",
  },
  {
    bad: "An inline <svg> chart has no role and no accessible name.",
    why: "The screen reader either says nothing or reads out every <path> and <rect> as meaningless shapes (1.1.1, 4.1.2).",
    fix: "Add role=\"img\" and an accessible name via aria-labelledby (pointing at <title>/<desc>) or aria-label, so the SVG is announced as one described image.",
  },
  {
    bad: "Axis labels and values are baked into a raster (PNG/JPG) image.",
    why: "The text blurs when zoomed, is invisible to assistive technology, and often fails contrast at small sizes (1.4.5, 1.4.10, 1.4.3).",
    fix: "Render labels as real text — inline SVG <text> or HTML — so they stay crisp when zoomed, are exposed to AT, and can meet contrast requirements.",
  },
  {
    bad: "Each data point's value appears only in a tooltip on mouse hover.",
    why: "Keyboard users, touch users, and screen reader users never reach the values, and the tooltip may not be dismissible (1.4.13, 2.1.1).",
    fix: "Show the same content on keyboard focus, make it dismissible, and expose the values through a reachable data table so hover is never the only source.",
  },
  {
    bad: "A <canvas> chart has no fallback content and no adjacent table.",
    why: "Canvas paints pixels and produces no DOM for what it draws, so the chart is entirely absent from the accessibility tree (1.1.1).",
    fix: "Put fallback content (a description or table) between the <canvas> tags, add role=\"img\" and aria-label for the summary, and provide a real data table for the detail.",
  },
]

export default function AccessibleChartsGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <FAQStructuredData faqs={faqs} />

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
                    Accessible Charts &amp; Data Visualization
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
                Data Visualization &amp; WCAG Guide &bull; Updated July 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Accessible Charts &amp; Data Visualization
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A chart is a picture of data — and the accessible version of a
                chart is the data itself, reachable as text. This guide covers
                the part most teams skip: the{" "}
                <strong className="text-slate-900 dark:text-white">
                  data table that is the real text alternative
                </strong>
                , choosing between SVG, canvas, and images, labelling an SVG
                with <code>role=&quot;img&quot;</code>, never coding a series by
                colour alone, keeping axis labels as scalable text,
                keyboard-navigable interactive charts and hover-or-focus
                tooltips, what charting libraries actually give you, and React —
                mapped to WCAG&nbsp;2.2.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Where Charts Lose Their Users
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A data visualization does one job: it turns numbers into a
                  shape a person can read at a glance. That is a spectacular
                  affordance — and it is built entirely on <em>seeing</em>. When
                  the reader cannot see the shape, or cannot tell your red line
                  from your green one, or cannot reach the tooltip that holds the
                  actual figure, the whole affordance collapses and the data is
                  simply gone. A chart is, quietly, one of the most exclusionary
                  things you can put on a page, because all of its meaning lives
                  in a channel some of your users do not have.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The fix is a change of mindset before it is any line of code.
                  Stop thinking of the picture as the content and the text as an
                  afterthought. Flip it:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    the data is the content, and the chart is one especially good
                    way of presenting it
                  </strong>
                  . Once the data itself is available as text — as a summary and,
                  where it matters, as a real table — the visual becomes an
                  enhancement layered on top, and you are free to make it as rich
                  as you like without leaving anyone behind.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This guide is framework-agnostic and applies whether you hand-
                  roll SVG, reach for D3, or drop in a React charting library.
                  The requirements cluster around a handful of WCAG criteria —{" "}
                  <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.1.1 Non-text Content
                  </Link>{" "}
                  for the text alternative,{" "}
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1 Use of Color
                  </Link>{" "}
                  for the series cues, and{" "}
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11 Non-text Contrast
                  </Link>{" "}
                  for the marks themselves — plus a few more for interactive
                  charts. We will take them in the order you meet them when you
                  build a chart, starting with the data.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG 2.2 Criteria Your Charts Must Satisfy
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that accessible charts and data
                    visualizations must satisfy and what each requires
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Criterion
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Level
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        What your chart must do
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.1.1 Non-text Content
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The chart has a text alternative that conveys its information — a short summary, and a data table or long description for the detail.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info and Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The data table alternative uses real table markup — header cells, scope — so relationships between labels and values are programmatic, not visual.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">No series or category is distinguished by colour alone; a label, pattern, shape, or dash carries the same distinction.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.3 Contrast (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Axis labels, values, and legend text meet text-contrast ratios against their background — 4.5:1, or 3:1 for large text.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.5 Images of Text
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Labels and numbers are real text (SVG or HTML), not pixels baked into a raster image, so they scale and are machine-readable.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.10 Reflow
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The chart remains usable when zoomed to 400%; vector output scales, and a data table reflows without two-dimensional scrolling.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.11 Non-text Contrast
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Bars, lines, points, and other meaningful marks have at least 3:1 contrast against adjacent colours and the background.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-13" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.13 Content on Hover or Focus
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Tooltips that appear on hover also appear on keyboard focus, stay visible while pointed at, and can be dismissed.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every interaction an interactive chart offers with a mouse is also possible with the keyboard — or the data is reachable through the table.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.3 Status Messages
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Values revealed as focus moves between data points, and dynamic updates, are announced through a live region without moving focus.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                The criterion charts fail most often is{" "}
                <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.1.1
                </Link>
                , because the data lives only in the pixels and never reaches the
                accessibility tree at all. Everything else in this guide is, in
                one way or another, in service of getting the numbers out of the
                picture and into text.
              </p>
            </div>
          </section>

          {/* 1. Start with the data */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Database className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Start With the Data, Not the Picture
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Before any ARIA, decide what the text alternative <em>is</em>.
                The mistake is to reach for a single <code>alt</code> attribute
                and try to cram a chart into it. A chart is not one image with
                one meaning — it is a structure of many values, and the right
                alternative depends on how much of that structure a user needs.
                Match the treatment to the chart&apos;s complexity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Decorative</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A sparkline that only echoes a number already in the text.
                      It adds no information of its own, so hide it with{" "}
                      <code>aria-hidden=&quot;true&quot;</code> and let the
                      surrounding text carry the meaning.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">One insight</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A single chart drawn to make one point. A concise text{" "}
                      <strong className="text-slate-900 dark:text-white">summary</strong>{" "}
                      that states the takeaway — the trend, the outlier — is
                      often a sufficient alternative on its own.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 dark:border-blue-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Explorable data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Multiple series, many categories, values a user would want
                      to read individually. The summary is not enough — you owe a{" "}
                      <strong className="text-slate-900 dark:text-white">data table</strong>{" "}
                      with the numbers.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This mirrors the W3C&apos;s{" "}
                <a
                  href="https://www.w3.org/WAI/tutorials/images/complex/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  complex images
                </a>{" "}
                model: a <em>short</em> text alternative that names the chart and
                its point, and a <em>long</em> alternative — the table or a prose
                description — that holds the full detail. The single most useful
                question to ask about any chart is the one a screen reader user
                is really asking:{" "}
                <strong className="text-slate-900 dark:text-white">
                  &ldquo;Can I answer the same questions from your text that a
                  sighted person can answer from your picture?&rdquo;
                </strong>{" "}
                If the chart invites comparison of specific values, only a table
                lets them.
              </p>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Do not read the whole dataset into an alt string.</strong>{" "}
                    A summary describes the shape (&ldquo;a steady rise from 40 to
                    210&rdquo;); it does not recite every point. Reciting the data
                    belongs in the table, where a screen reader user can navigate
                    it cell by cell instead of enduring one unbroken sentence.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* 2. SVG, canvas, or image */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Shapes className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. SVG, Canvas, or an Image?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                How you render the chart decides how much accessibility work is
                even <em>possible</em>. The three technologies start from very
                different places, and the difference is entirely about whether
                the marks exist in the DOM.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mb-6">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    How chart rendering technologies compare for accessibility
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Technology</th>
                      <th scope="col" className="px-4 py-3 font-semibold">In the DOM?</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it means for accessibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Inline <code>&lt;svg&gt;</code>
                      </th>
                      <td className="px-4 py-3 align-top">Yes — every mark</td>
                      <td className="px-4 py-3 align-top">The richest option. Label it as one image, keep axis text as real text, or make individual points focusable. Recommended for most charts.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        <code>&lt;img&gt;</code> (SVG or PNG source)
                      </th>
                      <td className="px-4 py-3 align-top">No — one opaque node</td>
                      <td className="px-4 py-3 align-top">Simplest and robust. Real <code>alt</code> gives the summary; pair with a data table for detail. Nothing else is exposed.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        <code>&lt;canvas&gt;</code>
                      </th>
                      <td className="px-4 py-3 align-top">No — pixels only</td>
                      <td className="px-4 py-3 align-top">The trap. The drawing has no accessible representation at all; you must supply fallback content and, in practice, a table.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The practical guidance: <strong className="text-slate-900 dark:text-white">prefer SVG</strong>{" "}
                (or a library that renders SVG) because the accessibility hooks
                come for free — it is text and shapes in the document, not a flat
                bitmap. Use an <code>&lt;img&gt;</code> when the chart is
                pre-rendered and you only need a summary plus a table. Treat{" "}
                <code>&lt;canvas&gt;</code> as opt-in extra work: it is fast for
                thousands of points, but everything a screen reader will ever
                know about the chart has to be provided <em>separately</em>,
                because the canvas itself is a black box.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<!-- Canvas exposes nothing it draws. Provide fallback + a real table. -->
<figure>
  <canvas role="img" aria-label="Support tickets by month: a rise from 40 in January to 210 in June.">
    <!-- Fallback content for anything that cannot use the canvas: -->
    Support tickets rose from 40 in January to 210 in June.
  </canvas>
  <figcaption>Support tickets by month, 2026. <a href="#tickets-table">View data table</a></figcaption>
</figure>`}</code></pre>
            </div>
          </section>

          {/* 3. Labelling an SVG chart */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Tags className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Labelling an SVG Chart
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For a chart you are treating as a single described image — the
                common case — three things turn a jumble of shapes into one
                announced graphic: <code>role=&quot;img&quot;</code> on the{" "}
                <code>&lt;svg&gt;</code>, an accessible name, and an accessible
                description.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<svg
  role="img"
  aria-labelledby="rev-title rev-desc"
  viewBox="0 0 640 360"
  width="640"
  height="360"
>
  <title id="rev-title">Monthly revenue, 2026</title>
  <desc id="rev-desc">
    Revenue rose from $12k in January to $47k in June, with a dip to $9k in April.
  </desc>

  <!-- bars, axes, labels... -->
</svg>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
                <code>role=&quot;img&quot;</code> does two jobs. It tells
                assistive technology to treat the SVG as a single image, and it{" "}
                <em>collapses</em> the internal shapes so a screen reader reads
                only your label — not every <code>&lt;path&gt;</code> and{" "}
                <code>&lt;rect&gt;</code> in turn. <code>aria-labelledby</code>{" "}
                points at the short name; the <code>&lt;desc&gt;</code> supplies
                the longer summary. For a one-line label you can use a plain{" "}
                <code>aria-label</code> instead.
              </p>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-blue-100 leading-relaxed flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>
                      <code>&lt;title&gt;</code> and <code>&lt;desc&gt;</code>{" "}
                      alone are not reliably announced.
                    </strong>{" "}
                    They are the semantically correct elements, and you should
                    keep them — but historically a bare <code>&lt;svg&gt;</code>{" "}
                    with just a <code>&lt;title&gt;</code> is exposed
                    inconsistently across browser and screen-reader pairings. The
                    dependable pattern is to add <code>role=&quot;img&quot;</code>{" "}
                    and wire <code>aria-labelledby</code> (or{" "}
                    <code>aria-label</code>) explicitly, then verify in your
                    target screen readers. Never assume the native elements are
                    read on their own.
                  </span>
                </p>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                Decorative SVG: hide it, and stop it stealing tab stops
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When an SVG adds nothing — an icon, a purely ornamental
                flourish, a sparkline that repeats a nearby figure — hide it from
                assistive technology <em>and</em> keep its inner shapes out of
                the tab order. In some browsers, SVG elements (and the root{" "}
                <code>&lt;svg&gt;</code> in legacy engines) can become keyboard
                tab stops, so a decorative graphic can quietly add empty stops to
                every keyboard user&apos;s journey.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<svg aria-hidden="true" focusable="false" viewBox="0 0 100 24">
  <!-- ornamental sparkline; the real number is in the text beside it -->
</svg>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <code>aria-hidden=&quot;true&quot;</code> removes it from the
                accessibility tree; <code>focusable=&quot;false&quot;</code>{" "}
                keeps it out of the tab order. Use both on any SVG a keyboard or
                screen reader user has no reason to reach.
              </p>
            </div>
          </section>

          {/* 4. Data table */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Table2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. The Accessible Data Table: The Load-Bearing Alternative
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For any chart with data worth reading individually, the data
                table is the alternative that actually carries the information.
                It is the one format that gives a screen reader user the same{" "}
                <em>random access</em> to values that a sighted user gets from
                scanning the chart — they can jump to a row, compare two cells,
                read a column header. Wrap the chart and its caption in a{" "}
                <code>&lt;figure&gt;</code>, and offer the table right there.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<figure>
  <svg role="img" aria-labelledby="tickets-title" ...>
    <title id="tickets-title">Support tickets by month, 2026</title>
    <!-- bars... -->
  </svg>

  <figcaption>Support tickets by month, 2026.</figcaption>

  <!-- The table can be visible, or revealed on demand like this: -->
  <details>
    <summary>Show data table</summary>
    <table id="tickets-table">
      <caption>Support tickets by month, 2026</caption>
      <thead>
        <tr>
          <th scope="col">Month</th>
          <th scope="col">Tickets</th>
        </tr>
      </thead>
      <tbody>
        <tr><th scope="row">January</th><td>40</td></tr>
        <tr><th scope="row">February</th><td>72</td></tr>
        <tr><th scope="row">March</th><td>115</td></tr>
        <!-- ... -->
      </tbody>
    </table>
  </details>
</figure>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
                A few details make the table pull its weight. Use{" "}
                <code>&lt;th scope=&quot;col&quot;&gt;</code> for column headers
                and <code>&lt;th scope=&quot;row&quot;&gt;</code> for the row
                label, so a screen reader announces &ldquo;January, 40&rdquo;
                rather than an unanchored &ldquo;40&rdquo; — that programmatic
                header-to-cell relationship is{" "}
                <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.3.1 Info and Relationships
                </Link>
                . The <code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code>{" "}
                disclosure keeps the page tidy while leaving the table one
                keystroke away and needs no JavaScript. If you would rather keep
                the table always present but out of the visual layout, a{" "}
                <code>sr-only</code> table works too — but a visible, toggleable
                table often helps sighted users who just want the exact numbers,
                so consider showing it to everyone.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The chart and the table are two views of one dataset. Generate
                both from the same data so they can never disagree — a table that
                has drifted out of sync with the chart is worse than no table at
                all. For the full set of rules on building the table itself, the{" "}
                <Link href="/guides/accessible-data-tables" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessible data tables guide
                </Link>{" "}
                covers headers, captions, complex tables with the headers and id
                method, and responsive patterns, and the{" "}
                <Link href="/learn/table" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessible tables demo
                </Link>{" "}
                shows the patterns live.
              </p>
            </div>
          </section>

          {/* 5. Color and patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Palette className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Colour, Patterns, and Never Colour Alone
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Charts lean on colour harder than almost any other interface, and
                that is exactly where they fail{" "}
                <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.4.1 Use of Color
                </Link>
                . If the only thing separating the &ldquo;desktop&rdquo; line
                from the &ldquo;mobile&rdquo; line is that one is blue and one is
                green, then a red-green colour-blind user — around one in twelve
                men — sees two identical lines, and so does anyone printing in
                greyscale. Colour can be <em>a</em> cue; it must never be the{" "}
                <em>only</em> cue.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Give every series a second, non-colour distinction:
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">Label directly.</strong>{" "}
                  Put each series&apos; name at the end of its line or on its
                  segment, so the reader never has to bounce between a legend and
                  the chart to decode which colour is which.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Vary the form.</strong>{" "}
                  Different dash patterns for lines, different marker shapes
                  (circle, square, triangle) for points, and textures or SVG{" "}
                  <code>&lt;pattern&gt;</code> fills for bars and areas — all
                  survive greyscale.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Order meaningfully.</strong>{" "}
                  In a stacked or grouped chart, a consistent order plus a direct
                  label does more than colour ever could.
                </li>
              </ul>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Contrast is a separate requirement from colour.</strong>{" "}
                    Even a colour-blind-safe palette can fail{" "}
                    <Link href="/wcag/1-4-11" className="underline">
                      1.4.11 Non-text Contrast
                    </Link>
                    : a pale bar on a white background, or two adjacent segments
                    only a shade apart, do not reach the required 3:1 for marks
                    that carry meaning. Check chart marks against their neighbours
                    and the background, and check label text against{" "}
                    <Link href="/wcag/1-4-3" className="underline">
                      1.4.3
                    </Link>{" "}
                    with the{" "}
                    <Link href="/tools/contrast-checker" className="underline">
                      contrast checker
                    </Link>
                    .
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Picking the palette itself — a categorical set that stays
                distinguishable for colour-blind viewers and holds contrast in
                both light and dark mode — is its own craft. The{" "}
                <Link href="/guides/accessible-color-palettes" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessible colour palettes guide
                </Link>{" "}
                covers building one, and the{" "}
                <Link href="/guides/oklch-apca-color-systems" className="text-blue-600 dark:text-blue-400 hover:underline">
                  OKLCH &amp; APCA guide
                </Link>{" "}
                covers the perceptual colour maths behind evenly-distinguishable
                series. The rule that ties it together: the safest chart is one
                that still reads in black and white.
              </p>
            </div>
          </section>

          {/* 6. Text, contrast, zoom */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Type className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. Keep Labels as Real, Scalable Text
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A chart is full of text — axis ticks, value labels, the legend,
                the title. How that text is <em>rendered</em> decides whether it
                survives zoom and reaches assistive technology. The failure mode
                is exporting the whole chart, labels and all, as a flat PNG.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Baking text into a raster image trips three criteria at once. It
                fails{" "}
                <Link href="/wcag/1-4-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.4.5 Images of Text
                </Link>{" "}
                because the words are pixels, not text; it fails{" "}
                <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.4.10 Reflow
                </Link>{" "}
                and turns to mush when a low-vision user zooms to 400%; and small
                baked labels routinely fail{" "}
                <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.4.3 Contrast (Minimum)
                </Link>{" "}
                with no way to override the colour. Rendering the same labels as
                real text — SVG <code>&lt;text&gt;</code> elements, or HTML
                positioned over the chart — fixes all three: the text scales
                crisply, stays selectable and machine-readable, and can meet
                contrast because it is styled with CSS.
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6">
                <li>
                  Use vector output (SVG) so the whole chart, text included,
                  scales without blurring when the page is zoomed.
                </li>
                <li>
                  Keep axis and value labels as live <code>&lt;text&gt;</code>,
                  never as part of a background bitmap.
                </li>
                <li>
                  Meet <strong className="text-slate-900 dark:text-white">4.5:1</strong>{" "}
                  for normal label text (3:1 for large), and remember that a light
                  grey axis label on white is a common, quiet failure.
                </li>
                <li>
                  Do not rely on font sizes so small they force the user to zoom
                  just to read a tick — respect zoom and reflow rather than
                  fighting them.
                </li>
              </ul>
            </div>
          </section>

          {/* 7. Keyboard & interactive */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Interactive Charts: Keyboard and Tooltips
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The moment a chart responds to the mouse — hover tooltips,
                clickable points, drag-to-zoom — it takes on interaction
                requirements, and the most common failure is that all of the
                value lives behind a mouse. There are two honest ways to make an
                interactive chart operable for everyone, and the pragmatic one is
                usually right.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card className="border-blue-200 dark:border-blue-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Expose the table (pragmatic)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Mouse users get the interactive chart; keyboard and screen
                      reader users get the fully navigable data table as the route
                      into the same values. Robust, cheap, and enough for most
                      dashboards — you are not rebuilding a charting engine as a
                      keyboard widget.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Focusable points (rich)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Make each data point focusable with{" "}
                      <code>tabindex</code>, a role, and an{" "}
                      <code>aria-label</code> announcing its value, and wire arrow
                      keys to move between points like a grid. Worth the effort for
                      genuine data-exploration tools.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Whichever path you take, two rules are non-negotiable for the
                tooltip that shows a point&apos;s value:
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6 mb-4">
                <li>
                  <strong className="text-slate-900 dark:text-white">Hover content must also appear on focus.</strong>{" "}
                  If a value is revealed when the mouse hovers a point, the same
                  value must appear when the point receives keyboard focus, it
                  must stay visible while it is pointed at, and it must be
                  dismissible (Escape) without moving focus — that is{" "}
                  <Link href="/wcag/1-4-13" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.13 Content on Hover or Focus
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Announce the change.</strong>{" "}
                  As focus moves from point to point, push the new value into a
                  polite{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    live region
                  </Link>{" "}
                  so a screen reader speaks &ldquo;March, 115 tickets&rdquo;
                  without you having to move focus into a tooltip.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Managing where focus lands as the user enters, moves through, and
                leaves the chart is the same discipline as any composite widget —
                the{" "}
                <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                  focus management guide
                </Link>{" "}
                covers roving <code>tabindex</code> and restoration, and the{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  keyboard accessibility guide
                </Link>{" "}
                covers the key handling. The golden rule for charts:{" "}
                <strong className="text-slate-900 dark:text-white">
                  never make a value available on hover only.
                </strong>
              </p>
            </div>
          </section>

          {/* 8. Libraries */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Library className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                8. Charting Libraries: What They Do and Don&apos;t Give You
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                No library makes an inaccessible chart accessible for free, but
                they start you at very different points. Knowing what each one
                hands you — and what it leaves you owning — is the difference
                between a quick configuration and a surprise rebuild.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mb-6">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Accessibility support across common charting libraries
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Library</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Renders</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Built-in accessibility</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What you still owe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Highcharts</th>
                      <td className="px-4 py-3 align-top">SVG</td>
                      <td className="px-4 py-3 align-top">A dedicated accessibility module: keyboard navigation, screen-reader descriptions, a data-table view, and audio sonification.</td>
                      <td className="px-4 py-3 align-top">Enable the module and write meaningful chart and series descriptions.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">ECharts</th>
                      <td className="px-4 py-3 align-top">Canvas or SVG</td>
                      <td className="px-4 py-3 align-top">An <code>aria</code> option that generates a text description of the chart.</td>
                      <td className="px-4 py-3 align-top">Turn on the <code>aria</code> option, prefer the SVG renderer, and add a data table.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Chart.js</th>
                      <td className="px-4 py-3 align-top">Canvas</td>
                      <td className="px-4 py-3 align-top">None by default — canvas exposes nothing it draws.</td>
                      <td className="px-4 py-3 align-top">Add an accessibility plugin or provide fallback content, an <code>aria-label</code>, and a table.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Recharts / Nivo / Victory</th>
                      <td className="px-4 py-3 align-top">SVG (React)</td>
                      <td className="px-4 py-3 align-top">A DOM you can annotate; minimal built-in ARIA that varies by release.</td>
                      <td className="px-4 py-3 align-top">Add <code>role=&quot;img&quot;</code> and a label, colours with a second cue, and a table.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">D3</th>
                      <td className="px-4 py-3 align-top">SVG (you build)</td>
                      <td className="px-4 py-3 align-top">Nothing — total control, zero defaults.</td>
                      <td className="px-4 py-3 align-top">You own every role, label, colour cue, the keyboard path, and the table.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Two practical takeaways. First, if accessibility matters and you
                have a choice, a library with a real accessibility module —
                Highcharts is the clearest example — saves you the most work,
                provided you actually enable it and write the descriptions.
                Second, whatever you pick, the responsibilities in this guide do
                not transfer to the vendor: the text alternative, the colour
                cues, the scalable labels, and the keyboard route are yours to
                verify. Treat the library&apos;s output as a starting point, then
                run the tests below.
              </p>
            </div>
          </section>

          {/* 9. React */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                9. Charts in React
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                React charting libraries such as Recharts render SVG, so the
                accessibility contract is the same as any SVG chart: name the
                graphic, and pair it with a reachable table. Wrap the chart in a{" "}
                <code>&lt;figure&gt;</code>, label the SVG as an image, and drive
                both the chart and the table from one array of data so they never
                drift. Use <code>useId</code> to tie the label and table together
                without hard-coded ids.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`function TicketsChart({ data }) {
  const id = useId()
  const titleId = id + "-title"
  const tableId = id + "-table"

  const summary =
    "Support tickets by month: a rise from " +
    data[0].value + " in " + data[0].month + " to " +
    data[data.length - 1].value + " in " + data[data.length - 1].month + "."

  return (
    <figure>
      {/* role="img" + aria-label makes the whole SVG one described image.
          Recharts renders the inner <svg>; wrap or configure it so the
          accessible name lands on the chart's root svg element. */}
      <div role="img" aria-label={summary}>
        <BarChart data={data} /* ...Recharts config... */ />
      </div>

      <figcaption id={titleId}>Support tickets by month, 2026</figcaption>

      <details>
        <summary>Show data table</summary>
        <table id={tableId}>
          <caption>Support tickets by month, 2026</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Tickets</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.month}>
                <th scope="row">{row.month}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                The table is generated from the same <code>data</code> the chart
                consumes, so it is always in sync — the single most important
                property of a chart&apos;s data-table alternative. A library will
                render the marks and often a hover tooltip, but it will not write
                your summary, guarantee your colours carry a second cue, or build
                the table; those stay your job. The same principles carry to the
                other frameworks — see the{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React
                </Link>
                ,{" "}
                <Link href="/guides/vue-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Vue
                </Link>
                , and{" "}
                <Link href="/guides/angular-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Angular
                </Link>{" "}
                accessibility guides.
              </p>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldAlert className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How to Test an Accessible Chart
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A scanner can confirm an SVG has a label; it cannot tell you
                whether a blind user could actually read your data. These are the
                hands-on checks, and they take a couple of minutes each.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Cover the picture.</strong>{" "}
                  Ignore the visual and read only the text alternatives. Can you
                  get the chart&apos;s finding from the summary, and the specific
                  numbers from a table or description? If not, the data is trapped
                  in the pixels (
                  <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.1.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Run a screen reader over it.</strong>{" "}
                  It should announce a meaningful description — not
                  &ldquo;image&rdquo;, not silence, and not a stream of{" "}
                  <code>path</code> elements. Use the commands in the{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    NVDA
                  </Link>{" "}
                  and{" "}
                  <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    VoiceOver
                  </Link>{" "}
                  guides.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Turn off colour.</strong>{" "}
                  Switch the display to greyscale and confirm you can still tell
                  every series and category apart — the distinction is in labels,
                  patterns, or shapes, not only in hue (
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Zoom to 400%.</strong>{" "}
                  Labels should stay crisp and the layout should reflow without a
                  horizontal scrollbar — proof the text is real and the output is
                  vector (
                  <Link href="/wcag/1-4-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.5
                  </Link>
                  ,{" "}
                  <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.10
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Put the mouse away.</strong>{" "}
                  If the chart is interactive, reach every value with the keyboard
                  or through the table, confirm hover tooltips also appear on
                  focus and can be dismissed, and listen for the value being
                  announced as focus moves (
                  <Link href="/wcag/1-4-13" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.13
                  </Link>
                  ,{" "}
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Measure contrast.</strong>{" "}
                  Check the marks against their neighbours and the background for
                  3:1 (
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11
                  </Link>
                  ) and the label text for 4.5:1 (
                  <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.3
                  </Link>
                  ) with the{" "}
                  <Link href="/tools/contrast-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                    contrast checker
                  </Link>
                  .
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Layer <code>axe-core</code> on top for the mechanical checks — see{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated vs manual testing
                </Link>{" "}
                — and scan the live page with the{" "}
                <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                  URL accessibility auditor
                </Link>{" "}
                to catch an unlabelled graphic or a missing table before it ships.
              </p>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Chart Accessibility Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common chart accessibility anti-patterns, why they fail, and
                    the fix
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Anti-pattern</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Why it fails</th>
                      <th scope="col" className="px-4 py-3 font-semibold">The fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {antiPatterns.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          {row.bad}
                        </th>
                        <td className="px-4 py-3 align-top">{row.why}</td>
                        <td className="px-4 py-3 align-top">{row.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Accessible Chart Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Text alternative exists.</strong>{" "}
                  Every chart has a real text equivalent — a summary — and
                  anything non-trivial has an accessible data table for the
                  numbers (
                  <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.1.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Right technology.</strong>{" "}
                  SVG or an <code>&lt;img&gt;</code> you can label; any{" "}
                  <code>&lt;canvas&gt;</code> chart has explicit fallback content
                  and a table.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">SVG is labelled.</strong>{" "}
                  <code>role=&quot;img&quot;</code> plus{" "}
                  <code>aria-labelledby</code> or <code>aria-label</code>;
                  decorative SVG uses <code>aria-hidden=&quot;true&quot;</code>{" "}
                  and <code>focusable=&quot;false&quot;</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Not colour alone.</strong>{" "}
                  Every series carries a second cue — direct label, pattern,
                  shape, or dash — and marks meet 3:1 contrast (
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1
                  </Link>
                  ,{" "}
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Real, scalable text.</strong>{" "}
                  Labels are live text, not baked pixels; readable at 400% zoom,
                  and label text meets 4.5:1 (
                  <Link href="/wcag/1-4-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.5
                  </Link>
                  ,{" "}
                  <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.10
                  </Link>
                  ,{" "}
                  <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.3
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Tooltips reachable.</strong>{" "}
                  Hover content also appears on focus, is dismissible, and is
                  never the only source of a value (
                  <Link href="/wcag/1-4-13" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.13
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Interactive means keyboard.</strong>{" "}
                  Every data point is reachable by keyboard, or the table is
                  exposed as the equivalent path (
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Changes announced.</strong>{" "}
                  Values revealed on focus, and dynamic updates, go through a
                  polite live region (
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3
                  </Link>
                  ).
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                to see charts in the context of every other requirement, and the{" "}
                <Link href="/guides/accessible-color-palettes" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessible colour palettes guide
                </Link>{" "}
                for building a series palette that holds up.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Charts on a Live Page
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch
                  an unlabelled SVG, a chart image with no alt text, or a data
                  table that never made it into the markup — then run the
                  cover-the-picture and greyscale tests above for the failures no
                  scanner can see.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/accessible-color-palettes">
                      Accessible Colour Palettes
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <details key={i} className="group border rounded-lg p-4 bg-card">
                    <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                      {item.question}
                      <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">
                        &#9662;
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Related Content */}
          <section className="pb-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <RelatedContent
                content="accessible charts data visualization svg accessibility chart alt text accessible data table figure figcaption role img aria-labelledby svg title desc canvas chart accessibility color blind friendly charts use of color non-text contrast images of text reflow content on hover or focus tooltip keyboard accessible chart live region status messages highcharts accessibility chart.js d3 recharts nivo victory charting library accessible bar chart line chart pie chart dashboard screen reader charts wcag 1.1.1 1.4.1 1.4.3 1.4.5 1.4.10 1.4.11 1.4.13 2.1.1 4.1.3 accessible color palettes contrast checker"
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
