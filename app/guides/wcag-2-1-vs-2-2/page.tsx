import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  FAQStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { wcagCriteria } from "@/lib/wcag-data"

const pageTitle = "WCAG 2.1 vs 2.2: What Changed & How to Migrate"
const pageDescription =
  "WCAG 2.2 adds 9 success criteria and removes 4.1.1 Parsing. See every change from WCAG 2.1, a side-by-side comparison, the legal context, and how to migrate."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "WCAG 2.1 vs 2.2",
    "WCAG 2.2 changes",
    "WCAG 2.2 new success criteria",
    "difference between WCAG 2.1 and 2.2",
    "WCAG 2.2 migration",
    "4.1.1 parsing removed",
    "WCAG 2.2 release date",
    "focus not obscured",
    "target size minimum",
    "accessible authentication",
  ],
  alternates: {
    canonical: "/guides/wcag-2-1-vs-2-2",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/wcag-2-1-vs-2-2",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
        alt: "WCAG 2.1 vs 2.2 comparison guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [`/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`],
  },
}

// The nine success criteria introduced in WCAG 2.2 (published October 5, 2023),
// derived from the canonical `introduced` field in lib/wcag-data.ts so this
// page stays in sync with the /wcag pages.
const slugFor = (number: string) => number.replace(/\./g, "-")

const newCriteria = wcagCriteria.filter((c) => c.introduced === "2.2")
if (newCriteria.length !== 9) {
  throw new Error(
    `Expected 9 criteria introduced in WCAG 2.2, found ${newCriteria.length} in lib/wcag-data.ts`
  )
}

// Practical, per-criterion migration notes that go beyond the one-line
// descriptions in the data file.
const migrationNotes: Record<string, { helps: string; inPractice: string }> = {
  "2.4.11": {
    helps: "Sighted keyboard users who lose track of focus behind sticky UI.",
    inPractice:
      "Make sure sticky headers, cookie banners, chat widgets, and non-modal footers never completely cover the element that has keyboard focus. Use scroll-padding or adjust z-index/scroll behavior so at least part of the focused element stays visible.",
  },
  "2.4.12": {
    helps: "Keyboard users who need the entire focused control visible.",
    inPractice:
      "The stricter AAA version of 2.4.11: no part of the focused component may be hidden by author-created content. Only required for AAA conformance claims.",
  },
  "2.4.13": {
    helps: "Low-vision keyboard users who rely on a clearly visible focus ring.",
    inPractice:
      "Focus indicators must be at least as large as a 2 CSS pixel thick perimeter around the component and have at least 3:1 contrast between focused and unfocused states. AAA only, but an excellent default for design systems.",
  },
  "2.5.7": {
    helps: "People with motor disabilities who cannot perform precise drag gestures.",
    inPractice:
      "Any drag-and-drop interaction (sortable lists, sliders, kanban boards, map panning) needs a single-pointer alternative such as up/down buttons, a select menu, or click-to-move — unless dragging is essential.",
  },
  "2.5.8": {
    helps: "People with tremors or limited dexterity, and everyone on touch screens.",
    inPractice:
      "Interactive targets must be at least 24 by 24 CSS pixels, or have enough surrounding spacing that a 24px circle centered on each target does not overlap another. Inline links in text, browser-native controls, and essential presentations are exempt.",
  },
  "3.2.6": {
    helps: "People with cognitive disabilities who need to find help quickly.",
    inPractice:
      "If help mechanisms (contact phone/email, contact form, live chat, FAQ/self-help, automated assistant) are offered on multiple pages of a site, they must appear in the same relative order on every page. It does not require adding help — only consistency where help exists.",
  },
  "3.3.7": {
    helps: "People with memory or cognitive limitations filling out multi-step processes.",
    inPractice:
      "Do not ask users to re-type information they already entered in the same process (for example, shipping address again as billing address). Auto-populate it or let them select it — unless re-entry is essential, needed for security, or the info is no longer valid.",
  },
  "3.3.8": {
    helps: "People with cognitive disabilities who cannot memorize or transcribe codes.",
    inPractice:
      "Login must not depend solely on a cognitive function test like memorizing a password or transcribing characters. Supporting password managers and paste, email magic links, passkeys, or OAuth all satisfy it. CAPTCHAs based on object recognition are allowed at this level.",
  },
  "3.3.9": {
    helps: "Users who also struggle with object-recognition puzzles.",
    inPractice:
      "The AAA version of 3.3.8: even object recognition (image CAPTCHAs) and identifying personal content are not allowed as the only path to authenticate.",
  },
}

