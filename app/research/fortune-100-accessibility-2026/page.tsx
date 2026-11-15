import type { Metadata } from "next"
import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight, Crosshair, EyeOff, ImageOff, Layers, Lock, MoveHorizontal, ZoomIn } from "lucide-react"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { PageByline } from "@/components/seo/page-byline"
import { RelatedContent } from "@/components/seo/related-content"
import { FaqSection } from "@/components/seo/faq-section"
import { clampDescription } from "@/lib/metadata"
import data from "@/lib/data/fortune-100-homepages-2026.json"
import { BarTable, OutcomeWaffle, SplitBar } from "./Fortune100Charts"

// One study of the Fortune 100 homepages, 14 and 15 November 2026: axe-core
// 4.10.2 plus scripted and manual checks (keyboard, 320px reflow, structure,
// alt-text quality, overlays). The full run was on 14 November; every finding
// named on the page was confirmed on the live site the next day. Figures come
// from lib/data/fortune-100-homepages-2026.json. The per-company workbook is
// not published, so there is no Dataset schema and no download.

const ROUTE = "/research/fortune-100-accessibility-2026"
const pageTitle = "Fortune 100 Homepage Accessibility 2026"
const pageDescription =
  "We tested all 100 Fortune 100 homepages with axe-core and manual checks. 46 had zero automated violations, but only 18 passed both the scan and every manual check. Keyboard traps, alt text, reflow and overlays, company by company."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "Fortune 100 accessibility",
    "Fortune 500 website accessibility",
    "corporate website accessibility study",
    "homepage accessibility audit 2026",
    "axe-core study",
    "WCAG 2.2 compliance large companies",
    "cookie banner keyboard trap",
    "accessibility overlay usage",
  ],
  alternates: { canonical: ROUTE },
  openGraph: {
    title: "How Accessible Are Fortune 100 Homepages? (November 2026)",
    description: pageDescription,
    url: ROUTE,
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("How Accessible Are Fortune 100 Homepages?")}&section=Research`,
        width: 1200,
        height: 630,
        alt: "How accessible are Fortune 100 homepages, November 2026",
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Research", url: "https://accessibility.build/research" },
  { name: "Fortune 100 homepages 2026", url: `https://accessibility.build${ROUTE}` },
]

const a = data.automated
const m = data.manual
const axeClean = a.zeroViolations
const cleanBoth = data.leaders.length
const hiddenByScan = axeClean - cleanBoth
const failedAxe = data.homepages - axeClean

// Chart colours. Light: categorical blue, orange and a darkened aqua (#14996a,
// 3.2:1) so every mark clears 3:1 on white; ordinal blue ramp for the split
// bar (middle step #256abf keeps white text above 4.5:1). Dark: matching dark steps. Validated with the dataviz palette checker.
const CHART_VARS = `
.f100{--f-s1:#2a78d6;--f-s2:#eb6834;--f-s3:#14996a;--f-o1:#86b6ef;--f-o2:#256abf;--f-o3:#104281;--f-empty:#e2e8f0}
.dark .f100{--f-s1:#3987e5;--f-s2:#d95926;--f-s3:#199e70;--f-o1:#6da7ec;--f-o2:#256abf;--f-o3:#184f95;--f-empty:#1e293b}
@media (forced-colors: active){.f100-mark,.f100-mark *{forced-color-adjust:none}}
`

const linkCls = "font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300"
const card = "min-w-0 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60 sm:p-8"

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">{children}</p>
}

function SectionHead({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {children ? <div className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{children}</div> : null}
    </div>
  )
}

function CardTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{children}</h3>
      {sub ? <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{sub}</p> : null}
    </div>
  )
}

function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>
}

