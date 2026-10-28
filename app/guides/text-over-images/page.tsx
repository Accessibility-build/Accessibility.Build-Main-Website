import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { FaqSection } from "@/components/seo/faq-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ListChecks, ScanSearch, ShieldCheck } from "lucide-react"
import { PageByline } from "@/components/seo/page-byline"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { clampDescription } from "@/lib/metadata"

const ROUTE = "/guides/text-over-images"
const pageTitle = "Text Over Image Accessibility: Contrast and Overlays"
const pageDescription =
  "Make text over images pass WCAG contrast: measure the worst point, then fix it with an overlay, text panel, halo or crop. Copy-ready CSS for every fix."
const ogImage = `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "text over image accessibility",
    "text on background image accessibility",
    "text on image contrast",
    "hero image text contrast",
    "text over image contrast checker",
    "overlay for text on image",
    "text shadow accessibility",
    "image overlay opacity for text",
    "scrim for text on image",
    "gradient overlay text readability",
    "background image contrast wcag",
    "wcag 1.4.3 background image",
    "text on photo contrast",
    "forced colors background image",
    "colour contrast text over image",
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
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [ogImage],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  { name: "Text Over Images", url: `https://accessibility.build${ROUTE}` },
]

const linkClass =
  "text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2"
const inlineCode =
  "rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[0.85em] text-slate-900 dark:text-slate-100 break-words"

const faqs = [
  {
    question: "How do you make text over an image accessible?",
    answer:
      "Make sure the text meets WCAG contrast against every part of the image behind it, not just its average colour: 4.5:1 for normal text and 3:1 for large text. The reliable ways to get there are a semi-transparent overlay (scrim) between the image and the text, a solid or semi-opaque panel behind the text, moving the text onto a calm, even part of the image, or darkening the image itself. Set a background colour behind the image so the text still passes if the image fails to load, and check every screen width, because the crop changes what sits behind the text.",
  },
  {
    question: "What contrast ratio does text on a background image need?",
    answer:
      "The same as any text, under WCAG 1.4.3 Contrast (Minimum) at Level AA: 4.5:1 for normal text and 3:1 for large text, which is at least 24 CSS pixels, or about 18.7 pixels if bold. Level AAA (1.4.6) raises that to 7:1 and 4.5:1. Icons and other graphics over the image that people need to understand need 3:1 under 1.4.11. The difference with an image is that the background varies, so the ratio has to hold at the point of lowest contrast behind the text. W3C lists background images without enough contrast as failure F83.",
  },
  {
    question: "What opacity should an overlay be for white text on an image?",
    answer:
      "With pure white text and a pure black overlay, 54% opacity is enough for 4.5:1 over any image, because even a pure white pixel darkens to about #757575, which is 4.6:1 against white. For large text at 3:1 the figure is 42%, and for 7:1 it is about 66%. Below those numbers it depends on the photo: a dark image may pass with much less, and the Text Over Image Contrast Checker works out the smallest opacity that passes for your actual image. Allow a few points of margin, and remeasure if the text is off-white or the overlay is tinted.",
  },
  {
    question: "Does a text-shadow make text over an image accessible?",
    answer:
      "Sometimes. W3C's guidance for 1.4.3 treats a wide halo that surrounds the letters as their background, so a dense, dark halo can supply the contrast that a busy image cannot. A typical drop shadow, offset to one side, blurred and semi-transparent, leaves parts of every letter against the photo and usually does not pass. Text shadows are also removed entirely in Windows contrast themes. Use a halo only on large headlines, and confirm it by measuring a screenshot rather than judging by eye.",
  },
  {
    question: "Can I use a normal contrast checker for text on an image?",
    answer:
      "Only if you test the right pair of colours. A normal checker compares two flat colours, so you would need to find the single lightest point behind light text, or the darkest point behind dark text, and test that. This is W3C's quick check for failure F83. It is easy to pick the wrong pixel, or to test the average colour, which can pass while a bright patch of sky makes a word unreadable. A text over image checker compares the text against every background pixel and reports the worst one.",
  },
  {
    question: "Does WCAG contrast apply to text that is part of a photo?",
    answer:
      "Not always. WCAG 1.4.3 exempts text that is incidental, such as a shop sign in a street photo, which is part of a picture with significant other visual content. It also exempts logos and pure decoration. A headline, button label or call to action placed over a hero image is none of those: it is content, so it must meet the ratio. Marketing text baked into a banner image must meet it too, and 1.4.5 Images of Text asks for real text instead wherever possible.",
  },
  {
    question: "What happens to text over images in Windows high contrast mode?",
    answer:
      "In forced colours mode, which Windows contrast themes switch on, browsers replace your text and background colours with the user's chosen colours and remove text shadows and box shadows. Gradients set as background images are removed, but photos loaded with url() or an img element stay. To keep text readable, browsers paint a solid backplate behind it. Do not set forced-color-adjust: none on hero text, because that switches the backplate off and leaves the text directly on the photo.",
  },
]

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <pre className="p-4 text-sm text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function ToolCallout({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="not-prose rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/20 p-5 my-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <ScanSearch aria-hidden="true" className="h-8 w-8 shrink-0 text-blue-700 dark:text-blue-300" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">{heading}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
      </div>
      <Button asChild className="gap-2 shrink-0">
        <Link href="/tools/text-over-image-contrast-checker">
          Measure text over an image
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

