import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ListChecks, Presentation, ShieldCheck } from "lucide-react"
import { PageByline } from "@/components/seo/page-byline"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { clampDescription } from "@/lib/metadata"

const ROUTE = "/guides/accessible-powerpoint-presentations"
const TOOL = "/tools/word-powerpoint-accessibility-checker"
const pageTitle = "How to Make PowerPoint Accessible: A Checklist"
const pageDescription =
  "Make PowerPoint accessible: unique slide titles, reading order, alt text, tables, contrast, captions and PDF export, plus a checklist and free checker."
const ogImage = `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "how to make powerpoint accessible",
    "powerpoint accessibility",
    "powerpoint accessibility checklist",
    "powerpoint reading order",
    "accessible powerpoint slides",
    "alt text powerpoint",
    "slide titles accessibility",
    "accessible powerpoint presentation",
    "powerpoint accessibility checker",
    "hidden slide title powerpoint",
    "powerpoint selection pane reading order",
    "reading order pane powerpoint",
    "powerpoint captions",
    "powerpoint live subtitles",
    "powerpoint contrast accessibility",
    "accessible pdf from powerpoint",
    "accessible presentations",
    "wcag powerpoint",
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
    name: "Accessible PowerPoint Presentations",
    url: `https://accessibility.build${ROUTE}`,
  },
]

const faqs: FaqItem[] = [
  {
    question: "How do I make a PowerPoint presentation accessible?",
    answer:
      "Give every slide a unique title, build slides from the built-in layouts so content sits in placeholders, and check that each slide's reading order starts with the title. Add alt text to pictures, charts, SmartArt and icons that carry meaning, and mark decorative ones as decorative. Use simple tables with a header row, link text that names the destination, high-contrast theme colours and large fonts. Add captions to video and a transcript for audio, keep animations and transitions simple, and set the presentation's title and language. Then run Review > Check Accessibility and check what it misses, such as link text and the presentation title.",
  },
  {
    question: "How do I check the reading order in PowerPoint?",
    answer:
      "On Windows, select Review > Check Accessibility, then choose Reading Order Pane on the Accessibility ribbon. It lists the objects on the slide in the order a screen reader reads them, top to bottom; drag them, or use Ctrl+Up arrow and Ctrl+Down arrow, so the title comes first. On a Mac and in PowerPoint for the web, use Home > Arrange > Selection Pane, which lists objects in the reverse of reading order: the item at the bottom of the list is read first, so the title belongs at the bottom.",
  },
  {
    question: "How do I give a slide a title without showing it?",
    answer:
      "Select Review > Check Accessibility, open the Slide Title drop-down on the Accessibility ribbon and choose Add Hidden Slide Title. PowerPoint adds a title placeholder positioned off the slide, so it does not show in the slide show but screen readers and the slide list still use it. You can also type a title in the placeholder and drag it off the edge of the slide yourself. For many slides, duplicate a layout in View > Slide Master and move its title placeholder off the slide.",
  },
  {
    question: "Does PowerPoint have an accessibility checker?",
    answer:
      "Yes. Select Review > Check Accessibility in PowerPoint for Windows, Mac or the web. It opens the Accessibility ribbon and a pane of errors, warnings and tips. Microsoft's published rules for PowerPoint cover missing alt text, missing slide titles, tables without header information, section names, restricted access, simple table structure, contrast, captions on media, reading order and duplicate slide titles. They do not cover link text, the presentation title or language, or whether titles and alt text actually make sense, so check those yourself or with the free Word and PowerPoint Accessibility Checker.",
  },
  {
    question: "How do I add alt text in PowerPoint?",
    answer:
      "Right-click the picture, chart, SmartArt graphic or icon and choose View Alt Text (Edit Alt Text in PowerPoint 2019 to 2024), then describe what it shows and why it is on the slide in a sentence or two. For a chart or SmartArt graphic, select the outer border so the description covers the whole object, and for a meaningful group, select the group. Tick Mark as decorative for anything that only decorates the slide. If PowerPoint generated a description, read and rewrite it before you share the file.",
  },
  {
    question: "What font size should I use in PowerPoint for accessibility?",
    answer:
      "WCAG does not set a minimum font size, but Microsoft's guidance is 18 pt or larger for body text where possible, and slides shown on a screen in a room usually need more. Use a clear sans serif font, avoid long runs of capitals, and keep text short enough that it does not need to shrink to fit. The real test is to stand at the back of the room, or share your screen in a meeting and view it on a small laptop, and check that every word is readable.",
  },
  {
    question: "How do I share an accessible PowerPoint as a PDF?",
    answer:
      "Fix the slides first, then export with tags. On Windows, select File > Export > Create PDF/XPS Document > Create PDF/XPS, select Options and make sure Document structure tags for accessibility is ticked; the same dialog lets you publish notes pages. On a Mac, save as PDF and choose Best for electronic distribution and accessibility, which uses a Microsoft online service. Share the .pptx alongside the PDF where you can, because the original keeps alt text, notes and media that a PDF can lose.",
  },
]

const titleExamples = [
  { bad: "Untitled, or the title text in a text box", better: "Q3 results: revenue up on last year" },
  { bad: "Results", better: "Results by region" },
  { bad: "Results (again, on the next slide)", better: "Results by region (2 of 2)" },
  { bad: "Questions?", better: "Questions and contact details" },
  { bad: "A photo with the title typed into it", better: "Our new Leeds office (typed title, photo with alt text)" },
]

type CheckerRow = [label: string, microsoft: string, ours: string, manual: string]

