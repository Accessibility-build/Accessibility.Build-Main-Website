import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { PageByline } from "@/components/seo/page-byline"
import { getRouteDate } from "@/lib/site-routes"
import { clampDescription } from "@/lib/metadata"
import { company } from "@/lib/company"
import v3Data from "@/lib/data/en-301-549-checklist.json"
import v4Data from "@/lib/data/en-301-549-v4-checklist.json"

const pageTitle = "EN 301 549 v4.1.1 Explained Clause by Clause"
const pageDescription =
  "What changed from v3.2.1 to v4.1.1: six WCAG 2.2 criteria, the user-preferences rework, total conversation and RTT, Annex ZB and the A.2 conformance tables, a migration list, and the legal status until the Official Journal citation."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "EN 301 549 v4",
    "EN 301 549 v4.1.1",
    "EN 301 549 WCAG 2.2",
    "EN 301 549 2026",
    "EN 301 549 changes",
    "EN 301 549 total conversation",
    "EN 301 549 Annex ZB",
    "EN 301 549 EAA harmonised standard",
    "EN 301 549 real-time text",
    "EN 301 549 v3.2.1 vs v4.1.1",
  ],
  alternates: {
    canonical: "/compliance/en-301-549-v4",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/compliance/en-301-549-v4",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Compliance`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [`/api/og?title=${encodeURIComponent(pageTitle)}&section=Compliance`],
  },
}

// Every number on this page is derived from the two datasets at build time,
// so the guide cannot drift from the checklist.
const v3Rows = v3Data.rows
const v4Rows = v4Data.rows
const v3Requirements = v3Rows.filter((r) => r.kind === "requirement").length
const v4Requirements = v4Data.counts.requirements
const v3Ch9Wcag = v3Rows.filter((r) => r.chapter === "9" && r.wcag).length
const v4Ch9Wcag = v4Rows.filter((r) => r.chapter === "9" && r.wcag).length
const v3Void = v3Rows.filter((r) => r.kind === "void").length
const v4Void = v4Data.counts.void
const v3Statements = v3Rows.filter((r) => r.kind === "statement").length
const v4Criteria = v4Rows.filter((r) => r.chapter === "4" && r.kind === "requirement").length
const v4Advisory = v4Data.counts.advisory
const { new: v4New, changed: v4Changed, removedFromV3: v4Removed } = v4Data.counts
const tables = v4Data.eaaTables as Record<string, { label: string; clauses: string[] }>
const clause6Rows = v4Rows.filter((r) => r.chapter === "6" && r.kind === "requirement").length
const clause6New = v4Rows.filter((r) => r.chapter === "6" && r.changeType === "new").length
const clause8_3 = v4Rows.filter((r) => r.clause.startsWith("8.3.") && r.kind === "requirement").length
const closedVariantsRemoved = v4Data.removedFromV3.filter((r) => r.chapter === "11" && /closed functionality/i.test(r.title)).length
const clause62 = v4Rows.filter((r) => r.clause.startsWith("6.2.") && r.kind === "requirement").length

const newCriteria = [
  { sc: "2.4.11", name: "Focus Not Obscured (Minimum)", level: "AA", page: "/wcag/2-4-11", web: "9.2.4.11", doc: "10.2.4.11", sw: "11.2.4.11", note: "Clauses 10 and 11 apply it only where the document or software accepts keyboard input." },
  { sc: "2.5.7", name: "Dragging Movements", level: "AA", page: "/wcag/2-5-7", web: "9.2.5.7", doc: "10.2.5.7", sw: "11.2.5.7", note: "Adapted in Tables 10.12 and 11.12: dragging determined by the user agent or platform and not modified by the author is exempt." },
  { sc: "2.5.8", name: "Target Size (Minimum)", level: "AA", page: "/wcag/2-5-8", web: "9.2.5.8", doc: "10.2.5.8", sw: "11.2.5.8", note: "24 by 24 CSS pixels with the spacing, equivalent, inline, user-agent and essential exceptions carried over." },
  { sc: "3.2.6", name: "Consistent Help", level: "A", page: "/wcag/3-2-6", web: "9.3.2.6", doc: "10.3.2.6", sw: "11.3.2.6 (void)", note: "Applies to a document within a set of documents; void for software, which has no concept of a set of pages." },
  { sc: "3.3.7", name: "Redundant Entry", level: "A", page: "/wcag/3-3-7", web: "9.3.3.7", doc: "10.3.3.7", sw: "11.3.3.7", note: "Referenced directly from WCAG 2.2 in all three clauses." },
  { sc: "3.3.8", name: "Accessible Authentication (Minimum)", level: "AA", page: "/wcag/3-3-8", web: "9.3.3.8", doc: "10.3.3.8", sw: "11.3.3.8", note: "Adapted in Tables 10.20 and 11.16 with the alternative, mechanism, object recognition and personal content exceptions." },
]

