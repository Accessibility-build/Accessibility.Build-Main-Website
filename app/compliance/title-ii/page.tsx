import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, CheckCircle2, CircleDot, Clock3, ExternalLink } from "lucide-react"
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { PageByline } from "@/components/seo/page-byline"
import { RelatedContent } from "@/components/seo/related-content"
import { TitleIIDeadlineChecker } from "@/components/title-ii/deadline-checker"
import { TitleIIPdfCheck } from "@/components/title-ii/pdf-check"
import { LinkToPage } from "@/components/title-ii/link-to-page"
import { clampDescription } from "@/lib/metadata"
import { getRouteDate } from "@/lib/site-routes"
import { cn } from "@/lib/utils"
import {
  DATES,
  EXCEPTIONS,
  OTHER_PROVISIONS,
  RULE_STATUS,
  SOURCES,
  TITLE_II_REVIEWED_ISO,
  TITLE_II_REVIEWED_ON,
  TITLE_II_ROUTE,
  WHAT_COULD_CHANGE,
  type StatusState,
} from "@/lib/title-ii/data"

const SITE = "https://accessibility.build"
const PAGE_URL = `${SITE}${TITLE_II_ROUTE}`
const pageTitle = "ADA Title II Web Accessibility: Deadlines and Free Tools"
const description = clampDescription(
  "For state and local governments: find your ADA Title II web deadline (26 April 2027 or 2028), follow the rule's status, see what is covered and exempt, and check PDFs free in your browser.",
)