const FINDINGS = [
  { value: failedAxe, text: <>homepages fail at least one automated WCAG A/AA rule; {a.withCriticalViolation} have a critical violation</> },
  { value: a.topRulesByHomepage[0].homepages, text: <>fail color contrast, the most common automated failure</> },
  { value: m.noSkipLink, text: <>have no skip link, and on {m.brokenSkipTarget} more it points to a target that doesn&apos;t exist</> },
  { value: m.noMainLandmark, text: <>have no main landmark, and {m.noH1} have no h1</> },
  { value: m.poorAltText, text: <>have poor alt text that axe passes: file names, asset codes, placeholders</> },
  { value: m.keyboardFocusVerified, text: <>have a verified keyboard or focus problem, mostly from cookie banners</> },
  { value: m.reflowFail, text: <>scroll horizontally at 320px, failing <Link href="/wcag/1-4-10" className={linkCls}>WCAG 1.4.10 reflow</Link></> },
  { value: m.overlays, text: <>load an overlay widget: UserWay, AudioEye, accessiBe, Recite Me</> },
]

const KEYBOARD_KIND: Record<string, { label: string; Icon: typeof Lock }> = {
  "Johnson & Johnson": { label: "Focus trap", Icon: Lock },
  Boeing: { label: "Focus trap", Icon: Lock },
  "American Airlines": { label: "Focus trap", Icon: Lock },
  "UnitedHealth Group": { label: "Focus trap", Icon: Lock },
  AbbVie: { label: "Focus obscured", Icon: EyeOff },
  TJX: { label: "No focus indicator", Icon: Crosshair },
  "Cardinal Health": { label: "No focus indicator", Icon: Crosshair },
}

const PRACTICE = [
  { title: "Cookie banners are the new keyboard trap.", body: <>{m.keyboardFromConsent} of the {m.keyboardFocusVerified} verified keyboard issues come from consent banners or dialogs. Test the default first-visit state, not a session where consent is already given.</> },
  { title: "Alt-text quality needs a human.", body: <>The content team, not the code, produced most Poor ratings: file names and CMS asset codes flowing straight into alt attributes. See <Link href="/guides/how-to-write-alt-text" className={linkCls}>how to write alt text</Link>.</> },
  { title: "WCAG 2.2 is already biting.", body: <>Target size is the 2nd most common axe failure, and <Link href="/wcag/2-4-11" className={linkCls}>focus obscured</Link> by sticky banners (2.4.11) showed up on AbbVie.</> },
  { title: "Structure basics are still missing at scale.", body: <>Between {m.noSkipLink} and {m.noMainLandmark} homepages each lack a <Link href="/guides/skip-links" className={linkCls}>skip link</Link>, an h1 or a main landmark: cheap fixes with large payoffs for screen-reader and keyboard users.</> },
  { title: "Overlays are rare and don't fix the basics.", body: <>Two of the four overlay sites still fail reflow, and one has Poor alt text. Read <Link href="/guides/accessibility-overlays" className={linkCls}>why overlays don&apos;t fix accessibility</Link>.</> },
]

const FAQS = [
  {
    question: "How was the Fortune 100 accessibility study done?",
    answer: `Each of the 100 homepages, taken from ranks 1 to 100 of the 2026 Fortune 500, was tested in one study on 14 and 15 November 2026. axe-core ${data.axeVersion} ran the WCAG 2.0, 2.1 and 2.2 A and AA rules at a 1366×900 desktop viewport. Scripted and manual checks covered keyboard focus (30 real Tab presses), reflow in a true 320 CSS px viewport, skip links, headings, landmarks, alt-text quality, zoom locks and overlay scripts. Every company-specific finding on the page was confirmed on the live site.`,
  },
  {
    question: "Does a homepage with zero axe violations meet WCAG?",
    answer: `No. Automated rules catch only a minority of WCAG failures. In this study ${axeClean} homepages had zero axe-core violations, but ${hiddenByScan} of those still failed at least one manual check, such as a missing skip link, no main landmark, poor alt text or a keyboard trap. Passing both is a floor, not proof of conformance.`,
  },
  {
    question: "Why are cookie banners a keyboard accessibility problem?",
    answer: `${m.keyboardFromConsent} of the ${m.keyboardFocusVerified} verified keyboard issues came from consent banners or dialogs: some confine Tab focus to the banner until it is dismissed, and on AbbVie the banner covers focused links (WCAG 2.4.11 Focus Not Obscured). The problem only appears on a first visit, so test the default state before consent is given.`,
  },
  {
    question: "How many Fortune 100 homepages use an accessibility overlay?",
    answer: `${m.overlays}: Cardinal Health (UserWay), Energy Transfer (AudioEye), Enterprise Products Partners (accessiBe) and Coca-Cola (Recite Me). Two of the four still fail the 320px reflow test, and Coca-Cola also has poor alt text.`,
  },
]