const checkerRows: CheckerRow[] = [
  ["Every slide has a title", "Yes (error)", "Yes", "Does each title describe its slide?"],
  ["Slide titles are unique", "Yes (tip)", "Yes", ""],
  ["Alt text on pictures, charts, SmartArt, groups", "Yes (error)", "Yes, and flags generated text, file names and \"image of\"", "Is each description accurate here?"],
  ["Table header information", "Yes (error)", "Yes (Header Row ticked)", "Do the headers describe the columns?"],
  ["Merged or split cells", "Yes, as \"simple structure\" (warning)", "Yes", ""],
  ["Reading order", "Yes (warning, on flagged slides)", "Checks the title is read first, and flags crowded slides with default shape names", "Does the whole slide read in a sensible order?"],
  ["Captions on audio and video", "Yes (warning)", "Reminds you to check each clip", "Are captions present and correct?"],
  ["Text contrast", "Yes (warning)", "Not checked", "Yes, especially text over pictures"],
  ["Section names", "Yes (error if not meaningful, tip if repeated)", "Not checked", ""],
  ["Presentation title in properties", "Not listed", "Yes", ""],
  ["Language of the text", "Not listed", "Yes", "Is it the language the text is written in?"],
  ["Link text", "Not listed", "Yes, plus linked pictures with no alt text", "Does each link make sense on its own?"],
  ["Hidden slides left in the file", "Not listed", "Yes (tip)", ""],
  ["Font size, animation, colour used alone", "Not listed", "Not checked", "Yes, by viewing the slide show"],
]

const linkClass =
  "text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2"
const strongClass = "text-slate-900 dark:text-white"
const h2Class = "text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6"
const h3Class = "text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3"
const pClass = "text-muted-foreground leading-relaxed mb-4"
const listClass = "text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1"
const olClass = "text-muted-foreground leading-relaxed mb-4 list-decimal pl-6 space-y-1"

/** A Microsoft 365 menu path, e.g. Review > Check Accessibility. */
function MenuPath({ steps }: { steps: string[] }) {
  return <strong className={strongClass}>{steps.join(" > ")}</strong>
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-xs font-mono text-slate-900 dark:text-slate-100">
      {children}
    </kbd>
  )
}

function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className={linkClass}>
      {children}
    </a>
  )
}

function Wcag({ id, name }: { id: string; name: string }) {
  return (
    <Link href={`/wcag/${id.replace(/\./g, "-")}`} className={linkClass}>
      {id} {name}
    </Link>
  )
}

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
      <Presentation aria-hidden="true" className="h-8 w-8 shrink-0 text-blue-700 dark:text-blue-300" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">{heading}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
      </div>
      <Button asChild size="sm" className="gap-2 shrink-0">
        <Link href={TOOL}>
          Check a presentation free
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  )
}

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 rounded border-slate-400 accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        />
        <span>{children}</span>
      </label>
    </li>
  )
}

const toc = [
  ["why", "Why presentation accessibility matters"],
  ["titles", "Unique slide titles"],
  ["layouts", "Built-in layouts and placeholders"],
  ["reading-order", "Reading order and the Selection Pane"],
  ["alt-text", "Alt text, decorative images, charts and SmartArt"],
  ["tables", "Tables"],
  ["links", "Link text"],
  ["contrast", "Contrast, colour and themes"],
  ["fonts", "Font size for presenting"],
  ["motion", "Animations and transitions"],
  ["media", "Video and audio"],
  ["checker", "PowerPoint's Check Accessibility"],
  ["sharing", "Sharing and exporting"],
  ["presenting", "Presenting accessibly in meetings"],
  ["checklist", "PowerPoint accessibility checklist"],
  ["test", "Test the deck with the free checker"],
]

