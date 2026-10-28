import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileCheck, ListChecks, ShieldCheck } from "lucide-react"
import { PageByline } from "@/components/seo/page-byline"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { clampDescription } from "@/lib/metadata"

const ROUTE = "/guides/accessible-word-documents"
const TOOL = "/tools/word-powerpoint-accessibility-checker"
const pageTitle = "How to Make a Word Document Accessible: Checklist"
const pageDescription =
  "Make a Word document accessible step by step: title, language, heading styles, alt text, tables, links, contrast and tagged PDF export, plus a checklist."
const ogImage = `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "how to make a word document accessible",
    "accessible word document",
    "word accessibility checklist",
    "word accessibility checker",
    "heading styles word accessibility",
    "alt text in word",
    "accessible tables in word",
    "make word document accessible",
    "word document accessibility",
    "check accessibility word",
    "accessibility assistant word",
    "mark as decorative word",
    "repeat header rows word accessibility",
    "word document language accessibility",
    "accessible pdf from word",
    "document structure tags for accessibility",
    "accessible word template",
    "wcag word documents",
    "en 301 549 documents",
    "section 508 word documents",
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
    name: "Accessible Word Documents",
    url: `https://accessibility.build${ROUTE}`,
  },
]

const faqs: FaqItem[] = [
  {
    question: "How do I make a Word document accessible?",
    answer:
      "Give the file a title in File > Info > Properties, set the document language, and build the structure with Word's built-in Heading styles and real bulleted or numbered lists. Add alt text to every meaningful picture, chart and SmartArt graphic, and mark purely decorative ones as decorative. Keep tables simple, with a header row set to repeat and no merged or empty layout cells. Write link text that says where the link goes, keep text contrast at 4.5:1 or more, and keep content in the main text rather than in floating text boxes. Then run Review > Check Accessibility, check what it does not cover, and export to PDF with document structure tags turned on.",
  },
  {
    question: "Does Word have an accessibility checker?",
    answer:
      "Yes. Select Review > Check Accessibility in Word for Windows, Mac or the web. On Windows it opens the Accessibility Assistant pane, which groups issues under Color and Contrast, Media and Illustrations, Tables, Document Structure and Document Access, and a status bar reminder appears when it finds problems. It is worth running on every file, but Microsoft's published rule list does not include a missing document title, the document language, vague link text, skipped heading levels or text that is only formatted to look like a heading, so check those separately. The free Word and PowerPoint Accessibility Checker on this site looks for them.",
  },
  {
    question: "Do Word documents have to meet WCAG?",
    answer:
      "In many settings, yes. The W3C's WCAG2ICT guidance explains how WCAG applies to non-web documents, and the rules that matter in practice follow it. EN 301 549 applies adapted WCAG criteria to non-web documents in clause 10, which is how documents come into scope in the EU. The US Section 508 standards apply WCAG 2.0 Level AA to electronic documents, and the ADA Title II rule for state and local governments covers word processing files posted online, with an exception for older documents that are not updated or still needed to use a service. UK public sector bodies must make documents published on their websites since 23 September 2018 accessible, with similar exceptions.",
  },
  {
    question: "How do I add alt text to a picture in Word?",
    answer:
      "In Word for Microsoft 365, right-click the picture and choose View Alt Text, or select it and choose Alt Text on the Picture Format tab. In Word 2019 to 2024 the command is called Edit Alt Text. On a Mac, Control-click the picture and choose View Alt Text. Type a sentence or two that says what the picture shows and why it is there, without starting with \"image of\". If the picture adds nothing, tick Mark as decorative instead. For a chart or SmartArt graphic, select its outer border first so the alt text applies to the whole object.",
  },
  {
    question: "How do I make a table accessible in Word?",
    answer:
      "Use Insert > Table for real data only, never for layout. Put column headings in the first row, then mark that row as a header: click in it and select Table Layout > Repeat Header Rows, or right-click, choose Table Properties and tick Repeat as header row at the top of each page on the Row tab. Also keep Header Row ticked on the Table Design tab. Avoid merged and split cells, tables inside tables, and empty rows or columns used for spacing, and give the table a caption or a sentence before it that says what it shows.",
  },
  {
    question: "How do I save an accessible PDF from Word?",
    answer:
      "On Windows, select File > Save As or Save a Copy, choose PDF as the file type, select More options and then Options, and make sure Document structure tags for accessibility is ticked. Ticking Create bookmarks using Headings adds bookmarks too. On a Mac, choose PDF as the file format and select Best for electronic distribution and accessibility, which Microsoft notes uses its online conversion service. In Word for the web, select File > Save As > Download as PDF. Do not use a Print to PDF printer, which produces an untagged file, and check the PDF itself afterwards.",
  },
  {
    question: "If the accessibility checker finds no issues, is my document accessible?",
    answer:
      "Not necessarily. Automated checks find structural problems such as missing alt text or a table with no header row. They cannot judge whether alt text is accurate, whether headings describe their sections, whether colour carries meaning on its own, or whether the reading order makes sense. Treat a clean result as the start of the review: scan the headings in the Navigation Pane, read the document with a screen reader or Read Aloud, and check the exported PDF.",
  },
]

const altExamples = [
  {
    image: "Photo in a staff newsletter of the new reception area",
    weak: "image of office",
    better: "The new ground-floor reception, with the visitor desk just inside the main doors.",
  },
  {
    image: "Bar chart of quarterly enquiries",
    weak: "chart",
    better: "Bar chart: enquiries rose in every quarter, from 410 in Q1 to 690 in Q4. Full figures are in Table 2.",
  },
  {
    image: "Screenshot in a how-to guide",
    weak: "screenshot.png",
    better: "Word Options dialog with Accessibility selected in the left-hand list.",
  },
  {
    image: "Logo beside the organisation's name in the header",
    weak: "logo",
    better: "Mark as decorative, because the name is already in the text next to it.",
  },
  {
    image: "Decorative divider line between sections",
    weak: "line",
    better: "Mark as decorative.",
  },
]

