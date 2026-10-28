import type { Metadata } from "next"
import Link from "next/link"
import WordPowerPointAccessibilityChecker from "@/components/tools/word-powerpoint-accessibility-checker"
import { BreadcrumbStructuredData, HowToStructuredData, ToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"

const ROUTE = "/tools/word-powerpoint-accessibility-checker"
const pageTitle = "Free Word and PowerPoint Accessibility Checker"
const pageDescription =
  "Check a Word or PowerPoint file for missing alt text, headings, slide titles, table headers, link text and language, with Microsoft 365 fixes. Never uploaded."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "word accessibility checker",
    "powerpoint accessibility checker",
    "docx accessibility checker",
    "pptx accessibility checker",
    "accessibility checker online",
    "check word document accessibility",
    "accessible powerpoint",
    "accessible word document",
    "alt text checker word",
    "slide title accessibility",
    "WCAG document accessibility",
    "microsoft office accessibility checker not working",
  ],
  alternates: { canonical: ROUTE },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "website",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Word and PowerPoint Accessibility Checker")}&section=Free tool`,
        width: 1200,
        height: 630,
        alt: "Word and PowerPoint accessibility checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: clampDescription(pageDescription),
    images: [`/api/og?title=${encodeURIComponent("Word and PowerPoint Accessibility Checker")}&section=Free tool`],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Word and PowerPoint Accessibility Checker", url: `https://accessibility.build${ROUTE}` },
]

const FAQS = [
  {
    question: "Is my document uploaded anywhere?",
    answer:
      "No. A .docx or .pptx file is a zip of XML files, and your browser can open it on its own. The page reads the file on your device, unzips only the parts that hold the text and structure (not the pictures or media), runs the checks and shows the results. Nothing about the file is sent to Accessibility.build or anyone else, so it is safe for confidential documents.",
  },
  {
    question: "Why can it not open my .doc or .ppt file?",
    answer:
      "Files ending .doc and .ppt use the binary formats Office used before 2007, which a browser cannot read without a large converter. Open the file in Word or PowerPoint, select File > Save As, choose Word Document (.docx) or PowerPoint Presentation (.pptx), and check the new copy. Password-protected files are encrypted, so remove the password from a copy first.",
  },
  {
    question: "How is this different from the Accessibility Checker in Word and PowerPoint?",
    answer:
      "Microsoft's checker, under Review > Check Accessibility, runs inside the app and is worth using on every file. This tool works on a file without opening Office, gives you a list you can download as CSV or Excel and share, and looks for a few patterns that are easy to miss, such as typed bullets, text formatted to look like a heading, skipped heading levels and text with a fixed low-contrast colour. Use both.",
  },
  {
    question: "Does a clean result mean the document meets WCAG?",
    answer:
      "No. Automated checks find structural problems such as missing alt text or a table with no header row. They cannot tell whether alt text is accurate, whether headings describe their sections, whether colour carries meaning on its own or whether a video's captions are correct. Treat a clean result as a good start, then read the file with a screen reader or have it reviewed.",
  },
  {
    question: "Can I check a Google Docs or Google Slides file?",
    answer:
      "Yes, once it is downloaded. In Google Docs select File > Download > Microsoft Word (.docx); in Google Slides select File > Download > Microsoft PowerPoint (.pptx). The results describe what Google writes into the file, so a heading made with Google's Heading styles is reported as a heading, and alt text added in Google carries over.",
  },
  {
    question: "Will my fixes carry over when I save as a PDF?",
    answer:
      "Mostly, if you export with tags. In Word or PowerPoint on Windows, choose PDF as the file type, select Options and make sure Document structure tags for accessibility is ticked. On a Mac, choose Best for electronic distribution and accessibility. Headings, alt text and table headers then become tags in the PDF, and the title is copied into its properties. Check the PDF itself too, because some things, such as text boxes, do not always export cleanly.",
  },
]