export default function AccessiblePowerPointGuidePage() {
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
                  <span className="text-slate-900 dark:text-white font-medium">Accessible PowerPoint</span>
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
                How to Make PowerPoint Presentations Accessible
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A slide deck gets used twice: once on screen while you talk, and again as a file people download,
                read with a screen reader or turn into a PDF. This guide covers both, in Microsoft 365 for Windows
                and Mac, with PowerPoint for the web where it differs: slide titles, layouts, the reading order trap
                in the Selection Pane, alt text for charts and SmartArt, tables, contrast, fonts, motion, captions,
                exporting and presenting in meetings.
              </p>
              <PageByline route={ROUTE} variant="hero" align="center" />
            </div>
          </section>

          {/* Intro callout + contents */}
          <section className="pb-4 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <ToolCallout heading="Check your slides as you go">
                The free Word and PowerPoint Accessibility Checker opens a .pptx file in your browser and lists slides
                with no title or a duplicate title, missing alt text, the title read out of order, table header rows,
                link text and language. The file is never uploaded.
              </ToolCallout>
              <nav aria-label="On this page" className="rounded-lg border border-slate-200 dark:border-slate-800 p-5">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">On this page</p>
                <ol className="text-sm leading-relaxed list-decimal pl-5 space-y-1 text-muted-foreground sm:columns-2 sm:gap-8">
                  {toc.map(([id, label]) => (
                    <li key={id}>
                      <a href={`#${id}`} className={linkClass}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </section>

          {/* Why */}
          <section id="why" className="py-10 px-4 sm:px-6 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>Why Presentation Accessibility Matters</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  Screen reader users move through a presentation slide by slide, using slide titles the way other
                  people glance at thumbnails, and hear each slide&apos;s objects in the order the file stores them.
                  People with low vision zoom in or need strong contrast. Deaf and hard of hearing people need
                  captions for video and for you. People with cognitive and attention disabilities need slides that
                  do not overload or move unexpectedly. A deck that only works when someone is looking at it and
                  listening to you at the same time leaves all of them out.
                </p>
                <p className={pClass}>
                  Presentations are documents in the eyes of the standards. WCAG applies to them through the
                  W3C&apos;s <Ext href="https://www.w3.org/TR/wcag2ict-22/">WCAG2ICT guidance</Ext>, EN 301 549 covers
                  them in clause 10 on non-web documents, the US Section 508 standards apply WCAG 2.0 AA to them, and
                  the ADA Title II rule names presentation files among the{" "}
                  <Ext href="https://www.ada.gov/resources/2024-03-08-web-rule/">conventional electronic documents</Ext>{" "}
                  that state and local governments post online. The legal side is set out in more detail in{" "}
                  <Link href="/guides/accessible-word-documents" className={linkClass}>
                    how to make a Word document accessible
                  </Link>
                  , and in our pages on{" "}
                  <Link href="/compliance/en-301-549" className={linkClass}>
                    EN 301 549
                  </Link>{" "}
                  and{" "}
                  <Link href="/compliance/section-508" className={linkClass}>
                    Section 508
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Titles */}
          <section id="titles" className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={`${h2Class} flex items-center gap-3`}>
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                1. Give Every Slide a Unique Title
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  Slide titles are the headings of a presentation. A screen reader announces the title when a slide
                  opens and lists titles when someone jumps between slides, and the titles make up the outline in
                  Outline view. A slide without a title is announced only by its number; five slides all called
                  &ldquo;Results&rdquo; sound identical. This supports <Wcag id="1.3.1" name="Info and Relationships" />{" "}
                  and <Wcag id="2.4.6" name="Headings and Labels" />. Microsoft&apos;s checker treats a missing title
                  as an error and a duplicate as a tip.
                </p>
                <h3 className={h3Class}>Add or fix a title</h3>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>From the layout:</strong> select the slide, choose{" "}
                    <MenuPath steps={["Home", "Layout"]} />{" "}and pick a layout with a title, such as Title and Content,
                    then type in the &ldquo;Click to add title&rdquo; box. In PowerPoint for the web the choices open
                    in a Slide Layout dialog.
                  </li>
                  <li>
                    <strong className={strongClass}>From the Accessibility ribbon:</strong> select{" "}
                    <MenuPath steps={["Review", "Check Accessibility"]} />, then open the Slide Title drop-down. Add
                    Slide Title adds a title placeholder, Edit Slide Title jumps to the existing one, and Set as Slide
                    Title turns a selected text box or shape into the title. This works on Windows, Mac and the web.
                  </li>
                  <li>
                    <strong className={strongClass}>In Outline view:</strong> select{" "}
                    <MenuPath steps={["View", "Outline View"]} /> (Windows and Mac) and type next to each slide
                    number. Outline view is also the fastest way to review every title at once, because it lists only
                    the text in title and body placeholders.
                  </li>
                </ul>
                <h3 className={h3Class}>Hide a title you do not want on the slide</h3>
                <p className={pClass}>
                  Some slides, such as a full-bleed photo or a section divider, look better without a visible title.
                  They still need one. Microsoft&apos;s{" "}
                  <Ext href="https://support.microsoft.com/en-us/powerpoint/title-a-slide">Title a slide</Ext>{" "}
                  article gives three ways to keep the title while hiding it from view:
                </p>
                <ol className={olClass}>
                  <li>
                    <strong className={strongClass}>Add Hidden Slide Title.</strong> In{" "}
                    <MenuPath steps={["Review", "Check Accessibility"]} />, open the Slide Title drop-down and choose
                    Add Hidden Slide Title. PowerPoint adds a title placeholder positioned off the slide and puts your
                    cursor in it.
                  </li>
                  <li>
                    <strong className={strongClass}>Drag it off the slide.</strong> Zoom out to about 50% (
                    <MenuPath steps={["View", "Zoom"]} />), type the title, then drag the title placeholder by its
                    border until it sits outside the slide. Check with{" "}
                    <MenuPath steps={["Slide Show", "From Current Slide"]} />: the title is not shown, but it is
                    still the slide&apos;s title.
                  </li>
                  <li>
                    <strong className={strongClass}>For many slides, use the slide master.</strong> In{" "}
                    <MenuPath steps={["View", "Slide Master"]} />, right-click a layout, choose Duplicate Layout, move
                    the duplicate&apos;s title placeholder off the slide, close the master view and apply the new
                    layout to the slides that need it (Windows and Mac).
                  </li>
                </ol>
                <p className={pClass}>
                  Avoid tricks such as white text on a white background or a tiny font. They are fragile: the text
                  can reappear for someone using a high contrast theme or change colour when the theme changes.
                </p>
                <div tabIndex={0} role="region" aria-label="Examples of weak and better slide titles" className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                  <table className="w-full text-sm text-left">
                    <caption className="sr-only">Examples of weak and better slide titles</caption>
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Weak</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Better</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                      {titleExamples.map((row) => (
                        <tr key={row.bad}>
                          <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                            {row.bad}
                          </th>
                          <td className="px-4 py-3 align-top">{row.better}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={pClass}>
                  When one topic runs over several slides, add &ldquo;(1 of 2)&rdquo; and &ldquo;(2 of 2)&rdquo; or
                  &ldquo;(continued)&rdquo;. If your deck uses sections, give them real names with{" "}
                  <MenuPath steps={["Home", "Section", "Rename Section"]} />; Microsoft&apos;s checker flags sections
                  left with default names.
                </p>
              </div>
            </div>
          </section>

          {/* Layouts */}
          <section id="layouts" className="py-10 px-4 sm:px-6 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>2. Use Built-in Layouts and Placeholders</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  Text typed into a layout&apos;s placeholders is structured: PowerPoint knows which box is the title
                  and which is the body, the text appears in Outline view, and the reading order starts in a sensible
                  place. Text boxes you draw yourself have none of that. They do not appear in Outline view, each new
                  one goes to the end of the reading order when you create it, and they are easy to forget when
                  checking.
                </p>
                <ul className={listClass}>
                  <li>
                    Start each slide from <MenuPath steps={["Home", "New Slide"]} /> or{" "}
                    <MenuPath steps={["Home", "Layout"]} />, and put content in the placeholders rather than adding
                    text boxes on top.
                  </li>
                  <li>
                    If a slide has drifted, <MenuPath steps={["Home", "Reset"]} />{" "}restores its placeholders to the
                    layout&apos;s positions and formatting.
                  </li>
                  <li>
                    Need a layout the theme does not have? Build it once in <MenuPath steps={["View", "Slide Master"]} />{" "}
                    with proper placeholders, rather than recreating it with text boxes on every slide.
                  </li>
                  <li>
                    Pick a theme from the Design tab and check its colours (see contrast below). Microsoft&apos;s
                    accessible templates are a good starting point: select <MenuPath steps={["File", "New"]} />{" "}and
                    search the online templates for &ldquo;accessible&rdquo;.
                  </li>
                </ul>
                <h3 className={h3Class}>A note on Designer</h3>
                <p className={pClass}>
                  Designer (labelled Design Suggestions or Designer, depending on version) rearranges your content,
                  and can add photos, icons and SmartArt. Microsoft&apos;s{" "}
                  <Ext href="https://support.microsoft.com/en-us/office/create-professional-slide-layouts-with-designer-53c77d7b-dc40-45c2-b684-81415eac0617">
                    Designer article
                  </Ext>{" "}
                  says nothing about alt text or reading order, so treat every suggestion you apply as new content:
                  check each picture or icon it added has alt text or is marked decorative, check that the text still
                  meets contrast against any new background, and check the reading order again.
                </p>
              </div>
            </div>
          </section>

          {/* Reading order */}
          <section id="reading-order" className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>3. Set the Reading Order (and Avoid the Selection Pane Trap)</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  A screen reader reads the objects on a slide in the order they are stored in the file, which is
                  usually the order they were added, not the order they appear on screen. A text box added last is
                  read last even if it sits at the top. The title should come first, then the content in the order a
                  sighted person would take it in (<Wcag id="1.3.2" name="Meaningful Sequence" />).
                </p>
                <h3 className={h3Class}>Windows: the Reading Order pane</h3>
                <ol className={olClass}>
                  <li>
                    Select <MenuPath steps={["Review", "Check Accessibility"]} />, then select Reading Order Pane on the
                    Accessibility ribbon. You can also open it from the lower half of the Check Accessibility button,
                    or from a reading order warning in the Accessibility pane.
                  </li>
                  <li>
                    The pane lists the slide&apos;s objects top to bottom in the order a screen reader reads them.
                    Drag them into the right order, use the Move Up and Move Down buttons, or press{" "}
                    <Kbd>Ctrl+Up arrow</Kbd> and <Kbd>Ctrl+Down arrow</Kbd>.
                  </li>
                  <li>
                    Clearing an object&apos;s checkbox marks it as decorative and takes it out of the reading order.
                  </li>
                </ol>
                <h3 className={h3Class}>Mac and web: the Selection Pane, in reverse</h3>
                <p className={pClass}>
                  Microsoft&apos;s instructions for PowerPoint for Mac and for the web use the Selection Pane: select{" "}
                  <MenuPath steps={["Home", "Arrange", "Selection Pane"]} /> and drag items to reorder them. The catch
                  is that the Selection Pane lists objects by layer, front to back, which is the{" "}
                  <strong className={strongClass}>reverse</strong> of the reading order. The object at the{" "}
                  <strong className={strongClass}>bottom</strong> of the list is read first. So the title belongs at the
                  bottom of the Selection Pane, and dragging the list into the order you see on the slide (title at the
                  top) breaks it.
                </p>
                <CodeBlock
                  label="Reading order compared with the Selection Pane"
                  code={`On the slide           Reading Order pane     Selection Pane
(what you see)         (Windows, read order)  (Mac and web, layers)

Title: Q3 results      1. Title 1             Chart 3      <- read last
Text: Revenue up 12%   2. Content 2           Content 2
Chart                  3. Chart 3             Title 1      <- read first`}
                />
                <p className={pClass}>
                  Rename shapes in the Selection Pane (double-click the name) so the list is easy to check: &ldquo;Q3
                  revenue chart&rdquo; is clearer than &ldquo;Picture 7&rdquo;. If several objects form one picture,
                  such as an arrow and its label, group them (select them, then <MenuPath steps={["Arrange", "Group", "Group"]} />)
                  so they are read as one item with one description. Microsoft notes that grouping removes any
                  animations on the grouped objects.
                </p>
              </div>
            </div>
          </section>

          {/* Alt text */}
          <section id="alt-text" className="py-10 px-4 sm:px-6 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>4. Alt Text, Decorative Images, Charts and SmartArt</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  Every picture, icon, chart, SmartArt graphic, shape without text, video and embedded object that
                  means something needs alt text (<Wcag id="1.1.1" name="Non-text Content" />). Shapes and text boxes
                  that contain text are read as text and do not need it. For what to write, with examples for every
                  kind of image, see{" "}
                  <Link href="/guides/how-to-write-alt-text" className={linkClass}>
                    how to write alt text
                  </Link>
                  .
                </p>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>Windows, Microsoft 365:</strong> right-click the object and choose
                    View Alt Text, or select it and choose Alt Text on its format tab. In PowerPoint 2019 to 2024 the
                    command is Edit Alt Text.
                  </li>
                  <li>
                    <strong className={strongClass}>Mac:</strong> Control-click and choose View Alt Text, or use Alt
                    Text on the Format tab.
                  </li>
                  <li>
                    <strong className={strongClass}>Decorative:</strong>{" "}tick Mark as decorative in the Alt Text pane
                    for backgrounds, borders, accent shapes and stock images that only set a mood. In the Windows
                    Reading Order pane, clearing an object&apos;s checkbox does the same.
                  </li>
                  <li>
                    <strong className={strongClass}>Generated descriptions:</strong> recent Microsoft 365 builds can
                    write a description with AI when you ask for one in the Alt Text pane. Read it and rewrite it for
                    the slide: it describes what is in the picture, not why it is there.
                  </li>
                </ul>
                <h3 className={h3Class}>Charts</h3>
                <p className={pClass}>
                  Select the chart&apos;s outer border, not a bar or the legend, then add alt text that gives the
                  point of the chart rather than its type: &ldquo;Column chart: support tickets fell every month
                  after the new help centre launched in March.&rdquo; Put the figures somewhere everyone can reach
                  them, such as a simple table on the next slide, the speaker notes or a linked data file. Bars, lines
                  and segments need 3:1 contrast with their neighbours (<Wcag id="1.4.11" name="Non-text Contrast" />),
                  and colour should not be the only way to tell series apart; label them directly. The{" "}
                  <Link href="/guides/accessible-charts" className={linkClass}>
                    accessible charts guide
                  </Link>{" "}
                  goes deeper.
                </p>
                <h3 className={h3Class}>SmartArt and diagrams</h3>
                <p className={pClass}>
                  Select the SmartArt frame (its outer border) and describe the relationship it shows: &ldquo;Four-step
                  cycle: plan, build, test, review, then back to plan.&rdquo; If the SmartArt is really a list in a
                  costume, a plain bulleted list in the content placeholder is often more accessible and easier to read
                  on a small screen. For a diagram drawn from shapes, group the shapes and give the group alt text, or
                  describe the diagram in the slide text.
                </p>
                <h3 className={h3Class}>Pictures of text and screenshots</h3>
                <p className={pClass}>
                  Avoid putting a picture of a table, a quote or a slide inside a slide (
                  <Wcag id="1.4.5" name="Images of Text" />). Paste it as real text or a real table. If a screenshot is
                  the point, say what it shows and what to notice: &ldquo;The Share button, top right of the
                  toolbar, highlighted in a red box.&rdquo;
                </p>
              </div>
            </div>
          </section>

          {/* Tables */}
          <section id="tables" className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>5. Tables</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  A slide is a poor place for a large table, so keep tables small and simple, and consider whether a
                  chart with a description, or a few bullet points, would say it better. When you do use one:
                </p>
                <ul className={listClass}>
                  <li>
                    Insert a real table with <MenuPath steps={["Insert", "Table"]} />, not a picture of one or a grid
                    of text boxes.
                  </li>
                  <li>
                    Put column headings in the first row and keep{" "}
                    <MenuPath steps={["Table Design", "Header Row"]} /> ticked (in the Table Style Options group, on
                    Windows and Mac). In PowerPoint, this checkbox is what tells assistive technology the first row
                    holds headers.
                  </li>
                  <li>
                    Avoid merged and split cells, tables inside tables and empty cells used for spacing, so each cell
                    belongs to exactly one row and one column (<Wcag id="1.3.1" name="Info and Relationships" />).
                  </li>
                  <li>
                    Pasting from Excel? Paste as a table, not as a picture, and check the header row afterwards.
                  </li>
                </ul>
                <p className={pClass}>
                  See{" "}
                  <Link href="/guides/accessible-data-tables" className={linkClass}>
                    accessible data tables
                  </Link>{" "}
                  for when a table is the right choice and how headers are read.
                </p>
              </div>
            </div>
          </section>

          {/* Links */}
          <section id="links" className="py-10 px-4 sm:px-6 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>6. Link Text</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  In the file, a link should say where it goes (<Wcag id="2.4.4" name="Link Purpose (In Context)" />).
                  &ldquo;Click here&rdquo; and &ldquo;link&rdquo; mean nothing when a screen reader lists the links,
                  and a long address is read out piece by piece.
                </p>
                <ul className={listClass}>
                  <li>
                    Right-click the link and choose Edit Link, or select it and press <Kbd>Ctrl+K</Kbd> (
                    <Kbd>Cmd+K</Kbd>{" "}on a Mac). Change Text to display to the destination&apos;s name, such as
                    &ldquo;2026 conference programme&rdquo;.
                  </li>
                  <li>
                    A slide that will be shown on screen sometimes needs an address people can type. Make it short and
                    memorable (a bare domain or a short path) and still link it. A long tracking URL helps nobody.
                  </li>
                  <li>
                    If a picture or button is the link, its alt text is the link&apos;s name, so the alt text must name
                    the destination.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contrast */}
          <section id="contrast" className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>7. Contrast, Colour and Themes</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  Projectors and shared screens wash colours out, so slides need more contrast than you think. Text
                  needs at least 4.5:1 against its background, or 3:1 for large text of 18 pt, or 14 pt bold (
                  <Wcag id="1.4.3" name="Contrast (Minimum)" />). Most slide text is large, but that is a minimum, not a
                  target.
                </p>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>Fix it in the theme.</strong> Choose a theme on the Design tab
                    and set its colours under the Variants gallery (Colors), so every slide inherits text and
                    background pairs that pass. Checking colours once in the theme beats fixing them slide by slide.
                    The{" "}
                    <Link href="/guides/accessible-color-palettes" className={linkClass}>
                      accessible colour palettes guide
                    </Link>{" "}
                    shows how to build a set that passes.
                  </li>
                  <li>
                    <strong className={strongClass}>Text over photos.</strong> This is the most common failure, and
                    Microsoft notes its checker can miss low contrast in some cases, such as text in a transparent
                    text box. Put a solid or semi-opaque shape behind the text and test the worst part of the image
                    with the{" "}
                    <Link href="/tools/text-over-image-contrast-checker" className={linkClass}>
                      text over image contrast checker
                    </Link>
                    . For flat colours, use the{" "}
                    <Link href="/tools/contrast-checker" className={linkClass}>
                      contrast checker
                    </Link>
                    .
                  </li>
                  <li>
                    <strong className={strongClass}>Never colour alone.</strong> Do not rely on red and green to mean
                    bad and good, or a coloured outline to show the recommended option (
                    <Wcag id="1.4.1" name="Use of Color" />). Add labels, icons or patterns.
                  </li>
                  <li>
                    <strong className={strongClass}>Check in greyscale.</strong>{" "}On Windows, Microsoft suggests turning
                    on the Grayscale colour filter (Settings &gt; Accessibility &gt; Color filters) and looking through
                    the deck: anything that stops making sense depends on colour.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Fonts */}
          <section id="fonts" className="py-10 px-4 sm:px-6 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>8. Font Size and Typography for Presenting</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  WCAG has no minimum font size, but a slide that cannot be read from the back of the room, or in a
                  thumbnail-sized video call window, is not doing its job. Microsoft&apos;s PowerPoint guidance is to
                  use 18 pt or larger for body text where possible; bigger rooms and screen sharing usually call for
                  more.
                </p>
                <ul className={listClass}>
                  <li>
                    Use a familiar sans serif font such as Arial or Calibri, as Microsoft suggests, and avoid long runs
                    of capitals and heavy italics.
                  </li>
                  <li>
                    Put less on each slide. If PowerPoint starts shrinking text to fit a placeholder (AutoFit), split
                    the content over two slides instead of accepting smaller text.
                  </li>
                  <li>
                    Keep text left-aligned for anything longer than a line, and leave space between lines and items.
                  </li>
                  <li>
                    Set fonts in the slide master so every slide stays consistent, and test by viewing the slide show
                    on the smallest screen your audience might use. The{" "}
                    <Link href="/guides/accessible-typography-wcag" className={linkClass}>
                      accessible typography guide
                    </Link>{" "}
                    covers the underlying principles.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Motion */}
          <section id="motion" className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>9. Animations and Transitions</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  Motion can help, for example building a diagram one step at a time as you explain it. It can also
                  distract, make some people feel unwell, and hide content from anyone reading the file later.
                </p>
                <ul className={listClass}>
                  <li>
                    Prefer simple, short effects such as Fade or Appear over spinning, bouncing and zooming
                    transitions.
                  </li>
                  <li>
                    Never use anything that flashes more than three times a second (
                    <Wcag id="2.3.1" name="Three Flashes or Below Threshold" />). Check embedded videos and GIFs for
                    flashing too.
                  </li>
                  <li>
                    The animation order (<MenuPath steps={["Animations", "Animation Pane"]} />) and the reading order
                    are separate settings. Setting one does not set the other, so check both.
                  </li>
                  <li>
                    Avoid slides that advance on a timer (<MenuPath steps={["Transitions"]} />, Advance Slide After)
                    unless the deck runs unattended, and then give people a way to pause or go back (
                    <Wcag id="2.2.1" name="Timing Adjustable" />). Looping or auto-playing motion in a self-running
                    deck also needs a way to pause it (<Wcag id="2.2.2" name="Pause, Stop, Hide" />).
                  </li>
                  <li>
                    Do not hide essential information behind an animation that only plays in the slide show. Anyone
                    reading the file sees every object at once.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Media */}
          <section id="media" className="py-10 px-4 sm:px-6 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>10. Video and Audio: Captions and Transcripts</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  Video with speech needs captions (<Wcag id="1.2.2" name="Captions (Prerecorded)" />). Audio-only
                  clips, such as a recorded interview, need a transcript (
                  <Wcag id="1.2.1" name="Audio-only and Video-only (Prerecorded)" />). If the picture shows something
                  important that nobody says, it needs describing too (
                  <Wcag id="1.2.5" name="Audio Description (Prerecorded)" />), in the narration, on the slide or in the
                  notes.
                </p>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>Windows and Mac:</strong> select the video, then{" "}
                    <MenuPath steps={["Playback", "Insert Captions", "Insert Captions"]} /> and choose a caption file.
                    WebVTT (.vtt) files work in current versions; SRT files need Microsoft 365 version 2411 or later on
                    Windows, or 16.91 or later on a Mac. The Accessibility ribbon has an Insert Captions button too.
                  </li>
                  <li>
                    <strong className={strongClass}>Web:</strong> select the video, then{" "}
                    <MenuPath steps={["Video", "Edit Captions"]} />. In the Captions pane you can choose Generate captions
                    to create them from the speech, edit them, or insert a WebVTT or SRT file.
                  </li>
                  <li>
                    <strong className={strongClass}>Audio:</strong> captions also work on inserted audio in newer
                    versions (Windows 2303 or later, Mac 16.71 or later), but they show only on the slide where the
                    audio was inserted. A transcript in the speaker notes or a linked document works everywhere.
                  </li>
                  <li>
                    <strong className={strongClass}>Keep them:</strong> Microsoft warns that Compress Media and
                    Optimize Media Compatibility can strip captions and alternative audio tracks. Keep a copy of the
                    original file before compressing, and check captions again afterwards.
                  </li>
                </ul>
                <p className={pClass}>
                  Generated captions are a draft. Read them through and correct names, technical terms and anything
                  misheard. Avoid setting video to play automatically on a slide that also needs you to speak, and
                  make sure the player controls are reachable.
                </p>
              </div>
            </div>
          </section>

          {/* Checker */}
          <section id="checker" className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>11. PowerPoint&apos;s Check Accessibility Tool</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  Select <MenuPath steps={["Review", "Check Accessibility"]} /> in PowerPoint for Windows, Mac or the
                  web. It opens the Accessibility ribbon, with Slide Title, Reading Order Pane, alt text and captions
                  tools in one place, and the Accessibility pane listing errors, warnings and tips. On Windows, the
                  checker also runs in the background and shows a reminder in the status bar.
                </p>
                <p className={pClass}>
                  Microsoft&apos;s published{" "}
                  <Ext href="https://support.microsoft.com/en-us/accessibility/office-accessibility/rules-for-the-accessibility-checker">
                    rules for the Accessibility Checker
                  </Ext>{" "}
                  for PowerPoint are: missing alt text, tables without header information, sections without meaningful
                  names, slides without titles and restricted access (errors); tables without a simple structure, low
                  text contrast, media without captions and an illogical reading order (warnings); repeated section
                  names and duplicate slide titles (tips); and suggested alt text to review. That is a useful safety
                  net, but it leaves gaps.
                </p>
              </div>
              <div tabIndex={0} role="region" aria-label="Which PowerPoint accessibility issues Microsoft's published checker rules cover, which the free checker on this site covers, and what needs a manual check" className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Which PowerPoint accessibility issues Microsoft&apos;s published checker rules cover, which the free
                    checker on this site covers, and what needs a manual check
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Issue</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Microsoft&apos;s published rules</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Free checker on this site</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Still check by hand</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {checkerRows.map(([label, microsoft, ours, manual]) => (
                      <tr key={label}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          {label}
                        </th>
                        <td className="px-4 py-3 align-top">{microsoft}</td>
                        <td className="px-4 py-3 align-top">{ours}</td>
                        <td className="px-4 py-3 align-top">{manual || "Covered by the checks"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className={`${pClass} mt-6`}>
                Microsoft updates its rules over time, so your version may report more. No checker can tell whether a
                title describes its slide, whether alt text is right, or whether the slide makes sense when it is
                read aloud; that part is yours.
              </p>
            </div>
          </section>

          {/* Sharing */}
          <section id="sharing" className="py-10 px-4 sm:px-6 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>12. Sharing and Exporting: PDF, Notes and the Original File</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className={h3Class}>Before you send it</h3>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>Set the presentation title:</strong>{" "}
                    <MenuPath steps={["File", "Info"]} />, then the Title box under Properties (on a Mac,{" "}
                    <MenuPath steps={["File", "Properties"]} />, Summary tab). Screen readers and PDF viewers show it
                    instead of the file name (<Wcag id="2.4.2" name="Page Titled" />).
                  </li>
                  <li>
                    <strong className={strongClass}>Set the language:</strong> PowerPoint stores the language on each
                    piece of text and has no single setting for the whole file. Select text and choose{" "}
                    <MenuPath steps={["Review", "Language", "Set Proofing Language"]} />. A quick way to cover titles
                    and body text is to select everything in Outline view first; then do text boxes, tables and notes
                    separately. In PowerPoint for the web, Microsoft says you can set it only for selected text or a
                    text box (<Wcag id="3.1.1" name="Language of Page" />).
                  </li>
                  <li>
                    <strong className={strongClass}>Remove hidden slides you do not need.</strong> They are skipped
                    in the slide show but are still in the file, and screen reader users and some exports still reach
                    them.
                  </li>
                  <li>
                    <strong className={strongClass}>Use the notes.</strong> Speaker notes are a good home for chart
                    data, transcripts and longer descriptions. Write them as if someone else will read them, because
                    they will.
                  </li>
                </ul>
                <h3 className={h3Class}>Export a tagged PDF</h3>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>Windows:</strong> select{" "}
                    <MenuPath steps={["File", "Export", "Create PDF/XPS Document", "Create PDF/XPS"]} />, then Options.
                    Make sure Document structure tags for accessibility and Document properties are ticked. Under
                    Publish what, choose Notes pages to include the speaker notes, and tick the hidden slides option
                    only if you mean to include them. Select OK, then Publish.
                  </li>
                  <li>
                    <strong className={strongClass}>Mac:</strong> choose <MenuPath steps={["File", "Save As"]} />{" "}(or
                    Export), set the File Format to PDF and select Best for electronic distribution and accessibility
                    (uses Microsoft online service), which Microsoft says produces a tagged PDF and keeps links on
                    objects. Microsoft&apos;s Mac instructions also say notes and hidden slides cannot be included in a
                    PDF export from the Mac app.
                  </li>
                  <li>
                    <strong className={strongClass}>Web:</strong> select{" "}
                    <MenuPath steps={["File", "Export", "Download as PDF"]} />.
                  </li>
                </ul>
                <p className={pClass}>
                  Do not print to PDF, which drops all the tags. A PDF also loses video, audio and animation, so share
                  the .pptx as well when people may need them, and check the PDF with the{" "}
                  <Link href="/tools/pdf-accessibility-checker" className={linkClass}>
                    PDF accessibility checker
                  </Link>
                  . The{" "}
                  <Link href="/guides/pdf-accessibility" className={linkClass}>
                    accessible PDF guide
                  </Link>{" "}
                  explains tags, reading order and what to fix if the export goes wrong.
                </p>
              </div>
            </div>
          </section>

          {/* Presenting */}
          <section id="presenting" className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>13. Presenting Accessibly in Meetings and Rooms</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  An accessible file is half the job. The other half is how you present it.
                </p>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>Send the deck in advance.</strong> People using screen readers or
                    magnification can follow along on their own device at their own pace, and people who process
                    information more slowly can read ahead.
                  </li>
                  <li>
                    <strong className={strongClass}>Turn on live subtitles.</strong> PowerPoint for Microsoft 365 can
                    show live captions or translated subtitles as you speak. Set them up in{" "}
                    <MenuPath steps={["Slide Show", "Subtitle Settings"]} /> (spoken language, subtitle language and
                    position) and select Always Use Subtitles to start them with every show. During a show, the Toggle
                    Subtitles button turns them on and off, and on Windows and the web the <Kbd>J</Kbd>{" "}key does too.
                    They need a good internet connection, and Microsoft&apos;s Speech Services receive your audio to
                    produce them.
                  </li>
                  <li>
                    <strong className={strongClass}>In a Teams meeting,</strong>{" "}attendees can turn on live captions
                    from the meeting&apos;s More actions menu (Captions). Remind people at the start that
                    they are available.
                  </li>
                  <li>
                    <strong className={strongClass}>Describe what is on screen.</strong>{" "}Read out the slide title as you
                    move on, and say what charts and pictures show: &ldquo;Sales doubled between May and June&rdquo;,
                    not &ldquo;as you can see here&rdquo;. Read out any quote or key number on the slide.
                  </li>
                  <li>
                    <strong className={strongClass}>Use a microphone,</strong> even in a small room, and repeat audience
                    questions before answering them. Hearing aid users and remote attendees depend on it.
                  </li>
                  <li>
                    <strong className={strongClass}>Pace and pointing.</strong> Pause on slides with a lot of content,
                    and describe where things are rather than pointing at them.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section id="checklist" className="py-10 px-4 sm:px-6 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={`${h2Class} flex items-center gap-3`}>
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                PowerPoint Accessibility Checklist
              </h2>
              <p className={pClass}>
                Tick the boxes as you work, or print this page (<Kbd>Ctrl+P</Kbd> or <Kbd>Cmd+P</Kbd>) to use it on
                paper. Nothing you tick is saved or sent anywhere.
              </p>
              <div className="grid gap-6 md:grid-cols-2 text-muted-foreground leading-relaxed">
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 break-inside-avoid">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Structure</h3>
                  <ul className="space-y-2">
                    <CheckItem>Every slide has a title, and no two titles are the same.</CheckItem>
                    <CheckItem>Slides without a visible title have a hidden one (off the slide).</CheckItem>
                    <CheckItem>Content is in layout placeholders, not loose text boxes.</CheckItem>
                    <CheckItem>Reading order starts with the title and follows the slide&apos;s logic.</CheckItem>
                    <CheckItem>Sections, if used, have meaningful names.</CheckItem>
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 break-inside-avoid">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Images and data</h3>
                  <ul className="space-y-2">
                    <CheckItem>Meaningful pictures, icons, charts and SmartArt have alt text that gives the point.</CheckItem>
                    <CheckItem>Decorative images are marked as decorative.</CheckItem>
                    <CheckItem>Generated alt text has been reviewed and rewritten.</CheckItem>
                    <CheckItem>Chart data is available as text or a table.</CheckItem>
                    <CheckItem>Tables are real tables with Header Row ticked and no merged cells.</CheckItem>
                    <CheckItem>No pictures of text.</CheckItem>
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 break-inside-avoid">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Visual design</h3>
                  <ul className="space-y-2">
                    <CheckItem>Text contrast is at least 4.5:1, or 3:1 for large text, including text over photos.</CheckItem>
                    <CheckItem>Colour is never the only way information is shown.</CheckItem>
                    <CheckItem>Body text is 18 pt or larger, in a clear sans serif font.</CheckItem>
                    <CheckItem>Animations and transitions are simple; nothing flashes.</CheckItem>
                    <CheckItem>Slides do not advance on a timer unless people can pause.</CheckItem>
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 break-inside-avoid">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Media and links</h3>
                  <ul className="space-y-2">
                    <CheckItem>Videos have accurate captions; important visuals are described.</CheckItem>
                    <CheckItem>Audio clips have a transcript.</CheckItem>
                    <CheckItem>Link text names the destination; linked pictures have alt text.</CheckItem>
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 break-inside-avoid md:col-span-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Before you share or present</h3>
                  <ul className="space-y-2">
                    <CheckItem>Presentation title set in File &gt; Info, and the language set on the text.</CheckItem>
                    <CheckItem>Unneeded hidden slides removed.</CheckItem>
                    <CheckItem>Review &gt; Check Accessibility shows no errors, and warnings are reviewed.</CheckItem>
                    <CheckItem>The free Word and PowerPoint checker shows no errors.</CheckItem>
                    <CheckItem>PDF exported with Document structure tags for accessibility, and checked.</CheckItem>
                    <CheckItem>Deck sent in advance; live subtitles or meeting captions ready.</CheckItem>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Test */}
          <section id="test" className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>Test the Deck With the Free Checker</h2>
              <ToolCallout heading="Word and PowerPoint Accessibility Checker">
                Drop in a .pptx file to see each problem by slide and shape, with the PowerPoint fix: missing and
                duplicate titles, alt text, the title&apos;s place in the reading order, table headers, links,
                language, media and hidden slides. Download the list as CSV or Excel. Your file stays on your device.
              </ToolCallout>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ol className={olClass}>
                  <li>
                    <strong className={strongClass}>Save a .pptx copy.</strong>{" "}The checker reads .pptx files. Convert
                    an old .ppt with File &gt; Save As &gt; PowerPoint Presentation (.pptx), and remove any password
                    from a copy first. For Google Slides, choose File &gt; Download &gt; Microsoft PowerPoint (.pptx).
                  </li>
                  <li>
                    <strong className={strongClass}>Open it in the checker.</strong> Drop the file on the{" "}
                    <Link href={TOOL} className={linkClass}>
                      Word and PowerPoint Accessibility Checker
                    </Link>
                    . Errors are clear failures, warnings need a judgement, and tips are good practice.
                  </li>
                  <li>
                    <strong className={strongClass}>Fix in PowerPoint, then run Check Accessibility.</strong>{" "}The free
                    checker does not measure contrast in PowerPoint, so Microsoft&apos;s checker and your own eyes
                    cover that.
                  </li>
                  <li>
                    <strong className={strongClass}>Read the outline.</strong> <MenuPath steps={["View", "Outline View"]} />{" "}
                    shows every title and the body text in placeholders. If the outline does not tell the story of the
                    deck, neither will a screen reader.
                  </li>
                  <li>
                    <strong className={strongClass}>Listen to a few slides.</strong> Start Narrator on Windows with{" "}
                    <Kbd>Ctrl+Windows+Enter</Kbd> or VoiceOver on a Mac with <Kbd>Cmd+F5</Kbd>. In Normal view, press{" "}
                    <Kbd>F6</Kbd> until you reach the slide, then <Kbd>Tab</Kbd> through its objects. You will hear
                    exactly the reading order and alt text you set.
                  </li>
                  <li>
                    <strong className={strongClass}>Watch the show.</strong> Run the slide show on a small screen, or
                    project it, and check that every word is readable and nothing flashes.
                  </li>
                </ol>
                <p className={pClass}>
                  For deeper screen reader testing, see the{" "}
                  <Link href="/guides/screen-reader-testing" className={linkClass}>
                    screen reader testing guide
                  </Link>{" "}
                  and the{" "}
                  <Link href="/guides/voiceover-screen-reader-testing" className={linkClass}>
                    VoiceOver guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Sources */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Microsoft Sources Used</h2>
              <p className={pClass}>
                Menu paths in this guide were checked against these Microsoft Support articles in October 2026.
                Microsoft moves commands between versions, so if a name differs in your copy, the article for your
                version will have it.
              </p>
              <ul className={listClass}>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/office/make-your-powerpoint-presentations-accessible-to-people-with-disabilities-6f7772b2-2f33-4bd2-8ca7-dae3b2b3ef25">
                    Make your PowerPoint presentations accessible to people with disabilities
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/powerpoint/title-a-slide">Title a slide</Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/powerpoint/make-slides-easier-to-read-by-using-the-reading-order-pane">
                    Make slides easier to read by using the Reading Order pane
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/office/add-alternative-text-to-a-shape-picture-chart-smartart-graphic-or-other-object-44989b2a-903c-4d9a-b742-6a75b451c669">
                    Add alternative text to a shape, picture, chart, SmartArt graphic, or other object
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/accessibility/office-accessibility/rules-for-the-accessibility-checker">
                    Rules for the Accessibility Checker
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/office/add-closed-captions-or-subtitles-to-media-in-powerpoint-df091537-fb22-4507-898f-2358ddc0df18">
                    Add closed captions or subtitles to media in PowerPoint
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/office/present-with-real-time-automatic-captions-or-subtitles-in-powerpoint-68d20e49-aec3-456a-939d-34a79e8ddd5f">
                    Present with real-time, automatic captions or subtitles in PowerPoint
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/office/create-accessible-pdfs-064625e0-56ea-4e16-ad71-3aa33bb4b7ed">
                    Create accessible PDFs
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-au/powerpoint/training/save-powerpoint-presentations-as-pdf-files">
                    Save PowerPoint presentations as PDF files
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/office/check-spelling-and-grammar-in-a-different-language-667ba67a-a202-42fd-8596-edc1fa320e00">
                    Check spelling and grammar in a different language
                  </Ext>
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Deck Before the Meeting
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Find missing titles, alt text and reading order problems in your browser, fix them in PowerPoint,
                  then export a tagged PDF for people who need the slides afterwards.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href={TOOL}>
                      Word and PowerPoint Checker
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/accessible-word-documents">Accessible Word Documents</Link>
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
                content="powerpoint presentation slides accessibility pptx slide titles reading order alt text decorative charts smartart tables contrast captions video audio transcript animation pdf export document accessibility word office screen reader"
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