const mistakes = [
  {
    bad: "Bold, larger text instead of Heading styles",
    why: "Screen reader users cannot move by heading, the Navigation Pane is empty and the PDF gets no heading tags (1.3.1).",
    fix: "Apply Heading 1, 2 and 3 from Home > Styles, and change the style's look if you want a different font.",
  },
  {
    bad: "Typing a hyphen or number to start each list item",
    why: "It is read as ordinary paragraphs, so nobody hears that a list starts or how long it is (1.3.1).",
    fix: "Use Home > Bullets or Home > Numbering.",
  },
  {
    bad: "Pressing Enter several times to add space",
    why: "Each empty paragraph is announced as blank, and the layout breaks when fonts or page sizes change.",
    fix: "Set Spacing Before and After on the Layout tab; use Ctrl+Enter for a page break.",
  },
  {
    bad: "A table used to lay out a form or a page",
    why: "Screen readers announce rows and columns that mean nothing and may read cells in an odd order (1.3.2).",
    fix: "Use styles, tabs and paragraph spacing for layout; keep tables for data.",
  },
  {
    bad: "Key information in a text box or floating shape",
    why: "Text boxes may be read out of order or skipped, and their headings do not appear in the Navigation Pane.",
    fix: "Move the text into the main body; set pictures to In Line with Text.",
  },
  {
    bad: "\"Click here\" or a pasted web address as link text",
    why: "Listed out of context, the link says nothing about where it goes, or reads out a long address (2.4.4).",
    fix: "Use the destination's name as the link text, through Edit Hyperlink > Text to display.",
  },
  {
    bad: "Red text as the only sign that something is overdue",
    why: "People who cannot tell red apart, or who use high contrast, miss the meaning (1.4.1).",
    fix: "Add a word or symbol as well as the colour.",
  },
]

type CheckerRow = [label: string, microsoft: string, ours: string, manual: string]

const checkerRows: CheckerRow[] = [
  ["Alt text on pictures, charts and SmartArt", "Yes (error)", "Yes, and flags generated text, file names and \"image of\"", "Is the description accurate and useful here?"],
  ["Table header information", "Yes (error)", "Yes, looks for a header row marked to repeat", "Do the headers describe each column?"],
  ["Merged cells, nested tables", "Yes, as \"simple structure\" (warning)", "Yes", "Could the data be simpler, or not a table at all?"],
  ["Text contrast", "Yes (warning)", "Text with a fixed colour only", "Theme colours, text on images, charts"],
  ["Heading styles used", "Yes (tip)", "Yes", "Do the headings describe their sections?"],
  ["Skipped heading levels", "Not listed", "Yes", ""],
  ["Text formatted to look like a heading", "Not listed", "Yes", ""],
  ["Document title in properties", "Not listed", "Yes", "Does the title describe the document?"],
  ["Document language", "Not listed", "Yes", "Are passages in other languages marked?"],
  ["Link text", "Not listed", "Yes: web addresses, \"click here\", empty links", "Does each link make sense on its own?"],
  ["Typed bullets, blank paragraphs", "Not listed", "Yes", ""],
  ["Text boxes and floating objects", "Not listed", "Yes", "Does the reading order make sense?"],
  ["Restricted access (rights management)", "Yes (error)", "Password-protected files cannot be opened", ""],
  ["Colour used as the only signal", "Not listed", "No", "Yes, by reading the document"],
  ["Text inside pictures", "Not listed", "No", "Yes, by looking at every image"],
]

const linkClass =
  "text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2"
const strongClass = "text-slate-900 dark:text-white"
const h2Class = "text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6"
const h3Class = "text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3"
const pClass = "text-muted-foreground leading-relaxed mb-4"
const listClass = "text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1"
const olClass = "text-muted-foreground leading-relaxed mb-4 list-decimal pl-6 space-y-1"

/** A Microsoft 365 menu path, e.g. File > Info > Properties. */
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
      <FileCheck aria-hidden="true" className="h-8 w-8 shrink-0 text-blue-700 dark:text-blue-300" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">{heading}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
      </div>
      <Button asChild size="sm" className="gap-2 shrink-0">
        <Link href={TOOL}>
          Check a Word file free
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
  ["why", "Why Word accessibility matters"],
  ["steps", "Step by step: make a Word document accessible"],
  ["templates", "Start from an accessible template"],
  ["checker", "Word's Check Accessibility, and what it misses"],
  ["pdf", "Export to an accessible PDF"],
  ["mistakes", "Common mistakes and how to fix them"],
  ["checklist", "Word accessibility checklist"],
  ["test", "Test the document with the free checker"],
]