export default function TextOverImagesGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema route={ROUTE} title={pageTitle} description={pageDescription} datePublished="2026-10-28" />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <Link href="/guides" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">Text Over Images</span>
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
                Implementation Guide
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Text Over Images: How to Make It Readable and Pass WCAG
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A headline over a photo looks fine in the design file, where you chose the crop. On the live site the
                photo shifts under the text at every screen width, bright clouds land behind letters, and sometimes
                the image does not load at all. Text over images is the hardest contrast case to get right and one of
                the easiest to miss in review. This guide covers what WCAG requires, how to measure it properly, and
                seven fixes with CSS you can copy.
              </p>
              <PageByline
                route={ROUTE}
                variant="hero"
                align="center"
                source={{
                  label: "Understanding WCAG 1.4.3",
                  href: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
                }}
              />
            </div>
          </section>

          {/* Why it is hard */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <ToolCallout heading="Free tool: Text Over Image Contrast Checker">
                Load a screenshot, mark the text and see the worst contrast ratio against every background pixel, a
                heatmap of where it fails, and the smallest overlay opacity that fixes it. The image is measured in
                your browser and never uploaded.
              </ToolCallout>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 mt-10 flex items-center gap-3">
                <ShieldCheck aria-hidden="true" className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Why Text Over Images Is the Hardest Contrast Case
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <Link href="/wcag/1-4-3" className={linkClass}>
                    WCAG 1.4.3 Contrast (Minimum)
                  </Link>{" "}
                  sets a ratio between text and the background it is drawn on. On a flat colour there is one
                  background and one number. On a photo or a gradient the background is different behind every
                  letter, and the criterion has no rule for averaging, so the text has to meet the ratio against all of
                  it. The part of the image with the least contrast is the part someone cannot read.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  W3C documents this as a named failure,{" "}
                  <a href="https://www.w3.org/WAI/WCAG22/Techniques/failures/F83" className={linkClass}>
                    F83: background images that do not give text enough contrast
                  </a>
                  . Its test starts with a quick check: compare light text with the lightest part of the image, or
                  dark text with the darkest part. If that pair passes, the text passes everywhere. If it does not,
                  you check the background directly behind each letter. The Understanding document adds two rules that
                  matter here: ratios are not rounded, so 4.49:1 fails 4.5:1, and a wide halo around the letters counts
                  as their background.
                </p>
              </div>

              <div
                role="region"
                aria-label="Contrast thresholds table, scrolls sideways on small screens"
                tabIndex={0}
                className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG contrast criteria that apply to text and graphics over images, with their level and ratio
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Criterion</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Level</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Normal text</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Large text</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Applies to</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-3" className={linkClass}>1.4.3 Contrast (Minimum)</Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">4.5:1</td>
                      <td className="px-4 py-3">3:1</td>
                      <td className="px-4 py-3">Text and images of text, at every point behind the letters</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-6" className={linkClass}>1.4.6 Contrast (Enhanced)</Link>
                      </th>
                      <td className="px-4 py-3">AAA</td>
                      <td className="px-4 py-3">7:1</td>
                      <td className="px-4 py-3">4.5:1</td>
                      <td className="px-4 py-3">The same text, at the stricter level</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-11" className={linkClass}>1.4.11 Non-text Contrast</Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3" colSpan={2}>3:1 against adjacent colours</td>
                      <td className="px-4 py-3">Icons, carousel arrows and control borders over the image that people need to understand</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none mt-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Large text means at least 18 point (24 CSS pixels), or 14 point bold (about 18.7 CSS pixels). For
                  icons on a gradient, the{" "}
                  <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html" className={linkClass}>
                    Understanding document for 1.4.11
                  </a>{" "}
                  says to test the least contrasting area too.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">What is exempt.</strong> Logos, pure decoration,
                  and text that is an incidental part of a picture with significant other visual content, such as a
                  shop sign in a street photo. A headline, a button label or a call to action placed over a hero image
                  is none of these. It is content, and it has to pass.
                </p>
              </div>
            </div>
          </section>

          {/* Measure */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                How to Measure It: the Worst Point, Not the Average
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The usual way to check contrast is to pick two colours and put them into a contrast checker. With an
                  image behind the text, that method fails quietly, for several reasons:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">An eyedropper samples one pixel.</strong> You
                    pick the spot where the text looks fine, which is rarely the spot where it fails.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">An average hides the extremes.</strong> A
                    background that is dark overall can still have a bright patch exactly where one word sits.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">The design crop is not the live crop.</strong>{" "}
                    The image you sampled in the design tool is rarely the slice that ends up behind the text at
                    every screen width.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Letter edges blur.</strong> Anti-aliased edges
                    and JPEG noise mix text and background colours, so a pixel next to a letter is not a fair sample of
                    either.
                  </li>
                </ul>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 my-6">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Worked example: white text over a sky
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Suppose the average colour behind the headline is <code className={inlineCode}>#466E96</code>, a
                    mid blue: 5.3:1 against white, a comfortable pass. But one cloud behind the second word is{" "}
                    <code className={inlineCode}>#F0F4F8</code>: 1.1:1, effectively invisible. The average passes; the
                    headline fails. Put a 55% black overlay on the image and that cloud becomes about{" "}
                    <code className={inlineCode}>#6C6E70</code>, which is 5.1:1, and the darker parts of the sky only
                    get better.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Measuring properly means comparing the text colour with{" "}
                  <strong className="text-slate-900 dark:text-white">every</strong> background pixel behind it,
                  skipping the blended pixels right at the letter edges, and reporting the worst. That is what the{" "}
                  <Link href="/tools/text-over-image-contrast-checker" className={linkClass}>
                    Text Over Image Contrast Checker
                  </Link>{" "}
                  does on a screenshot. Alongside the worst point it shows the share of the background that passes and
                  the 5th percentile, which tell you whether the failure is one bright spot to cover or the whole area.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If you want to check by hand, follow F83&apos;s quick check: find the lightest point behind light
                  text (or the darkest behind dark text) with the{" "}
                  <Link href="/tools/image-color-picker" className={linkClass}>
                    image colour picker
                  </Link>
                  , and test that pair in the{" "}
                  <Link href="/tools/contrast-checker" className={linkClass}>
                    contrast checker
                  </Link>
                  . It works when the extreme point is easy to see, and it is slow and easy to get wrong when it is
                  not.
                </p>
              </div>
            </div>
          </section>

          {/* Fixes */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Seven Fixes, with Copy-Ready CSS
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The examples build on one hero pattern: a real <code>img</code> positioned behind the text, so it can
                  be cropped, art-directed and lazy-loaded. The photo here is mood, so it has an empty alt; if your
                  image carries information, give it a description (see{" "}
                  <Link href="/guides/how-to-write-alt-text" className={linkClass}>
                    how to write alt text
                  </Link>
                  ).
                </p>
                <CodeBlock
                  label="HTML: hero markup"
                  code={`<section class="hero">
  <img class="hero__img" src="harbour.jpg" alt=""
       width="1600" height="900">
  <div class="hero__text">
    <h1 class="hero__title">Summer on the harbour</h1>
    <p>Boat trips every hour from 10am</p>
  </div>
</section>`}
                />

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                  1. A scrim or gradient overlay
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A scrim is a semi-transparent layer between the image and the text. It darkens (or lightens) every
                  pixel by the same proportion, which pulls the brightest highlights down to a level the text can
                  beat.
                </p>
                <CodeBlock
                  label="CSS: hero with a flat overlay"
                  code={`.hero {
  position: relative;
  isolation: isolate;
  display: grid;
  align-items: end;
  min-height: 28rem;
  background-color: #1d2733; /* fallback, see fix 6 */
  color: #fff;
}

.hero__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}

/* The scrim */
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background-color: rgb(0 0 0 / 0.55);
}

.hero__text {
  padding: 2rem;
}`}
                />
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">How to choose the opacity.</strong> There are
                  two numbers worth knowing. The first is the smallest opacity that passes for your actual image, which
                  the checker works out from a screenshot. The second is a ceiling that passes for{" "}
                  <em>any</em> image. With pure white text, the worst possible pixel is pure white, so if the overlay is
                  strong enough to make white text readable on white, it is strong enough for everything. These are the
                  ceilings, worked out with the WCAG formula:
                </p>
              </div>
              <div
                role="region"
                aria-label="Overlay opacity table, scrolls sideways on small screens"
                tabIndex={0}
                className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Overlay opacity that guarantees each contrast ratio over any image, for white and black text
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Text and overlay</th>
                      <th scope="col" className="px-4 py-3 font-semibold">3:1 (large text)</th>
                      <th scope="col" className="px-4 py-3 font-semibold">4.5:1 (normal text)</th>
                      <th scope="col" className="px-4 py-3 font-semibold">7:1 (AAA)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        White text (#fff), black overlay
                      </th>
                      <td className="px-4 py-3">42%</td>
                      <td className="px-4 py-3">54%</td>
                      <td className="px-4 py-3">66%</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        Black text (#000), white overlay
                      </th>
                      <td className="px-4 py-3">36%</td>
                      <td className="px-4 py-3">46%</td>
                      <td className="px-4 py-3">59%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  So a 54% black overlay under white text passes 4.5:1 whatever photo an editor drops in later: pure
                  white becomes about <code>#757575</code>, which is 4.6:1. Add a few points of margin for rounding,
                  which is why the example uses 55%. The ceilings assume the overlay covers every pixel behind the text
                  and that the text is pure white or pure black. Off-white text, a brand-tinted overlay or
                  semi-transparent text all need measuring.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">A gradient scrim</strong> keeps the rest of the
                  photo bright by darkening only where the text sits. The common mistake is sizing the gradient as a
                  percentage of the whole hero: on a phone the text wraps onto more lines and climbs into the faded
                  part. Put the gradient on the text block instead, solid behind the text and fading only in the top
                  padding:
                </p>
                <CodeBlock
                  label="CSS: gradient scrim on the text block"
                  code={`.hero__text {
  padding: 4rem 2rem 2rem;
  /* 60% black behind every line of text,
     fading out only in the top 4rem of padding */
  background-image: linear-gradient(
    to top,
    rgb(0 0 0 / 0.6) calc(100% - 4rem),
    rgb(0 0 0 / 0)
  );
}`}
                />

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                  2. A solid text panel
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A panel behind the text takes the image out of the equation. An opaque panel is a flat colour you can
                  check with any contrast checker, it survives every crop, and the rest of the photo stays untouched. A
                  semi-opaque panel follows the same opacity ceilings as an overlay. For a headline that wraps, a
                  highlight that follows each line looks lighter than a box.
                </p>
                <CodeBlock
                  label="CSS: text panel and line highlight"
                  code={`.hero__panel {
  max-width: 36rem;
  padding: 1.25rem 1.5rem;
  background-color: rgb(15 23 42 / 0.88);
  color: #fff;
  border-radius: 0.5rem;
}

/* A highlight that follows each line of a wrapped headline */
.hero__title span {
  background-color: #0f172a;
  color: #fff;
  padding: 0.1em 0.35em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}`}
                />

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                  3. text-shadow: when it is enough and when it is not
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The{" "}
                  <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" className={linkClass}>
                    Understanding document for 1.4.3
                  </a>{" "}
                  treats a wide border or halo around the letters as their background, while a thin outline counts as
                  part of the letter. So a dark halo that fully surrounds every stroke can supply the contrast the
                  image cannot. The usual decorative drop shadow does not: it is offset to one side, so one edge of
                  every letter still touches the photo, and its blur fades to almost nothing a pixel or two out.
                </p>
                <CodeBlock
                  label="CSS: drop shadow versus halo"
                  code={`/* Not enough: offset, soft and faint */
.hero__title {
  text-shadow: 2px 2px 4px rgb(0 0 0 / 0.4);
}

/* A halo: stacked shadows that surround every stroke */
.hero__title {
  color: #fff;
  text-shadow:
    0 0 2px #000,
    0 0 4px #000,
    0 0 8px #000,
    0 0 12px rgb(0 0 0 / 0.8);
}`}
                />
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A halo can be enough for a large, bold headline over a moderately busy image, once you have measured
                  a screenshot of it. It is not enough for body copy or small text, where a halo muddies the letter
                  shapes, or over very bright, detailed images. And it disappears completely in Windows contrast
                  themes, which remove text shadows (fix 7 covers what happens instead). Use it as a finishing touch,
                  not your only defence.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                  4. Move the text onto a calm area
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The cheapest fix is composition. Choose images with a large, even area (sky, wall, water, shadow) and
                  keep that area behind the text with <code>object-position</code>. When one crop cannot serve every
                  width, art-direct a different image for small screens, or stop overlapping altogether and stack the
                  text under the photo.
                </p>
                <CodeBlock
                  label="CSS: repositioning the image"
                  code={`/* Keep the calm water behind the text */
.hero__img {
  object-position: 30% 50%;
}

@media (max-width: 40rem) {
  .hero__img {
    object-position: 60% 20%;
  }
}

/* Or stop overlapping on small screens:
   the text sits on the fallback colour below the photo */
@media (max-width: 40rem) {
  .hero { display: block; }
  .hero__img { position: static; height: 14rem; }
  .hero::before { display: none; }
}`}
                />
                <CodeBlock
                  label="HTML: a different crop for narrow screens"
                  code={`<picture>
  <source media="(max-width: 40rem)" srcset="harbour-tall.jpg">
  <img class="hero__img" src="harbour-wide.jpg" alt="">
</picture>`}
                />

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                  5. Darken or blur the image
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The most dependable version of this is editing the image file itself: export it darker, or pull down
                  the highlights in the area behind the text. That costs nothing at runtime and looks the same
                  everywhere. In CSS, a <code>brightness()</code> filter darkens the whole image, and a{" "}
                  <code>backdrop-filter</code> blur on the text panel calms busy texture. Blur on its own is not a
                  contrast fix, though: a blurred white cloud is still white. Pair it with a tint and measure the
                  result.
                </p>
                <CodeBlock
                  label="CSS: darken and blur"
                  code={`.hero__img {
  filter: brightness(0.6);
}

.hero__panel {
  background-color: rgb(0 0 0 / 0.55);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}`}
                />

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                  6. A background colour for when the image fails
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Images do not always load: slow connections, data savers, blocked requests, CDN outages, and the
                  moment before a lazy-loaded image arrives all leave the text on whatever is behind the image. White text over a missing image usually
                  ends up on white. W3C failure{" "}
                  <a href="https://www.w3.org/WAI/WCAG22/Techniques/failures/F24" className={linkClass}>
                    F24
                  </a>{" "}
                  warns against setting a text colour without a background colour, and notes that you should think
                  about contrast for when the image is not displayed. Give the element behind the image a solid colour
                  that passes with the text on its own: in the hero above, <code>#1d2733</code> gives white text
                  15.1:1. With a CSS background image, put the colour in the same shorthand.
                </p>
                <CodeBlock
                  label="CSS: background colour fallback"
                  code={`.banner {
  /* The colour shows until, or instead of, the image */
  background: #1d2733 url("harbour.jpg") center / cover no-repeat;
  color: #fff;
}`}
                />

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                  7. Forced colours and increased contrast
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In <strong className="text-slate-900 dark:text-white">forced colours mode</strong>, which Windows
                  contrast themes switch on, the browser replaces your colours with the user&apos;s and, as{" "}
                  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors" className={linkClass}>
                    MDN&apos;s forced-colors reference
                  </a>{" "}
                  describes, removes <code>text-shadow</code> and <code>box-shadow</code> and drops background images
                  that are not loaded with <code>url()</code>. So a gradient scrim vanishes while the photo stays. To
                  keep text readable, browsers paint a solid backplate behind it. Two rules follow: never set{" "}
                  <code>forced-color-adjust: none</code> on hero text, which switches the backplate off, and if you
                  want a guaranteed panel, give the text block system colours.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">
                    <code>prefers-contrast: more</code>
                  </strong>{" "}
                  matches when someone has asked their system for more contrast, such as Increase contrast on macOS.
                  It is a cheap moment to strengthen the overlay or switch to a solid panel.
                </p>
                <CodeBlock
                  label="CSS: forced colours and prefers-contrast"
                  code={`@media (prefers-contrast: more) {
  .hero::before {
    background-color: rgb(0 0 0 / 0.75);
  }
  .hero__panel {
    background-color: #0f172a;
  }
}

@media (forced-colors: active) {
  .hero__text {
    background-color: Canvas;
    color: CanvasText;
  }
}`}
                />
              </div>
            </div>
          </section>

          {/* Responsive pitfalls */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Responsive Pitfalls: the Crop Changes What Sits Behind the Text
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Text over an image often passes in the design file and fails in production, because the image and
                  the text move independently. A hero that passes at one width can fail at the next:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">Cover crops differently at every width.</strong>{" "}
                    <code>object-fit: cover</code> and <code>background-size: cover</code> fill the box by cutting off
                    the top and bottom on wide screens and the sides on narrow ones, so a different slice of the photo
                    lands behind the text.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Text wraps and grows.</strong> On a phone the
                    headline takes more lines and climbs into busier parts of the image, or out of a gradient sized for
                    desktop.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Zoom and reflow move everything.</strong>{" "}
                    <Link href="/wcag/1-4-4" className={linkClass}>1.4.4 Resize Text</Link> (200%) and{" "}
                    <Link href="/wcag/1-4-10" className={linkClass}>1.4.10 Reflow</Link> (320 CSS pixels wide) both
                    change where the text falls. A hero with a fixed <code>height</code> and{" "}
                    <code>overflow: hidden</code> also clips the text, which fails both; use <code>min-height</code>.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Text spacing overrides.</strong> Users who
                    apply the{" "}
                    <Link href="/wcag/1-4-12" className={linkClass}>1.4.12 Text Spacing</Link> values make lines longer
                    and taller, which can push text out of a panel that was sized to fit.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Art direction and themes.</strong> A different
                    image per breakpoint, or per light and dark theme, is a different contrast test each time.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Editors swap images.</strong> A CMS hero that
                    passes today can fail when someone uploads a brighter photo next month. Either retest every change
                    or design for the worst case with an overlay at the ceiling opacity or a solid panel.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Images of text and carousels */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Images of Text, Carousels and Video Backgrounds
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">Text baked into the image file</strong>, such as
                  a promotional banner exported from a design tool, cannot be fixed with CSS: an overlay darkens the
                  letters along with the photo. Contrast has to be right in the artwork itself, the alt text has to
                  repeat the words, and the text blurs when zoomed and cannot reflow.{" "}
                  <Link href="/wcag/1-4-5" className={linkClass}>
                    1.4.5 Images of Text
                  </Link>{" "}
                  asks for real text wherever the design can be achieved with it, with logos the main exception. Live
                  text over an image is almost always the better build.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">Carousels</strong> multiply the problem: every
                  slide puts a different image behind its text, so every slide needs its own check. A carousel that
                  advances on its own for more than five seconds also needs a way to pause or stop it under{" "}
                  <Link href="/wcag/2-2-2" className={linkClass}>
                    2.2.2 Pause, Stop, Hide
                  </Link>
                  , and its arrows and dots over the image need 3:1 under 1.4.11. The{" "}
                  <Link href="/learn/carousels" className={linkClass}>
                    accessible carousels lesson
                  </Link>{" "}
                  covers the rest.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong className="text-slate-900 dark:text-white">Video backgrounds</strong> are the extreme case:
                  the background changes many times a second. Use an overlay at the ceiling opacity or a solid panel,
                  because you cannot measure every frame, and give people a way to pause motion that runs for more than
                  five seconds.
                </p>
              </div>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                How to Test Text Over Images
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A single check at your own screen width proves very little. Test the layouts your users actually get.
              </p>
              <ToolCallout heading="Measure each breakpoint in the checker">
                Paste or drop a screenshot, drag a box around the text, and get the worst ratio, a heatmap of the
                failing pixels, and overlay CSS at the smallest opacity that passes.
              </ToolCallout>
              <ol className="mt-4 space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Screenshot every breakpoint.</strong> Capture the
                  hero at each layout width you support, for example 320, 768, 1024 and 1440 CSS pixels, plus your
                  main layout at 200% zoom. Save as PNG; JPEG artefacts around letters add noise.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Measure each one.</strong> Load the screenshot
                  into the checker, mark the text, choose the threshold (4.5:1 for normal text, 3:1 for large text or
                  for icons) and read the worst point. Check text in more than one colour one colour at a time.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Fix and remeasure.</strong> Copy the overlay CSS
                  the tool suggests, or apply a panel, then take a fresh screenshot and measure again.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Block the image.</strong> Use your browser
                  developer tools to block the image request and confirm the fallback background colour keeps the text
                  readable.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Turn on forced colours and more contrast.</strong>{" "}
                  Try a Windows contrast theme, or emulate <code className={inlineCode}>forced-colors: active</code>{" "}
                  and <code className={inlineCode}>prefers-contrast: more</code> from the Rendering panel in Chrome or
                  Edge DevTools, and check the text is still readable.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Cover every variant.</strong> Each carousel
                  slide, each art-directed image, light and dark themes, and any hero an editor can change.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                For a page-level view of how the hero looks with colour vision deficiencies or blur, run it through the{" "}
                <Link href="/tools/website-vision-simulator" className={linkClass}>
                  website vision simulator
                </Link>
                . For flat-colour text elsewhere on the page, the{" "}
                <Link href="/tools/contrast-checker" className={linkClass}>
                  contrast checker
                </Link>{" "}
                is faster, and the{" "}
                <Link href="/guides/accessible-color-palettes" className={linkClass}>
                  accessible colour palettes guide
                </Link>{" "}
                covers building a palette that passes by design.
              </p>
            </div>
          </section>

          {/* Checklist */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks aria-hidden="true" className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Text Over Images Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Worst point passes.</strong> 4.5:1 for normal
                  text and 3:1 for large text against every pixel behind the letters, not the average (1.4.3).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Icons and controls pass.</strong> Arrows, dots and
                  icons over the image reach 3:1 against what is next to them (1.4.11).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">A real fix, not a hope.</strong> An overlay, a
                  panel, a calm area or a darker image, rather than a faint drop shadow.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Opacity chosen on purpose.</strong> Measured for
                  the image, or at the ceiling (54% black under white text for 4.5:1) where the image can change.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Fallback colour set.</strong> The text passes on
                  the background colour alone if the image never loads.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Every breakpoint checked.</strong> Including 320
                  CSS pixels, 200% zoom and any art-directed images.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No clipping.</strong> The hero grows with its
                  text: <code className={inlineCode}>min-height</code>, not a fixed height with hidden overflow.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Forced colours safe.</strong> No{" "}
                  <code className={inlineCode}>forced-color-adjust: none</code> on hero text; readable in a Windows
                  contrast theme.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Live text, not baked-in text.</strong> Words
                  are real text over the image, except logos (1.4.5).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Every slide and frame covered.</strong> Each
                  carousel slide checked; video backgrounds use a ceiling overlay or a panel and can be paused.
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Hero Image Now
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Measure the text against every pixel behind it and get the overlay that fixes it, without the image
                  leaving your browser.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/text-over-image-contrast-checker">
                      Open the Text Over Image Checker
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/tools/contrast-checker">Check flat colours</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <div className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <FaqSection faqs={faqs} />
            </div>
          </div>

          {/* Related Content */}
          <section className="pb-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <RelatedContent
                content="text over image contrast background image hero image overlay scrim gradient text shadow halo colour contrast color contrast wcag 1.4.3 contrast minimum 1.4.6 contrast enhanced 1.4.11 non-text contrast forced colors high contrast prefers-contrast images of text carousel responsive design reflow"
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
