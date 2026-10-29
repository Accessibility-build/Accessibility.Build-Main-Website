import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { FaqSection } from "@/components/seo/faq-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, ListChecks, ScanSearch, ShieldCheck, X } from "lucide-react"
import { PageByline } from "@/components/seo/page-byline"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { clampDescription } from "@/lib/metadata"

const ROUTE = "/guides/how-to-write-alt-text"
const pageTitle = "How to Write Alt Text: Examples and Best Practices"
const pageDescription =
  "How to write alt text: decide by what each image does, then follow good and bad examples for logos, charts, tables, art and icons, plus length and markup."
const ogImage = `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "how to write alt text",
    "how to write alt text for images",
    "alt text examples",
    "alt text examples for images",
    "alt text for a logo",
    "alt text for logo",
    "alt text for graphs",
    "alt text for charts",
    "alt text for tables",
    "alt text for art",
    "decorative images alt text",
    "alt text best practices",
    "alt text length",
    "alt text character limit",
    "125 character alt text",
    "alt text for instagram",
    "image alt text",
    "empty alt attribute",
    "alt text for icons",
    "wcag 1.1.1 non-text content",
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
  { name: "How to Write Alt Text", url: `https://accessibility.build${ROUTE}` },
]

const linkClass =
  "text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2"
const inlineCode =
  "rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-[0.85em] text-slate-900 dark:text-slate-100 break-words"

const faqs = [
  {
    question: "How do you write good alt text?",
    answer:
      "Start with what the image is doing on that page, not what it looks like. If it is a link or a button, say where it goes or what it does. If it shows information, write the information in a short phrase or sentence, leading with what matters most. If it repeats nearby text or is only decoration, use an empty alt attribute (alt=\"\") so screen readers skip it. If it is a chart, diagram or map, write a short alt that gives the main point and put the full detail in text on the page. Leave out \"image of\", file names and keywords, and read it back in context to check it makes sense without the picture.",
  },
  {
    question: "What is an example of good alt text?",
    answer:
      "For a product photo of a coat, \"Navy wool overcoat, knee length, with notch lapels and two flap pockets\" is good, while \"coat\" is too vague and \"best mens wool coat winter sale\" is keyword stuffing. For a logo that links to the home page, \"Acme home\" is good because it names the destination. For a magnifying glass search button, \"Search\" is good and \"magnifying glass icon\" is not. For a chart, \"Line chart: visits grew every quarter in 2025, from 40,000 to 95,000. Full figures in the table below\" gives the point and says where the data is.",
  },
  {
    question: "How long should alt text be?",
    answer:
      "As long as it needs to be to do the image's job, and no longer. WCAG sets no character limit. The often repeated 125-character rule traces back to an old version of the JAWS screen reader that read long alt text in pieces of about 125 characters, which some people mistook for a cut-off. Most informative images need a phrase or one or two sentences. Screen reader users hear alt text in one go and cannot skim it, so lead with what matters. If you need more than a couple of sentences, the image is probably complex: keep the alt short and put the full description in visible text.",
  },
  {
    question: "When should alt text be empty?",
    answer:
      "Use an empty alt attribute (alt=\"\") when the image adds nothing a screen reader user needs: decorative flourishes, dividers, background-style photos, and images whose meaning is already in the text right next to them, such as an icon beside a link that already says the same thing. Keep the attribute and leave the value empty. Never leave the attribute out, because some screen readers then read the file name. And never use an empty alt on an image that is the only content of a link or button, because the control is then left with no name.",
  },
  {
    question: "What alt text should a logo have?",
    answer:
      "A logo is an image of text, so its alt text is usually the words in the logo: the organisation's name, such as \"Acme\". When the logo is a link to the home page, the alt becomes the link's name, so say where it goes, such as \"Acme home\". If the link also contains the visible name as text, give the logo alt=\"\" so the name is not read twice. Add the word \"logo\" only when the fact that it is a logo matters, for example on a page about brand guidelines.",
  },
  {
    question: "How do you write alt text for a chart or graph?",
    answer:
      "Give the chart a short alt that names the type of chart and states its main point, for example \"Bar chart: sales doubled between 2023 and 2025\", and say where the detail is. Then put the full data on the page as text, ideally as a real HTML table next to the chart or in a figure with a caption. Do not cram every data point into the alt attribute: screen reader users cannot navigate it the way they can navigate a table, and sighted users who would benefit from the numbers never see it.",
  },
  {
    question: "How do I add alt text on Instagram?",
    answer:
      "In the Instagram app, when you create a post, tap Next after editing the photo, tap More options, then Write alt text, type your description and tap Done. To change the alt text of a post you have already shared, open it, tap the Options menu, tap Edit, then Edit alt text in the bottom right. On a computer, choose Accessibility while editing the post and write the alt text there. Instagram adds automatic alt text from object recognition if you write none, and your own description is almost always better.",
  },
]