export const metadata: Metadata = {
  title: pageTitle,
  description,
  keywords: [
    "ADA Title II web accessibility",
    "Title II deadline",
    "Title II web rule",
    "ADA Title II compliance date",
    "28 CFR 35.200",
    "WCAG 2.1 AA state and local government",
    "Title II PDF accessibility",
    "Title II special district",
    "public entity website accessibility",
  ],
  alternates: { canonical: TITLE_II_ROUTE },
  openGraph: {
    title: pageTitle,
    description,
    url: TITLE_II_ROUTE,
    type: "article",
    siteName: "Accessibility.build",
    images: [{ url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Compliance`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description,
    images: [`/api/og?title=${encodeURIComponent(pageTitle)}&section=Compliance`],
  },
}

const faqs = [
  {
    question: "When is the ADA Title II web accessibility deadline?",
    answer: `${DATES.large.label} for public entities with a total population of 50,000 or more, and ${DATES.small.label} for smaller public entities and every special district government (28 CFR 35.200(b)). These dates come from an interim final rule published on 20 April 2026, which moved the original 2024 dates back by one year and is being challenged in federal court.`,
  },
  {
    question: "What standard does the Title II rule require?",
    answer:
      "WCAG 2.1 Level A and Level AA, for web content and mobile apps that a public entity provides or makes available, directly or through contractual, licensing or other arrangements. Meeting WCAG 2.2 AA also meets 2.1 AA, because 2.2 includes every 2.1 success criterion except 4.1.1, which was removed as obsolete.",
  },
  {
    question: "How do we know which population figure to use?",
    answer:
      "Counties, cities, towns and other governments with a Census count use the most recent decennial Census. Independent school districts use the Census Bureau's Small Area Income and Poverty Estimates, which count everyone living in the district, not enrollment. An agency or authority without its own count uses the combined Census population of the governments it belongs to. Special districts have the later date regardless of size (28 CFR 35.104).",
  },
  {
    question: "Are old PDFs on our website exempt?",
    answer:
      "Only some. A PDF, Word, PowerPoint or Excel file that was online before your compliance date is exempt unless it is currently used to apply for, get access to, or take part in a service, program or activity (28 CFR 35.201(b)). Separately, archived content is exempt if it meets all four conditions in the rule, including being kept only for reference, research or recordkeeping in a clearly marked archive area. Anything posted on or after your compliance date is covered.",
  },
  {
    question: "Does the rule cover content from our vendors?",
    answer:
      "Yes. The rule covers web content and mobile apps a public entity provides directly or through contractual, licensing or other arrangements (28 CFR 35.200(a)). Payment portals, permitting systems, agenda and video platforms, and other third-party systems you use to deliver services are your responsibility, which is why accessibility belongs in procurement language.",
  },
  {
    question: "Do we have to publish an accessibility statement?",
    answer:
      "The Title II web rule does not require one. It is still good practice, because it tells people how to report a barrier and get information another way, and many state laws and policies do require one.",
  },
  {
    question: "What happens if the court rules on the extension?",
    answer:
      "The National Federation of the Blind has asked the federal court in Maryland to set aside the extensions and restore the 2024 dates (NFB v. DOJ, No. 1:26-cv-02007). No ruling had been found as of our last review. Because each extension is severable, a ruling could affect one date and not the other. We update this page when the docket or the rule changes.",
  },
  {
    question: "Does the PDF check on this page upload our files?",
    answer:
      "No. The check runs in your browser using pdf.js served from this site. The file is read on your computer and is not sent anywhere, which matters when documents contain personal information. It checks structure a person can't see, such as tags, language, title, alternative text and form field names. It does not judge reading order, the quality of alt text or table logic, which need a human review.",
  },
]

const STEPS: { title: string; text: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Name an owner and confirm your date",
    text: "Pick one person to coordinate web accessibility, confirm which date applies, and put it in the calendar for everyone who publishes content.",
    links: [
      { label: "Deadline checker", href: "#deadline" },
      { label: "DOJ: first steps", href: SOURCES.firstSteps, external: true },
    ],
  },
  {
    title: "List everything that's covered",
    text: "Websites, mobile apps, document libraries, social media accounts, and the vendor systems you use to deliver services: payments, permits, agendas, meeting video, maps.",
    links: [{ label: "What the rule covers", href: "#scope" }],
  },
  {
    title: "Test the pages people use most",
    text: "Start with the services residents rely on: paying bills, applying for permits and benefits, finding meeting information, contacting staff. Combine automated checks with keyboard and screen reader testing.",
    links: [
      { label: "URL accessibility auditor", href: "/tools/url-accessibility-auditor" },
      { label: "WCAG 2.1 quick reference", href: SOURCES.wcagQuickRef, external: true },
    ],
  },
  {
    title: "Fix documents at the source",
    text: "Decide what can be archived under the rule, then fix the rest in Word or the original program rather than patching PDFs one by one. Train the people who publish agendas and minutes first.",
    links: [
      { label: "Free PDF check", href: "#pdf-check" },
      { label: "Accessible Word documents", href: "/guides/accessible-word-documents" },
      { label: "PDF accessibility guide", href: "/guides/pdf-accessibility" },
    ],
  },
  {
    title: "Write accessibility into contracts",
    text: "Require WCAG 2.1 AA in new and renewing contracts, ask vendors for an Accessibility Conformance Report, and test what they deliver before you accept it.",
    links: [
      { label: "Section508.gov: buying accessible ICT", href: SOURCES.section508Buy, external: true },
      { label: "How to read a VPAT", href: "/guides/vpat-accessibility-conformance-report" },
    ],
  },
  {
    title: "Give people a way to report barriers",
    text: "Not required by the rule, but an accessibility statement with a contact route catches problems early and gives people another way to get information while fixes are made.",
    links: [
      { label: "Statement generator", href: "/tools/accessibility-statement-generator" },
      { label: "W3C: accessibility statements", href: SOURCES.w3cStatements, external: true },
    ],
  },
  {
    title: "Keep it accessible after the deadline",
    text: "Compliance is ongoing: new content posted after your date is covered. Build checks into publishing, re-test after redesigns, and review vendor updates.",
    links: [
      { label: "Contrast checker", href: "/tools/contrast-checker" },
      { label: "Word and PowerPoint checker", href: "/tools/word-powerpoint-accessibility-checker" },
    ],
  },
]

const OFFICIAL = [
  { label: "28 CFR part 35, subpart H (the rule text)", href: SOURCES.subpartH, note: "eCFR, current" },
  { label: "Interim final rule extending the dates, 91 FR 20902", href: SOURCES.ifr, note: "Federal Register, 20 April 2026" },
  { label: "DOJ fact sheet on the web rule", href: SOURCES.factSheet, note: "ADA.gov" },
  { label: "Small Entity Compliance Guide", href: SOURCES.smallEntityGuide, note: "ADA.gov" },
  { label: "First steps toward complying", href: SOURCES.firstSteps, note: "ADA.gov" },
  { label: "WCAG 2.1", href: SOURCES.wcag21, note: "W3C Recommendation" },
  { label: "HHS Section 504 web rule dates, 45 CFR 84.84", href: SOURCES.hhs8484, note: "eCFR, for HHS recipients" },
  { label: "PDF Accessibility Checker (PAC)", href: SOURCES.pac, note: "Free full PDF/UA checker for Windows" },
]

const STATE_STYLE: Record<StatusState, { icon: typeof CheckCircle2; label: string; dot: string; text: string }> = {
  done: { icon: CheckCircle2, label: "Happened", dot: "bg-slate-900 text-white dark:bg-white dark:text-slate-900", text: "text-slate-600 dark:text-slate-400" },
  pending: { icon: CircleDot, label: "Where things stand", dot: "bg-amber-500 text-slate-950", text: "text-amber-800 dark:text-amber-300" },
  upcoming: { icon: Clock3, label: "Coming up", dot: "bg-blue-700 text-white dark:bg-blue-500", text: "text-blue-800 dark:text-blue-300" },
}

const NAV = [
  ["deadline", "Your deadline"],
  ["rule-status", "Rule status"],
  ["scope", "What's covered"],
  ["pdf-check", "Free PDF check"],
  ["action-plan", "Action plan"],
  ["resources", "Official sources"],
  ["faq", "Questions"],
  ["link", "Link to this page"],
] as const

function Ext({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={cn("inline-flex items-center gap-1 font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200", className)}>
      {children}
      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    </a>
  )
}

function SectionHeading({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">{eyebrow}</p>
      <h2 id={`${id}-heading`} className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h2>
      {children ? <div className="mt-3 text-lg leading-relaxed text-slate-600 dark:text-slate-300">{children}</div> : null}
    </div>
  )
}

export default function TitleIIHubPage() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: SITE },
          { name: "Compliance", url: `${SITE}/compliance` },
          { name: "ADA Title II", url: PAGE_URL },
        ]}
      />
      <ArticleStructuredData
        headline={pageTitle}
        description={description}
        author={{ name: "Accessibility.build Editorial", url: `${SITE}/about` }}
        publisher={{ name: "Accessibility.build", logo: `${SITE}/android-chrome-512x512.png` }}
        datePublished="2026-11-27"
        dateModified={getRouteDate(TITLE_II_ROUTE) ?? TITLE_II_REVIEWED_ISO}
        image={`${SITE}/og-image.png`}
        url={PAGE_URL}
        wordCount={2600}
        keywords={["ADA Title II", "Title II web rule", "WCAG 2.1 AA", "Title II deadline", "public entity accessibility"]}
      />

      <div className="min-h-screen bg-white pt-12 dark:bg-slate-950">
        <nav aria-label="Breadcrumb" className="border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-blue-700 hover:underline dark:hover:text-blue-300">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/compliance" className="hover:text-blue-700 hover:underline dark:hover:text-blue-300">
                  Compliance
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="font-medium text-slate-900 dark:text-white">
                  ADA Title II
                </span>
              </li>
            </ol>
          </div>
        </nav>

        {/* ---------- Hero ---------- */}
        <header className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                  For state and local governments
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl dark:text-white">
                  ADA Title II web accessibility, in one place
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                  The rule, your compliance date, where the court challenge stands, what is covered and exempt, and a free
                  PDF check that never uploads your files. Every date links to the regulation it comes from.
                </p>
                <PageByline route={TITLE_II_ROUTE} variant="hero" className="mt-6" />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-60 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
                  </span>
                  Rule status, checked <time dateTime={TITLE_II_REVIEWED_ISO}>{TITLE_II_REVIEWED_ON}</time>
                </p>
                <dl className="mt-4 divide-y divide-slate-200 text-sm dark:divide-slate-800">
                  {[
                    ["Standard", "WCAG 2.1 Level A and AA"],
                    ["50,000 or more people", DATES.large.label],
                    ["Under 50,000, and special districts", DATES.small.label],
                    ["Court challenge", "Pending, no ruling found"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="text-slate-600 dark:text-slate-400">{k}</dt>
                      <dd className="text-right font-semibold text-slate-900 dark:text-white">{v}</dd>
                    </div>
                  ))}
                </dl>
                <a href="#rule-status" className="mt-4 inline-block text-sm font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300">
                  What could change
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* ---------- On this page ---------- */}
        <nav aria-labelledby="toc-heading" className="border-b border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <h2 id="toc-heading" className="sr-only">
              On this page
            </h2>
            <ul className="flex flex-wrap gap-2">
              {NAV.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="inline-block rounded-full border border-slate-300 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-500 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl space-y-24 px-4 py-16 sm:px-6 lg:px-8">
          {/* ---------- Deadline checker ---------- */}
          <section id="deadline" aria-labelledby="deadline-heading" className="scroll-mt-28">
            <SectionHeading id="deadline" eyebrow="Step 1" title="Which date applies to you?">
              Two or three questions, based on the definitions in 28 CFR 35.104. Nothing you choose is stored or sent.
            </SectionHeading>
            <TitleIIDeadlineChecker />
          </section>

          {/* ---------- Rule status ---------- */}
          <section id="rule-status" aria-labelledby="rule-status-heading" className="scroll-mt-28">
            <SectionHeading id="rule-status" eyebrow="Tracker" title="Where the rule stands">
              Checked against the Federal Register, eCFR and the court record on{" "}
              <time dateTime={TITLE_II_REVIEWED_ISO}>{TITLE_II_REVIEWED_ON}</time>. When something changes, this page
              changes the same week.
            </SectionHeading>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <ol className="relative space-y-6 border-l-2 border-slate-200 pl-8 dark:border-slate-800">
                {RULE_STATUS.map((event) => {
                  const style = STATE_STYLE[event.state]
                  const Icon = style.icon
                  return (
                    <li key={event.iso + event.title} className="relative">
                      <span className={cn("absolute -left-[2.6rem] top-0.5 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-950", style.dot)} aria-hidden="true">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className={cn("text-xs font-semibold uppercase tracking-wider", style.text)}>
                        <span className="sr-only">{style.label}: </span>
                        {event.state === "pending" ? event.label : <time dateTime={event.iso}>{event.label}</time>}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{event.title}</h3>
                      <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">{event.detail}</p>
                      {event.source ? (
                        <p className="mt-1.5 text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Source: </span>
                          <Ext href={event.source.href}>{event.source.label}</Ext>
                        </p>
                      ) : null}
                    </li>
                  )
                })}
              </ol>

              <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">What could change next</h3>
                {WHAT_COULD_CHANGE.map((item) => (
                  <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
                    <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.text}</p>
                  </div>
                ))}
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Our advice: keep working to the earlier date you originally planned around. The duty to make programs
                  accessible under Title II did not move, and work done early is never wasted. More in{" "}
                  <Link href="/guides/doj-title-ii-deadline-extension" className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300">
                    our analysis of the extension
                  </Link>{" "}
                  and{" "}
                  <Link href="/blog/nfb-v-doj-title-ii-deadline-extension-lawsuit" className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300">
                    NFB v. DOJ explained
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* ---------- Scope ---------- */}
          <section id="scope" aria-labelledby="scope-heading" className="scroll-mt-28">
            <SectionHeading id="scope" eyebrow="The rule" title="What's covered, and what isn't">
              Title II applies to every state and local government entity: agencies, courts, public schools and
              universities, libraries, transit and utilities. The web rule covers the web content and mobile apps they
              provide or make available, directly or through contractual, licensing or other arrangements (
              <Ext href={SOURCES.s35200}>28 CFR 35.200(a)</Ext>).
            </SectionHeading>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Websites and web apps", "Public sites, online services, portals and the pages vendors run for you."],
                ["Mobile apps", "Apps downloaded to phones and tablets, such as transit, parking or 311 apps."],
                ["Documents and social media", "PDF, Word, PowerPoint and Excel files, and social media posts made from your compliance date."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
                  <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{text}</p>
                </div>
              ))}
            </div>

            <h3 className="mt-12 text-xl font-semibold text-slate-900 dark:text-white">
              The five exceptions <span className="font-normal text-slate-600 dark:text-slate-400">(</span>
              <Ext href={SOURCES.s35201}>28 CFR 35.201</Ext>
              <span className="font-normal text-slate-600 dark:text-slate-400">)</span>
            </h3>
            <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
              Each one is narrow. The second column is where most public entities get caught out.
            </p>
            <div
              tabIndex={0}
              role="region"
              aria-label="The five exceptions in the Title II web rule"
              className="relative mt-5 overflow-x-auto rounded-xl border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-800"
            >
              <table className="w-full min-w-[44rem] text-left text-sm">
                <caption className="sr-only">The five exceptions in 28 CFR 35.201, what each covers, and when it does not apply.</caption>
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Exception
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      What it covers
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Where it stops
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {EXCEPTIONS.map((e) => (
                    <tr key={e.cite} className="align-top">
                      <th scope="row" className="min-w-[12rem] px-4 py-4 font-semibold text-slate-900 dark:text-white">
                        {e.title}
                        <span className="mt-0.5 block font-mono text-xs font-normal text-slate-600 dark:text-slate-400">{e.cite}</span>
                      </th>
                      <td className="px-4 py-4 leading-relaxed text-slate-700 dark:text-slate-300">{e.text}</td>
                      <td className="px-4 py-4 leading-relaxed text-slate-700 dark:text-slate-300">{e.catch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-12 text-xl font-semibold text-slate-900 dark:text-white">Other parts of the rule worth knowing</h3>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              {OTHER_PROVISIONS.map((p) => (
                <div key={p.cite} className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
                  <dt className="font-semibold text-slate-900 dark:text-white">
                    {p.title} <span className="ml-1 font-mono text-xs font-normal text-slate-600 dark:text-slate-400">{p.cite}</span>
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{p.text}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ---------- PDF check ---------- */}
          <section id="pdf-check" aria-labelledby="pdf-check-heading" className="scroll-mt-28">
            <SectionHeading id="pdf-check" eyebrow="Free tool" title="Check your PDFs, privately">
              Documents are where most public entities have the most work. This checks the structure a screen reader
              depends on, for a whole batch of files at once, without uploading anything. No account needed.
            </SectionHeading>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
              <TitleIIPdfCheck />
              <div className="space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <h3 id="pdf-about-heading" className="text-base font-semibold text-slate-900 dark:text-white">
                  What it checks
                </h3>
                <ul className="list-disc space-y-1.5 pl-5">
                  <li>Real text, not a scanned image</li>
                  <li>Tags (document structure)</li>
                  <li>Title and language</li>
                  <li>Headings, alternative text and table headers</li>
                  <li>Bookmarks on long documents</li>
                  <li>Form field names</li>
                  <li>Security settings that block screen readers</li>
                </ul>
                <p>
                  It can&apos;t judge reading order, whether alt text is meaningful, or colour contrast. For a full PDF/UA
                  check, use the free <Ext href={SOURCES.pac}>PAC checker</Ext> or Acrobat Pro&apos;s Full Check.
                </p>
                <p>
                  Before fixing an old file, ask whether it&apos;s still used to apply for or take part in a service. If not,
                  it may fall under the <a href="#scope" className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300">preexisting documents exception</a>.
                </p>
              </div>
            </div>
          </section>

          {/* ---------- Action plan ---------- */}
          <section id="action-plan" aria-labelledby="action-plan-heading" className="scroll-mt-28">
            <SectionHeading id="action-plan" eyebrow="Plan" title="Seven steps from here to compliance">
              The order most public entities find workable. Each step links to free tools and the official guidance.
            </SectionHeading>
            <ol className="grid gap-4 md:grid-cols-2">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{step.text}</p>
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                      {step.links.map((l) => (
                        <li key={l.label}>
                          {l.external ? (
                            <Ext href={l.href}>{l.label}</Ext>
                          ) : l.href.startsWith("#") ? (
                            <a href={l.href} className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300">
                              {l.label}
                            </a>
                          ) : (
                            <Link href={l.href} className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300">
                              {l.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ---------- Official sources ---------- */}
          <section id="resources" aria-labelledby="resources-heading" className="scroll-mt-28">
            <SectionHeading id="resources" eyebrow="Primary sources" title="Official sources">
              Read the rule itself before relying on any summary, including this one.
            </SectionHeading>
            <ul className="grid gap-3 sm:grid-cols-2">
              {OFFICIAL.map((o) => (
                <li key={o.href}>
                  <a
                    href={o.href}
                    className="group flex h-full items-start justify-between gap-3 rounded-xl border border-slate-200 p-4 hover:border-blue-400 hover:bg-blue-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-800 dark:hover:border-blue-700 dark:hover:bg-blue-950/20"
                  >
                    <span>
                      <span className="block font-medium text-slate-900 group-hover:underline dark:text-white">{o.label}</span>
                      <span className="mt-0.5 block text-sm text-slate-600 dark:text-slate-400">{o.note}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* ---------- FAQ ---------- */}
          <div id="faq" className="scroll-mt-28">
            <FaqSection faqs={faqs} title="Questions public entities ask" />
          </div>

          {/* ---------- Link to this page ---------- */}
          <section id="link" aria-labelledby="link-heading" className="scroll-mt-28">
            <div className="grid gap-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 lg:grid-cols-2 dark:border-slate-800 dark:bg-slate-900/60">
              <div>
                <h2 id="link-heading" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Add this page to your resource list
                </h2>
                <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
                  If you keep an accessibility or ADA page for staff or residents, you&apos;re welcome to link here. The
                  tools are free, need no account, and carry no advertising. We keep the dates current and say when we
                  last checked them.
                </p>
                <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
                  Spotted something out of date or wrong?{" "}
                  <Link href="/contact" className="font-medium text-blue-700 underline underline-offset-2 dark:text-blue-300">
                    Tell us
                  </Link>{" "}
                  and we&apos;ll correct it.
                </p>
                <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
                  General information, not legal advice. Accessibility.build is not affiliated with the Department of
                  Justice or any government body.
                </p>
              </div>
              <LinkToPage url={PAGE_URL} title="ADA Title II web accessibility: deadlines and free tools" />
            </div>
          </section>
        </div>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <RelatedContent
            content="ADA Title II state local government web accessibility WCAG 2.1 deadline PDF documents section 504 public entity"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
