import type { Metadata } from "next"
import Link from "next/link"
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react"
import { BreadcrumbStructuredData, DatasetStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { PageByline } from "@/components/seo/page-byline"
import { KeyFacts } from "@/components/research/key-facts"
import { clampDescription } from "@/lib/metadata"
import { W3C_WCAG22_META } from "@/lib/data/w3c-wcag22.meta"
import {
  WCAG_ATTRIBUTION,
  WCAG_COLUMNS,
  WCAG_DATA_PAGE_PATH,
  WCAG_DOWNLOAD_FILES,
  buildWcagCsv,
  buildWcagDownload,
  buildWcagJson,
  cellText,
  type WcagDownloadFormat,
} from "@/lib/wcag-download"
import { buildWcagXlsx } from "@/lib/wcag-download-xlsx"
import { wcagPath } from "@/lib/wcag-pages"

const ROUTE = WCAG_DATA_PAGE_PATH
const SITE = "https://accessibility.build"

// Dates the page is pinned to. Restamp when the W3C snapshot is refreshed.
const REVIEWED_ON = "11 November 2026"
const REVIEWED_ISO = "2026-11-11"
const PUBLISHED_ISO = "2026-11-11"

const { counts } = buildWcagDownload()

const pageTitle = "WCAG 2.2 Data Download: CSV, Excel and JSON"
const pageDescription = `Download all ${counts.total} WCAG 2.2 success criteria as CSV, Excel or JSON: W3C's verbatim text, levels, guidelines and links, built from W3C's official wcag.json.`
const ogTitle = encodeURIComponent(pageTitle)

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "wcag 2.2 json",
    "wcag 2.2 csv",
    "wcag 2.2 success criteria list",
    "wcag success criteria download",
    "wcag 2.2 data",
    "wcag json",
    "wcag 2.2 spreadsheet",
    "wcag 2.2 excel",
    "wcag dataset",
  ],
  alternates: {
    canonical: ROUTE,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "website",
    images: [{ url: `/api/og?title=${ogTitle}&section=Resources`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [{ url: `/api/og?title=${ogTitle}&section=Resources`, width: 1200, height: 630 }],
  },
}

function formatSize(bytes: number): string {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function formatIsoDate(iso: string): string {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

const sources = [
  {
    label: `${W3C_WCAG22_META.specTitle}, ${W3C_WCAG22_META.specStatus}`,
    href: W3C_WCAG22_META.specDatedUrl,
  },
  {
    label: "WCAG 2.2 machine-readable data file (wcag.json), W3C Web Accessibility Initiative",
    href: W3C_WCAG22_META.sourceUrl,
  },
  {
    label: "README for the WCAG JSON files, including the terms for using the data, w3c/wcag repository on GitHub",
    href: W3C_WCAG22_META.readmeUrl,
  },
  {
    label: "Announcement: WCAG 2 available as JSON machine-readable files, public-wai-announce mailing list, 16 October 2025",
    href: "https://lists.w3.org/Archives/Public/public-wai-announce/2025OctDec/0000.html",
  },
  {
    label: "W3C Document License (2023)",
    href: W3C_WCAG22_META.licenceUrl,
  },
  {
    label: "Using WAI Material: Permission to Use WAI-Copyrighted Material, W3C Web Accessibility Initiative",
    href: W3C_WCAG22_META.usingWaiMaterialUrl,
  },
  {
    label: "W3C Intellectual Rights FAQ: May I annotate one of your specifications?",
    href: "https://www.w3.org/copyright/intellectual-rights/#annotate",
  },
  {
    label: "Dataset structured data documentation, Google Search Central",
    href: "https://developers.google.com/search/docs/appearance/structured-data/dataset",
  },
]

export default function WcagDataPage() {
  const { rows, excluded } = buildWcagDownload()

  const sizes: Record<WcagDownloadFormat, number> = {
    csv: Buffer.byteLength(buildWcagCsv(), "utf8"),
    xlsx: buildWcagXlsx().byteLength,
    json: Buffer.byteLength(buildWcagJson(), "utf8"),
  }

  const downloads: { format: WcagDownloadFormat; icon: typeof FileText; title: string; body: string }[] = [
    {
      format: "csv",
      icon: FileText,
      title: "CSV",
      body: "UTF-8 with a byte order mark, comma separated, RFC 4180 quoting, one header row. Multi-line criterion text is quoted, so use a real CSV parser rather than splitting on line breaks.",
    },
    {
      format: "xlsx",
      icon: FileSpreadsheet,
      title: "Excel (.xlsx)",
      body: "A \"WCAG 2.2\" sheet with the data, a filter on the header row and every cell stored as text, plus an \"About\" sheet with the W3C attribution, licence and column notes.",
    },
    {
      format: "json",
      icon: FileJson,
      title: "JSON",
      body: "A metadata object (source, retrieval date, licence, attribution, counts, column dictionary) followed by a criteria array. Served with open CORS, so scripts can fetch it directly.",
    },
  ]

  const previewRows = rows.slice(0, 3)
  const sample = rows.find((r) => r.ref === "1.4.3")
  const principles = Array.from(new Set(rows.map((r) => r.principle)))
  const newIn22 = rows.filter((r) => r.new_in_2_2)
  const excludedLabel = excluded.map((e) => `${e.ref} ${e.title}`).join(", ")

  const faqs = [
    {
      question: "How many success criteria are in WCAG 2.2?",
      answer: `${counts.total}. Level A has ${counts.byLevel.A}, Level AA has ${counts.byLevel.AA} and Level AAA has ${counts.byLevel.AAA}. Of those, ${counts.byIntroducedIn["2.0"]} date from WCAG 2.0, ${counts.byIntroducedIn["2.1"]} were added in WCAG 2.1 and ${counts.byIntroducedIn["2.2"]} were added in WCAG 2.2. A site that conforms at Level AA meets the ${counts.byLevel.A + counts.byLevel.AA} Level A and AA criteria. Every one of them is a row in the CSV, Excel and JSON files on this page.`,
    },
    {
      question: "Why is 4.1.1 Parsing not in the files?",
      answer:
        "Because it is not part of WCAG 2.2. W3C's own WCAG 2.2 JSON file still carries an entry for 4.1.1, titled \"Parsing (Obsolete and removed)\", with no conformance level and with versions 2.0 and 2.1 only. We build the 2.2 set by keeping the criteria whose versions include 2.2, which leaves 4.1.1 out. If you work to WCAG 2.1, where 4.1.1 still applies, take it from the WCAG 2.1 Recommendation or W3C's WCAG 2.1 JSON file.",
    },
    {
      question: "Can I use this data in my own tool, product or audit template?",
      answer:
        "Yes, on W3C's terms. The README for W3C's JSON files allows the data to be used in full or in part if you clearly attribute and link the WCAG source and do not change the content, and if anything you add is clearly marked as yours. That is how these files are built: the W3C columns are copied without change and carry the attribution, and our two added columns are named accessibility_build_url and accessibility_build_summary. Keep the attribution with any copy you make, and keep our summaries apart from the W3C text.",
    },
    {
      question: "Is the summary column the official WCAG wording?",
      answer:
        "No. accessibility_build_summary is a one-sentence plain-language paraphrase written by Accessibility.build for quick scanning. It is shorter than the real criterion and leaves out exceptions and notes, so it must not be quoted as the success criterion or used to decide conformance. The official wording is in the w3c_text column, copied without change from W3C.",
    },
    {
      question: "How is this different from the WCAG 2.2 Excel checklist?",
      answer:
        "The Excel checklist is an audit template: it has status, notes and progress-tracking columns and summary sheets for running an audit by hand. This page is the data itself: one clean row per criterion with W3C's full text, identifiers and links, for loading into a database, a test tool, a ticketing system or your own template. If you want to track an audit, use the checklist; if you want to build something, use these files.",
    },
    {
      question: "Will Excel change criterion numbers like 1.4.10?",
      answer:
        "Not in the .xlsx file, where every cell is stored as text. A CSV has no cell types, so when Excel opens one directly it may read a value such as 1.4.10 as a date or a number, depending on your regional settings. If that happens, use the .xlsx file, or import the CSV through Excel's data import and set the ref column to Text.",
    },
    {
      question: "Does the dataset include techniques, failures or the glossary?",
      answer:
        "No. These files flatten each success criterion into one row and stop there. W3C's wcag.json also holds the sufficient and advisory techniques, the failures and the glossary terms, nested under each criterion; if you need those, use W3C's file directly. Each row here links to the criterion's Understanding document and How to Meet entry, which list the techniques.",
    },
    {
      question: "How current is the data?",
      answer: `The files are built from a copy of W3C's wcag.json downloaded on ${formatIsoDate(W3C_WCAG22_META.retrievedOn)}; W3C last changed that file on ${formatIsoDate(W3C_WCAG22_META.sourceLastModified)}. The criterion text itself comes from the WCAG 2.2 Recommendation of 12 December 2024. The retrieval date is printed on this page and inside every file, so you can always tell which copy you have.`,
    },
  ]

  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: SITE },
          { name: "Resources", url: `${SITE}/resources` },
          { name: "WCAG 2.2 Data", url: `${SITE}${ROUTE}` },
        ]}
      />
      <DatasetStructuredData
        name="WCAG 2.2 Success Criteria (CSV, Excel and JSON)"
        description={`All ${counts.total} success criteria of WCAG 2.2 (${counts.byLevel.A} Level A, ${counts.byLevel.AA} Level AA, ${counts.byLevel.AAA} Level AAA) as one flat record each: number, title, level, principle, guideline, version introduced, W3C's verbatim criterion text and links to the Recommendation, Understanding and How to Meet documents, plus a separately labelled Accessibility.build summary. Built from W3C's machine-readable wcag.json.`}
        url={`${SITE}${ROUTE}`}
        datePublished={PUBLISHED_ISO}
        dateModified={W3C_WCAG22_META.retrievedOn}
        creator={[
          { name: "World Wide Web Consortium (W3C)", url: "https://www.w3.org/" },
          { name: "Accessibility.build", url: SITE },
        ]}
        license={W3C_WCAG22_META.licenceUrl}
        isBasedOn={W3C_WCAG22_META.specLatestUrl}
        citation={W3C_WCAG22_META.sourceUrl}
        version={`2.2 (${W3C_WCAG22_META.specStatus})`}
        variableMeasured={WCAG_COLUMNS.map((c) => c.key)}
        keywords={["WCAG 2.2", "success criteria", "web accessibility", "W3C", "accessibility standards"]}
        distribution={(Object.keys(WCAG_DOWNLOAD_FILES) as WcagDownloadFormat[]).map((format) => ({
          name: WCAG_DOWNLOAD_FILES[format].filename,
          encodingFormat: WCAG_DOWNLOAD_FILES[format].encodingFormat,
          contentUrl: `${SITE}${WCAG_DOWNLOAD_FILES[format].path}`,
        }))}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/resources" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Resources
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-900 dark:text-white" aria-current="page">
                WCAG 2.2 Data
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-4xl">
            <p className="text-blue-300 font-semibold text-sm tracking-wider uppercase mb-4">
              Resources &bull; Open data
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              WCAG 2.2 success criteria as data:{" "}
              <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">
                CSV, Excel and JSON
              </span>
            </h1>
            <PageByline route={ROUTE} variant="hero" tone="inverse" className="mt-0 mb-5" />
            <p className="text-lg md:text-xl text-slate-300 mb-6 max-w-2xl">
              All {counts.total} WCAG 2.2 success criteria, one row each, with W3C&apos;s exact
              wording, levels, guidelines, the version each one arrived in and links to the
              Recommendation, Understanding and How to Meet pages. Built from W3C&apos;s official
              machine-readable file and checked row by row against our own criteria data.
            </p>
            <p
              className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-blue-300/40 bg-blue-400/10 px-4 py-3 text-sm text-blue-100"
              aria-label="Data status"
            >
              <strong className="font-semibold text-white">
                Source: W3C wcag.json, retrieved{" "}
                <time dateTime={W3C_WCAG22_META.retrievedOn}>{formatIsoDate(W3C_WCAG22_META.retrievedOn)}</time>.
              </strong>
              <span>
                WCAG 2.2 is a {W3C_WCAG22_META.specStatus}. Page reviewed{" "}
                <time dateTime={REVIEWED_ISO}>{REVIEWED_ON}</time>.
              </span>
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
        <div className="max-w-4xl space-y-14">
          {/* Downloads */}
          <section aria-labelledby="downloads-heading">
            <h2 id="downloads-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Download the data
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              The three files hold the same {counts.total} rows and the same {WCAG_COLUMNS.length} columns.
              Free, no account needed.
            </p>
            <ul className="grid gap-4 md:grid-cols-3">
              {downloads.map(({ format, icon: Icon, title, body }) => {
                const file = WCAG_DOWNLOAD_FILES[format]
                return (
                  <li
                    key={format}
                    className="flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50"
                  >
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                      <Icon className="h-5 w-5 text-blue-700 dark:text-blue-300" aria-hidden="true" />
                      {title}
                    </h3>
                    <p className="mt-2 mb-4 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{body}</p>
                    <a
                      href={file.path}
                      download={file.filename}
                      type={file.encodingFormat}
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      Download {file.filename}
                      <span className="font-normal">
                        ({file.label}, {formatSize(sizes[format])})
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </section>

          <KeyFacts
            title="What is in the files"
            facts={[
              {
                value: String(counts.total),
                label: "WCAG 2.2 success criteria, one row each",
                source: "W3C wcag.json",
                sourceHref: W3C_WCAG22_META.sourceUrl,
                asOf: W3C_WCAG22_META.retrievedOn,
              },
              {
                value: `${counts.byLevel.A} / ${counts.byLevel.AA} / ${counts.byLevel.AAA}`,
                label: "Level A, AA and AAA criteria",
                source: "W3C wcag.json",
                sourceHref: W3C_WCAG22_META.sourceUrl,
                asOf: W3C_WCAG22_META.retrievedOn,
              },
              {
                value: String(counts.byIntroducedIn["2.2"]),
                label: `Criteria new in WCAG 2.2; ${counts.byIntroducedIn["2.1"]} arrived in 2.1 and ${counts.byIntroducedIn["2.0"]} date from 2.0`,
                source: "W3C wcag.json, versions field",
                sourceHref: W3C_WCAG22_META.sourceUrl,
                asOf: W3C_WCAG22_META.retrievedOn,
              },
            ]}
          />

          {/* Column dictionary */}
          <section aria-labelledby="columns-heading">
            <h2 id="columns-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Column dictionary
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Columns marked W3C are copied without change from W3C&apos;s file. URLs marked as built
              from the W3C id follow W3C&apos;s own URL patterns. The two Accessibility.build columns
              are ours and are not WCAG text. The examples are the row for{" "}
              {sample ? (
                <Link href={wcagPath(sample.ref)} className="text-blue-700 dark:text-blue-300 underline underline-offset-2">
                  {sample.ref} {sample.title}
                </Link>
              ) : null}
              .
            </p>
            <div
              tabIndex={0}
              role="region"
              aria-label="Columns in the WCAG 2.2 data files"
              className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <table className="w-full min-w-[720px] text-left text-sm">
                <caption className="sr-only">Columns in the WCAG 2.2 data files</caption>
                <thead className="bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Column</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Source</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Meaning</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {WCAG_COLUMNS.map((col) => (
                    <tr key={col.key} className="align-top">
                      <th scope="row" className="px-4 py-3 font-mono text-xs font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        {col.key}
                      </th>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">{col.source}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{col.description}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300 break-words max-w-[16rem]">
                        {col.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Preview */}
          <section aria-labelledby="preview-heading">
            <h2 id="preview-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Preview: the first {previewRows.length} rows
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              A selection of columns from the top of the file. The criterion text is shown exactly as
              it appears in the downloads, with listed conditions and notes on their own lines.
            </p>
            <div
              tabIndex={0}
              role="region"
              aria-label={`First ${previewRows.length} rows of the WCAG 2.2 data`}
              className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <table className="w-full min-w-[900px] text-left text-sm">
                <caption className="sr-only">First {previewRows.length} rows of the WCAG 2.2 data</caption>
                <thead className="bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-semibold">ref</th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-semibold">title</th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-semibold">level</th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-semibold">introduced_in</th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-semibold">w3c_text (W3C, verbatim)</th>
                    <th scope="col" className="px-4 py-3 font-mono text-xs font-semibold">
                      accessibility_build_summary (ours)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {previewRows.map((row) => (
                    <tr key={row.ref} className="align-top">
                      <th scope="row" className="px-4 py-3 font-semibold whitespace-nowrap">
                        <Link href={wcagPath(row.ref)} className="text-blue-700 dark:text-blue-300 underline underline-offset-2">
                          {row.ref}
                        </Link>
                      </th>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{cellText(row, "title")}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.level}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.introduced_in}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-pre-line">{row.w3c_text}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{row.accessibility_build_summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Attribution and licence */}
          <section aria-labelledby="licence-heading">
            <h2 id="licence-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Attribution and licence
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                The WCAG text belongs to W3C. It is published under the{" "}
                <a href={W3C_WCAG22_META.licenceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-300 underline underline-offset-2">
                  W3C Document License
                </a>
                , and the{" "}
                <a href={W3C_WCAG22_META.readmeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-300 underline underline-offset-2">
                  README for W3C&apos;s JSON files
                </a>{" "}
                sets the terms for this data specifically. Together they ask for three things:
              </p>
              <ol className="list-decimal space-y-2 pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Attribute and link.</strong> Name the WCAG
                  source and link to it. The Document License also asks every copy to carry W3C&apos;s
                  copyright notice and the document&apos;s status.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Do not change the content.</strong> W3C
                  text is reused word for word. The Document License grants no right to modify it.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Keep additions separate.</strong> Anything
                  you add must be clearly distinguishable from what came from the WCAG documents.
                </li>
              </ol>
              <p>
                These files follow all three. Every W3C column is copied without change, and every row
                links to the criterion in the Recommendation. The full attribution travels inside the
                JSON file (in its metadata) and the Excel file (on its About sheet). A CSV has no place
                for a notice without breaking parsers, so if you pass the CSV on, put this text
                alongside it:
              </p>
              <pre
                className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                {WCAG_ATTRIBUTION}
              </pre>
              <p>
                <strong className="text-slate-900 dark:text-white">Our columns are ours.</strong>{" "}
                accessibility_build_summary and accessibility_build_url are written by Accessibility.build.
                The summaries are short paraphrases for scanning a list; they are not WCAG text, they are
                not covered by the W3C licence and they are not endorsed by W3C. Never present a summary
                as the success criterion.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                W3C&apos;s names and trademarks may not be used in advertising without W3C&apos;s
                permission. This section is our reading of W3C&apos;s published terms, not legal advice;
                the{" "}
                <a href={W3C_WCAG22_META.usingWaiMaterialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-300 underline underline-offset-2">
                  Using WAI Material
                </a>{" "}
                page is W3C&apos;s own guide.
              </p>
            </div>
          </section>

          {/* Differences from W3C */}
          <section aria-labelledby="differences-heading">
            <h2 id="differences-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              How this differs from W3C&apos;s wcag.json
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              W3C has published WCAG 2 as machine-readable JSON since October 2025. It is the
              authoritative source and these files are built from it. The differences are all about
              shape, not wording:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-300 leading-relaxed">
              <li>
                <strong className="text-slate-900 dark:text-white">Filtered to WCAG 2.2.</strong> W3C&apos;s 2.2
                file still lists {excludedLabel}, which belongs to WCAG 2.0 and 2.1 only. We keep the{" "}
                {counts.total} criteria whose versions include 2.2.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Flattened.</strong> W3C nests criteria
                inside guidelines inside principles and stores the text as HTML with glossary links. Here
                each criterion is one row, with its principle and guideline repeated on the row and its
                text as plain text.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">CSV and Excel as well as JSON.</strong> W3C
                offers JSON only. Spreadsheets need no code to open.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Links added.</strong> Each row carries the
                Recommendation, Understanding and How to Meet URLs, built from W3C&apos;s identifier,
                and a link to our guide for the criterion.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Less detail.</strong> Techniques,
                failures and glossary terms are left out. Use W3C&apos;s file if you need them.
              </li>
            </ul>
          </section>

          {/* Update policy */}
          <section aria-labelledby="updates-heading">
            <h2 id="updates-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              How the files are kept up to date
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>
                The files are generated when the site is built, from a dated copy of W3C&apos;s
                wcag.json kept in our repository. The current copy was downloaded on{" "}
                <time dateTime={W3C_WCAG22_META.retrievedOn}>{formatIsoDate(W3C_WCAG22_META.retrievedOn)}</time>
                ; W3C last changed the file on{" "}
                <time dateTime={W3C_WCAG22_META.sourceLastModified.slice(0, 10)}>
                  {formatIsoDate(W3C_WCAG22_META.sourceLastModified)}
                </time>
                . W3C&apos;s README says the JSON files are published monthly.
              </p>
              <p>
                Each build checks every row against our own WCAG 2.2 criteria list: the set of criteria,
                titles, levels, guidelines, the version introduced and the level counts must all agree,
                and 4.1.1 must be absent. If anything disagrees the build stops, so a file that reaches
                this page has passed those checks. When W3C changes its file, we download it again,
                rerun the checks and republish, and the date above changes with it.
              </p>
            </div>
          </section>

          {/* Browse criteria */}
          <section aria-labelledby="browse-heading">
            <h2 id="browse-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Browse the {counts.total} criteria
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Every row in the files has a guide page on this site. The {newIn22.length} criteria new in
              WCAG 2.2 are marked.
            </p>
            <div className="grid gap-8 md:grid-cols-2">
              {principles.map((principle) => (
                <div key={principle}>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    Principle {principle}
                  </h3>
                  <ul className="space-y-1.5 text-sm">
                    {rows
                      .filter((r) => r.principle === principle)
                      .map((r) => (
                        <li key={r.ref}>
                          <Link href={wcagPath(r.ref)} className="text-blue-700 dark:text-blue-300 underline underline-offset-2">
                            {r.ref} {r.title}
                          </Link>{" "}
                          <span className="text-slate-600 dark:text-slate-400">
                            (Level {r.level}
                            {r.new_in_2_2 ? ", new in 2.2" : ""})
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Related checklists */}
          <section aria-labelledby="checklists-heading">
            <h2 id="checklists-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Looking for a checklist instead?
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-300 leading-relaxed">
              <li>
                <Link href="/checklists/wcag-2-2/excel" className="text-blue-700 dark:text-blue-300 underline underline-offset-2">
                  WCAG 2.2 Excel checklist
                </Link>
                : an audit template with status, notes and progress columns.
              </li>
              <li>
                <Link href="/checklists/wcag-2-2" className="text-blue-700 dark:text-blue-300 underline underline-offset-2">
                  WCAG 2.2 checklist
                </Link>
                : every criterion explained, grouped by principle and level.
              </li>
              <li>
                <Link href="/checklists/interactive" className="text-blue-700 dark:text-blue-300 underline underline-offset-2">
                  Interactive WCAG checklist
                </Link>
                : tick criteria off in the browser and track progress.
              </li>
              <li>
                <Link href="/wcag" className="text-blue-700 dark:text-blue-300 underline underline-offset-2">
                  WCAG 2.2 guide
                </Link>
                : plain-language pages for every success criterion.
              </li>
              <li>
                <Link href="/templates/wcag-audit-workbook" className="text-blue-700 dark:text-blue-300 underline underline-offset-2">
                  WCAG Audit Workbook
                </Link>
                : a paid Excel and Google Sheets template with test steps, a results grid, an issue log and draft ACR remarks.
              </li>
            </ul>
          </section>

          {/* FAQ */}
          <FaqSection faqs={faqs} title="Frequently Asked Questions" as="h2" className="scroll-mt-24" />

          {/* Sources */}
          <section aria-labelledby="sources-heading">
            <h2 id="sources-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Sources
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The data and the licence terms were read from the documents below on{" "}
              <time dateTime={REVIEWED_ISO}>{REVIEWED_ON}</time>.
            </p>
            <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-decimal pl-5">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="WCAG 2.2 success criteria checklist excel download data JSON CSV levels A AA AAA guidelines"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