const migration = [
  {
    title: "Re-baseline web, document and software testing on WCAG 2.2 AA.",
    body: "Add the six criteria above to your test plan, drop 4.1.1 Parsing from your findings, and keep the rest: every WCAG 2.1 A and AA criterion is still required in v4.1.1. If your audit tooling already runs WCAG 2.2, most of this step is renaming the column header.",
  },
  {
    title: "Add the three user-preference checks.",
    body: "Clause 9.7 (web), 10.7 (documents) and 11.7 (software) are new or rewritten. For web, look for CSS that overrides forced colours, text size or cursor settings; for documents, viewers' reflow and colour modes; for software, whether the app honours the platform's contrast, text size, pointer and cursor settings.",
  },
  {
    title: "Re-map chapter 11 clause numbers.",
    body: "Every open-functionality variant (11.x.x.x.1) is now the clause itself (11.x.x.x), and the closed-functionality variants (11.x.x.x.2) are gone; closed functionality is assessed under clause 5.1 instead, which gained 5.1.8 for input purpose. Authoring-tool requirements moved from 11.8 to 5.10 and now also cover web-based tools.",
  },
  {
    title: "Treat the functional performance criteria as requirements.",
    body: `Chapter 4 moved from 12 descriptive statements to ${v4Criteria} criteria written with "shall", each with an Annex C test and a new criterion 4.2.11 Privacy. Annex C accepts either evidence that the outcome is achieved or a pass on every requirement Annex B maps to the criterion, so a complete clause 5 to 13 assessment usually satisfies them, but your report should now state that.`,
  },
  {
    title: "Rescope anything with voice, video or chat.",
    body: `Clause 6 is now ${clause6Rows} requirements, ${clause6New} of them new. If your product offers real-time voice, it must offer real-time text with no "unless it would require redesign" exception, and if it offers video too it must offer total conversation. Contact centres, telehealth, conferencing, in-app support calls and messaging apps with calling are all in scope.`,
  },
  {
    title: "Re-measure self-service terminals and kiosks against the new clause 8.3.",
    body: `The reach, height and free-space rules were rewritten as two sets (${clause8_3} requirements): Set 1 where nothing in the design prevents the preferred dimensions, Set 2 where functional or design restrictions apply. Old findings against 8.3.2 to 8.3.5 of v3.2.1 do not carry over; display screens must now sit no lower than 800 mm, and three hardware clauses (8.6 connections, 8.7 colour, 8.8 contrast) moved out of 8.1.`,
  },
  {
    title: "Rename captions to subtitles in reports.",
    body: "Clauses 7, 9, 10 and 11 now say subtitles where v3.2.1 said captions; the underlying WCAG criteria (1.2.2 and 1.2.4) are unchanged. Clause 7 also gains 7.1.5 spoken subtitles and rewrites 7.3 so subtitles, audio description and spoken subtitles can each be toggled with one action at the same level as the volume control.",
  },
  {
    title: "Restate documentation and support duties under clause 12.",
    body: "The old 12.1 (product documentation) and 12.2 (support services) became 12.1 to 12.5: information about products, information about services (which now includes support services), accessibility and compatibility features in the documentation, and two electronic programme guide clauses for media services.",
  },
  {
    title: "Pick the right conformance table for the EAA.",
    body: "Clause A.2 has five tables: A.1 web pages, A.2 non-web documents, A.3 non-web software with a user interface, A.4 hardware, A.5 all ICT. Assess every table whose condition applies to the product, in order; the standard itself says the Annex ZB tables are impractical for assessing a specific product and points you to A.2.",
  },
  {
    title: "Update your statement and ACR template, but not the citation yet.",
    body: "Keep citing v3.2.1 for Web Accessibility Directive statements until the Official Journal lists v4.1.1, and say which edition you tested against in any EAA conformity documentation. Prepare the v4.1.1 wording now; the only thing you cannot do before citation day is claim a presumption of conformity through it.",
  },
]

const faqs = [
  {
    question: "Is EN 301 549 V4.1.1 in force?",
    answer:
      "It is published but not yet cited. ETSI, CEN and CENELEC adopted V4.1.1 on 24 August 2026 and published it on 2 September 2026. Legal effect under EU law comes only from citation in the Official Journal of the European Union: until the Commission publishes a decision citing V4.1.1, V3.2.1 remains the edition cited for the Web Accessibility Directive, and no edition of EN 301 549 is cited under the European Accessibility Act at all. The citation is expected between late November and mid-December 2026; ETSI's own date of 30 November 2026 is the deadline for national standards bodies to announce the standard, not an Official Journal date.",
  },
  {
    question: "Does EN 301 549 V4.1.1 require WCAG 2.2 AA?",
    answer: `Yes for web content, and the equivalent for documents and software. Clause 9 requires every WCAG 2.2 Level A and AA success criterion (${v4Ch9Wcag} of them) plus the five WCAG 2.2 conformance requirements at Level AA in clause 9.6, and clause 9.5 lists the Level AAA criteria as informative only. Clauses 10 and 11 apply the same criteria to non-web documents and non-web software, adapted where web wording does not fit, following the W3C's WCAG2ICT guidance.`,
  },
  {
    question: "Which WCAG 2.2 criteria did V4.1.1 add, and which did it remove?",
    answer:
      "It added 2.4.11 Focus Not Obscured (Minimum), 2.5.7 Dragging Movements, 2.5.8 Target Size (Minimum), 3.2.6 Consistent Help, 3.3.7 Redundant Entry and 3.3.8 Accessible Authentication (Minimum). It removed 4.1.1 Parsing, which WCAG 2.2 deleted; clauses 9.4.1.1, 10.4.1.1 and 11.4.1.1 are now void. Every other WCAG 2.1 A and AA criterion carries over unchanged.",
  },
  {
    question: "What is total conversation and why does the EAA care?",
    answer:
      "Total conversation is real-time voice, real-time text and video in one communication session, each meeting the quality rules of clause 6 and able to interoperate. V4.1.1 clause 6.7 requires it from any ICT that provides real-time voice and includes video, and clause 6.2 requires real-time text from any ICT that provides real-time voice. The European Accessibility Act requires that emergency communications to 112 be answered by the most appropriate public safety answering point using synchronised voice and text, including real-time text, and synchronised video where video is provided; member states must apply that from 28 June 2027 at the latest. Clause 6's emergency scenarios (6.0.6 to 6.0.9) and the reference to ETSI EN 303 919 are how the standard connects to that date.",
  },
  {
    question: "What is Annex ZB?",
    answer:
      "Annex ZB is the informative annex that maps the essential requirements of the European Accessibility Act (Directive (EU) 2019/882) to the clauses of EN 301 549, in five tables: ZB.1 information on products, ZB.2 user interface and functionality of products plus support services, ZB.3 information about specific products, ZB.4 accessibility of services, and ZB.5 functionality of specific services. It is what makes V4.1.1 a candidate harmonised standard for the Act. Annex ZA does the same job for the Web Accessibility Directive (replacing the old Annex A), and Annex ZC covers the other directives that the Act's Annex I Section VI points at. For assessing one product, use the tables in clause A.2 instead; Annex ZB itself says so.",
  },
  {
    question: "Do I need to redo an audit done against V3.2.1?",
    answer:
      "Not from scratch. A V3.2.1 audit that tested WCAG 2.1 AA is still valid for every criterion it covered; add the six WCAG 2.2 criteria, the user-preference clauses 9.7, 10.7 and 11.7, and the renumbered chapter 11 references. Products with voice or video communication, self-service terminals and hardware need a fuller re-assessment because clauses 6 and 8.3 were rewritten. The interactive checklist's v4.1.1 edition flags every new or changed row so the delta can be worked through on its own.",
  },
  {
    question: "What happens on the day V4.1.1 is cited in the Official Journal?",
    answer:
      "Conformance with the clauses in Tables A.1 to A.5 will confer a presumption of conformity with the corresponding essential requirements of the European Accessibility Act, within the scope of the standard, for as long as the reference stays in the published list. If the same decision also cites V4.1.1 for the Web Accessibility Directive, public-sector statements should move to it, usually with a transition period stated in the decision. Until the decision is published, nothing changes legally; this page and the checklist will be updated on that day.",
  },
]

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Compliance", url: "https://accessibility.build/compliance" },
  { name: "EN 301 549", url: "https://accessibility.build/compliance/en-301-549" },
  { name: "V4.1.1 clause by clause", url: "https://accessibility.build/compliance/en-301-549-v4" },
]

