import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { PageByline } from "@/components/seo/page-byline"
import { RelatedContent } from "@/components/seo/related-content"
import { KeyFacts } from "@/components/research/key-facts"
import { DatasetDownloads } from "@/components/research/dataset-downloads"
import { clampDescription } from "@/lib/metadata"
import data from "@/lib/data/agent-readiness-2026.json"

// Can an AI agent use your website? We measured it.
//
// Browser-use agents read a page through its accessibility tree, the same
// structure a screen reader uses. A control with no accessible name reaches
// the agent as a bare "button" it cannot tell apart from any other. This study
// takes the ARIA snapshot Playwright exposes (the agent's view) of the home
// pages of two defined samples and counts what is nameless. The per-site data
// is published, the method is stated, and the limits are stated with it.

const ROUTE = "/research/ai-agent-readiness"
const pageTitle = "AI Agent Readiness: Can an Agent Use Your Website?"
const pageDescription =
  "We took the accessibility-tree view an AI browser agent receives of the home pages of the FTSE 100 and UK local authorities and counted the controls with no name, the images without alt text and the unlabelled fields. Per-site results and method published."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "AI agent accessibility",
    "browser-use agent accessibility tree",
    "agent readiness website",
    "accessible name agents",
    "FTSE 100 website accessibility",
    "UK council website accessibility",
    "unnamed buttons study",
    "agentic web accessibility",
    "accessibility tree study 2026",
    "Claude browser use accessibility",
  ],
  alternates: { canonical: ROUTE },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Can an AI agent use your website?")}&section=Research`,
        width: 1200,
        height: 630,
        alt: "AI agent readiness study",
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Research", url: "https://accessibility.build/research" },
  { name: "AI agent readiness", url: `https://accessibility.build${ROUTE}` },
]

interface AgentSite {
  name: string
  host: string
  controls: number
  unnamed: number
  unnamedPct: number
  imagesMissingAlt: number
  images: number
  fieldsUnlabeled: number
  fields: number
  lang: boolean
  h1: number
  skipLink: boolean
  mainLandmark: boolean
  iframesNoTitle: number
  overlay: boolean
}

interface Group {
  label: string
  sampled: number
  measured: number
  excluded: number
  controls: number
  controlsUnnamed: number
  controlsUnnamedPct: number
  sitesWithUnnamedControl: number
  sitesWithUnnamedControlPct: number
  medianUnnamedPct: number
  byRole: Record<string, { named: number; unnamed: number }>
  images: number
  imagesMissingAlt: number
  sitesWithImagesMissingAlt: number
  fields: number
  fieldsUnlabeled: number
  sitesWithFieldsUnlabeled: number
  sitesNoLang: number
  sitesNoH1: number
  sitesMultipleH1: number
  sitesSkipLink: number
  sitesNoMainLandmark: number
  sitesUntitledIframes: number
  sitesOverlay: number
  sites: AgentSite[]
}

function pct(n: number, d: number) {
  return d ? `${Math.round((100 * n) / d)}%` : "n/a"
}

const FAQS = [
  {
    question: "Why does an AI agent care whether a button has a name?",
    answer:
      "Browser-use agents from Anthropic, OpenAI and Google act on a page through its accessibility tree, where every control is a role plus a name. A button with no name reaches the agent as 'button' and nothing else, so the agent cannot reliably choose it, describe it, or report what it did. It is the same failure a screen reader user hits, which is why the fix is the same: an accessible name.",
  },
  {
    question: "How was the agent's view measured?",
    answer:
      "Each home page was loaded in headless Chromium with Playwright, and the ARIA snapshot of the page body was taken: a text rendering of the accessibility tree, one line per node, in which a control either carries a quoted name or does not. Controls counted are buttons, links, text boxes, checkboxes, radios, comboboxes, menu items, tabs, switches, sliders and search boxes. Sites that returned an error, blocked automation or produced a near-empty tree were excluded and the count of exclusions is reported.",
  },
  {
    question: "Is this a WCAG audit?",
    answer:
      "No. It is one automated measurement of the home page, taken once, of the defects an agent hits first. It says nothing about checkout, forms beyond the home page, keyboard traps, focus visibility or content. A site with zero unnamed controls here can still be unusable; a site with several may be fine everywhere else. Treat it as a screening measure with the method published so it can be repeated.",
  },
  {
    question: "Why FTSE 100 companies and UK councils?",
    answer:
      "Both are public, defined lists that anyone can reproduce from Wikidata, and they represent two different obligations: councils have had a legal duty to meet WCAG since 2020 under the Public Sector Bodies Accessibility Regulations, while listed companies have only the general duty of the Equality Act and, where they sell into the EU, the European Accessibility Act.",
  },
]