const faqs = [
  {
    question: "What is the difference between WCAG 2.1 and WCAG 2.2?",
    answer:
      "WCAG 2.2 builds directly on WCAG 2.1. It adds nine new success criteria — two at Level A (3.2.6 Consistent Help, 3.3.7 Redundant Entry), four at Level AA (2.4.11 Focus Not Obscured (Minimum), 2.5.7 Dragging Movements, 2.5.8 Target Size (Minimum), 3.3.8 Accessible Authentication (Minimum)), and three at Level AAA (2.4.12, 2.4.13, 3.3.9) — and removes one criterion, 4.1.1 Parsing, which had become obsolete. Everything else carries over unchanged: all remaining WCAG 2.1 success criteria appear verbatim in WCAG 2.2, bringing the total to 86 criteria.",
  },
  {
    question: "When was WCAG 2.2 released?",
    answer:
      "WCAG 2.2 became an official W3C Recommendation on October 5, 2023, five years after WCAG 2.1 (June 2018) and fifteen years after WCAG 2.0 (December 2008). It is the current recommended version of the Web Content Accessibility Guidelines, and W3C encourages using it for new and updated conformance efforts.",
  },
  {
    question: "If my site meets WCAG 2.2, does it also meet WCAG 2.1?",
    answer:
      "Effectively yes. WCAG 2.2 is backwards compatible: a page that conforms to WCAG 2.2 satisfies every WCAG 2.1 requirement except 4.1.1 Parsing, which was removed in 2.2. The W3C has since published guidance that 4.1.1 should be considered always satisfied for HTML content in WCAG 2.0 and 2.1 conformance claims, because modern browsers and assistive technologies fully handle parsing errors. So in practice, conforming to WCAG 2.2 AA also gives you WCAG 2.1 AA and WCAG 2.0 AA conformance.",
  },
  {
    question: "Do laws require WCAG 2.2 yet?",
    answer:
      "Mostly not yet — most regulations still cite WCAG 2.1 AA. The U.S. DOJ's ADA Title II rule for state and local governments requires WCAG 2.1 AA, the European standard EN 301 549 (which underpins the European Accessibility Act) references WCAG 2.1 AA, and U.S. Section 508 still points to WCAG 2.0 AA. Because WCAG 2.2 is backwards compatible, targeting 2.2 AA satisfies all of these at once while future-proofing you as standards bodies update their references.",
  },
  {
    question: "What happened to success criterion 4.1.1 Parsing?",
    answer:
      "It was removed in WCAG 2.2. When 4.1.1 was written in 2008, malformed HTML (unclosed tags, duplicate IDs, improper nesting) could crash or confuse assistive technologies that parsed markup directly. Modern browsers now repair markup errors consistently before assistive technologies ever see the content, so the criterion no longer improved accessibility on its own. Cases where markup errors cause real user harm — like duplicate IDs breaking a label association — are already covered by other criteria such as 1.3.1 Info and Relationships and 4.1.2 Name, Role, Value.",
  },
  {
    question: "Should I target WCAG 2.1 AA or WCAG 2.2 AA?",
    answer:
      "Target WCAG 2.2 AA. It is the current W3C Recommendation, it automatically satisfies WCAG 2.1 AA (the version most laws reference), and the six new A/AA criteria are comparatively cheap to implement — mostly touching focus styling, target sizes, drag alternatives, form flows, and login. Auditing once against 2.2 AA costs little more than auditing against 2.1 AA and saves you a re-audit when regulators inevitably update their references.",
  },
  {
    question: "How hard is it to migrate from WCAG 2.1 AA to WCAG 2.2 AA?",
    answer:
      "For most sites it is a small, well-scoped project. Only six new criteria apply at A/AA, and they cluster in a few places: check that sticky UI never fully covers focused elements (2.4.11), give every drag interaction a click alternative (2.5.7), make interactive targets at least 24 by 24 CSS pixels or spaced equivalently (2.5.8), keep help mechanisms in a consistent order (3.2.6), stop asking users to re-enter data within a process (3.3.7), and support password managers, paste, or passwordless login (3.3.8). Teams with a design system can often fix target size and focus styles globally in one pass.",
  },
]

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "WCAG 2.1 vs 2.2",
    url: "https://accessibility.build/guides/wcag-2-1-vs-2-2",
  },
]