const CHECKS: [string, string, string, { id: string; label: string }[]][] = [
  ["Title", "Title in the file's properties, and not a default such as Document1", "The same", [{ id: "2.4.2", label: "2.4.2" }]],
  ["Language", "The document's default language", "Language on the text of every slide", [{ id: "3.1.1", label: "3.1.1" }]],
  [
    "Headings and titles",
    "Heading styles used, levels not skipped, text that only looks like a heading",
    "Every slide has a title, and titles are different",
    [
      { id: "1.3.1", label: "1.3.1" },
      { id: "2.4.2", label: "2.4.2" },
      { id: "2.4.6", label: "2.4.6" },
    ],
  ],
  ["Alt text", "Pictures, charts, SmartArt and groups have alt text or are marked decorative; generated descriptions and file names flagged", "The same, plus video and audio", [{ id: "1.1.1", label: "1.1.1" }]],
  ["Tables", "Header row marked to repeat, merged cells, tables inside tables", "Header Row ticked, merged cells", [{ id: "1.3.1", label: "1.3.1" }]],
  ["Links", "Text that is a web address, \"click here\" or empty", "The same, plus linked pictures without alt text", [{ id: "2.4.4", label: "2.4.4" }]],
  ["Reading order", "Text boxes and pictures that float over the text", "The title is read first; slides crowded with default-named shapes", [{ id: "1.3.2", label: "1.3.2" }]],
  ["Lists and spacing", "Typed bullets and numbers, runs of blank paragraphs", "Not checked", [{ id: "1.3.1", label: "1.3.1" }]],
  ["Colour contrast", "Text with a fixed colour against white, the page colour or its shading", "Not checked", [{ id: "1.4.3", label: "1.4.3" }]],
  [
    "Audio and video",
    "Not checked",
    "A reminder to check captions and transcripts for each clip",
    [
      { id: "1.2.1", label: "1.2.1" },
      { id: "1.2.2", label: "1.2.2" },
    ],
  ],
]

const linkClass = "font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300"

export default function WordPowerPointAccessibilityCheckerPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ToolStructuredData
        name="Word and PowerPoint Accessibility Checker"
        description={pageDescription}
        url={`https://accessibility.build${ROUTE}`}
        applicationCategory="BusinessApplication"
        operatingSystem="Any"
      />
      <HowToStructuredData
        name="How to check a Word document or PowerPoint presentation for accessibility"
        description="Open the file in the checker, read the findings for each check, and fix them in Microsoft 365."
        steps={[
          { name: "Choose the file", text: "Drop a .docx or .pptx file on the page, or select Choose a Word or PowerPoint file. It is read in your browser and never uploaded." },
          { name: "Read the summary", text: "The summary counts errors, warnings and tips, and shows how many checks passed." },
          { name: "Work through the checks", text: "Each check lists where the problem is, by page and paragraph or by slide and shape, and how to fix it in Word or PowerPoint." },
          { name: "Download and re-check", text: "Download the results as CSV or Excel to share or track, fix the file, then check it again alongside Review > Check Accessibility in Office." },
        ]}
      />

      <div className="bg-white pb-20 dark:bg-slate-950">
        <header className="border-b border-slate-200 bg-slate-50 pt-12 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container-wide py-10 lg:py-14">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/tools" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Tools
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 dark:text-white">Word and PowerPoint Accessibility Checker</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Free tool &middot; Runs in your browser
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Check Word and PowerPoint files for accessibility, without uploading them
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              Choose a .docx or .pptx file and get a list of the problems that stop screen reader users, and
              anyone else, from using it: missing alt text, headings and slide titles, table header rows, vague
              link text, a missing document language and more. Each finding says where it is and how to fix it in
              Microsoft 365. The checks run in your browser, so the file stays on your device.
            </p>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-6xl py-12">
            <WordPowerPointAccessibilityChecker />

            <section aria-labelledby="checks-heading" className="mt-14">
              <h2 id="checks-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What it checks
              </h2>
              <p className="mt-4 max-w-[68ch] leading-7 text-slate-700 dark:text-slate-300">
                Each check is tied to the WCAG success criterion it helps you meet. WCAG was written for web
                pages, but the W3C&apos;s guidance on applying it to documents (WCAG2ICT) treats a Word or
                PowerPoint file as a page, and so do procurement rules such as EN 301 549 and Section 508.
              </p>
              <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full border-collapse text-sm">
                  <caption className="sr-only">The checks run on Word documents and PowerPoint presentations, and the WCAG criteria they relate to</caption>
                  <thead>
                    <tr>
                      {["Check", "Word", "PowerPoint", "WCAG"].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {CHECKS.map(([name, word, ppt, criteria]) => (
                      <tr key={name} className="align-top">
                        <th scope="row" className="border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">
                          {name}
                        </th>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{word}</td>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{ppt}</td>
                        <td className="whitespace-nowrap border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                          {criteria.map((c, i) => (
                            <span key={c.id}>
                              {i > 0 && ", "}
                              <Link href={`/wcag/${c.id.replace(/\./g, "-")}`} className={linkClass}>
                                {c.label}
                              </Link>
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 max-w-[68ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
                Errors are clear failures, such as a picture with no alt text. Warnings are likely problems that
                need a person to decide, such as a skipped heading level. Tips are good practice, such as removing
                blank paragraphs used for spacing. Our guides on{" "}
                <Link href="/guides/accessible-word-documents" className={linkClass}>
                  how to make a Word document accessible
                </Link>{" "}
                and{" "}
                <Link href="/guides/accessible-powerpoint-presentations" className={linkClass}>
                  how to make PowerPoint presentations accessible
                </Link>{" "}
                walk through each fix step by step.
              </p>
            </section>

            <section aria-labelledby="private-heading" className="mt-14 max-w-[68ch]">
              <h2 id="private-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Why the file never leaves your device
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  Since Office 2007, a .docx or .pptx file has been a zip archive of XML files: one for the text,
                  one for the styles, one per slide, and the pictures alongside. A few lines of code in the page
                  can unzip it and read the XML, so the checker does everything on your device. It opens the
                  archive, reads only the parts that describe text and structure, and never looks at the pictures
                  or media themselves.
                </p>
                <p>
                  Nothing is uploaded, and the page sends nothing about the file anywhere. That matters for the
                  documents people most need to check: contracts, board papers, HR policies and course materials
                  that should not be pasted into an online service.
                </p>
              </div>
            </section>

            <section aria-labelledby="limits-heading" className="mt-12 max-w-[68ch]">
              <h2 id="limits-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What it cannot tell you
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-700 dark:text-slate-300">
                <li>Whether alt text is accurate or useful. It finds missing alt text, file names and unedited automatic descriptions; only a person can judge the rest.</li>
                <li>
                  Most colour contrast. It measures text given a fixed colour in Word. Theme colours, colours from
                  table styles, text in shapes and everything in PowerPoint need the{" "}
                  <Link href="/tools/contrast-checker" className={linkClass}>
                    contrast checker
                  </Link>{" "}
                  or Office&apos;s own checker.
                </li>
                <li>Whether the reading order makes sense beyond the slide title coming first, or whether headings describe their sections.</li>
                <li>Whether a video has captions, or whether the language set on the text is the language it is written in.</li>
                <li>Text inside charts, SmartArt and pictures, and footnotes and comments. In headers and footers it checks pictures only.</li>
                <li>
                  PDFs exported from the file. Export with tags and check the result with the{" "}
                  <Link href="/tools/pdf-accessibility-checker" className={linkClass}>
                    PDF accessibility checker
                  </Link>
                  ; the{" "}
                  <Link href="/guides/pdf-accessibility" className={linkClass}>
                    PDF accessibility guide
                  </Link>{" "}
                  explains what to look for.
                </li>
              </ul>
              <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">
                Word and PowerPoint include their own checker under <strong className="font-semibold">Review &gt; Check Accessibility</strong>,
                and it is worth running on every file. It sees the document the way Office lays it out; this tool
                gives you a list to download and share and looks for a few patterns, such as typed bullets and text
                formatted to look like a heading, that are easy to miss. Neither replaces reading the file with a
                screen reader.
              </p>
            </section>

            <div className="mt-14 max-w-[68ch]">
              <FaqSection faqs={FAQS} />
            </div>

            <div className="mt-14">
              <RelatedContent
                content="document accessibility Word PowerPoint alt text headings tables PDF WCAG office screen reader"
                title="Related reading"
                maxItems={4}
                showDescriptions
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
