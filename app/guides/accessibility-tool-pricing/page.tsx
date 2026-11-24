import Link from "next/link"
import { GuideShell, GuideTable, guideMetadata } from "@/components/guides/guide-shell"
import type { FaqItem } from "@/components/seo/faq-section"

// Search Console, Nov 2026: "accessibility software pricing" (22nd), "how much do top
// accessibility testing tools cost?" (4th), "axe devtools pricing", "wave accessibility tool
// pricing" and "website accessibility checker pricing" had no page answering them.
// Every price below was read from the vendor's own pricing page on 24 Nov 2026. Vendors that
// publish no price are listed as quote-only rather than estimated. Re-check every row before
// restamping: these pages change without notice.

const route = "/guides/accessibility-tool-pricing"
const title = "Accessibility Testing Tool Pricing Compared (2026)"
const description =
  "What accessibility testing and monitoring tools cost in 2026, from vendors' own pricing pages: free tools, Pope Tech, WAVE API, Stark, SortSite, BrowserStack and overlays."
const datePublished = "2026-11-24"
const checked = "24 November 2026"

export const metadata = guideMetadata({
  route,
  title,
  description,
  datePublished,
  keywords: [
    "accessibility software pricing",
    "accessibility testing tools pricing",
    "axe devtools pricing",
    "wave accessibility tool pricing",
    "website accessibility checker pricing",
    "pope tech pricing",
    "siteimprove accessibility pricing",
    "accessibility monitoring cost",
  ],
})

const faqs: FaqItem[] = [
  {
    question: "How much do accessibility testing tools cost?",
    answer:
      "From nothing to tens of thousands of dollars a year. The core engines (axe-core, Lighthouse, Pa11y, WAVE and ARC Toolkit extensions, Accessibility Insights) are free. Published paid plans in November 2026 start around $25 a month for page-based monitoring (Pope Tech Team, billed annually), $149 for a perpetual desktop crawler licence (SortSite Standard), and $2,500 a year for Stark's team plan. Enterprise platforms such as Siteimprove, Level Access, Silktide and Evinced quote privately.",
  },
  {
    question: "How much is axe DevTools Pro?",
    answer:
      "Deque's pricing page did not show a Pro price when we checked on 24 November 2026; it offers a 14-day free trial and quote-based bundles. The axe DevTools browser extension and the axe-core engine are free.",
  },
  {
    question: "Is WAVE free?",
    answer:
      "The WAVE browser extensions and the wave.webaim.org checker are free. The WAVE API, for automated or bulk checks, is paid per credit: $0.04 a credit for 250 to 999 credits, $0.03 for 1,000 to 9,999 and $0.025 for 10,000 or more, with 100 free credits for new accounts. A basic page check uses one credit.",
  },
  {
    question: "Are overlays cheaper than testing tools?",
    answer:
      "Overlays such as accessiBe and UserWay start at about $490 a year, but they do not make a site conform to WCAG and sites using them are still sued. The money is better spent on a testing tool plus fixing the code. See our guide to overlay alternatives.",
  },
  {
    question: "Does a paid tool replace a manual audit?",
    answer:
      "No. Every tool here automates the same kind of checks, which cover a minority of WCAG criteria. Paid platforms add scheduling, dashboards, history and guided manual tests, but someone still has to test keyboard use, screen reader output and content quality.",
  },
]

const sections = [
  { id: "summary", title: "Prices at a glance" },
  { id: "free", title: "Free tools" },
  { id: "published", title: "Paid tools with public prices" },
  { id: "quote", title: "Quote-only platforms" },
  { id: "overlays", title: "Overlays" },
  { id: "choosing", title: "How to choose" },
]