type Example = {
  title: string
  context: string
  good: string[]
  avoid: string[]
  why: string
}

const examples: Example[] = [
  {
    title: "Product photo",
    context:
      "The main image on a product page for a coat. The product name and price are in the text beside it.",
    good: ['alt="Navy wool overcoat, knee length, with notch lapels and two flap pockets"'],
    avoid: ['alt="coat"', 'alt="mens-coat-navy-01.jpg"', 'alt="best wool coat mens winter coat navy coat sale"'],
    why: "Describe what a shopper would look at: colour, cut, material, details. The name is already on the page, so spend the words on what the photo adds. In a product grid where the image and the product name sit inside one link, use alt=\"\" so the name is not read twice.",
  },
  {
    title: "Logo on its own",
    context: "A partner's logo in a row of client logos. It is not a link.",
    good: ['alt="Northwind Bank"'],
    avoid: ['alt="logo"', 'alt="northwind_logo_rgb.png"'],
    why: "A logo is an image of text, so the alt is the words in it. Add \"logo\" only when the fact that it is a logo matters, for example on a brand guidelines page.",
  },
  {
    title: "Logo as a home link",
    context: "The site logo in the header, linking to the home page, with no other text in the link.",
    good: ['alt="Acme home"'],
    avoid: ['alt=""', 'alt="Acme logo, click here to go to the home page"'],
    why: "The alt becomes the link's name, so it should say where the link goes. An empty alt leaves the link with no name at all. If the link also contains the visible word \"Acme\", give the image alt=\"\" instead.",
  },
  {
    title: "Icon button",
    context: "A magnifying glass button that opens site search. There is no visible text.",
    good: ['aria-label="Search" on the button, with the SVG inside it hidden', 'alt="Search" on an image button'],
    avoid: ['alt="magnifying glass"', 'alt="icon"', 'alt="search-icon.svg"'],
    why: "For controls, describe the action, not the picture. A printer icon is \"Print this page\", a cross is \"Close\", an arrow in a carousel is \"Next slide\". A visible text label is better still.",
  },
  {
    title: "Chart or graph",
    context: "A line chart in a quarterly report. The figures are in a table under the chart.",
    good: ['alt="Line chart: website visits grew every quarter in 2025, from 40,000 to 95,000. Full figures in the table below."'],
    avoid: ['alt="chart"', 'alt="graph showing data"', "a 300-word alt that reads out every data point"],
    why: "The alt gives the point the chart makes and says where the detail is. The table gives the data in a form people can navigate. Without the table, the chart fails anyone who cannot see it.",
  },
  {
    title: "Image of a data table",
    context: "A screenshot of a delivery price table pasted into a blog post.",
    good: ["A real HTML table instead of the image", 'If the image must stay: alt="Delivery prices by zone, also listed in the table below"'],
    avoid: ['alt="table"', "every cell of the table typed into the alt"],
    why: "An image of a table cannot be navigated cell by cell, resized, searched or translated. Screen reader users move through real tables with the row and column headers announced, which no alt text can match.",
  },
  {
    title: "Photo of a person in a news story",
    context:
      "A news photo with the caption: Council leader Maria Lopez after Tuesday's budget vote.",
    good: ['alt="Lopez at the podium, holding up a copy of the flood defence plan"'],
    avoid: ['alt="Woman smiling"', "alt that repeats the caption word for word"],
    why: "The caption already names her, so the alt says what the photo shows that matters to the story. Mention appearance, such as age or ethnicity, only when it is relevant and you know it to be true.",
  },
  {
    title: "Artwork",
    context: "A painting on an art history page about the painter.",
    good: ['alt="The Starry Night by Vincent van Gogh, 1889: swirling blue sky with glowing stars and a crescent moon over a sleeping village, a dark cypress in the foreground"'],
    avoid: ['alt="painting"', 'alt="A beautiful masterpiece"'],
    why: "Art is a sensory experience, so WCAG only asks you to identify it at minimum. On a page that is about the art, describe the subject, composition, colour and style. Put longer interpretation in visible text where everyone can read it.",
  },
  {
    title: "Screenshot",
    context: "A step in a help article showing where a setting lives.",
    good: ['alt="Settings page with the Accessibility tab open and the Reduce motion switch turned on"'],
    avoid: ['alt="Screenshot"', 'alt="Screen Shot 2026-03-14 at 10.42.17.png"'],
    why: "Say what the reader should see to confirm the step, not everything on the screen. The written steps should still work without the picture.",
  },
  {
    title: "CAPTCHA",
    context: "An image CAPTCHA on a sign-up form.",
    good: ['alt="CAPTCHA: type the letters shown in this image. An audio version is available below."'],
    avoid: ["alt that contains the answer", 'alt="captcha"'],
    why: "WCAG 1.1.1 asks the alt to say what the CAPTCHA is and what it is for, and requires another version in a different sense, such as audio. Better still, avoid image CAPTCHAs: at login, 3.3.8 Accessible Authentication rules out a transcription test as the only way in.",
  },
  {
    title: "Decorative flourish",
    context: "A swirl divider between two sections of an article.",
    good: ['alt=""', "or a CSS background image"],
    avoid: ['alt="decorative swirl"', 'alt="divider"', "no alt attribute at all"],
    why: "An empty alt tells screen readers to skip the image. Describing it only adds noise, and leaving the attribute out can get the file name read aloud.",
  },
]