const toc = [
  ["status", "Where V4.1.1 stands"],
  ["numbers", "V3.2.1 and V4.1.1 by the numbers"],
  ["wcag-22", "The six WCAG 2.2 criteria now required"],
  ["user-preferences", "The user-preferences rework"],
  ["clause-6", "Clause 6: total conversation and real-time text"],
  ["annex-zb", "Annex ZB and the conformance tables"],
  ["documents", "What changed for documents"],
  ["software", "What changed for software"],
  ["elsewhere", "Everything else that moved"],
  ["migration", "Migration list for teams on V3.2.1"],
  ["legal-trap", "The legal-status trap"],
  ["faq", "Frequently asked questions"],
]

export default function EN301549V4Page() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ArticleStructuredData
        headline={pageTitle}
        description={pageDescription}
        author={{ name: company.legalOperator, url: company.founderWebsite }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-10-19"
        dateModified={getRouteDate("/compliance/en-301-549-v4") ?? "2026-10-19"}
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/compliance/en-301-549-v4"
        wordCount={5000}
        keywords={["EN 301 549 v4.1.1", "WCAG 2.2", "European Accessibility Act", "total conversation", "Annex ZB"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <Link href="/compliance" className="hover:text-blue-600 transition-colors">Compliance</Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <Link href="/compliance/en-301-549" className="hover:text-blue-600 transition-colors">EN 301 549</Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">V4.1.1 clause by clause</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-200 text-xs font-semibold uppercase tracking-wide mb-5">
              <span aria-hidden="true">●</span>
              Standard deep dive
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              EN 301 549 V4.1.1, clause by clause: what changed and what it means
            </h1>
            <PageByline route="/compliance/en-301-549-v4" className="mb-5" />
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              The 2026 edition of Europe&apos;s ICT accessibility standard moves clauses 9, 10 and 11 to WCAG
              2.2, rebuilds clause 6 around total conversation and real-time text, turns the functional
              performance statements into requirements, and adds the Annex ZB mapping and clause A.2
              tables that make it the European Accessibility Act&apos;s harmonised standard once it is
              cited. This guide walks the changes clause by clause, with every number taken from the
              published ETSI PDF rather than from secondary summaries.
            </p>
          </header>

          <div
            className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5 mb-10"
            role="note"
          >
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Not legal advice.</strong> This is an educational reading of EN 301 549 V4.1.1 and the
              EU law around it, verified against the published standard on 19 October 2026. Which edition
              applies to you, and from when, depends on the law, the member state and your product. Consult a
              qualified lawyer for compliance decisions.
            </p>
          </div>

          <nav aria-labelledby="toc-heading" className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5">
            <h2 id="toc-heading" className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-3">
              On this page
            </h2>
            <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm list-decimal pl-5">
              {toc.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-blue-700 dark:text-blue-300 hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* 1. Status */}
          <section id="status" className="mb-12 scroll-mt-24" aria-labelledby="status-heading">
            <h2 id="status-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Where V4.1.1 stands
            </h2>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-6">
              <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                <strong>Status on 19 October 2026:</strong> published, not cited. V3.2.1 is the only edition in the
                Official Journal, and only under the Web Accessibility Directive (Commission Implementing Decision
                (EU) 2018/2048, as amended by Decision (EU) 2021/1339). No edition of EN 301 549 is cited under the
                European Accessibility Act, so there is no EAA presumption of conformity through any version until
                V4.1.1 is cited. Expected citation window: late November to mid-December 2026.
              </p>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                V4.1.1 was prepared under the European Commission&apos;s standardisation request C(2022) 6456 (M/587)
                to provide one voluntary means of conforming to the essential requirements of Directive (EU) 2019/882,
                the European Accessibility Act. V3.2.1, by contrast, was prepared under request C(2017) 2585 for
                Directive (EU) 2016/2102, the Web Accessibility Directive. That difference in mandate is why v4 has an
                EAA annex and v3 does not, and why the citation that matters for private-sector sellers is still ahead.
              </p>
              <p>The ETSI cover sheet gives the dates that frame the next two years:</p>
              <ul>
                <li><strong>24 August 2026:</strong> date of adoption by ETSI, CEN and CENELEC, after the national vote on the V4.1.0 final draft (25 June to 24 August 2026).</li>
                <li><strong>2 September 2026:</strong> publication of V4.1.1 (2026-09).</li>
                <li><strong>30 November 2026:</strong> latest date for national standards bodies to announce the EN. This is the date behind Deque&apos;s &ldquo;30 November&rdquo; citation estimate; it is an ETSI milestone, not an Official Journal date.</li>
                <li><strong>31 May 2027:</strong> latest date for national publication or endorsement.</li>
                <li><strong>31 May 2028:</strong> withdrawal of any conflicting national standard.</li>
              </ul>
              <p>
                The foreword lists the significant changes since V3.2.1 in one paragraph: the real-time text
                requirements in clause 6.2 &ldquo;significantly revised and extended to include total conversation&rdquo;;
                clauses 9, 10 and 11 updated to WCAG 2.2; a new Annex ZA for the Web Accessibility Directive
                (replacing the old Annex A); a new Annex ZB for the European Accessibility Act; and a new clause A.2
                for evaluating a specific product or service against the Act. The rest of this page is what those five
                lines look like at clause level, plus the changes the foreword does not mention.
              </p>
            </div>
          </section>

          {/* 2. Numbers */}
          <section id="numbers" className="mb-12 scroll-mt-24" aria-labelledby="numbers-heading">
            <h2 id="numbers-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              V3.2.1 and V4.1.1 by the numbers
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <caption className="sr-only">Comparison of the V3.2.1 and V4.1.1 datasets behind the interactive checklist</caption>
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-3 font-semibold">Measure</th>
                    <th scope="col" className="text-left p-3 font-semibold">V3.2.1 (2021-03)</th>
                    <th scope="col" className="text-left p-3 font-semibold">V4.1.1 (2026-09)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {[
                    ["Testable requirements (clauses 4 to 13)", String(v3Requirements), String(v4Requirements)],
                    ["Of which recommendations (\"should\")", String(v3Rows.filter((r) => r.advisory).length), String(v4Advisory)],
                    ["WCAG-mapped rows in clause 9", `${v3Ch9Wcag} (WCAG 2.1 A and AA)`, `${v4Ch9Wcag} (WCAG 2.2 A and AA)`],
                    ["Void slots kept for WCAG alignment", String(v3Void), String(v4Void)],
                    ["Chapter 4", `${v3Statements} functional performance statements (descriptive)`, `${v4Criteria} functional performance criteria (\"shall\", each with an Annex C test)`],
                    ["Clause 6 requirements", String(v3Rows.filter((r) => r.chapter === "6" && r.kind === "requirement").length), String(clause6Rows)],
                    ["EAA conformance tables", "none", "Tables A.1 to A.5 (clause A.2) plus Annex ZB"],
                    ["Rows new in V4.1.1", "", String(v4New)],
                    ["Rows changed from V3.2.1 (number or title)", "", String(v4Changed)],
                    ["V3.2.1 clauses with no V4.1.1 row", "", String(v4Removed)],
                  ].map(([k, a, b]) => (
                    <tr key={k} className="border-t border-slate-200 dark:border-slate-800">
                      <th scope="row" className="text-left p-3 font-medium text-slate-900 dark:text-white align-top">{k}</th>
                      <td className="p-3 align-top">{a}</td>
                      <td className="p-3 align-top">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
              Counts come from the two datasets behind the{" "}
              <Link href="/checklists/en-301-549?version=v4" className="text-blue-600 dark:text-blue-400 hover:underline">
                interactive checklist
              </Link>
              , generated from the ETSI PDFs by a committed script and reconciled against Annex C and the clause A.2
              tables. &ldquo;Changed&rdquo; means the clause number or title differs from V3.2.1, or the clause moved; it
              deliberately ignores the editorial rewrite that turned every precondition into &ldquo;Where ICT is, or
              includes, ...&rdquo;, which touched almost every row without changing what is tested.
            </p>
          </section>

          {/* 3. WCAG 2.2 */}
          <section id="wcag-22" className="mb-12 scroll-mt-24" aria-labelledby="wcag-heading">
            <h2 id="wcag-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              The six WCAG 2.2 criteria now required
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none mb-6">
              <p>
                Clause 9.1 to 9.4 is now a one-to-one list of the WCAG 2.2 Level A and AA success criteria, each
                clause saying that the web page &ldquo;shall satisfy WCAG 2.2 Success Criterion&rdquo; so-and-so. Clause 9.6
                requires the five WCAG 2.2 conformance requirements at Level AA (conformance level, full pages, complete
                processes, only accessibility-supported ways of using technologies, non-interference), and clause 9.5
                lists the 31 Level AAA criteria as informative. Six criteria are new against V3.2.1, and one slot is
                newly void: 9.4.1.1 Parsing, with a note explaining that WCAG 2.2 removed the criterion because the
                problems it prevented &ldquo;either no longer exist or are addressed by other criteria&rdquo;.
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <caption className="sr-only">WCAG 2.2 success criteria added in EN 301 549 V4.1.1 and their clause numbers</caption>
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-3 font-semibold">Criterion</th>
                    <th scope="col" className="text-left p-3 font-semibold">Level</th>
                    <th scope="col" className="text-left p-3 font-semibold">Web</th>
                    <th scope="col" className="text-left p-3 font-semibold">Documents</th>
                    <th scope="col" className="text-left p-3 font-semibold">Software</th>
                    <th scope="col" className="text-left p-3 font-semibold">How V4.1.1 applies it</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {newCriteria.map((c) => (
                    <tr key={c.sc} className="border-t border-slate-200 dark:border-slate-800">
                      <th scope="row" className="text-left p-3 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap">
                        <Link href={c.page} className="text-blue-700 dark:text-blue-300 hover:underline">{c.sc} {c.name}</Link>
                      </th>
                      <td className="p-3 align-top">{c.level}</td>
                      <td className="p-3 align-top font-mono text-xs">{c.web}</td>
                      <td className="p-3 align-top font-mono text-xs">{c.doc}</td>
                      <td className="p-3 align-top font-mono text-xs">{c.sw}</td>
                      <td className="p-3 align-top">{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none mt-6">
              <p>
                Two subtleties are easy to miss. First, clauses 10 and 11 reference WCAG 2.2 directly for most
                criteria but restate 38 of them in tables (Table 10.1 to 10.20 and 11.1 to 11.16) where web wording does
                not fit; the table versions are where the exceptions for documents and software live, and each table&apos;s
                note names the WCAG criterion it is identical to. Second, the document and software equivalents of
                Consistent Help differ: 10.3.2.6 applies to a non-web document &ldquo;within a set of non-web
                documents&rdquo;, while 11.3.2.6 is void because software has no equivalent of a set of pages. The same
                logic voids 11.3.1.2 Language of parts and 11.3.2.3 Consistent navigation for software, as it did in
                V3.2.1.
              </p>
              <p>
                Three slots that were void in V3.2.1 are now requirements: 10.3.2.3 Consistent navigation and 10.3.2.4
                Consistent identification apply to a document within a set of documents, and 11.2.4.2 (software titled)
                now requires a title describing each window or screen on platforms that support one. If your document
                remediation process assumed those three slots were empty, it needs a line each.
              </p>
            </div>
          </section>

          {/* 4. User preferences */}
          <section id="user-preferences" className="mb-12 scroll-mt-24" aria-labelledby="prefs-heading">
            <h2 id="prefs-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              The user-preferences rework
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                V3.2.1 had one user-preferences clause, 11.7, which asked software to follow a fixed list of platform
                settings: measurement units, colour, contrast, font type, font size and focus cursor. V4.1.1 replaces
                that list with a concept, &ldquo;documented platform accessibility features&rdquo;, and extends the duty from
                software to web pages and documents through three parallel clauses:
              </p>
              <ul>
                <li>
                  <strong>9.7 User preferences for web pages</strong> (new): a web page must not block the browser&apos;s modes
                  of operation that present the page according to user preference settings, and must not explicitly
                  override user preferences for documented platform accessibility features, unless that is essential to
                  the page. The note names the CSS <code>forced-color-adjust</code> property as the kind of override the
                  clause limits to essential cases.
                </li>
                <li>
                  <strong>10.7 User preferences for non-web documents</strong> (new): the same duty for documents, aimed at
                  files that lock out the viewer&apos;s reflow, colour or text-size modes.
                </li>
                <li>
                  <strong>11.7 User preferences</strong> (rewritten): software that is not designed to be isolated from its
                  platform must follow the values of the user&apos;s preference settings for documented platform
                  accessibility features unless not doing so is essential to the software&apos;s function. The notes list
                  colour filters, contrast, text size, pointer size and text cursor as the kinds of feature meant, and
                  say that a user agent (browser or document viewer) meets the clause by offering at least one mode that
                  enforces the user&apos;s settings when rendering content.
                </li>
              </ul>
              <p>
                The chain closes through two older clauses: 11.6.1 requires platform software to give users control over
                its documented accessibility features and 11.6.2 forbids software from disrupting them, while 12.3
                requires product documentation to say what the accessibility features are and how to use them. In
                other words, the features a platform documents under 12.3 are the features that 9.7, 10.7 and 11.7 oblige
                content and apps to respect. For a web team the practical test is simple: with Windows high contrast,
                a larger system text size and a custom cursor switched on, does the page still honour them?
              </p>
            </div>
          </section>

          {/* 5. Clause 6 */}
          <section id="clause-6" className="mb-12 scroll-mt-24" aria-labelledby="c6-heading">
            <h2 id="c6-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Clause 6: total conversation and real-time text
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                V3.2.1&apos;s clause 6 was titled &ldquo;ICT with two-way voice communication&rdquo; and held{" "}
                {v3Rows.filter((r) => r.chapter === "6" && r.kind === "requirement").length} requirements. V4.1.1&apos;s is
                &ldquo;ICT supporting real-time bidirectional communication&rdquo; with {clause6Rows}, {clause6New} of them
                new. The standard now describes a communication system end to end: clients, systems, interconnection,
                roaming, and emergency communications, each with a set of requirements that must hold in every scenario.
              </p>
              <h3>6.0 Operational scenarios</h3>
              <p>
                Eight new self-scoping clauses, 6.0.2 to 6.0.9, define the situations in which the rest of clause 6
                must be met: a communication client, a communication system with its own clients, a system connecting
                to another system, a system serving a roaming visiting client, and the same four again for emergency
                communications with public safety answering points (PSAPs), including a client that is abroad and
                contacts the visited country&apos;s PSAP over an IP-based system that does not use roaming at call-control
                level. Annex C turns each scenario into test preconditions, so a product is tested in the configurations
                it will actually be used in.
              </p>
              <h3>6.1 Voice</h3>
              <p>
                6.1.1 (new) requires ICT that connects to other ICT for voice to document how its voice interoperates,
                covering at least 100 Hz to 7 000 Hz, either by mutual agreement or by implementing ITU-T G.722. 6.1.2
                keeps the 250 Hz to 7 000 Hz capture and presentation range from the old 6.1. 6.1.3 (attached listening
                devices down to 100 Hz) and 6.1.4 (subtitles for voice calls within 2 seconds) are recommendations.
              </p>
              <h3>6.2 Real-time text</h3>
              <p>
                This is the rewrite the foreword flags. The headline change is in 6.2.1.1: where V3.2.1 excused ICT from
                providing RTT when that would require redesign, V4.1.1 simply requires that ICT providing real-time
                voice &ldquo;shall provide functionality that allows real-time bidirectional RTT communication&rdquo;, with notes
                that this implicitly covers interoperation and multi-party use. Clause 6.2 holds {clause62} requirements in all:
              </p>
              <ul>
                <li><strong>6.2.1.2 Concurrent voice and RTT</strong> and <strong>6.2.1.3 Single user action</strong> (new): one action must act on all media when a session is started, answered, modified or ended.</li>
                <li><strong>6.2.2.1 to 6.2.2.5 Display of RTT:</strong> sources distinguished (a label such as Speaker 1 is enough), all active communicators indicated, a real-time indicator of non-local audio, text presented as blocks in relative time order (block ends at sentence punctuation plus space, a line separator, or 5 seconds of silence), and the ability to review the whole conversation during and, if recorded, after the session.</li>
                <li><strong>6.2.3 DTMF during RTT:</strong> touch-tone digits must be sendable by a method distinct from typing them as text.</li>
                <li><strong>6.2.4 Responsiveness:</strong> the 500 ms transmission limit from the smallest reliably composed unit of text is kept, with a note that 300 ms or less feels better.</li>
                <li><strong>6.2.5 to 6.2.9 (new):</strong> erasing text from the current end without being blocked by earlier line breaks, 90 characters per second from 3 simultaneous sources in multi-party calls, a character set covering Latin-1, the regional scripts, platform emoji and U+FFFD, RTT input through every general text-input method, and RTT media that can be requested, answered or added mid-call regardless of settings.</li>
                <li><strong>6.2.10 RTT interoperability:</strong> the old 6.2.3, now a documentation requirement with ITU-T T.140 plus IETF RFC 4103 (updated by RFC 9071) as the fallback that always satisfies it.</li>
              </ul>
              <h3>6.3 to 6.7 Caller ID, alternatives, video, total conversation</h3>
              <p>
                6.3 (caller identification in text and programmatically determinable) and 6.4 (voicemail, auto-attendant
                and IVR usable without hearing or speech) survive with rewritten preconditions. 6.5 keeps the video floor
                of QVGA, 20 frames per second and 100 ms audio-video synchronisation, and widens 6.5.6 from identifying who
                is signing to indicating all active participants. 6.6 (alternatives to video-based services) is now
                labelled a recommendation. 6.7 is new: <strong>6.7.1 Total conversation provision</strong> requires any ICT that
                provides real-time voice and includes video to also provide RTT conforming to 6.2, so that voice, video
                and text are available together, and <strong>6.7.2</strong> requires documented video interoperability (ITU-T
                H.264 constrained baseline level 3 as the fallback, H.265 or VP8 where codecs are negotiated).
              </p>
              <h3>Why 28 June 2027 is in this clause</h3>
              <p>
                The European Accessibility Act requires, in Article 4(8) and Annex I Section V, that emergency
                communications to the single European emergency number 112 be answered by the most appropriate PSAP
                using synchronised voice and text, including real-time text, and synchronised video where video is
                provided. Article 31(3) lets member states apply that requirement as late as 28 June 2027. The
                emergency scenarios in 6.0.6 to 6.0.9, the note in 6.2.10 that emergency communications are &ldquo;an
                important case&rdquo; of required interoperation, and the pointer in 13.3 to ETSI EN 303 919 (the detailed
                emergency-communications standard) are V4.1.1 giving the Act a testable definition of what an
                accessible 112 call is. For vendors of PSAP software, telecoms equipment and emergency apps, clause 6 is
                the part of the standard with a hard date attached.
              </p>
            </div>
          </section>

          {/* 6. Annex ZB and tables */}
          <section id="annex-zb" className="mb-12 scroll-mt-24" aria-labelledby="zb-heading">
            <h2 id="zb-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Annex ZB and the conformance tables
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p>
                A harmonised standard needs a formal map from the law&apos;s essential requirements to its own clauses.
                V3.2.1 had one such map, Annex A, for the Web Accessibility Directive. V4.1.1 has three Z annexes plus a
                working annex:
              </p>
              <ul>
                <li><strong>Annex ZA</strong> replaces the old Annex A: Table ZA.1 for web pages and documents and Table ZA.2 for mobile applications under Directive (EU) 2016/2102, drawing on clauses 9, 10 and 11 and parts of 5, 6, 7 and 12.</li>
                <li><strong>Annex ZB</strong> maps Directive (EU) 2019/882: ZB.1 provision of information on products, ZB.2 user interface and functionality of products plus support services, ZB.3 information about specific products, ZB.4 accessibility of services (the general service requirements of the Act&apos;s Annex I Section III), and ZB.5 functionality of specific services. Each row quotes the essential requirement and names the clauses that cover it.</li>
                <li><strong>Annex ZC</strong> covers the other directives that the Act&apos;s Annex I Section VI refers to, by pointing back at the ZB tables.</li>
                <li><strong>Clause A.2</strong> is the working route. Its clause A.2.0 says, in a paragraph headed &ldquo;Important&rdquo;, that each of A.2.1 to A.2.5 is to be considered in order, that every requirement in a table whose condition applies must be assessed, and that Table A.5 applies to all ICT. The note in ZB.0 adds that a product can fall into several rows of several ZB tables, which &ldquo;makes the tables in Annex ZB impractical for use in assessing whether a specific ICT product or service meets all the applicable requirements&rdquo;, and sends assessors to A.2.</li>
              </ul>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 mt-6">
              <table className="w-full text-sm">
                <caption className="sr-only">The five conformance tables in clause A.2 of EN 301 549 V4.1.1 and the number of clauses in each</caption>
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-3 font-semibold">Table</th>
                    <th scope="col" className="text-left p-3 font-semibold">Condition</th>
                    <th scope="col" className="text-left p-3 font-semibold">Clauses</th>
                    <th scope="col" className="text-left p-3 font-semibold">What it contains</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {[
                    ["A.1", `${v4Ch9Wcag} WCAG 2.2 A and AA criteria plus 9.6 and 9.7.`],
                    ["A.2", "Clause 10 criteria plus 10.7; the recommendations 10.5 and 10.6 are not listed."],
                    ["A.3", "Clause 11 criteria, the accessibility-services clauses 11.5.2.1 and 11.5.2.4 to 11.5.2.17, 11.6 and 11.7."],
                    ["A.4", "Clause 8 plus 5.5 (tactilely discernible operable parts)."],
                    ["A.5", "Clauses 4.2, 5 (including 5.10 authoring tools), 6, 7, 12 and 13.1, every one self-scoped by its own precondition."],
                  ].map(([id, what]) => (
                    <tr key={id} className="border-t border-slate-200 dark:border-slate-800">
                      <th scope="row" className="text-left p-3 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap">Table {id}</th>
                      <td className="p-3 align-top">{tables[id].label}</td>
                      <td className="p-3 align-top">{tables[id].clauses.length}</td>
                      <td className="p-3 align-top">{what}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none mt-6">
              <p>
                Together the five tables list every testable requirement of the standard except the six
                recommendations; our build script asserts that equality against the extracted clause list. One erratum
                is worth knowing before you copy Table A.4 into a report: the published PDF misnumbers four
                stationary-ICT rows, printing 8.3.10.1 and 8.3.10.2 for the free-space clauses that the body numbers
                8.3.11.1 and 8.3.11.2, and 8.3.11.2 and 8.3.11.3 for the obstructed side reach clauses 8.3.10.2 and
                8.3.10.3. The row titles and the Annex C references make the intent clear; follow the clause numbers in
                the body of the standard.
              </p>
              <p>
                The foreword and A.2.0 state the legal effect in one sentence: once the standard is cited in the
                Official Journal under the Act, conformance with the normative clauses in Tables A.1 to A.5 confers,
                within the scope of the standard, a presumption of conformity with the corresponding essential
                requirements, and that presumption &ldquo;stays valid only as long as a reference to the present document is
                maintained in the list published in the Official Journal&rdquo;. Note the word &ldquo;corresponding&rdquo;: the
                Act also has requirements the standard does not cover, such as the service-provider information duties
                in Annex V, which no clause of EN 301 549 discharges for you.
              </p>
            </div>
          </section>

          {/* 7. Documents */}
          <section id="documents" className="mb-12 scroll-mt-24" aria-labelledby="docs-heading">
            <h2 id="docs-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              What changed for documents (clause 10)
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul>
                <li><strong>WCAG 2.2:</strong> the six new criteria at 10.2.4.11, 10.2.5.7, 10.2.5.8, 10.3.2.6, 10.3.3.7 and 10.3.3.8, and 10.4.1.1 Parsing void. Focus Not Obscured applies only where the document accepts keyboard input (forms and interactive PDFs, not a flat report).</li>
                <li><strong>10.7 User preferences for non-web documents</strong> (new): the document must not block the viewer&apos;s preference-driven modes or override documented platform accessibility features unless essential.</li>
                <li><strong>Sets of documents:</strong> 10.3.2.3 Consistent navigation and 10.3.2.4 Consistent identification, void in V3.2.1, now apply to a document within a set of documents, alongside 10.3.2.6 Consistent Help. A multi-file manual or a series of statements is a set.</li>
                <li><strong>10.2.4.2 Non-web document titled</strong> is reworded to require a title where the format has a programmatically determinable title that common authoring tools can edit; the substance (a title describing name, topic or purpose) is unchanged.</li>
                <li><strong>10.5 Subtitle positioning</strong> and <strong>10.6 Audio description timing</strong> are now explicitly labelled recommendations, as their Annex C entries always treated them.</li>
                <li><strong>Terminology:</strong> captions are subtitles throughout; the notes point out that WCAG&apos;s definition of captions covers both words.</li>
                <li><strong>PDF/UA:</strong> note 11 to clause 10.0 names ISO 14289-1:2014 (PDF/UA-1) and ISO 14289-2:2024 (PDF/UA-2) as the technical standards for accessible PDF that &ldquo;would be useful in meeting EN 301 549&rdquo;, the first time the 2024 edition is referenced; note 9 recommends Schema.org accessibility metadata for discoverability. See the{" "}
                  <Link href="/guides/pdf-accessibility">PDF accessibility guide</Link> and the free{" "}
                  <Link href="/tools/pdf-accessibility-checker">PDF accessibility checker</Link>.</li>
              </ul>
            </div>
          </section>

          {/* 8. Software */}
          <section id="software" className="mb-12 scroll-mt-24" aria-labelledby="sw-heading">
            <h2 id="sw-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              What changed for software (clause 11)
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ul>
                <li><strong>The open/closed split is gone.</strong> V3.2.1 numbered many software clauses as X.1 (open functionality) and X.2 (closed functionality, redirecting to clause 5.1). V4.1.1 has one clause per criterion whose precondition excludes functionality &ldquo;closed to programmatic access of information by assistive technologies&rdquo;; clause 5.1 covers closed functionality, and gains 5.1.8 Identify input purpose (closed functionality), which requires the purpose of user-data fields to be presented in audio. {closedVariantsRemoved} v3 closed-functionality variants therefore disappear from clause 11, including the three not-applicable slots for Parsing, Name/role/value and Status messages.</li>
                <li><strong>WCAG 2.2:</strong> 11.2.4.11, 11.2.5.7, 11.2.5.8, 11.3.3.7 and 11.3.3.8 are new; 11.3.2.6 Consistent Help is void; 11.4.1.1 Parsing is void; 11.2.4.2 (software titled) is a requirement where it was void.</li>
                <li><strong>11.5 is now &ldquo;Interoperability with keyboards and assistive technology&rdquo;.</strong> 11.5.1 becomes informative, 11.5.2.2 is void because its content merged into 11.5.2.1 (platform software must provide documented accessibility services covering every concept in 11.5.2.5 to 11.5.2.17), and 11.5.2.3 Use of accessibility services is demoted from a requirement to a recommendation. The thirteen object-information, relationship, action and notification clauses (11.5.2.5 to 11.5.2.17) carry over.</li>
                <li><strong>11.6 is now &ldquo;Documented accessibility features&rdquo;</strong> and <strong>11.7 User preferences</strong> is rewritten as described above.</li>
                <li><strong>Authoring tools moved to clause 5.10.</strong> The old 11.8.1 to 11.8.5 (content technology, accessible content creation, preservation in transformations, repair assistance, templates) are now generic requirements that apply to any ICT with authoring functionality, including web-based editors, and their targets now include clause 11 as well as 9 and 10. A CMS, a form builder or a design tool that outputs web content is in scope whether or not it is itself non-web software.</li>
              </ul>
            </div>
          </section>

          {/* 9. Elsewhere */}
          <section id="elsewhere" className="mb-12 scroll-mt-24" aria-labelledby="else-heading">
            <h2 id="else-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Everything else that moved
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h3>Clause 4: statements become criteria</h3>
              <p>
                The &ldquo;functional performance statements&rdquo; are now &ldquo;functional performance criteria&rdquo;, and every one
                is written with &ldquo;shall&rdquo;: where ICT provides visual modes of operation, it &ldquo;shall provide at least one
                mode of operation that does not require vision&rdquo;, and so on. A new 4.2.11 Privacy requires that using
                accessibility features does not cost the user privacy. Annex C gives each criterion a two-check test:
                the ICT passes if it meets every requirement that Annex B marks as primary or secondary for that
                criterion, or if there is evidence of the outcome. The notes also add a measurable floor for the first
                time: best practice for the smallest text is an x-height of at least 8 CSS pixels, 1.2 mm at 400 mm.
              </p>
              <h3>Clause 5: generic requirements</h3>
              <p>
                Every closed-functionality clause in 5.1 now starts &ldquo;Where ICT includes closed functionality&rdquo; and 5.1.3.3
                Auditory output correlation is promoted from a recommendation to a requirement. The two operable-parts
                clauses 5.5.1 and 5.5.2 collapse into 5.5 Tactilely discernible operable parts, which lets a touchscreen
                edge, corner or tactile marker count as a discernible part. 5.10 is the relocated authoring-tool clause.
              </p>
              <h3>Clause 7: video capabilities</h3>
              <p>
                Captions become subtitles; 7.1.2 keeps the 100 ms synchronisation to the subtitle timecode; 7.1.5 is
                reworded so a player must be able to play spoken subtitles that exist, not generate them; and 7.3 User
                control of audiovisual accessibility features now requires that subtitles, audio description or spoken
                subtitles can each be switched with a single operation at the same level as the volume control.
              </p>
              <h3>Clause 8: hardware, and a rewritten 8.3</h3>
              <p>
                Standard connections, colour and contrast leave 8.1 to become 8.6, 8.7 and the new 8.8 (non-digital
                characters, symbols and unlabelled parts must contrast light-on-dark or dark-on-light; a Michelson
                contrast of 0.7 and 0.4 is the usual approach). 8.3 Stationary ICT is rebuilt around two sets of
                dimensions, Set 1 for designs with no functional or design restrictions and Set 2 for designs with them:
                display screens no lower than 800 mm (8.3.2), operating information no higher than 1 600 mm or 2 000 mm
                (8.3.3), one of each control between 800 mm and 1 100 mm or between 380 mm and 1 220 mm (8.3.5), all
                controls within a 900 mm horizontal span (8.3.6), reach depth of 300 mm or 510/610 mm (8.3.7),
                obstruction limits for forward and side reach (8.3.9, 8.3.10) and knee and toe clearance from Table 8.2
                (8.3.11). The v3 clear-floor-space, change-in-level and alcove clauses are gone; access space is
                declared out of scope and left to the built-environment standards.
              </p>
              <h3>Clause 12: information about products and services</h3>
              <p>
                12.1 and 12.2 route digital information about a product or service, including support services, to
                clauses 9, 10 or 11 by format; 12.3 keeps the duty to document accessibility features and how to get
                support; 12.4 and 12.5 are new and require electronic programme guides to state, and let users check
                without playing the item, whether subtitles, audio description, spoken subtitles and sign language are
                available. The v3 &ldquo;effective communication&rdquo; clause for support services has no direct successor.
              </p>
              <h3>Clause 13: relay services</h3>
              <p>
                The five per-service clauses (text, sign, lip-reading, captioned telephony, speech-to-speech) are replaced
                by 13.1.2 Relay service access (five invocation requirements: using the primary user&apos;s normal
                destination addresses, conveying caller ID, user-controlled invocation on outgoing and incoming calls,
                emergency invocation) and 13.1.3 Relay service requirements (relaying action for every modality,
                pass-through of unconverted media, conference participation, accepting PSAP-initiated invocations).
                13.2 is void and 13.3 Access to emergency services is informative, deferring to clause 6 and EN 303 919.
              </p>
            </div>
          </section>

          {/* 10. Migration */}
          <section id="migration" className="mb-12 scroll-mt-24" aria-labelledby="mig-heading">
            <h2 id="mig-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Migration list for teams on V3.2.1
            </h2>
            <ol className="space-y-4 list-decimal pl-6">
              {migration.map((m) => (
                <li key={m.title} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">{m.title}</strong> {m.body}
                </li>
              ))}
            </ol>
            <div className="mt-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Work the delta directly: open the{" "}
                <Link href="/checklists/en-301-549?version=v4" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  interactive checklist in its v4.1.1 edition
                </Link>
                , tick &ldquo;Only rows that are new or changed since v3.2.1&rdquo;, pick the EAA conformance table that
                matches your product, and export the result to Excel with the change notes included.
              </p>
            </div>
          </section>

          {/* 11. Legal trap */}
          <section id="legal-trap" className="mb-12 scroll-mt-24" aria-labelledby="trap-heading">
            <h2 id="trap-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              The legal-status trap
            </h2>
            <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 p-5">
              <div className="prose prose-slate dark:prose-invert max-w-none prose-p:my-2">
                <p>
                  <strong>V3.2.1 is cited in the Official Journal only under the Web Accessibility Directive</strong>, by
                  Commission Implementing Decision (EU) 2018/2048 as amended by Decision (EU) 2021/1339. It has never
                  been cited under the European Accessibility Act.
                </p>
                <p>
                  <strong>No edition of EN 301 549 is cited under the European Accessibility Act today.</strong> That means
                  conforming to V3.2.1, or to V4.1.1, gives you no presumption of conformity with the Act. It is still the
                  right technical benchmark, and market-surveillance authorities use it, but a statement that your
                  service &ldquo;complies with the EAA because it conforms to EN 301 549&rdquo; is not true in law yet.
                </p>
                <p>
                  <strong>V4.1.1 is the edition built to be cited under the Act</strong>, and when it is, the presumption
                  attaches to the clauses in Tables A.1 to A.5, within the scope of the standard, for as long as the
                  reference stays in the Official Journal list. Until then, cite v3.2.1 for public-sector statements,
                  test against WCAG 2.2 AA, document which edition you tested against, and do not write &ldquo;presumption
                  of conformity&rdquo; anywhere.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mb-12">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Get ahead of the citation
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Audit against WCAG 2.2 AA now, work the v4.1.1 delta in the checklist, and have the conformance
                documentation ready for the day the Official Journal lists the standard.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/checklists/en-301-549?version=v4"
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Open the v4.1.1 checklist
                </Link>
                <Link
                  href="/services/accessibility-audits"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Professional EN 301 549 audit
                </Link>
                <Link
                  href="/compliance/eaa"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  EAA compliance guide
                </Link>
              </div>
            </div>
          </section>

          <div id="faq" className="scroll-mt-24">
            <FaqSection faqs={faqs} title="Frequently asked questions" className="mb-12" />
          </div>

          <section className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Keep exploring
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <li>
                <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                  EN 301 549 explained: structure, versions and who needs it
                </Link>
              </li>
              <li>
                <Link href="/blog/en-301-549-v4-1-1-wcag-2-2-eaa" className="text-blue-600 dark:text-blue-400 hover:underline">
                  News: EN 301 549 V4.1.1 published (September 2026)
                </Link>
              </li>
              <li>
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 AA checklist
                </Link>
              </li>
              <li>
                <Link href="/guides/wcag-2-1-vs-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.1 vs 2.2: the new criteria explained
                </Link>
              </li>
              <li>
                <Link href="/compliance/eaa-ireland" className="text-blue-600 dark:text-blue-400 hover:underline">
                  EAA compliance in Ireland
                </Link>
              </li>
              <li>
                <Link href="/tools/eaa-scope-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                  EAA scope checker
                </Link>
              </li>
            </ul>
          </section>
        </article>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="EN 301 549 v4.1.1 WCAG 2.2 European Accessibility Act harmonised standard total conversation real-time text Annex ZB conformance EAA audit"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