const manualRows = [
  { key: "main", label: "No main landmark", value: m.noMainLandmark },
  { key: "skip", label: "No skip link", value: m.noSkipLink },
  { key: "h1", label: "No h1", value: m.noH1 },
  { key: "alt", label: "Poor alt text", value: m.poorAltText },
  { key: "reflow", label: "Fails 320px reflow", value: m.reflowFail },
  { key: "kbd", label: "Keyboard or focus problem", value: m.keyboardFocusVerified },
  { key: "skipt", label: "Skip link target missing", value: m.brokenSkipTarget },
  { key: "zoom", label: "Pinch-zoom disabled", value: m.zoomDisabled },
]

export default function Fortune100StudyPage() {
  return (
    <>
      <style>{CHART_VARS}</style>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema route={ROUTE} title={pageTitle} description={pageDescription} datePublished="2026-11-16" section="Research" />

      <article className="f100 bg-white pb-24 dark:bg-slate-950">
        {/* Hero */}
        <header className="border-b border-slate-200 bg-slate-50 pt-12 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container-wide grid items-center gap-12 py-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-14">
            <div>
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><Link href="/" className="hover:text-teal-700 dark:hover:text-teal-300">Home</Link></li>
                  <li aria-hidden="true">/</li>
                  <li><Link href="/research" className="hover:text-teal-700 dark:hover:text-teal-300">Research</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="text-slate-900 dark:text-white" aria-current="page">Fortune 100 homepages 2026</li>
                </ol>
              </nav>
              <Eyebrow>Research &middot; Original measurement &middot; November 2026</Eyebrow>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                How accessible are Fortune&nbsp;100 homepages?
              </h1>
              <p className="mt-6 max-w-[56ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
                Automated scanning makes America&apos;s largest companies look nearly clean, but the checks a human
                makes do not. <Strong>{axeClean} of 100</Strong> homepages had zero axe-core violations, yet only{" "}
                <Strong>{cleanBoth}</Strong> passed both the automated scan and every manual check.
              </p>
              <div className="mt-8">
                <PageByline route={ROUTE} />
              </div>
            </div>
            <div className={`${card} mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end`}>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">100 homepages, one square each</p>
              <p className="mb-5 mt-1 text-sm text-slate-600 dark:text-slate-400">axe-core {data.axeVersion} plus manual checks, November 2026</p>
              <OutcomeWaffle cleanBoth={cleanBoth} axeCleanOnly={hiddenByScan} failedAxe={failedAxe} />
            </div>
          </div>
        </header>

        <div className="container-wide">
          {/* Key findings */}
          <section aria-labelledby="findings-heading" className="pt-16">
            <SectionHead id="findings-heading" eyebrow="Key findings" title="Eight numbers from the study">
              <p>
                A clean automated scan hid real barriers on <Strong>{hiddenByScan} of the {axeClean}</Strong> axe-clean
                homepages, so automated results alone overstate how accessible these sites are.
              </p>
            </SectionHead>
            <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
              {FINDINGS.map((f, i) => (
                <li key={i} className="bg-white p-6 dark:bg-slate-900">
                  <p className="font-mono text-4xl font-semibold tabular-nums text-slate-900 dark:text-white">{f.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{f.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Automated */}
          <section aria-labelledby="automated-heading" className="pt-20">
            <SectionHead id="automated-heading" eyebrow="Automated results" title="What axe-core found">
              <p>
                {axeClean} homepages passed every axe-core WCAG A/AA rule, {a.failedOneRule} failed exactly one, and{" "}
                {a.failedTwoOrMore} failed two or more. The median homepage fails just {a.medianRulesFailed} rule, and{" "}
                {a.failingElements} failing elements were found across all 100.
              </p>
            </SectionHead>

            <div className="mt-10 grid gap-6 lg:grid-cols-5">
              <div className={`${card} lg:col-span-2`}>
                <CardTitle sub="How many axe-core WCAG A/AA rules each homepage failed">Rules failed per homepage</CardTitle>
                <SplitBar
                  caption={`${axeClean} homepages failed no rules, ${a.failedOneRule} failed one, ${a.failedTwoOrMore} failed two or more.`}
                  parts={[
                    { label: "No rules", value: axeClean, color: "var(--f-o1)", ink: "#0b0b0b" },
                    { label: "One rule", value: a.failedOneRule, color: "var(--f-o2)", ink: "#ffffff" },
                    { label: "Two or more", value: a.failedTwoOrMore, color: "var(--f-o3)", ink: "#ffffff" },
                  ]}
                />
                <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
                  <div>
                    <dt className="text-sm text-slate-600 dark:text-slate-400">Failing elements in total</dt>
                    <dd className="font-mono text-3xl font-semibold tabular-nums text-slate-900 dark:text-white">{a.failingElements}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-slate-600 dark:text-slate-400">Homepages with a critical violation</dt>
                    <dd className="font-mono text-3xl font-semibold tabular-nums text-slate-900 dark:text-white">{a.withCriticalViolation}</dd>
                  </div>
                </dl>
              </div>

              <div className={`${card} lg:col-span-3`}>
                <CardTitle sub="Number of homepages failing each rule at least once">Most common automated failures</CardTitle>
                <BarTable
                  caption="Most common axe-core failures, by number of homepages"
                  columns={[{ header: "Rule" }, { header: "WCAG" }]}
                  valueHeader="Homepages"
                  max={25}
                  rows={a.topRulesByHomepage.map((r) => ({ key: r.rule, cells: [r.label, r.wcag], value: r.homepages }))}
                />
                <p className="mt-6 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <Link href="/wcag/2-5-8" className={linkCls}>Target size</Link> is new in WCAG 2.2 and already the
                  2nd most common failure by homepage count, and 1st by element count ({a.targetSizeElements}).
                </p>
              </div>
            </div>

            <div className={`${card} mt-6`}>
              <CardTitle sub={`Nike alone accounts for ${a.heaviest[0].elements} of the ${a.failingElements} failing elements.`}>The heaviest automated results</CardTitle>
              <BarTable
                caption="Homepages with the most failing elements"
                columns={[{ header: "Company" }, { header: "What failed" }]}
                valueHeader="Failing elements"
                max={110}
                rows={a.heaviest.map((h) => ({ key: h.company, cells: [h.company, h.detail], value: h.elements }))}
              />
            </div>
          </section>

          {/* Manual */}
          <section aria-labelledby="manual-heading" className="pt-20">
            <SectionHead id="manual-heading" eyebrow="Manual review" title="What only a person catches">
              <p>
                {m.failedAtLeastOne} homepages failed at least one manual check, and the most common failures are
                structural basics. Only {m.passedAll} passed every manual check.
              </p>
            </SectionHead>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className={card}>
                <CardTitle sub="Number of homepages failing each scripted or manual check">Manual check failures</CardTitle>
                <BarTable
                  caption="Manual check failures, by number of homepages"
                  columns={[{ header: "Check" }]}
                  valueHeader="Homepages"
                  max={32}
                  rows={manualRows.map((r) => ({ key: r.key, cells: [r.label], value: r.value }))}
                />
                <p className="mt-6 rounded-xl bg-slate-50 p-5 text-sm leading-6 text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                  <Strong>{m.noSkipLink + m.brokenSkipTarget} homepages have no working skip link:</Strong> {m.noSkipLink} have
                  none, and on {m.brokenSkipTarget} the link points to a target that doesn&apos;t exist. See the{" "}
                  <Link href="/guides/skip-links" className={linkCls}>skip links guide</Link>.
                </p>
              </div>

              <div className={card}>
                <CardTitle sub={`axe checks that alt text exists, not that it makes sense. ${m.poorAltText} homepages were rated Poor on review. Examples:`}>
                  <span className="inline-flex items-center gap-2"><ImageOff aria-hidden="true" className="h-5 w-5 text-slate-500" />Alt text that passes axe but fails people</span>
                </CardTitle>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {data.altExamples.map((r) => (
                    <div key={r.company} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">{r.company}</dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {r.examples.map((e) => (
                          <code key={e} className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-slate-800 ring-1 ring-slate-200 [overflow-wrap:anywhere] dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700">
                            alt=&quot;{e}&quot;
                          </code>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Keyboard */}
            <div className={`${card} mt-6`}>
              <CardTitle sub={`Each one confirmed by following focus with real Tab presses or comparing screenshots. ${m.keyboardFromConsent} of the ${m.keyboardFocusVerified} come from consent banners or dialogs.`}>
                {m.keyboardFocusVerified} verified keyboard and focus problems
              </CardTitle>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.keyboard.map((r) => {
                  const kind = KEYBOARD_KIND[r.company]
                  const Icon = kind?.Icon ?? Lock
                  return (
                    <li key={r.company} className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
                      <p className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                        {kind?.label}
                      </p>
                      <h4 className="mt-3 font-semibold text-slate-900 dark:text-white">{r.company}</h4>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{r.issue}</p>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-6 text-sm leading-6 text-slate-600 dark:text-slate-400">
                The automatic focus-visibility check flagged far more pages ({m.focusVisibilityFlagged}). Spot checks
                showed it misfires on shadow-DOM headers (Humana, Prudential) and cookie overlays, so those flags were
                treated as leads, not failures.
              </p>
            </div>

            {/* Reflow + overlays */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className={card}>
                <CardTitle sub="Page loaded in a true 320 CSS px viewport, the same width as 1280px at 400% zoom">
                  <span className="inline-flex items-center gap-2"><MoveHorizontal aria-hidden="true" className="h-5 w-5 text-slate-500" />Reflow and zoom</span>
                </CardTitle>
                <dl className="grid grid-cols-3 gap-4">
                  {[
                    { v: String(m.reflowFail), k: "homepages scroll sideways at 320px" },
                    { v: "94px", k: "widest typical overflow (Elevance Health)" },
                    { v: "1000px", k: "Amazon's fixed desktop layout" },
                  ].map((s) => (
                    <div key={s.k} className="flex flex-col-reverse justify-end">
                      <dt className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">{s.k}</dt>
                      <dd className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-white sm:text-3xl">{s.v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Most failing homepages overflow by less than 100px, and on most of them the first screen looks fine.
                  The overflow comes from wide elements further down. Amazon&apos;s desktop homepage has no viewport
                  setting at all.
                </p>
                <p className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                  <ZoomIn aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                  <span>TJX is the only homepage that disables pinch-zoom (<code className="font-mono text-xs">user-scalable=no</code>).</span>
                </p>
              </div>

              <div className={card}>
                <CardTitle sub="Homepages loading an accessibility overlay widget script">
                  <span className="inline-flex items-center gap-2"><Layers aria-hidden="true" className="h-5 w-5 text-slate-500" />Only {m.overlays} use an overlay</span>
                </CardTitle>
                <div aria-hidden="true" className="f100-mark grid grid-cols-[repeat(25,minmax(0,1fr))] gap-[3px]">
                  {Array.from({ length: data.homepages }, (_, i) => (
                    <span key={i} className="aspect-square rounded-[2px]" style={{ background: i < m.overlays ? "var(--f-s1)" : "var(--f-empty)" }} />
                  ))}
                </div>
                <table className="mt-6 w-full text-sm">
                  <caption className="sr-only">Homepages that load an overlay widget, and the vendor</caption>
                  <thead className="sr-only">
                    <tr><th scope="col">Company</th><th scope="col">Overlay vendor</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.overlays.map((o) => (
                      <tr key={o.company}>
                        <th scope="row" className="py-2.5 text-left font-medium text-slate-900 dark:text-white">{o.company}</th>
                        <td className="py-2.5 text-right text-slate-700 dark:text-slate-300">{o.vendor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Enterprise Products and Coca-Cola both still fail reflow, and Coca-Cola also has Poor alt text.
                </p>
              </div>
            </div>
          </section>

          {/* Industry */}
          <section aria-labelledby="industry-heading" className="pt-20">
            <SectionHead id="industry-heading" eyebrow="By industry" title="Insurers lead, automotive and retail trail">
              <p>
                All {data.industries[0].homepages} insurance homepages had zero axe violations, and{" "}
                {data.industries[0].cleanBoth} of the {cleanBoth}{" "}cleanest homepages overall are insurers.
                Automotive &amp; transport and retail homepages carry the most barriers.
              </p>
            </SectionHead>
            <div className={`${card} mt-10`}>
              <BarTable
                caption="Results by industry, ordered by median barrier points"
                columns={[
                  { header: "Industry" },
                  { header: "Homepages", align: "right" },
                  { header: "Zero axe violations", align: "right" },
                  { header: "Clean on both", align: "right" },
                ]}
                valueHeader="Median barrier points"
                max={28}
                rows={data.industries.map((r) => ({ key: r.industry, cells: [r.industry, r.homepages, r.zeroAxe, r.cleanBoth], value: r.medianPoints }))}
              />
            </div>
            <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Industry groups are our own, broader than Fortune&apos;s sector labels; Berkshire Hathaway, for example, is
              counted under financial services rather than insurance. Groups are small (1 to 16 homepages), so read
              differences between neighbouring rows as directional. Even among insurers, MetLife, New York Life,
              Nationwide and Prudential fail manual checks that axe cannot see: missing skip links and main landmarks,
              poor alt text, or no h1.
            </p>
          </section>

          {/* Leaders and laggards */}
          <section aria-labelledby="leaders-heading" className="pt-20">
            <SectionHead id="leaders-heading" eyebrow="Leaders and laggards" title="Who passed, and who carries the most barriers" />
            <div className="mt-10 grid gap-6">
              <div className={card}>
                <CardTitle sub="Barrier points rank pages only: impact weight times failing elements per axe rule (at most 10 elements counted), plus 3 per failed manual check">
                  The 10 homepages with the most barrier points
                </CardTitle>
                <BarTable
                  caption="The 10 homepages with the most barrier points"
                  columns={[
                    { header: "Company" },
                    { header: "Fortune rank", align: "right" },
                    { header: "axe rules / elements", align: "right" },
                    { header: "Critical elements", align: "right" },
                    { header: "Manual check fails" },
                  ]}
                  valueHeader="Barrier points"
                  max={140}
                  rows={data.top10.map((r) => ({ key: r.company, cells: [r.company, r.rank, `${r.rules} / ${r.elements}`, r.critical, r.manual], value: r.points }))}
                />
                <p className="mt-4 text-xs leading-5 text-slate-600 dark:text-slate-400">
                  Tesla and Amazon were tested in a real Chrome from India because they blocked headless browsers;
                  Tesla&apos;s result includes a country-selector banner shown to that location.
                </p>
              </div>

              <div className={card}>
                <CardTitle sub="Passed the axe-core scan and every manual check. A floor, not proof of conformance.">
                  The {cleanBoth} clean homepages
                </CardTitle>
                <ul className="flex flex-wrap gap-2">
                  {data.leaders.map((name) => (
                    <li key={name} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-800 dark:border-slate-700 dark:text-slate-200">
                      {name}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {data.industries[0].cleanBoth} of the {cleanBoth} are insurers. Walmart is the only retailer on the list.
                </p>
              </div>
            </div>
          </section>

          {/* Practice */}
          <section aria-labelledby="practice-heading" className="pt-20">
            <SectionHead id="practice-heading" eyebrow="For practitioners" title="What this means for your own testing" />
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {PRACTICE.map((p) => (
                <li key={p.title} className={card}>
                  <h3 className="text-lg font-semibold leading-snug text-slate-900 dark:text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{p.body}</p>
                </li>
              ))}
              <li className="flex flex-col justify-between rounded-2xl bg-slate-900 p-6 text-white dark:bg-slate-800 sm:p-8">
                <div>
                  <h3 className="text-lg font-semibold leading-snug">Run the automated half on your own homepage.</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    The URL auditor runs axe-core against any page. Then do the manual half: Tab through it, zoom to
                    400%, and read the alt text.
                  </p>
                </div>
                <Link
                  href="/tools/url-accessibility-auditor"
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  Open the URL auditor <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </li>
            </ul>
          </section>

          {/* Method */}
          <section aria-labelledby="method-heading" className="grid gap-10 pt-20 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <div>
              <SectionHead id="method-heading" eyebrow="Method" title="How the homepages were tested" />
              <div className="mt-6 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  Each company&apos;s homepage was tested in one study on 14 and 15 November 2026, using ranks 1 to 100
                  of the 2026 Fortune 500 as published by{" "}
                  <a href="https://www.demandsage.com/fortune-500-companies/" className={linkCls}>DemandSage</a>. The
                  full automated and manual run took place on 14 November, and every company-specific finding on this
                  page was confirmed on the live site the next day.
                </p>
                <p>
                  92 homepages ran in headless Chrome with a US locale. Eight were tested in a real desktop Chrome from
                  India instead: seven served bot challenges to headless traffic (Amazon, Marathon Petroleum, StoneX,
                  Tesla, Eli Lilly, Oracle, American Airlines), and Nationwide rendered blank. Some of those eight showed
                  country prompts.
                </p>
                <p>
                  <Strong>Limits.</Strong> This covers one page per company during Black Friday promotions, and
                  homepages change daily: by the second day a few axe counts had shifted, most of all on Albertsons and
                  FedEx, so treat the figures as a snapshot. No screen reader testing was done, and no forms, checkout
                  flows, mobile apps or PDFs were tested. Zero axe violations is not WCAG conformance: automated rules
                  catch only a minority of issues, which is why the manual checks matter.
                </p>
                <p>
                  <Strong>Barrier points</Strong>, used only to rank pages, add up each failed axe rule&apos;s impact
                  weight (critical 4, serious 3, moderate 2, minor 1) times its failing elements, counting at most 10
                  elements per rule. Each failed manual check adds 3.
                </p>
              </div>
            </div>
            <div className="lg:pt-12">
              <div tabIndex={0} role="region" aria-label="How each check was done" className="overflow-x-auto rounded-lg border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800">
                <table className="w-full border-collapse text-sm">
                  <caption className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-white">How each check was done</caption>
                  <thead>
                    <tr>
                      {["Check", "How it was done"].map((h) => (
                        <th key={h} scope="col" className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {[
                      ["Automated scan", `axe-core ${data.axeVersion}, WCAG 2.0, 2.1 and 2.2 A and AA rules only (best-practice rules excluded), desktop viewport 1366×900`],
                      ["Keyboard", "30 real Tab presses from the top; focus order, traps and hidden focus stops logged; focus visibility measured by pixel difference, then the flagged cases verified by screenshot"],
                      ["Reflow", "Page loaded in a true 320 CSS px viewport (1280px at 400% zoom); fail = horizontal scrolling"],
                      ["Structure", "Skip link and whether its target exists, h1 count, main landmark, lang attribute"],
                      ["Alt text", "Up to 25 alt values per page read and rated Good, Fair or Poor"],
                      ["Links", "Repeated vague link text (“Learn more” ×2 or more) with no accessible-name override"],
                      ["Other", "Viewport zoom lock, autoplaying video without a pause control, overlay widget scripts"],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <th scope="row" className="whitespace-nowrap border-t border-slate-200 px-4 py-2 text-left align-top font-semibold text-slate-900 dark:border-slate-800 dark:text-white">{k}</th>
                        <td className="border-t border-slate-200 px-4 py-2 dark:border-slate-800">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Sources + FAQ */}
          <div className="grid gap-12 pt-20 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <section aria-labelledby="sources-heading">
              <h2 id="sources-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">Sources</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-700 dark:text-slate-300">
                <li>
                  DemandSage: <a href="https://www.demandsage.com/fortune-500-companies/" className={linkCls}>Fortune 500 Companies List (2026)</a>, ranks 1 to 100 used for scope
                </li>
                <li>
                  Deque: <a href="https://github.com/dequelabs/axe-core" className={linkCls}>axe-core</a>, version {data.axeVersion}, automated rules engine
                </li>
              </ul>
            </section>
            <div>
              <FaqSection faqs={FAQS} />
            </div>
          </div>

          <div className="pt-16">
            <RelatedContent content="Fortune 100 corporate homepage accessibility study axe-core keyboard overlays alt text" title="Related reading" maxItems={4} showDescriptions excludeUrl={ROUTE} />
          </div>
        </div>
      </article>
    </>
  )
}