export default function AccessibilityToolPricingPage() {
  return (
    <GuideShell
      route={route}
      crumb="Tool pricing"
      badge="Buyer's guide"
      title={title}
      h1="Accessibility testing tool pricing, compared"
      description={description}
      datePublished={datePublished}
      sections={sections}
      faqs={faqs}
      relatedContent="accessibility testing tools pricing axe wave pope tech siteimprove monitoring audit cost overlay alternatives testing tools benchmark ci cd"
      intro={
        <p>
          Most accessibility vendors hide their prices behind a demo. This page lists only what vendors publish on their
          own pricing pages, all checked on {checked}, and says plainly where a price is quote-only. Prices are in US
          dollars and exclude tax.
        </p>
      }
    >
      <h2 id="summary">Prices at a glance</h2>
      <GuideTable caption={`Accessibility tool prices from vendor pages, checked ${checked}`}>
        <thead>
          <tr>
            <th scope="col">Tool</th>
            <th scope="col">Cheapest paid plan</th>
            <th scope="col">Priced by</th>
            <th scope="col">Free option</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Pope Tech</td><td>$25/mo billed annually ($30 monthly)</td><td>Pages; unlimited users and sites</td><td>Yes, 25 pages and 1 site</td></tr>
          <tr><td>WAVE API (WebAIM)</td><td>$10 minimum (250 credits at $0.04)</td><td>Credits per page check</td><td>Extension free; 100 API credits</td></tr>
          <tr><td>SortSite (PowerMapper)</td><td>$149 perpetual (Standard)</td><td>Per user</td><td>10-page online demo</td></tr>
          <tr><td>Stark</td><td>From $198 a year per user (3-seat minimum)</td><td>Seats, then team plans</td><td>Free team account</td></tr>
          <tr><td>BrowserStack Accessibility</td><td>Shown as $1,099/mo billed annually for Test &amp; Monitor</td><td>Users and pages (configurable)</td><td>Not stated</td></tr>
          <tr><td>axe DevTools (Deque)</td><td>Pro price not shown</td><td>Quote for bundles</td><td>Extension and axe-core free</td></tr>
          <tr><td>Siteimprove, Level Access, Silktide, Evinced, ARC Platform, Acquia Optimize</td><td>Quote only</td><td>Varies</td><td>Free checks only</td></tr>
        </tbody>
      </GuideTable>

      <h2 id="free">Free tools</h2>
      <p>For a single site or a small team, these cover most automated checking at no cost:</p>
      <ul>
        <li><strong>axe DevTools extension</strong> and the open-source <strong>axe-core</strong> engine (Deque).</li>
        <li><strong>WAVE</strong> browser extensions and online checker (WebAIM).</li>
        <li><strong>Lighthouse</strong>, built into Chrome DevTools (runs a subset of axe rules).</li>
        <li><strong>Accessibility Insights</strong> for Web and Windows (Microsoft, open source), which adds guided manual tests.</li>
        <li><strong>ARC Toolkit</strong> browser extension (TPGi).</li>
        <li><strong>Pa11y</strong> and <strong>Pa11y CI</strong> for scripted and pipeline scans.</li>
      </ul>
      <p>
        On this site, the <Link href="/tools/contrast-checker">contrast checker</Link> is free, and the{" "}
        <Link href="/tools/url-accessibility-auditor">URL accessibility auditor</Link> gives one free scan a day without
        an account. To run the open-source engines on every
        pull request, follow our <Link href="/guides/accessibility-testing-ci-cd">CI/CD testing guide</Link>.
      </p>

      <h2 id="published">Paid tools with public prices</h2>
      <h3>Pope Tech</h3>
      <p>
        Built on WebAIM&rsquo;s WAVE engine and priced by pages scanned, with unlimited users and websites on every paid
        plan. Team from $25 a month billed annually ($30 month to month), Business Plus from $225 a month ($270 monthly),
        Professional from $400 a month billed annually, and Enterprise on quote. The free plan covers 25 pages on one
        site with two users. <a href="https://pope.tech/pricing/">Pope Tech pricing</a>.
      </p>
      <h3>WAVE API</h3>
      <p>
        Pay-as-you-go credits for running WAVE from your own scripts: $0.04 a credit for 250 to 999 (so $10 minimum),
        $0.03 for 1,000 to 9,999 and $0.025 for 10,000 or more. A basic check is one credit; advanced reports use two or
        three. New accounts get 100 free credits. <a href="https://wave.webaim.org/api/">WAVE API pricing</a>.
      </p>
      <h3>SortSite</h3>
      <p>
        A desktop crawler that checks accessibility alongside broken links and SEO. Perpetual per-user licences: Standard
        $149, Professional $349, Developer $849, with optional yearly upgrades from $37.25.{" "}
        <a href="https://www.powermapper.com/buy/all/sortsite/">SortSite pricing</a>.
      </p>
      <h3>Stark</h3>
      <p>
        Design-focused checks in Figma and the browser. Premium Pack from $198 a year per user with a three-seat minimum;
        team plans from $2,500 a year (Launch) and $8,000 a year (Grow), and Scale from $21,000 a year.{" "}
        <a href="https://www.getstark.co/pricing/">Stark pricing</a>.
      </p>
      <h3>BrowserStack Accessibility Testing</h3>
      <p>
        Its pricing page shows a configurable plan, displayed as $1,099 a month billed annually for Test &amp; Monitor when
        we checked, with the total changing by users and pages. Use its calculator for a real figure.{" "}
        <a href="https://www.browserstack.com/pricing?product=accessibility-testing">BrowserStack pricing</a>.
      </p>

      <h2 id="quote">Quote-only platforms</h2>
      <p>
        <strong>Siteimprove, Level Access, Silktide, Evinced, TPGi&rsquo;s ARC Platform and Acquia Optimize</strong>{" "}
        (formerly Monsido) publish no prices. Deque shows no axe DevTools Pro price and quotes its bundles, axe Monitor and
        axe Linter. Expect annual contracts priced by pages, domains or seats, and negotiate: list prices are rarely final.
        Ask every vendor for the number of pages included, how manual testing is handled, and whether VPATs or audit
        reports are extra.
      </p>

      <h2 id="overlays">Overlays</h2>
      <p>
        Overlay widgets are not testing tools, but they are often priced against them. accessiBe lists $490 a year (up to
        5,000 monthly visits), $1,490 and $3,990; UserWay lists widget plans from $490 a year and monitoring from $990 a
        year for 100 pages. AudioEye no longer publishes plan prices. An overlay does not make a site conform to WCAG; see{" "}
        <Link href="/guides/accessibility-overlay-alternatives">overlay alternatives that pass an audit</Link> and check
        any site with our <Link href="/tools/overlay-detector">overlay detector</Link>.
      </p>

      <h2 id="choosing">How to choose</h2>
      <ul>
        <li><strong>One site, small team:</strong> free extensions plus axe in CI. Add Pope Tech&rsquo;s free or Team plan for scheduled scans.</li>
        <li><strong>Agencies and many sites:</strong> page-based tools with unlimited sites (Pope Tech) or a desktop crawler (SortSite).</li>
        <li><strong>Design teams:</strong> Stark, alongside our <Link href="/tools/color-palette-generator">accessible palette generator</Link>.</li>
        <li><strong>Large organizations needing reporting and governance:</strong> run trials of two quote-only platforms against the same pages and compare findings, not dashboards.</li>
      </ul>
      <p>
        Whatever you buy, budget for manual testing. Our guide to{" "}
        <Link href="/guides/accessibility-audit-cost">accessibility audit costs</Link> covers what that costs.
      </p>
    </GuideShell>
  )
}