const levelBadgeClasses: Record<string, string> = {
  A: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  AA: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  AAA: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
}

export default function Wcag21Vs22Page() {
  const newAOrAA = newCriteria.filter((c) => c.level !== "AAA")
  const newAAA = newCriteria.filter((c) => c.level === "AAA")

  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ArticleStructuredData
        headline={pageTitle}
        description={pageDescription}
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-09"
        dateModified="2026-07-09"
        image={`https://accessibility.build/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`}
        url="https://accessibility.build/guides/wcag-2-1-vs-2-2"
        wordCount={2600}
        keywords={[
          "WCAG 2.1 vs 2.2",
          "WCAG 2.2 changes",
          "WCAG 2.2 new success criteria",
          "WCAG 2.2 migration",
        ]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/" className="hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <Link href="/guides" className="hover:text-blue-600 transition-colors">
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    WCAG 2.1 vs 2.2
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 text-xs font-semibold uppercase tracking-wide mb-5">
              <span aria-hidden="true">●</span>
              WCAG Reference
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              WCAG 2.1 vs 2.2: What Changed and How to Migrate
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              WCAG 2.2 became the official W3C Recommendation on{" "}
              <strong>October 5, 2023</strong>. It adds{" "}
              <strong>nine new success criteria</strong>, removes one obsolete
              criterion (4.1.1 Parsing), and changes nothing else — every other
              requirement carries over from WCAG 2.1 word for word. Here is the
              complete list of changes, what each new criterion means in
              practice, and how to move an existing WCAG 2.1 program to 2.2.
            </p>
          </header>

          {/* At-a-glance stats */}
          <section aria-label="WCAG 2.2 at a glance" className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">9</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                New success criteria
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">1</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Criterion removed (4.1.1)
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">6</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                New at Level A/AA
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {wcagCriteria.length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Total criteria in 2.2
              </p>
            </div>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>A quick history: 2.0 → 2.1 → 2.2</h2>
            <p>
              The Web Content Accessibility Guidelines evolve slowly and
              deliberately. WCAG 2.0 (December 2008) established the four{" "}
              <Link href="/wcag">POUR principles</Link> — Perceivable, Operable,
              Understandable, Robust — and 61 success criteria. WCAG 2.1 (June
              2018) added 17 criteria focused on mobile devices, low vision, and
              cognitive disabilities. WCAG 2.2 (October 2023) adds nine more,
              concentrated on three groups the earlier versions underserved:
              users with cognitive and learning disabilities, users with motor
              impairments, and sighted keyboard users.
            </p>
            <p>
              Each version is a strict superset of the last (with the single
              exception of 4.1.1, covered below). That backwards compatibility
              is the key fact for migration planning:{" "}
              <strong>
                a site that conforms to WCAG 2.2 also conforms to WCAG 2.1 and
                2.0 at the same level
              </strong>
              . The next major revision,{" "}
              <Link href="/wcag-3">WCAG 3.0</Link>, is a ground-up redesign that
              is still years from becoming a standard — 2.2 is what you should
              build against today.
            </p>
          </section>

          {/* Comparison table */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              WCAG 2.1 vs 2.2 side by side
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm text-left">
                <caption className="sr-only">
                  Comparison of WCAG 2.1 and WCAG 2.2
                </caption>
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      &nbsp;
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      WCAG 2.1
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      WCAG 2.2
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      Published
                    </th>
                    <td className="px-4 py-3">June 5, 2018</td>
                    <td className="px-4 py-3">October 5, 2023</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      Total success criteria
                    </th>
                    <td className="px-4 py-3">78</td>
                    <td className="px-4 py-3">86 (78 − 4.1.1 + 9 new)</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      Level A criteria
                    </th>
                    <td className="px-4 py-3">30</td>
                    <td className="px-4 py-3">31 (+3.2.6, +3.3.7, −4.1.1)</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      Level AA criteria
                    </th>
                    <td className="px-4 py-3">20</td>
                    <td className="px-4 py-3">24 (+2.4.11, +2.5.7, +2.5.8, +3.3.8)</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      Level AAA criteria
                    </th>
                    <td className="px-4 py-3">28</td>
                    <td className="px-4 py-3">31 (+2.4.12, +2.4.13, +3.3.9)</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      Removed criteria
                    </th>
                    <td className="px-4 py-3">None</td>
                    <td className="px-4 py-3">4.1.1 Parsing (obsolete)</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      Main focus of additions
                    </th>
                    <td className="px-4 py-3">Mobile, low vision, cognitive</td>
                    <td className="px-4 py-3">
                      Cognitive, motor impairments, keyboard focus visibility
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      Referenced by law
                    </th>
                    <td className="px-4 py-3">
                      DOJ ADA Title II rule, EN 301 549 / EAA
                    </td>
                    <td className="px-4 py-3">
                      Not yet — but conforming to 2.2 satisfies 2.1 references
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      W3C status
                    </th>
                    <td className="px-4 py-3">Superseded Recommendation</td>
                    <td className="px-4 py-3">Current Recommendation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* The 9 new criteria */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              The 9 new success criteria in WCAG 2.2
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Six of the nine apply at Level A or AA — the levels legal
              standards and most conformance targets care about. The remaining
              three are Level AAA. Each links to our full criterion reference
              with examples and testing steps.
            </p>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              New at Level A and AA (required for AA conformance)
            </h3>
            <div className="space-y-4 mb-10">
              {newAOrAA.map((criterion) => (
                <div
                  key={criterion.number}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                      <Link
                        href={`/wcag/${slugFor(criterion.number)}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {criterion.number} {criterion.title}
                      </Link>
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${levelBadgeClasses[criterion.level]}`}
                    >
                      Level {criterion.level}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {criterion.description}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">
                      Who it helps:
                    </strong>{" "}
                    {migrationNotes[criterion.number].helps}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong className="text-slate-900 dark:text-white">
                      In practice:
                    </strong>{" "}
                    {migrationNotes[criterion.number].inPractice}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              New at Level AAA (optional for most conformance targets)
            </h3>
            <div className="space-y-4">
              {newAAA.map((criterion) => (
                <div
                  key={criterion.number}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                      <Link
                        href={`/wcag/${slugFor(criterion.number)}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {criterion.number} {criterion.title}
                      </Link>
                    </h4>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${levelBadgeClasses[criterion.level]}`}
                    >
                      Level {criterion.level}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                    {criterion.description}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">
                      In practice:
                    </strong>{" "}
                    {migrationNotes[criterion.number].inPractice}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>The one removal: 4.1.1 Parsing</h2>
            <p>
              WCAG 2.2 is the first version ever to remove a success criterion.
              4.1.1 Parsing (Level A) required markup to be well-formed — no
              unclosed tags, no duplicate IDs, proper nesting. In 2008 that
              mattered because some assistive technologies parsed HTML
              themselves and could fail on malformed markup. Today, browsers
              repair markup errors consistently before assistive technologies
              ever see the content, so the criterion had stopped catching real
              accessibility problems while still generating audit noise.
            </p>
            <p>
              Cases where markup errors genuinely harm users — a duplicate ID
              that breaks a form label, for instance — are already failures
              under <Link href="/wcag/1-3-1">1.3.1 Info and Relationships</Link>{" "}
              or <Link href="/wcag/4-1-2">4.1.2 Name, Role, Value</Link>. The
              W3C has additionally published errata stating that for HTML
              content, 4.1.1 should be treated as always satisfied in WCAG 2.0
              and 2.1 conformance claims. Practical consequence: you can drop
              parsing-only findings from your audit backlog regardless of which
              version you target.
            </p>

            <h2>Migrating from WCAG 2.1 AA to 2.2 AA</h2>
            <p>
              Because everything else is unchanged, migration is exactly the gap
              between the two versions: verify the six new A/AA criteria and
              stop testing 4.1.1. A focused pass looks like this:
            </p>
            <ol>
              <li>
                <strong>Audit sticky UI against focus.</strong> Tab through
                every page template and confirm sticky headers, cookie banners,
                and chat launchers never fully cover the focused element (
                <Link href="/wcag/2-4-11">2.4.11</Link>).
              </li>
              <li>
                <strong>Inventory drag interactions.</strong> Sliders, sortable
                lists, file-drop zones, map panning — each needs a single-click
                alternative (<Link href="/wcag/2-5-7">2.5.7</Link>).
              </li>
              <li>
                <strong>Measure target sizes.</strong> Check icon buttons,
                pagination, and toolbars against the 24×24 CSS pixel minimum or
                its spacing exception (<Link href="/wcag/2-5-8">2.5.8</Link>).
                Fixing this once in your design system usually fixes it
                everywhere.
              </li>
              <li>
                <strong>Standardize help placement.</strong> If contact links,
                chat, or FAQs appear across pages, keep them in the same
                relative order (<Link href="/wcag/3-2-6">3.2.6</Link>).
              </li>
              <li>
                <strong>Remove redundant form entry.</strong> Auto-populate or
                offer to reuse anything the user already typed in the same
                process (<Link href="/wcag/3-3-7">3.3.7</Link>).
              </li>
              <li>
                <strong>Modernize login.</strong> Allow paste and password
                managers, or offer passkeys, magic links, or OAuth so
                authentication never depends solely on memory or transcription (
                <Link href="/wcag/3-3-8">3.3.8</Link>).
              </li>
            </ol>
            <p>
              Teams already at 2.1 AA typically close this gap in days, not
              months. Work through the full list with our{" "}
              <Link href="/checklists/wcag-2-2">WCAG 2.2 checklist</Link>, or
              see exactly what AA requires end to end in our{" "}
              <Link href="/guides/wcag-2-2-aa-requirements">
                complete WCAG 2.2 AA requirements list
              </Link>
              .
            </p>

            <h2>Legal context: which version do laws actually require?</h2>
            <p>
              As of mid-2026, most binding standards still reference{" "}
              <strong>WCAG 2.1 AA</strong>, not 2.2:
            </p>
            <ul>
              <li>
                <strong>ADA Title II (U.S. state and local government):</strong>{" "}
                the DOJ&apos;s web accessibility rule requires WCAG 2.1 AA. See
                our analysis of the{" "}
                <Link href="/guides/doj-title-ii-deadline-extension">
                  Title II compliance deadlines
                </Link>
                .
              </li>
              <li>
                <strong>European Accessibility Act / EN 301 549:</strong> the
                harmonized European standard references WCAG 2.1 AA for web
                content.
              </li>
              <li>
                <strong>Section 508 (U.S. federal):</strong> still references
                WCAG 2.0 AA.
              </li>
              <li>
                <strong>ADA Title III (U.S. private sector):</strong> no formal
                technical standard, but WCAG 2.1 AA is the de facto benchmark in
                settlements and demand letters — with 2.2 appearing more often.
                Our <Link href="/research/accessibility-lawsuits">lawsuit
                tracker</Link> follows the trend.
              </li>
            </ul>
            <p>
              None of this is a reason to stay on 2.1. Since WCAG 2.2 AA
              conformance satisfies every 2.1 AA reference above, building to
              2.2 AA is the strictly safer choice: you meet today&apos;s legal
              standards and are already done when regulators update their
              citations.
            </p>
          </section>

          {/* CTA */}
          <section className="mb-16">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Check your site against WCAG 2.2
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Work through every criterion with the interactive checklist, or
                scan a URL to find machine-detectable failures first.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/checklists/wcag-2-2"
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  WCAG 2.2 Checklist
                </Link>
                <Link
                  href="/tools/url-accessibility-auditor"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Scan Your Site
                </Link>
                <Link
                  href="/wcag"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Browse All 86 Criteria
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
                >
                  <summary className="cursor-pointer text-lg font-semibold text-slate-900 dark:text-white list-none flex justify-between items-start gap-4">
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0"
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </article>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="WCAG 2.2 WCAG 2.1 success criteria comparison migration focus not obscured target size dragging movements accessible authentication consistent help redundant entry parsing conformance"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