const mistakes = [
  {
    bad: "Starting with \"image of\" or \"picture of\"",
    why: "Screen readers already announce that it is an image, so the user hears it twice.",
    fix: "Start with the content. Name the medium only when it matters: \"Oil painting of\", \"Screenshot of\", \"Pencil sketch of\".",
  },
  {
    bad: "File names as alt (IMG_2041.jpg, hero-final-v3.png)",
    why: "They say nothing about the image, and they tend to appear when alt is filled in automatically rather than written.",
    fix: "Write the alt by hand, and check whether your CMS, theme or upload tool fills it in for you.",
  },
  {
    bad: "Keyword stuffing",
    why: "A list of keywords is useless to someone listening. Google's image guidance warns that it is a poor experience and can look like spam.",
    fix: "Describe the image. If it is relevant to the page, the right words appear naturally.",
  },
  {
    bad: "Repeating the caption",
    why: "A screen reader reads both, so the user hears the same sentence twice.",
    fix: "Let the alt say what the picture shows and the caption give context, credit or date. If nearby text already describes the picture fully, alt=\"\" is fine.",
  },
  {
    bad: "Empty alt on a linked image",
    why: "When the image is the only content of a link, the link has no name. Screen readers fall back to the URL or file name. W3C lists this as failure F89 of 2.4.4 and 4.1.2.",
    fix: "Give the image alt text that says where the link goes.",
  },
  {
    bad: "A title attribute instead of alt",
    why: "The title is only a fallback for the accessible name and only appears as a mouse tooltip, so keyboard and touch users never see it.",
    fix: "Put the text in alt. Drop the title, or keep it only if it adds something the alt does not.",
  },
  {
    bad: "CMS placeholders (\"image\", \"photo\", \"untitled\", \"alt text here\")",
    why: "Placeholder words pass a check for an alt attribute while telling the user nothing.",
    fix: "Ask for alt on every upload, with an explicit \"decorative\" option and help text that explains the decision process above.",
  },
  {
    bad: "No alt attribute at all",
    why: "Assistive technology cannot tell whether the image matters. Some screen readers read out the file name.",
    fix: "Every img gets an alt attribute: descriptive text, or empty for decoration.",
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
        <Link href="/tools/alt-text-checker">
          Check a page&apos;s alt text
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

export default function HowToWriteAltTextGuidePage() {
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
                  <span className="text-slate-900 dark:text-white font-medium">How to Write Alt Text</span>
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
                How to Write Alt Text, with Examples for Every Kind of Image
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Alt text is what a screen reader says in place of an image, and what a browser shows when the image
                fails to load. Good alt text is not a description of pixels. It says what the image is doing on that
                page, in as few words as that takes. This guide gives you a decision process for every kind of image,
                worked examples of good and bad alt text, the markup, and how to add alt text on social media.
              </p>
              <PageByline
                route={ROUTE}
                variant="hero"
                align="center"
                source={{ label: "W3C Images Tutorial", href: "https://www.w3.org/WAI/tutorials/images/" }}
              />
            </div>
          </section>

          {/* What alt text is for */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <ToolCallout heading="Free tool: Alt Text Checker">
                Enter a page address and every image a visitor can see is checked for missing alt, image links with no
                name, file names, placeholders and alt that repeats the caption. An optional AI review looks at up to
                eight images in context and suggests better text.
              </ToolCallout>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 mt-10">
                What Alt Text Is For
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The alt attribute gives an image a text alternative. Screen readers speak it, braille displays show
                  it, and browsers display it when the image does not load because of a slow connection, a blocked
                  request or a broken link. Search engines read it too: Google&apos;s{" "}
                  <a href="https://developers.google.com/search/docs/appearance/google-images" className={linkClass}>
                    image SEO guidance
                  </a>{" "}
                  says it combines alt text with computer vision and the page&apos;s content to work out what an
                  image shows.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The requirement comes from{" "}
                  <Link href="/wcag/1-1-1" className={linkClass}>
                    WCAG 1.1.1 Non-text Content
                  </Link>
                  : every image that conveys something needs a text alternative that serves the{" "}
                  <strong className="text-slate-900 dark:text-white">equivalent purpose</strong>, and every image that
                  is pure decoration must be marked so assistive technology can ignore it. Purpose is the word that
                  matters. The alt does the image&apos;s job, which is not always the same as describing what the
                  image looks like.
                </p>
              </div>

              <div
                role="region"
                aria-label="WCAG criteria table, scrolls sideways on small screens"
                tabIndex={0}
                className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">WCAG success criteria that apply to alt text, their level, and what each asks</caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Criterion</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Level</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it means for images</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-1-1" className={linkClass}>1.1.1 Non-text Content</Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Informative images get a text alternative with the same purpose; decorative images get alt=&quot;&quot; so they are skipped.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-4" className={linkClass}>2.4.4 Link Purpose (In Context)</Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">When an image is the only content of a link, its alt is the link text, so it must say where the link goes.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className={linkClass}>4.1.2 Name, Role, Value</Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Image buttons and icon-only controls need an accessible name that says what they do.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-5" className={linkClass}>1.4.5 Images of Text</Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Use real text instead of text baked into images, except for logos and where a particular look is essential.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                So does every image need alt text? Every <code className={inlineCode}>img</code> needs an{" "}
                <strong className="text-slate-900 dark:text-white">alt attribute</strong>. Whether that attribute
                holds words or is left empty depends on what the image is for, which is the next decision.
              </p>
            </div>
          </section>

          {/* Decision process */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck aria-hidden="true" className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Decide What the Image Is For First
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The same photo can need a full sentence on one page and nothing at all on another. A picture of a red
                  bicycle on a product page is the product, so it needs a description. The same picture inside a link
                  that already says &ldquo;Shop bikes&rdquo; adds nothing, so it gets alt=&quot;&quot;. Before you write
                  a word, work through these questions in order. They follow the logic of the W3C{" "}
                  <a href="https://www.w3.org/WAI/tutorials/images/decision-tree/" className={linkClass}>
                    alt decision tree
                  </a>
                  , in our own words.
                </p>
              </div>
              <ol className="mt-2 space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Does the image contain text?</strong>{" "}If the same
                  words appear as real text next to it, or the lettering is only there for visual effect, use
                  alt=&quot;&quot;. If the text has a function, as on an icon, say what the function is. Otherwise put
                  the words from the image in the alt, and consider replacing the image with real text (
                  <Link href="/wcag/1-4-5" className={linkClass}>1.4.5</Link>).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Is it in a link or a button?</strong>{" "}If the
                  control&apos;s purpose would be unclear without it, the alt says where the link goes or what the
                  button does, not what the picture shows.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Does it add meaning to the page?</strong>{" "}If it is
                  a simple photo or illustration, write a short alt that carries that meaning. If it is a chart,
                  diagram or map, write a short alt and give the full information in text elsewhere on the page. If it
                  only repeats nearby text, use alt=&quot;&quot;.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Is it decoration, or not meant to be seen?</strong>{" "}
                  Borders, flourishes, mood photos, spacers and tracking pixels get alt=&quot;&quot;.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Still unsure?</strong> The full{" "}
                  <a href="https://www.w3.org/WAI/tutorials/images/" className={linkClass}>
                    W3C Images Tutorial
                  </a>{" "}
                  covers the edge cases, including image maps.
                </li>
              </ol>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-10 mb-4">
                What to write for each kind of image
              </h3>
              <div
                role="region"
                aria-label="Image types table, scrolls sideways on small screens"
                tabIndex={0}
                className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">Kinds of image by purpose, what the alt text should contain, and an example</caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Purpose</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What the alt should do</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {[
                      ["Informative", "Give the information or impression the image adds, in a phrase or a sentence.", "Volunteers planting trees along the canal towpath"],
                      ["Functional (links and buttons)", "Say where the link goes or what the button does.", "Acme home; Search; Print this page"],
                      ["Decorative", "Nothing. Use alt=\"\" so screen readers skip it.", "A wave divider; a mood photo; an icon next to text that says the same"],
                      ["Image of text", "Repeat the words in the image, unless they are already real text nearby.", "Summer sale: 30% off all lamps"],
                      ["Complex (charts, diagrams, maps)", "Name it and give the main point; put the full detail in text on the page.", "Bar chart: sales doubled between 2023 and 2025. Data in the table below."],
                      ["Group of images", "Let one image carry the alt for the whole group; give the rest alt=\"\".", "Five star icons: first gets \"Rated 4 out of 5\", the others alt=\"\""],
                    ].map(([kind, what, example]) => (
                      <tr key={kind} className="align-top">
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">{kind}</th>
                        <td className="px-4 py-3">{what}</td>
                        <td className="px-4 py-3">{example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Informative or decorative is a decision the author makes, based on why the image is on the page. Nobody
                else can make it for you, which is why automated tools can find missing alt but cannot tell you whether
                the alt you wrote is right.
              </p>
            </div>
          </section>

          {/* Examples */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-5xl">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Alt Text Examples: Good and Bad
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Eleven common images, each with the context that decides its alt text, a good version, versions to
                  avoid, and the reasoning. Change the context and the right answer changes with it.
                </p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {examples.map((ex) => (
                  <div
                    key={ex.title}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{ex.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{ex.context}</p>
                    <dl className="mt-4 space-y-3 text-sm">
                      <div>
                        <dt className="flex items-center gap-1.5 font-semibold text-green-700 dark:text-green-400">
                          <Check aria-hidden="true" className="h-4 w-4" />
                          Good
                        </dt>
                        {ex.good.map((g) => (
                          <dd key={g} className="mt-1 text-slate-800 dark:text-slate-200">
                            <code className={inlineCode}>{g}</code>
                          </dd>
                        ))}
                      </div>
                      <div>
                        <dt className="flex items-center gap-1.5 font-semibold text-red-700 dark:text-red-400">
                          <X aria-hidden="true" className="h-4 w-4" />
                          Avoid
                        </dt>
                        {ex.avoid.map((a) => (
                          <dd key={a} className="mt-1 text-slate-800 dark:text-slate-200">
                            <code className={inlineCode}>{a}</code>
                          </dd>
                        ))}
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-900 dark:text-white">Why</dt>
                        <dd className="mt-1 text-muted-foreground leading-relaxed">{ex.why}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
              <p className="max-w-4xl mx-auto text-muted-foreground leading-relaxed mt-8">
                For charts, the{" "}
                <Link href="/guides/accessible-charts" className={linkClass}>
                  accessible charts guide
                </Link>{" "}
                covers the data table and description patterns in depth, and the{" "}
                <Link href="/guides/accessible-data-tables" className={linkClass}>
                  accessible data tables guide
                </Link>{" "}
                shows how to build the table that replaces an image of one. Maps have their own{" "}
                <Link href="/guides/accessible-maps" className={linkClass}>
                  accessible maps guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Length */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                How Long Should Alt Text Be?
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You will see &ldquo;keep alt text under 125 characters&rdquo; repeated as a rule. It is not one.
                  WCAG sets no limit, and neither does the W3C Images Tutorial.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Where the 125-character figure comes from
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The number traces back to an old test in which JAWS 6, a screen reader release from around twenty
                  years ago, read long alt text in chunks of roughly 125 characters. People who saw the break took it
                  for a cut-off, and the figure spread from there, but the same testing found no screen reader that
                  cut long alt text off. The history is laid out in a{" "}
                  <a href="https://github.com/w3c/wcag/discussions/4047" className={linkClass}>
                    W3C WCAG discussion on alt text length
                  </a>{" "}
                  and in accessibility consultant Eric Eggert&apos;s 2022 post{" "}
                  <a href="https://yatil.net/blog/there-is-no-character-limit-for-alt-text" className={linkClass}>
                    There is no character limit for alt text
                  </a>
                  .
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  What actually matters
                </h3>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">Purpose sets the length.</strong> A home link
                    needs two words. A product photo needs a sentence. A painting on a page about the painting may need
                    two.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Lead with what matters.</strong> Screen reader
                    users hear alt text read straight through and cannot skim it the way they skim a page, so put the
                    key information first.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Say it once.</strong>{" "}No &ldquo;image
                    of&rdquo;, no repeating the caption or the heading above, no list of keywords.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Long means move it.</strong> Alt text is
                    invisible to sighted users. If a description needs more than a couple of sentences, the detail
                    probably helps everyone, so put it in visible text: a caption, the body copy, or a long description
                    linked to the image. Keep the alt short and say where the detail is.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  As a working signal, our{" "}
                  <Link href="/tools/alt-text-checker" className={linkClass}>
                    Alt Text Checker
                  </Link>{" "}
                  flags alt over 150 characters for a person to review rather than failing it. Some platforms set
                  their own caps: X allows up to 1,000 characters per image description.
                </p>
              </div>
            </div>
          </section>

          {/* Mistakes */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Alt Text Mistakes and How to Fix Them
              </h2>
              <div
                role="region"
                aria-label="Mistakes table, scrolls sideways on small screens"
                tabIndex={0}
                className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">Common alt text mistakes, why each one fails, and the fix</caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Mistake</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Why it fails</th>
                      <th scope="col" className="px-4 py-3 font-semibold">The fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {mistakes.map((row) => (
                      <tr key={row.bad}>
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
              <p className="text-muted-foreground leading-relaxed mt-4">
                Auto-generated alt text deserves the same scepticism. Facebook, Instagram and LinkedIn can add
                descriptions from object recognition, and AI tools write fluent drafts, but neither knows why the image
                is on your page. Treat them as a first draft to correct, never as the finished text.
              </p>
            </div>
          </section>

          {/* Markup */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                The Markup: alt, Empty alt, SVG, Figures and Long Descriptions
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  The alt attribute and alt=&quot;&quot;
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  An empty alt is a deliberate signal that says &ldquo;skip this&rdquo;. A missing alt is an
                  unanswered question, and some screen readers answer it by reading the file name.
                </p>
                <CodeBlock
                  label="HTML example: alt and empty alt"
                  code={`<!-- Informative: the alt carries the meaning -->
<img src="towpath.jpg"
     alt="Volunteers planting trees along the canal towpath">

<!-- Decorative: empty alt, never a missing alt -->
<img src="wave-divider.svg" alt="">

<!-- Linked logo with no other text: say where it goes -->
<a href="/">
  <img src="acme.svg" alt="Acme home">
</a>

<!-- Logo beside the visible name in the same link: empty alt -->
<a href="/">
  <img src="acme-mark.svg" alt=""> Acme
</a>`}
                />

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                  SVG icons and images
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Inline SVG has no alt attribute. Give an informative SVG <code>role=&quot;img&quot;</code> and a
                  name, either with <code>aria-label</code> or with a <code>title</code> element referenced by{" "}
                  <code>aria-labelledby</code>. Hide decorative SVGs, and SVG icons inside a button that already has a
                  name, with <code>aria-hidden=&quot;true&quot;</code>. An SVG used through an{" "}
                  <code>img</code> element takes a normal alt.
                </p>
                <CodeBlock
                  label="HTML example: accessible SVG"
                  code={`<!-- Informative inline SVG -->
<svg role="img" aria-label="Warning" viewBox="0 0 24 24">...</svg>

<!-- Or name it with a title element -->
<svg role="img" aria-labelledby="growth-title" viewBox="0 0 400 200">
  <title id="growth-title">Visits doubled between 2024 and 2025</title>
  ...
</svg>

<!-- Icon button: name the button, hide the icon -->
<button type="button" aria-label="Search">
  <svg aria-hidden="true" viewBox="0 0 24 24">...</svg>
</button>

<!-- Better still: a visible label -->
<button type="button">
  <svg aria-hidden="true" viewBox="0 0 24 24">...</svg>
  Search
</button>`}
                />
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The{" "}
                  <Link href="/guides/using-aria" className={linkClass}>
                    guide to using ARIA
                  </Link>{" "}
                  explains how <code>aria-label</code>, <code>aria-labelledby</code> and <code>aria-hidden</code>{" "}
                  combine into the accessible name.
                </p>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                  figure and figcaption
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A <code>figcaption</code>{" "}is visible to everyone and labels the figure, but it does not replace the
                  image&apos;s alt. Let the two divide the work: the alt says what the picture shows, the caption adds
                  the context, credit or date.
                </p>
                <CodeBlock
                  label="HTML example: figure with caption"
                  code={`<figure>
  <img src="lopez-budget-vote.jpg"
       alt="Lopez at the podium, holding up the flood defence plan">
  <figcaption>
    Council leader Maria Lopez after Tuesday's budget vote.
    Photo: City Press.
  </figcaption>
</figure>`}
                />

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                  Long descriptions for complex images
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For a chart or diagram, keep the alt short and put the full description in the page. The most robust
                  pattern is a figure that contains the image, a caption and the data table. For a description that is
                  plain text with no headings or tables, <code>aria-describedby</code> links it to the image; screen
                  readers read the referenced text as one continuous paragraph, so keep it simple.
                </p>
                <CodeBlock
                  label="HTML example: long descriptions"
                  code={`<!-- Preferred: the detail is visible to everyone -->
<figure>
  <img src="visits-2025.png"
       alt="Line chart of 2025 visits. Figures in the table below.">
  <figcaption>Website visits by quarter, 2025</figcaption>
  <table>
    <tr><th scope="col">Quarter</th><th scope="col">Visits</th></tr>
    <tr><th scope="row">Q1</th><td>40,000</td></tr>
    ...
  </table>
</figure>

<!-- Text-only description linked with aria-describedby -->
<img src="process.png" alt="Diagram of the returns process"
     aria-describedby="process-desc">
<p id="process-desc">Customers request a label, post the item,
  and get a refund within five working days of it arriving.</p>`}
                />

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">
                  Groups of images and CSS backgrounds
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When several images form one piece of information, such as a star rating, give one image the alt for
                  the whole group and the rest alt=&quot;&quot;. Images set with CSS <code>background-image</code>{" "}
                  have no alt at all, so use them only for decoration; anything informative belongs in an{" "}
                  <code>img</code> element.
                </p>
                <CodeBlock
                  label="HTML example: star rating as a group"
                  code={`<span class="rating">
  <img src="star-full.svg" alt="Rated 4 out of 5">
  <img src="star-full.svg" alt="">
  <img src="star-full.svg" alt="">
  <img src="star-full.svg" alt="">
  <img src="star-empty.svg" alt="">
</span>`}
                />
              </div>
            </div>
          </section>

          {/* Social media */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                How to Add Alt Text on Instagram, X, LinkedIn and Facebook
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The same rules apply on social media: say what the image adds to the post, and if it contains text,
                such as a quote card or an event flyer, include the words. Menu names change often; these steps match
                each platform&apos;s help pages as of October 2026.
              </p>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Instagram</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
                    <li>
                      <strong className="text-slate-900 dark:text-white">New post in the app:</strong> after editing
                      the photo, tap Next, then More options, then Write alt text. Type it and tap Done.
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">Existing post in the app:</strong> open it,
                      tap the Options menu, tap Edit, then Edit alt text in the bottom right.
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">On a computer:</strong> choose Accessibility
                      while editing the post, or for a shared post, Options, Edit, then Accessibility.
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Instagram fills in automatic alt text if you write none. Replace it.{" "}
                    <a href="https://help.instagram.com/503708446705527" className={linkClass}>
                      Instagram help: edit alt text
                    </a>
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">X</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
                    <li>
                      <strong className="text-slate-900 dark:text-white">In the apps:</strong> after adding the image
                      to a post, tap +ALT on the image, type the description and tap Done.
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">On the web:</strong> select Add description
                      under the image, type it and select Save.
                    </li>
                    <li>
                      An ALT badge then shows on the image. Each description can be up to 1,000 characters.
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    X&apos;s help covers adding it while you write the post, so do it before posting.{" "}
                    <a href="https://help.x.com/en/using-x/add-image-descriptions" className={linkClass}>
                      X help: add image descriptions
                    </a>
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">LinkedIn</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
                    <li>
                      <strong className="text-slate-900 dark:text-white">On desktop:</strong> after uploading the
                      image, click the Alt text option below it, write the description and click Save.
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">On mobile:</strong> tap ALT below the image,
                      write the description and tap Done.
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    LinkedIn may add alt text automatically to images that have none, and on mobile it does not tell
                    you, so check before posting.{" "}
                    <a href="https://www.linkedin.com/help/linkedin/answer/a519856" className={linkClass}>
                      LinkedIn help: alternative text
                    </a>
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Facebook</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
                    <li>
                      <strong className="text-slate-900 dark:text-white">Before posting, on a computer:</strong> hover
                      over the photo, click Edit, choose Alternative text, then Custom alt text. Write it and click
                      Save.
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">After posting:</strong> open the photo, choose
                      Options, then Change alt text on a computer or Edit alt text in the iPhone and Android apps.
                    </li>
                  </ul>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    The apps only let you change alt text after posting; the automatic text starts with &ldquo;Image
                    may contain&rdquo;.{" "}
                    <a href="https://www.facebook.com/help/214124458607871" className={linkClass}>
                      Facebook help: alternative text
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                How to Test Your Alt Text
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Testing alt text has two halves. A tool can find alt that is missing or malformed on every image in
                seconds. Only a person can judge whether the alt that is there is right, so finish with a short
                screen reader pass.
              </p>
              <ToolCallout heading="Step 1: run the Alt Text Checker">
                Check one page of each template: home, article, product, listing. Fix the Failures first (missing alt,
                image links and buttons with no name, file names, placeholders), then work through Needs review. The
                optional AI review suggests alt for up to eight images; treat its suggestions as drafts.
              </ToolCallout>
              <ol className="mt-6 space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6" start={2}>
                <li>
                  <strong className="text-slate-900 dark:text-white">Draft what is missing.</strong> For a single image,
                  the{" "}
                  <Link href="/tools/alt-text-generator" className={linkClass}>
                    AI Alt Text Generator
                  </Link>{" "}
                  writes a first draft from an upload or an image address, with optional context about where the
                  image is used. Edit it with the page in front of you.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Jump through the images with a screen reader.</strong>{" "}
                  In NVDA (browse mode) and JAWS (virtual cursor), press <kbd className={inlineCode}>G</kbd> to move
                  from graphic to graphic. In VoiceOver on a Mac, press <kbd className={inlineCode}>VO</kbd>+
                  <kbd className={inlineCode}>Command</kbd>+<kbd className={inlineCode}>G</kbd>. Then read the page
                  from the top, because alt only makes sense in context.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Ask four questions of each image.</strong> Would I
                  understand this part of the page without seeing it? Does each linked image say where it goes? Are
                  decorative images silent? Do I hear anything twice?
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Check controls and the reading order.</strong> The{" "}
                  <Link href="/tools/screen-reader-simulator" className={linkClass}>
                    screen reader simulator
                  </Link>{" "}
                  lists every image and control a screen reader meets on a page, and the{" "}
                  <Link href="/tools/accessible-name-previewer" className={linkClass}>
                    accessible name previewer
                  </Link>{" "}
                  shows the name each button and link exposes.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                New to screen readers? Start with the{" "}
                <Link href="/guides/screen-reader-testing" className={linkClass}>
                  screen reader testing guide
                </Link>
                , then the{" "}
                <Link href="/guides/nvda-screen-reader-testing" className={linkClass}>
                  NVDA
                </Link>{" "}
                or{" "}
                <Link href="/guides/voiceover-screen-reader-testing" className={linkClass}>
                  VoiceOver
                </Link>{" "}
                walkthrough.
              </p>
            </div>
          </section>

          {/* Checklist */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks aria-hidden="true" className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Alt Text Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Every img has an alt attribute.</strong> Words for
                  images that convey something, empty for decoration, never missing.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Purpose decided first.</strong> Informative,
                  functional, decorative, text, complex or group, before any words are written.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Links and buttons say what they do.</strong> No
                  image-only link or button is left without a name (2.4.4, 4.1.2).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Text in images is repeated.</strong> And replaced
                  with real text wherever possible, logos excepted (1.4.5).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Complex images have a long description.</strong>{" "}
                  A short alt plus the full information in visible text or a table.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Key information first.</strong>{" "}Concise, no
                  &ldquo;image of&rdquo;, no file names, no keyword lists.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No duplication.</strong> Alt does not repeat the
                  caption, the link text or the heading beside it.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">SVGs are named or hidden.</strong>{" "}
                  role=&quot;img&quot; with a name for informative SVGs, aria-hidden for decorative ones.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No placeholders shipped.</strong> CMS defaults,
                  automatic captions and AI drafts reviewed by a person.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Tested.</strong> The Alt Text Checker is clean
                  and a screen reader pass makes sense in context.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Then verify the rest of the page against the{" "}
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
                  Find Every Image That Needs Better Alt Text
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Audit a whole page in one pass, then draft the alt text that is missing and review it in context.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/alt-text-checker">
                      Open the Alt Text Checker
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/tools/alt-text-generator">Draft alt text with AI</Link>
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
                content="alt text alternative text image accessibility alt attribute decorative images empty alt functional images logo alt text icon button svg role img figure figcaption long description complex images charts graphs data tables images of text screen reader wcag 1.1.1 non-text content link purpose 2.4.4 4.1.2 1.4.5 social media alt text instagram"
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