function GroupSummary({ g }: { g: Group }) {
  const roles = Object.entries(g.byRole).sort((a, b) => b[1].unnamed - a[1].unnamed)
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full border-collapse text-sm">
          <caption className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
            {g.label}: {g.measured} home pages measured ({g.excluded} of {g.sampled} excluded)
          </caption>
          <tbody className="text-slate-700 dark:text-slate-300">
            {[
              ["Controls in the agent's view", g.controls.toLocaleString()],
              ["Controls with no name", `${g.controlsUnnamed.toLocaleString()} (${g.controlsUnnamedPct}%)`],
              ["Sites with at least one nameless control", `${g.sitesWithUnnamedControl} (${g.sitesWithUnnamedControlPct}%)`],
              ["Images with no alt attribute", `${g.imagesMissingAlt.toLocaleString()} of ${g.images.toLocaleString()}, on ${g.sitesWithImagesMissingAlt} sites`],
              ["Form fields with no label", `${g.fieldsUnlabeled} of ${g.fields}, on ${g.sitesWithFieldsUnlabeled} sites`],
              ["Sites with no language declared", `${g.sitesNoLang} (${pct(g.sitesNoLang, g.measured)})`],
              ["Sites with no h1", `${g.sitesNoH1} (${pct(g.sitesNoH1, g.measured)})`],
              ["Sites with more than one h1", `${g.sitesMultipleH1} (${pct(g.sitesMultipleH1, g.measured)})`],
              ["Sites with a skip link", `${g.sitesSkipLink} (${pct(g.sitesSkipLink, g.measured)})`],
              ["Sites with no main landmark", `${g.sitesNoMainLandmark} (${pct(g.sitesNoMainLandmark, g.measured)})`],
              ["Sites with an untitled iframe", `${g.sitesUntitledIframes} (${pct(g.sitesUntitledIframes, g.measured)})`],
              ["Sites running an accessibility overlay", `${g.sitesOverlay} (${pct(g.sitesOverlay, g.measured)})`],
            ].map(([k, v]) => (
              <tr key={k}>
                <th scope="row" className="border-t border-slate-200 px-4 py-2.5 text-left font-normal dark:border-slate-800">{k}</th>
                <td className="border-t border-slate-200 px-4 py-2.5 text-right font-mono tabular-nums text-slate-900 dark:border-slate-800 dark:text-white">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full border-collapse text-sm">
          <caption className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
            {g.label}: nameless controls by role
          </caption>
          <thead>
            <tr>
              {["Role", "Named", "Unnamed", "Unnamed share"].map((h, i) => (
                <th key={h} scope="col" className={`border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 ${i ? "text-right" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-slate-300">
            {roles.map(([role, v]) => (
              <tr key={role}>
                <th scope="row" className="border-t border-slate-200 px-4 py-2 text-left font-normal dark:border-slate-800">{role}</th>
                <td className="border-t border-slate-200 px-4 py-2 text-right font-mono tabular-nums dark:border-slate-800">{v.named.toLocaleString()}</td>
                <td className={`border-t border-slate-200 px-4 py-2 text-right font-mono tabular-nums dark:border-slate-800 ${v.unnamed ? "font-semibold text-rose-800 dark:text-rose-300" : ""}`}>{v.unnamed}</td>
                <td className="border-t border-slate-200 px-4 py-2 text-right font-mono tabular-nums dark:border-slate-800">{pct(v.unnamed, v.named + v.unnamed)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SiteTable({ g, id }: { g: Group; id: string }) {
  return (
    <details className="mt-6 rounded-lg border border-slate-200 dark:border-slate-800">
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">
        Every measured site in {g.label} ({g.sites.length}), worst first
      </summary>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm" id={id}>
          <caption className="sr-only">Per-site measurements for {g.label}</caption>
          <thead>
            <tr>
              {["Site", "Controls", "Unnamed", "Images missing alt", "Fields unlabelled", "Lang", "h1", "Skip link", "Main", "Overlay"].map((h, i) => (
                <th key={h} scope="col" className={`border-y border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 ${i ? "text-right" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-slate-300">
            {g.sites.map((s) => (
              <tr key={s.host + s.name}>
                <th scope="row" className="whitespace-nowrap border-b border-slate-200 px-3 py-1.5 text-left font-normal dark:border-slate-800">
                  {s.name} <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{s.host}</span>
                </th>
                <td className="border-b border-slate-200 px-3 py-1.5 text-right font-mono tabular-nums dark:border-slate-800">{s.controls}</td>
                <td className={`border-b border-slate-200 px-3 py-1.5 text-right font-mono tabular-nums dark:border-slate-800 ${s.unnamed ? "font-semibold text-rose-800 dark:text-rose-300" : ""}`}>{s.unnamed} ({s.unnamedPct}%)</td>
                <td className={`border-b border-slate-200 px-3 py-1.5 text-right font-mono tabular-nums dark:border-slate-800 ${s.imagesMissingAlt ? "font-semibold text-rose-800 dark:text-rose-300" : ""}`}>{s.imagesMissingAlt} / {s.images}</td>
                <td className={`border-b border-slate-200 px-3 py-1.5 text-right font-mono tabular-nums dark:border-slate-800 ${s.fieldsUnlabeled ? "font-semibold text-rose-800 dark:text-rose-300" : ""}`}>{s.fieldsUnlabeled} / {s.fields}</td>
                <td className="border-b border-slate-200 px-3 py-1.5 text-right dark:border-slate-800">{s.lang ? "Yes" : "No"}</td>
                <td className="border-b border-slate-200 px-3 py-1.5 text-right font-mono tabular-nums dark:border-slate-800">{s.h1}</td>
                <td className="border-b border-slate-200 px-3 py-1.5 text-right dark:border-slate-800">{s.skipLink ? "Yes" : "No"}</td>
                <td className="border-b border-slate-200 px-3 py-1.5 text-right dark:border-slate-800">{s.mainLandmark ? "Yes" : "No"}</td>
                <td className="border-b border-slate-200 px-3 py-1.5 text-right dark:border-slate-800">{s.overlay ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

export default function AgentReadinessPage() {
  const f = data.groups.ftse100 as unknown as Group
  const c = data.groups.councils as unknown as Group
  const measured = f.measured + c.measured
  const bothUnnamed = f.sitesWithUnnamedControl + c.sitesWithUnnamedControl
  const bothControls = f.controls + c.controls
  const bothUnnamedControls = f.controlsUnnamed + c.controlsUnnamed
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema
        route={ROUTE}
        title={pageTitle}
        description={pageDescription}
        datePublished="2026-09-03"
        section="Research"
        author={{ name: "The Accessibility.build team", url: "https://accessibility.build/about", type: "Organization" }}
      />
      <FAQStructuredData faqs={FAQS} />

      <article className="bg-white pb-20 dark:bg-slate-950">
        <header className="border-b border-slate-200 bg-slate-50 pt-12 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container-wide py-10 lg:py-14">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="/" className="hover:text-teal-700 dark:hover:text-teal-300">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/research" className="hover:text-teal-700 dark:hover:text-teal-300">Research</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 dark:text-white">AI agent readiness</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Research &middot; Original measurement, September 2026
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Can an AI agent use your website? We measured {measured} home pages
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              Browser-use agents read a page through its accessibility tree, the same structure a
              screen reader uses. We took that view of the home pages of the FTSE 100 and of UK
              local authorities and counted what an agent cannot name: buttons and links with no
              accessible name, images with no alt text, fields with no label. The per-site results
              are below and downloadable; the method is stated so it can be repeated.
            </p>
            <div className="mt-6">
              <PageByline route={ROUTE} reviewer={{ name: "The Accessibility.build team", href: "/about", credential: "" }} />
            </div>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-6xl py-12">
            <KeyFacts
              title="What an agent sees"
              facts={[
                { value: pct(bothUnnamed, measured), label: `of ${measured} measured home pages expose at least one control with no name to an agent`, source: "This study", asOf: data.measuredOn },
                { value: `${((100 * bothUnnamedControls) / bothControls).toFixed(1)}%`, label: `of ${bothControls.toLocaleString()} controls in the agent's view have no name`, source: "This study", asOf: data.measuredOn },
                { value: `${f.sitesWithUnnamedControlPct}%`, label: `of measured FTSE 100 home pages have a nameless control, against ${c.sitesWithUnnamedControlPct}% of councils`, source: "This study", asOf: data.measuredOn },
                { value: pct(f.sitesWithImagesMissingAlt + c.sitesWithImagesMissingAlt, measured), label: "of measured home pages have at least one image with no alt attribute", source: "This study", asOf: data.measuredOn },
                { value: pct(f.sitesSkipLink + c.sitesSkipLink, measured), label: "of measured home pages have a skip link; WebAIM found 17.1% across the top million", source: "This study; WebAIM Million 2026", sourceHref: "https://webaim.org/projects/million/", asOf: data.measuredOn },
                { value: `${f.sitesOverlay + c.sitesOverlay}`, label: "measured home pages running a known accessibility overlay", source: "This study", asOf: data.measuredOn },
              ]}
            />

            <section aria-labelledby="why-heading" className="mt-12 max-w-[68ch]">
              <h2 id="why-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Why an agent and a screen reader fail on the same page
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  Anthropic&apos;s browser-use tool, generally available since 19 August 2026, operates a
                  page &ldquo;through its structure: the accessibility tree, elements, forms, and
                  tabs&rdquo;. OpenAI&apos;s computer-using agent and Google&apos;s Mariner ground their
                  actions in the same tree plus a screenshot. The tree is what a screen reader has
                  always read: for each control, a role and a name. When the name is missing, a
                  screen reader announces &ldquo;button&rdquo; and an agent receives{" "}
                  <code className="font-mono text-sm">- button</code>. Neither can tell it from the next
                  one.
                </p>
                <p>
                  This is not a new class of defect. It is{" "}
                  <Link href="/wcag/4-1-2" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">WCAG 4.1.2</Link>,
                  the criterion pleaded in{" "}
                  <Link href="/cases/robles-v-dominos" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">Robles v. Domino&apos;s</Link>,
                  and it is what WebAIM found on 30.6% of the top million home pages (empty buttons)
                  and 46.3% (empty links) in 2026. What has changed is who is affected. Agentic
                  traffic passed half of all internet traffic in June 2026, and an agent acting for
                  a sighted customer fails on the same nameless button a blind customer does.
                </p>
              </div>
            </section>

            <section aria-labelledby="method-heading" className="mt-12 max-w-[68ch]">
              <h2 id="method-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Method
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  Two samples, both reproducible from Wikidata queries: companies in the FTSE 100
                  index with an official website, and UK local authorities (unitary, district,
                  county and London borough councils) with an official website. Each home page was
                  loaded once on {data.measuredOn} in headless Chromium through Playwright at
                  1280 by 900, waited 2.5 seconds after DOM ready, and its ARIA snapshot was taken.
                </p>
                <p>
                  In the snapshot every control is a line such as{" "}
                  <code className="font-mono text-sm">- button &quot;Search&quot;</code> or, when the
                  accessible name computation yields nothing,{" "}
                  <code className="font-mono text-sm">- button</code>. We counted both for buttons,
                  links, text boxes, checkboxes, radios, comboboxes, menu items, tabs, switches,
                  sliders and search boxes. Separately, in the DOM, we counted images with no alt
                  attribute, form fields with no label by any mechanism, the language attribute,
                  h1 count, skip links, a main landmark, untitled iframes and markers of known
                  accessibility overlays.
                </p>
                <p>
                  Sites that returned an HTTP error, blocked automated browsers, or produced a tree
                  of fewer than twenty lines were excluded rather than scored, and the number
                  excluded is reported for each group. A site can be excluded and still be
                  inaccessible; we simply could not measure it.
                </p>
              </div>
            </section>

            <section aria-labelledby="results-heading" className="mt-12">
              <h2 id="results-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Results
              </h2>
              <h3 className="mt-8 text-xl font-semibold text-slate-900 dark:text-white">FTSE 100</h3>
              <GroupSummary g={f} />
              <SiteTable g={f} id="ftse-sites" />
              <h3 className="mt-10 text-xl font-semibold text-slate-900 dark:text-white">UK local authorities</h3>
              <GroupSummary g={c} />
              <SiteTable g={c} id="council-sites" />
            </section>

            <section aria-labelledby="reading-heading" className="mt-12 max-w-[68ch]">
              <h2 id="reading-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What to take from it
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">The public sector, which has had a legal duty since 2020, does markedly better.</strong>{" "}
                  Councils expose a nameless control on {c.sitesWithUnnamedControlPct}% of measured
                  home pages against {f.sitesWithUnnamedControlPct}% for FTSE 100 companies, and their
                  nameless share of all controls is {c.controlsUnnamedPct}% against {f.controlsUnnamedPct}%.
                  The duty, the monitoring and the mandatory statement appear to have worked on the
                  defect class an agent meets first.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">The defects are few per site and easy to find.</strong>{" "}
                  Most sites with a problem have one to five nameless controls, usually icon buttons
                  and image links in the header or a carousel. Any of the four checkers in our{" "}
                  <Link href="/research/accessibility-testing-tools-benchmark" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">tools benchmark</Link>{" "}
                  reports them, and the{" "}
                  <Link href="/tools/accessible-name-previewer" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">accessible name previewer</Link>{" "}
                  shows exactly what the agent receives for any snippet.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">This is a floor, not a verdict.</strong>{" "}
                  A home page with every control named can still hide an unusable checkout, and the
                  measurement says nothing about keyboard traps, focus visibility, timing or
                  content. It measures the one thing an agent cannot work around: a control it
                  cannot name.
                </p>
              </div>
            </section>

            <DatasetDownloads
              dataset="agent-readiness"
              name="AI agent readiness of UK home pages, 2026"
              description="Per-site measurements of the accessibility-tree view of FTSE 100 and UK local authority home pages: nameless controls by role, images without alt text, unlabelled fields, language, headings, skip links, landmarks, iframes and overlays."
              pageUrl={`https://accessibility.build${ROUTE}`}
              datePublished="2026-09-03"
              dateModified={data.measuredOn}
              temporalCoverage="2026-09"
              attribution="Accessibility.build measurement; samples from Wikidata"
              tables={[
                { key: "ftse100", label: "FTSE 100 home pages" },
                { key: "councils", label: "UK local authority home pages" },
              ]}
            />

            <section aria-labelledby="faq-heading" className="mt-14 max-w-[68ch]">
              <h2 id="faq-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">Frequently asked questions</h2>
              <dl className="mt-6 space-y-6">
                {FAQS.map((q) => (
                  <div key={q.question}>
                    <dt className="font-semibold text-slate-900 dark:text-white">{q.question}</dt>
                    <dd className="mt-2 leading-7 text-slate-700 dark:text-slate-300">{q.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="mt-14">
              <RelatedContent content="AI agent accessibility tree accessible name screen reader button link study" title="Related reading" maxItems={4} showDescriptions />
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