export default function AccessibleWordDocumentsGuidePage() {
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
                  <span className="text-slate-900 dark:text-white font-medium">Accessible Word Documents</span>
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
                How to Make a Word Document Accessible
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Most inaccessible PDFs, policies and reports start as Word documents, and nearly every problem is cheaper
                to fix there. This guide walks through each step in Microsoft 365 for Windows and Mac, with the web
                version where it differs: a title, the language, heading styles, real lists, alt text, simple tables,
                clear links, contrast and layout. It ends with what Word&apos;s own checker misses, how to export a
                tagged PDF, and a checklist you can print.
              </p>
              <PageByline route={ROUTE} variant="hero" align="center" />
            </div>
          </section>

          {/* Intro callout + contents */}
          <section className="pb-4 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <ToolCallout heading="Check your document as you go">
                The free Word and PowerPoint Accessibility Checker opens a .docx file in your browser and lists
                missing alt text, headings, table header rows, link text, language and more, with the fix for each.
                The file is never uploaded.
              </ToolCallout>
              <nav aria-label="On this page" className="rounded-lg border border-slate-200 dark:border-slate-800 p-5">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">On this page</p>
                <ol className="text-sm leading-relaxed list-decimal pl-5 space-y-1 text-muted-foreground">
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
              <h2 className={h2Class}>Why Word Accessibility Matters</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  A Word document is not just text on a page. Under the surface it records which paragraphs are
                  headings, which are list items, which row of a table holds the column names and what each picture
                  shows. A screen reader uses that structure to let someone jump from heading to heading, hear how
                  many items a list has, and know which column a number belongs to. When the structure is missing,
                  the document still looks fine but turns into one long, flat stream of words for anyone who cannot
                  see it.
                </p>
                <p className={pClass}>
                  The same structure helps far more people than screen reader users. Someone with low vision who
                  zooms in or switches to high contrast needs real text in the main body, not text boxes and pictures
                  of text. People with dyslexia or cognitive disabilities rely on clear headings, short sections and
                  good spacing. Everyone gets a working Navigation Pane, an automatic table of contents and PDF
                  bookmarks.
                </p>
                <h3 className={h3Class}>WCAG applies to documents too</h3>
                <p className={pClass}>
                  WCAG was written for web pages, but the W3C&apos;s{" "}
                  <Ext href="https://www.w3.org/TR/wcag2ict-22/">WCAG2ICT guidance</Ext> explains how its success
                  criteria apply to non-web documents: a .docx file is treated much like a page, its title is the
                  page title and its default language is the page language. The laws and standards that matter in
                  practice build on that:
                </p>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>EN 301 549, clause 10.</strong> The European ICT accessibility
                    standard applies adapted WCAG criteria to non-web documents such as Office files and PDFs. V3.2.1,
                    the edition cited under the Web Accessibility Directive, uses WCAG 2.1 Level AA, and V4.1.1 moves
                    to WCAG 2.2. See{" "}
                    <Link href="/compliance/en-301-549" className={linkClass}>
                      EN 301 549 explained
                    </Link>
                    , what changed for documents in{" "}
                    <Link href="/compliance/en-301-549-v4" className={linkClass}>
                      EN 301 549 v4.1.1
                    </Link>
                    , and the{" "}
                    <Link href="/checklists/en-301-549" className={linkClass}>
                      EN 301 549 checklist
                    </Link>
                    , which can be filtered to the documents chapter.
                  </li>
                  <li>
                    <strong className={strongClass}>European Accessibility Act.</strong> Beyond websites and apps,
                    covered services have to think about the electronic documents they give customers, such as
                    invoices and e-tickets. The{" "}
                    <Link href="/checklists/eaa" className={linkClass}>
                      EAA readiness checklist
                    </Link>{" "}
                    covers what that means.
                  </li>
                  <li>
                    <strong className={strongClass}>Section 508.</strong> The Revised 508 Standards apply WCAG 2.0
                    Level AA to electronic documents, not just web pages, so US federal agencies and their suppliers
                    need accessible Word files. See{" "}
                    <Link href="/compliance/section-508" className={linkClass}>
                      Section 508 compliance
                    </Link>
                    .
                  </li>
                  <li>
                    <strong className={strongClass}>ADA Title II.</strong> The Department of Justice rule for state
                    and local governments sets WCAG 2.1 Level AA for web content, and it names word processing,
                    presentation, PDF and spreadsheet files as covered{" "}
                    <Ext href="https://www.ada.gov/resources/2024-03-08-web-rule/">conventional electronic documents</Ext>
                    . Documents posted before the compliance date are generally exempt, unless they are later updated
                    or are still used to apply for or take part in a service. The compliance dates are now 26 April
                    2027 and 26 April 2028; our{" "}
                    <Link href="/guides/doj-title-ii-deadline-extension" className={linkClass}>
                      Title II deadline guide
                    </Link>{" "}
                    explains the change.
                  </li>
                  <li>
                    <strong className={strongClass}>UK public sector.</strong> Under the public sector accessibility
                    regulations, documents on public sector websites must be accessible. GOV.UK&apos;s{" "}
                    <Ext href="https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps">
                      accessibility requirements guidance
                    </Ext>{" "}
                    says documents published before 23 September 2018 are exempt unless people need them to use a
                    service.
                  </li>
                </ul>
                <p className={pClass}>
                  The success criteria you will meet most often in a Word file are{" "}
                  <Wcag id="1.1.1" name="Non-text Content" />, <Wcag id="1.3.1" name="Info and Relationships" />,{" "}
                  <Wcag id="1.3.2" name="Meaningful Sequence" />, <Wcag id="1.4.3" name="Contrast (Minimum)" />,{" "}
                  <Wcag id="2.4.2" name="Page Titled" />, <Wcag id="2.4.4" name="Link Purpose (In Context)" />,{" "}
                  <Wcag id="2.4.6" name="Headings and Labels" /> and <Wcag id="3.1.1" name="Language of Page" />.
                  Each step below says which one it serves.
                </p>
              </div>
            </div>
          </section>

          {/* Steps */}
          <section id="steps" className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={`${h2Class} flex items-center gap-3`}>
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                Step by Step: Make a Word Document Accessible
              </h2>
              <p className={pClass}>
                Menu paths are for Word in Microsoft 365. Where Word for Mac or Word for the web works differently,
                the step says so. Older versions such as Word 2019 use slightly different names for a few commands;
                those are noted too.
              </p>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {/* 1 Title */}
                <h3 className={h3Class}>1. Give the document a title</h3>
                <p className={pClass}>
                  The title in a document&apos;s properties is what a screen reader announces when the file opens,
                  what a browser tab shows when the file is opened online, and what the window title of an exported
                  PDF shows. Without one, people hear the file name, such as &ldquo;FINAL_v3_JB_edits.docx&rdquo;.
                  This is <Wcag id="2.4.2" name="Page Titled" />.
                </p>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>Windows:</strong> select <MenuPath steps={["File", "Info"]} />.
                    Under Properties on the right, click the Title box and type a title that describes the content,
                    then save. For the full set of fields, choose{" "}
                    <MenuPath steps={["Properties", "Advanced Properties", "Summary"]} />.
                  </li>
                  <li>
                    <strong className={strongClass}>Mac:</strong> select{" "}
                    <MenuPath steps={["File", "Properties"]} />, open the Summary tab, fill in Title and select OK.
                  </li>
                  <li>
                    <strong className={strongClass}>Web:</strong> Microsoft documents the title property for the
                    desktop apps, so open the file in the desktop app to set it if you cannot find it online.
                  </li>
                </ul>
                <p className={pClass}>
                  A good title is the document&apos;s real name: &ldquo;Parking permit application guide
                  2026&rdquo;, not &ldquo;Document1&rdquo;, &ldquo;Title&rdquo; or the file name. Word sometimes fills
                  the field from the first line of text, so check it rather than assume.
                </p>

                {/* 2 Language */}
                <h3 className={h3Class}>2. Set the document language</h3>
                <p className={pClass}>
                  Screen readers switch pronunciation rules based on the language stored with the text. If it is
                  missing or wrong, a French screen reader may read English text with French sounds, which is close
                  to unintelligible. The default language is <Wcag id="3.1.1" name="Language of Page" />, and a
                  passage in another language is <Wcag id="3.1.2" name="Language of Parts" />.
                </p>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>Windows:</strong> press <Kbd>Ctrl+A</Kbd> to select all the text,
                    then choose <MenuPath steps={["Review", "Language", "Set Proofing Language"]} />. Pick the
                    language and select OK. Selecting Set As Default in the same dialog makes new documents use it
                    too.
                  </li>
                  <li>
                    <strong className={strongClass}>Mac:</strong> press <Kbd>Cmd+A</Kbd>, then select{" "}
                    <MenuPath steps={["Review", "Language"]} />, choose the language and select OK.
                  </li>
                  <li>
                    <strong className={strongClass}>Web:</strong> select the text, then{" "}
                    <MenuPath steps={["Review", "Editor", "Set Proofing Language"]} />.
                  </li>
                </ul>
                <p className={pClass}>
                  For a quotation or section in another language, select just that text and set its language the same
                  way. The Language dialog on Windows also has a Detect language automatically option; it helps
                  spelling, but check what it chose, because it can guess wrong on short passages.
                </p>

                {/* 3 Headings */}
                <h3 className={h3Class}>3. Build the structure with heading styles</h3>
                <p className={pClass}>
                  Headings are the single most important structure in a long document. Screen reader users pull up a
                  list of headings to skim, and jump between them the way sighted readers scan bold titles. Word only
                  knows a paragraph is a heading if it uses a Heading style. Making text bigger and bold changes how
                  it looks but not what it is. This is <Wcag id="1.3.1" name="Info and Relationships" />, and{" "}
                  <Wcag id="2.4.6" name="Headings and Labels" /> asks that the headings describe what follows.
                </p>
                <ol className={olClass}>
                  <li>
                    Click in the heading text and choose Heading 1, Heading 2 or Heading 3 from the Styles gallery on
                    the Home tab. On Windows, <Kbd>Ctrl+Alt+1</Kbd> to <Kbd>Ctrl+Alt+3</Kbd> apply them from the
                    keyboard; on a Mac, use <Kbd>Cmd+Option+1</Kbd> to <Kbd>Cmd+Option+3</Kbd>.
                  </li>
                  <li>
                    Use the Title style, or one Heading 1, for the document&apos;s own title, then work down one level
                    at a time. A Heading 3 belongs under a Heading 2, never straight under a Heading 1.
                  </li>
                  <li>
                    To change how a heading looks, change the style, not the paragraph: right-click the style in the
                    gallery and choose Modify, or format one heading the way you want and choose Update Heading 1 to
                    Match Selection. Every heading of that level updates at once.
                  </li>
                  <li>
                    Check the outline in the Navigation Pane: on Windows, select{" "}
                    <MenuPath steps={["View", "Navigation Pane"]} /> or press <Kbd>Ctrl+F</Kbd>, then the Headings tab.
                    Microsoft notes the pane does not show headings inside tables, text boxes, headers or footers, so a
                    heading missing from the list is a sign it sits somewhere a screen reader may not treat as part of
                    the outline.
                  </li>
                </ol>
                <CodeBlock
                  label="Example heading outline"
                  code={`Good: one level at a time, every heading a style

Heading 1   Annual Report 2026
  Heading 2   Summary
  Heading 2   Our services
    Heading 3   Housing
    Heading 3   Waste and recycling
  Heading 2   Finances

Bad: bold Normal text and a skipped level

Normal, bold, 16 pt   Annual Report 2026   <- not a heading
Heading 3             Summary              <- skips 1 and 2
Normal, bold          Our services         <- not a heading`}
                />
                <p className={pClass}>
                  Keep headings short and specific. &ldquo;Section 2&rdquo; tells nobody anything; &ldquo;How to
                  apply&rdquo; does. Do not apply a Heading style to an empty paragraph to create space, because it is
                  announced as a blank heading. The{" "}
                  <Link href="/guides/cognitive-accessibility" className={linkClass}>
                    cognitive accessibility guide
                  </Link>{" "}
                  covers writing headings and sections people can scan.
                </p>

                {/* 4 Lists */}
                <h3 className={h3Class}>4. Use real lists</h3>
                <p className={pClass}>
                  A list made with <MenuPath steps={["Home", "Bullets"]} /> or{" "}
                  <MenuPath steps={["Home", "Numbering"]} /> is announced as a list with a number of items, so a
                  listener knows how much is coming and when it ends. Typing a hyphen, an asterisk or &ldquo;1.&rdquo;
                  at the start of each line produces ordinary paragraphs that only look like a list (
                  <Wcag id="1.3.1" name="Info and Relationships" />). Word often converts typed bullets automatically;
                  if it did not, select the paragraphs, delete the typed characters and apply Bullets or Numbering.
                </p>
                <p className={pClass}>
                  Microsoft also advises against dropping a plain, unbulleted paragraph into the middle of a list,
                  because screen readers may then miscount the items or announce that the list has ended. Use
                  Numbering for steps that must happen in order, and Bullets for everything else.
                </p>

                {/* 5 Alt text */}
                <h3 className={h3Class}>5. Add alt text, or mark images as decorative</h3>
                <p className={pClass}>
                  Every picture, chart, SmartArt graphic, shape, icon and embedded object that carries meaning needs
                  a text alternative (<Wcag id="1.1.1" name="Non-text Content" />). Anything that is only decoration
                  should be marked as decorative so screen readers skip it; when you export to PDF, Microsoft tags
                  decorative objects as artifacts, which screen readers ignore.
                </p>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>Windows, Microsoft 365:</strong> right-click the object and choose
                    View Alt Text, or select it and choose Alt Text on its format tab (for example Picture Format). In
                    Word 2019 to 2024 the command is Edit Alt Text.
                  </li>
                  <li>
                    <strong className={strongClass}>Mac:</strong> Control-click the object and choose View Alt Text,
                    or choose Alt Text on its Format tab.
                  </li>
                  <li>
                    <strong className={strongClass}>Decorative:</strong> in the Alt Text pane, tick Mark as decorative
                    (called Decorative in Word 2019 to 2024). The description box greys out.
                  </li>
                  <li>
                    <strong className={strongClass}>Charts and SmartArt:</strong> click the outer border of the whole
                    object before opening alt text, so the description applies to the graphic, not one shape inside
                    it.
                  </li>
                  <li>
                    <strong className={strongClass}>Groups:</strong> if several pictures form one idea, group them and
                    describe the group. If they are grouped only for positioning, ungroup them and describe each.
                  </li>
                </ul>
                <p className={pClass}>
                  Say what the image means in this document, in a sentence or two. Do not start with &ldquo;image
                  of&rdquo; or &ldquo;picture of&rdquo;, because the screen reader already says it is a graphic, and
                  do not repeat a caption or the sentence next to it. For a chart, give the main finding, and put the
                  numbers in the text or a table where everyone can use them. For examples covering every kind of
                  image, see{" "}
                  <Link href="/guides/how-to-write-alt-text" className={linkClass}>
                    how to write alt text
                  </Link>
                  .
                </p>
                <div tabIndex={0} role="region" aria-label="Examples of weak and better alt text for images in a Word document" className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                  <table className="w-full text-sm text-left">
                    <caption className="sr-only">Examples of weak and better alt text for images in a Word document</caption>
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Image</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Weak alt text</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Better</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                      {altExamples.map((row) => (
                        <tr key={row.image}>
                          <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                            {row.image}
                          </th>
                          <td className="px-4 py-3 align-top">&ldquo;{row.weak}&rdquo;</td>
                          <td className="px-4 py-3 align-top">{row.better}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={pClass}>
                  <strong className={strongClass}>Generated alt text needs a person.</strong> Recent Microsoft 365
                  builds write a description with AI when you ask for one in the Alt Text pane, and Copilot+ PCs can
                  do it automatically when you insert a picture. On Windows the setting is under{" "}
                  <MenuPath steps={["File", "Options", "Accessibility"]} /> (Enable the option to generate alt text
                  using AI). Older builds added captions ending &ldquo;Description automatically
                  generated&rdquo; when a picture was inserted. Either way, read and rewrite the text before you share
                  the file: a description of what is in a photo is not the same as what the photo is there to say.
                  Avoid pictures of text altogether where you can (<Wcag id="1.4.5" name="Images of Text" />); if a
                  scanned page or a screenshot of text is unavoidable, put the text itself in the document.
                </p>

                {/* 6 Tables */}
                <h3 className={h3Class}>6. Keep tables simple, with a real header row</h3>
                <p className={pClass}>
                  A screen reader reads a table cell by cell, announcing the column header as you move across, but
                  only if Word knows which row holds the headers (<Wcag id="1.3.1" name="Info and Relationships" />).
                  Use tables for data, not to position things on the page.
                </p>
                <ol className={olClass}>
                  <li>
                    Insert the table with <MenuPath steps={["Insert", "Table"]} /> and type the column headings in the
                    first row.
                  </li>
                  <li>
                    Click in the first row and select <MenuPath steps={["Table Layout", "Repeat Header Rows"]} /> (in
                    the Data group; the tab is called Layout in some versions). Or right-click the row, choose{" "}
                    <MenuPath steps={["Table Properties", "Row"]} /> and tick Repeat as header row at the top of each
                    page. The row must be the first row of the table.
                  </li>
                  <li>
                    Keep <MenuPath steps={["Table Design", "Header Row"]} /> ticked in the Table Style Options group
                    too. Microsoft&apos;s accessibility instructions use this option, but Word ticks it on every new
                    table and it mainly controls formatting. Repeat Header Rows is what marks the row as a header in
                    the file, which is why the free checker on this site looks for it. Setting both covers each way
                    the header is read.
                  </li>
                  <li>
                    Avoid merged and split cells, tables inside tables, and empty rows, columns or cells added for
                    spacing. Each one makes it harder to tell which row and column a cell belongs to. If a table needs
                    merged cells to make sense, split it into two simpler tables.
                  </li>
                  <li>
                    Introduce the table with a sentence or a caption (References &gt; Insert Caption) that says what
                    it shows, and avoid fixed-width tables that do not reflow on small screens.
                  </li>
                </ol>
                <p className={pClass}>
                  Repeated headers only show in Print Layout and when printing, and Word will not repeat them across
                  a manual page break inside the table. For a deeper look at table structure, see{" "}
                  <Link href="/guides/accessible-data-tables" className={linkClass}>
                    accessible data tables
                  </Link>
                  .
                </p>

                {/* 7 Links */}
                <h3 className={h3Class}>7. Write link text that makes sense on its own</h3>
                <p className={pClass}>
                  Screen reader users often list every link in a document and choose from that list, where
                  &ldquo;click here&rdquo; and &ldquo;read more&rdquo; say nothing, and a pasted address is read out
                  character by character. Link text should name the destination (
                  <Wcag id="2.4.4" name="Link Purpose (In Context)" />).
                </p>
                <ul className={listClass}>
                  <li>
                    Right-click the link and choose Edit Hyperlink (Edit Link in some versions), or select it and
                    press <Kbd>Ctrl+K</Kbd> (<Kbd>Cmd+K</Kbd> on a Mac). Change Text to display to words that describe
                    the destination.
                  </li>
                  <li>
                    Bad: &ldquo;For the fees, click here.&rdquo; Better: &ldquo;See the{" "}
                    <span className="underline">2026 planning fees</span>.&rdquo;
                  </li>
                  <li>
                    A ScreenTip (the button in the same dialog) shows on hover, but it is not a substitute for clear
                    link text.
                  </li>
                  <li>
                    If the document will be printed, keep the readable link text and add a short address in brackets
                    or a references list, rather than making the long address the link text.
                  </li>
                </ul>

                {/* 8 Colour */}
                <h3 className={h3Class}>8. Check colour and contrast</h3>
                <p className={pClass}>
                  Body text needs a contrast ratio of at least 4.5:1 against its background, and large text (18 pt,
                  or 14 pt bold) at least 3:1 (<Wcag id="1.4.3" name="Contrast (Minimum)" />). Colour must never be
                  the only way you show something, such as red for overdue items or a coloured row for the
                  recommended option (<Wcag id="1.4.1" name="Use of Color" />): add a word, a symbol or a pattern.
                  Lines and bars in charts need 3:1 against their background (
                  <Wcag id="1.4.11" name="Non-text Contrast" />).
                </p>
                <ul className={listClass}>
                  <li>
                    Use the Automatic font colour for body text where you can. Microsoft recommends it because it
                    adapts when someone uses a high contrast mode.
                  </li>
                  <li>
                    Pale grey text, coloured text on coloured table shading and text over pictures are the usual
                    failures. Test any colour pair with the{" "}
                    <Link href="/tools/contrast-checker" className={linkClass}>
                      contrast checker
                    </Link>
                    .
                  </li>
                  <li>
                    In Word for Windows, the Accessibility Assistant flags low-contrast text and offers a font colour
                    picker with a High-contrast only switch.
                  </li>
                  <li>
                    Underline links so they stand out without relying on colour.
                  </li>
                </ul>

                {/* 9 Fonts */}
                <h3 className={h3Class}>9. Choose readable fonts and spacing</h3>
                <p className={pClass}>
                  WCAG does not set a minimum font size for documents, but readable text is part of making a document
                  usable. Microsoft suggests familiar sans serif fonts such as Arial or Calibri, and advises against
                  all capitals and heavy use of italics or underlining.
                </p>
                <ul className={listClass}>
                  <li>
                    Use a comfortable body size (11 to 12 pt is common for print) and left-aligned text. WCAG&apos;s
                    Level AAA <Wcag id="1.4.8" name="Visual Presentation" /> criterion asks for text that is not
                    justified, because the uneven gaps between words make it harder to read, especially for many
                    people with dyslexia.
                  </li>
                  <li>
                    Add space with paragraph settings, not blank lines: set Spacing Before and After on the Layout tab,
                    and line spacing in the Paragraph dialog. Turn on{" "}
                    <MenuPath steps={["Home", "Show/Hide"]} /> to see empty paragraphs as pilcrow marks and delete
                    them.
                  </li>
                  <li>
                    Start a new page with <MenuPath steps={["Insert", "Page Break"]} /> (<Kbd>Ctrl+Enter</Kbd> on
                    Windows), not a run of empty lines that shifts whenever text changes.
                  </li>
                  <li>
                    Set your font choices in the Normal and Heading styles so the whole document stays consistent. The{" "}
                    <Link href="/guides/accessible-typography-wcag" className={linkClass}>
                      accessible typography guide
                    </Link>{" "}
                    goes further on size, line length and spacing.
                  </li>
                </ul>

                {/* 10 Floating */}
                <h3 className={h3Class}>10. Avoid text boxes and floating objects</h3>
                <p className={pClass}>
                  Text boxes, shapes with text and pictures set to float with text wrapping sit outside the normal
                  flow of the document. Screen readers may read them out of order or not at all, their headings do not
                  appear in the Navigation Pane, and they often lose their place or structure when the document is
                  saved as a PDF (<Wcag id="1.3.2" name="Meaningful Sequence" />).
                </p>
                <ul className={listClass}>
                  <li>
                    Move text out of text boxes into the main body and format it with a style. A pull quote or
                    callout can be a shaded paragraph instead of a text box; Microsoft suggests shaded paragraphs as an
                    alternative to tables for this kind of banner.
                  </li>
                  <li>
                    Set pictures and charts to sit in the text: on Windows, select the picture, open the Layout
                    Options button and choose In Line with Text, or use{" "}
                    <MenuPath steps={["Picture Format", "Wrap Text", "In Line with Text"]} />. On a Mac, use{" "}
                    <MenuPath steps={["Picture Format", "Arrange", "Wrap Text", "In Line with Text"]} />. Then place
                    the picture next to the paragraph it belongs with.
                  </li>
                  <li>
                    Keep important information out of headers and footers, which Microsoft lists among its best
                    practices: some screen readers do not read them as part of the main text.
                  </li>
                </ul>

                {/* 11 Properties */}
                <h3 className={h3Class}>11. Check the file before you share it</h3>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>Properties:</strong> confirm the Title in File &gt; Info (step 1),
                    and that the Author and other fields say what you want them to say.
                  </li>
                  <li>
                    <strong className={strongClass}>Restricted access:</strong> Microsoft&apos;s checker treats
                    restricted access (Information Rights Management) as an error, because it can stop screen readers
                    reading the file. Use permissions on the storage location rather than in the file where you can.
                  </li>
                  <li>
                    <strong className={strongClass}>Tracked changes and comments:</strong> accept or reject changes
                    and delete comments before you publish, so nobody hears the draft history.
                  </li>
                  <li>
                    <strong className={strongClass}>Format:</strong> save as .docx, the current format. Saving as the
                    old .doc format puts Word into Compatibility Mode, which turns off some newer features, and the
                    checker on this site cannot read .doc files.
                  </li>
                  <li>
                    <strong className={strongClass}>Forms:</strong> if the document uses content controls for people
                    to fill in, give each control a title in its Properties; Microsoft&apos;s checker flags controls
                    without one.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Templates */}
          <section id="templates" className="py-10 px-4 sm:px-6 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>Start From an Accessible Template</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  The cheapest accessible document is one built on a template that already does the right thing, so
                  authors get headings, lists and table styles by default instead of by memory.
                </p>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>Microsoft&apos;s templates:</strong> select{" "}
                    <MenuPath steps={["File", "New"]} /> and search the online templates for
                    &ldquo;accessible&rdquo;. Microsoft publishes a set designed with accessibility in mind. Still run
                    the checks in this guide on them, because your content can undo their good structure.
                  </li>
                  <li>
                    <strong className={strongClass}>Your own house template:</strong> set the Normal style&apos;s
                    font, size and spacing; style Heading 1 to 3 in your brand fonts; choose theme colours whose text
                    combinations pass 4.5:1; create a table style with a distinct header row; set the default language.
                    Then select <MenuPath steps={["File", "Save As"]} /> and choose Word Template (.dotx).
                  </li>
                  <li>
                    <strong className={strongClass}>Make the right thing easy:</strong> add a short instruction page
                    or placeholder text that tells authors to use the Styles gallery and the Alt Text pane, and remove
                    styles nobody should use.
                  </li>
                </ul>
                <p className={pClass}>
                  Keep the template under version control like any other shared asset. When you change it, check one
                  real document built from it with the free checker before rolling it out.
                </p>
              </div>
            </div>
          </section>

          {/* Checker */}
          <section id="checker" className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>Word&apos;s Check Accessibility, and What It Misses</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  Word has a built-in checker on every platform. Select{" "}
                  <MenuPath steps={["Review", "Check Accessibility"]} /> in Word for Windows, Mac or the web. If you do
                  not see the button on Windows, use{" "}
                  <MenuPath steps={["File", "Info", "Check for Issues", "Check Accessibility"]} />.
                </p>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>Windows:</strong> in current Word for Windows, Check Accessibility
                    opens the{" "}
                    <Ext href="https://support.microsoft.com/en-us/topic/improve-accessibility-in-your-documents-with-the-accessibility-assistant-f01562ca-0119-40ad-8dd6-f6223df50bef">
                      Accessibility Assistant
                    </Ext>
                    . It runs in the background, highlights an Accessibility indicator in the status bar when it finds
                    issues, and groups them under Color and Contrast, Media and Illustrations, Tables, Document
                    Structure and Document Access, with suggested fixes.
                  </li>
                  <li>
                    <strong className={strongClass}>Mac:</strong> the Accessibility pane lists Errors, Warnings and
                    Tips.
                  </li>
                  <li>
                    <strong className={strongClass}>Web:</strong> the pane adds an Intelligent Services group, which
                    suggests alt text for review, and a Recheck button.
                  </li>
                </ul>
                <p className={pClass}>
                  Run it on every document. But it is a structural check, and Microsoft&apos;s published{" "}
                  <Ext href="https://support.microsoft.com/en-us/accessibility/office-accessibility/rules-for-the-accessibility-checker">
                    rules for the Accessibility Checker
                  </Ext>{" "}
                  cover a short list of issues. For Word, the errors are missing alt text, tables without column
                  header information, restricted document access and content controls without titles; the warnings
                  are tables without a simple structure and low text contrast; the one tip is to use heading styles;
                  and an Intelligent Services rule suggests alt text for you to review. Microsoft updates the rules
                  over time, so your version may flag more, but several common problems are not on the list at
                  all.
                </p>
              </div>
              <div tabIndex={0} role="region" aria-label="Which Word accessibility issues Microsoft's published checker rules cover, which the free checker on this site covers, and what needs a manual check" className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Which Word accessibility issues Microsoft&apos;s published checker rules cover, which the free
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
                Neither checker can tell whether your alt text is right, whether the headings describe their
                sections, or whether the order makes sense when read aloud. That part needs a person, and the testing
                section below shows a quick way to do it.
              </p>
            </div>
          </section>

          {/* PDF */}
          <section id="pdf" className="py-10 px-4 sm:px-6 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>Export to an Accessible PDF</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className={pClass}>
                  Many Word documents end up as PDFs. Word turns headings, lists, tables, alt text and the title into
                  PDF tags only if you export with tags switched on; printing to PDF throws them away. Microsoft&apos;s{" "}
                  <Ext href="https://support.microsoft.com/en-us/office/create-accessible-pdfs-064625e0-56ea-4e16-ad71-3aa33bb4b7ed">
                    accessible PDF instructions
                  </Ext>{" "}
                  also recommend running the Accessibility Checker first.
                </p>
                <ul className={listClass}>
                  <li>
                    <strong className={strongClass}>Windows:</strong> select{" "}
                    <MenuPath steps={["File", "Save As"]} /> or Save a Copy, choose PDF (*.pdf) as the file type and
                    select More options, then Options. Make sure Document structure tags for accessibility is ticked.
                    Also tick Document properties, and Create bookmarks using Headings so the PDF gets bookmarks from
                    your headings. Select OK, then Save.
                  </li>
                  <li>
                    <strong className={strongClass}>Mac:</strong> select <MenuPath steps={["File", "Save As"]} />,
                    choose PDF as the File Format, and select Best for electronic distribution and accessibility (uses
                    Microsoft online service). Microsoft says this option is what makes the PDF tagged. It sends the
                    file to a Microsoft conversion service, which Microsoft says does not keep it; bear that in mind
                    for confidential files.
                  </li>
                  <li>
                    <strong className={strongClass}>Web:</strong> select{" "}
                    <MenuPath steps={["File", "Save As", "Download as PDF"]} />.
                  </li>
                </ul>
                <p className={pClass}>
                  Avoid any Print to PDF option, such as the Microsoft Print to PDF printer on Windows: it produces a
                  PDF with no tags at all. After exporting, open the PDF and check that headings appear as bookmarks,
                  the title shows in the window bar, and tables have header cells. Problems such as text boxes and
                  floating pictures that read in the wrong order are easier to fix in Word and export again than to
                  repair in the PDF.
                </p>
                <p className={pClass}>
                  To check the result, run it through the{" "}
                  <Link href="/tools/pdf-accessibility-checker" className={linkClass}>
                    PDF accessibility checker
                  </Link>
                  , and read the{" "}
                  <Link href="/guides/pdf-accessibility" className={linkClass}>
                    guide to accessible PDFs
                  </Link>{" "}
                  for tags, reading order and PDF/UA.
                </p>
              </div>
            </div>
          </section>

          {/* Mistakes */}
          <section id="mistakes" className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>Common Mistakes and How to Fix Them</h2>
              <div tabIndex={0} role="region" aria-label="Common Word accessibility mistakes, why they fail, and the fix" className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">Common Word accessibility mistakes, why they fail, and the fix</caption>
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
            </div>
          </section>

          {/* Checklist */}
          <section id="checklist" className="py-10 px-4 sm:px-6 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={`${h2Class} flex items-center gap-3`}>
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                Word Accessibility Checklist
              </h2>
              <p className={pClass}>
                Tick the boxes as you work, or print this page (<Kbd>Ctrl+P</Kbd> or <Kbd>Cmd+P</Kbd>) and use it on
                paper. Nothing you tick is saved or sent anywhere.
              </p>
              <div className="grid gap-6 md:grid-cols-2 text-muted-foreground leading-relaxed">
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 break-inside-avoid">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Set-up</h3>
                  <ul className="space-y-2">
                    <CheckItem>The file is a .docx, built on an accessible template.</CheckItem>
                    <CheckItem>Title set in File &gt; Info &gt; Properties, and it describes the document.</CheckItem>
                    <CheckItem>Document language set; passages in other languages marked.</CheckItem>
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 break-inside-avoid">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Structure</h3>
                  <ul className="space-y-2">
                    <CheckItem>Every heading uses a Heading style; none is just bold text.</CheckItem>
                    <CheckItem>Heading levels go down one step at a time, and the Navigation Pane shows a sensible outline.</CheckItem>
                    <CheckItem>Lists use Bullets or Numbering, not typed characters.</CheckItem>
                    <CheckItem>No empty paragraphs for spacing; page breaks used for new pages.</CheckItem>
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 break-inside-avoid">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Images and tables</h3>
                  <ul className="space-y-2">
                    <CheckItem>Every meaningful picture, chart and SmartArt graphic has alt text that says what it means.</CheckItem>
                    <CheckItem>Decorative images are marked as decorative.</CheckItem>
                    <CheckItem>Generated alt text has been reviewed and rewritten.</CheckItem>
                    <CheckItem>No pictures of text, or the text is also in the document.</CheckItem>
                    <CheckItem>Tables hold data only, with a header row set to repeat.</CheckItem>
                    <CheckItem>No merged cells, nested tables or blank cells for layout.</CheckItem>
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 break-inside-avoid">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Text, links and layout</h3>
                  <ul className="space-y-2">
                    <CheckItem>Link text names the destination; no &ldquo;click here&rdquo; or bare web addresses.</CheckItem>
                    <CheckItem>Text contrast is at least 4.5:1 (3:1 for large text).</CheckItem>
                    <CheckItem>Colour is never the only way information is shown.</CheckItem>
                    <CheckItem>Readable sans serif font, left-aligned, no long runs of capitals or italics.</CheckItem>
                    <CheckItem>No content in text boxes or floating objects; pictures in line with text.</CheckItem>
                    <CheckItem>Nothing important only in headers or footers.</CheckItem>
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-5 break-inside-avoid md:col-span-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Before you share</h3>
                  <ul className="space-y-2">
                    <CheckItem>Review &gt; Check Accessibility shows no errors, and its warnings have been reviewed.</CheckItem>
                    <CheckItem>The free Word and PowerPoint checker shows no errors.</CheckItem>
                    <CheckItem>Tracked changes resolved, comments removed, no restricted access.</CheckItem>
                    <CheckItem>Read through with a screen reader or Read Aloud, start to finish.</CheckItem>
                    <CheckItem>PDF exported with Document structure tags for accessibility, and the PDF checked.</CheckItem>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Test */}
          <section id="test" className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40 scroll-mt-24">
            <div className="container mx-auto max-w-4xl">
              <h2 className={h2Class}>Test the Document With the Free Checker</h2>
              <ToolCallout heading="Word and PowerPoint Accessibility Checker">
                Drop in a .docx file to see errors, warnings and tips for each check, located by page and paragraph,
                with the Microsoft 365 fix. Download the list as CSV or Excel to share it. Your file stays on your
                device.
              </ToolCallout>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ol className={olClass}>
                  <li>
                    <strong className={strongClass}>Save a .docx copy.</strong> The checker reads .docx files, the
                    format Word has used since 2007. If you have an old .doc file, use File &gt; Save As and choose
                    Word Document (.docx). Remove any password from a copy first, since encrypted files cannot be
                    read. For a Google Doc, choose File &gt; Download &gt; Microsoft Word (.docx).
                  </li>
                  <li>
                    <strong className={strongClass}>Open it in the checker.</strong> Drop the file on the{" "}
                    <Link href={TOOL} className={linkClass}>
                      Word and PowerPoint Accessibility Checker
                    </Link>
                    . It checks the title, language, headings and heading order, text that only looks like a heading,
                    alt text and its quality, table header rows, merged and nested tables, link text, typed lists,
                    blank paragraphs, text boxes and floating objects, and the contrast of text with a fixed colour.
                  </li>
                  <li>
                    <strong className={strongClass}>Fix errors first, then warnings.</strong> Errors are clear
                    failures such as a picture with no alt text. Warnings need a judgement, such as a skipped heading
                    level. Tips are good practice, such as removing blank paragraphs.
                  </li>
                  <li>
                    <strong className={strongClass}>Run Word&apos;s own checker too.</strong> It sees the document as
                    Word lays it out, including some contrast problems the free checker cannot measure, such as theme
                    colours.
                  </li>
                  <li>
                    <strong className={strongClass}>Listen to it.</strong> Open the Navigation Pane and read the
                    outline as if it were a contents page. Then use <MenuPath steps={["View", "Immersive Reader"]} />{" "}
                    and Read Aloud, or a screen reader such as Narrator, NVDA or VoiceOver, to hear the document in
                    order. Anything read in a strange place, or not at all, is a structure problem.
                  </li>
                  <li>
                    <strong className={strongClass}>Check the PDF.</strong> If you publish a PDF, export it with tags
                    and check that file as well.
                  </li>
                </ol>
                <p className={pClass}>
                  For hands-on screen reader testing, see the{" "}
                  <Link href="/guides/screen-reader-testing" className={linkClass}>
                    screen reader testing guide
                  </Link>{" "}
                  and the{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className={linkClass}>
                    NVDA guide
                  </Link>
                  . Presentations have their own pitfalls, covered in{" "}
                  <Link href="/guides/accessible-powerpoint-presentations" className={linkClass}>
                    how to make PowerPoint accessible
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
                  <Ext href="https://support.microsoft.com/en-us/office/make-your-word-documents-accessible-to-people-with-disabilities-d9bf3683-87ac-47ea-b91a-78dcacb3c66d">
                    Make your Word documents accessible to people with disabilities
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/office/improve-accessibility-with-the-accessibility-checker-a16f6de0-2f39-4a2b-8bd8-5ad801426c7f">
                    Improve accessibility with the Accessibility Checker
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/accessibility/office-accessibility/rules-for-the-accessibility-checker">
                    Rules for the Accessibility Checker
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/office/add-alternative-text-to-a-shape-picture-chart-smartart-graphic-or-other-object-44989b2a-903c-4d9a-b742-6a75b451c669">
                    Add alternative text to a shape, picture, chart, SmartArt graphic, or other object
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-US/Word/repeat-table-header-on-subsequent-pages">
                    Repeat table header on subsequent pages
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/office/check-spelling-and-grammar-in-a-different-language-667ba67a-a202-42fd-8596-edc1fa320e00">
                    Check spelling and grammar in a different language
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/office/view-or-change-the-properties-for-an-office-file-21d604c2-481e-4379-8e54-1dd4622c6b75">
                    View or change the properties for an Office file
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/word/use-the-navigation-pane-in-word">
                    Use the Navigation pane in Word
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/office/wrap-text-around-a-picture-in-word-bdbbe1fe-c089-4b5c-b85c-43997da64a12">
                    Wrap text around a picture in Word
                  </Ext>
                </li>
                <li>
                  <Ext href="https://support.microsoft.com/en-us/office/create-accessible-pdfs-064625e0-56ea-4e16-ad71-3aa33bb4b7ed">
                    Create accessible PDFs
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
                  Find the Problems Before Your Readers Do
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Check a Word document in your browser in seconds, fix what it finds in Microsoft 365, then export a
                  tagged PDF and check that too.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href={TOOL}>
                      Word and PowerPoint Checker
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/pdf-accessibility">Accessible PDF Guide</Link>
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
                content="word document accessibility office docx heading styles alt text decorative tables header row link text contrast language document title pdf export tagged pdf accessible pdf powerpoint en 301 549 section 508 wcag2ict screen reader"
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
