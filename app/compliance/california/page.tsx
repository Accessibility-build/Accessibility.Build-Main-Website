import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

const ogTitle = encodeURIComponent("California Website Accessibility & the Unruh Act")

export const metadata: Metadata = {
  title: "California Website Accessibility & the Unruh Act",
  description:
    "How California's Unruh Civil Rights Act applies to websites: $4,000 minimum statutory damages per violation, SB 1186, state-court filing trends, and practical steps.",
  keywords: [
    "unruh act website accessibility",
    "california website accessibility law",
    "unruh civil rights act ada",
    "unruh act statutory damages",
    "california web accessibility lawsuit",
    "sb 1186 website",
    "california ada lawsuit",
  ],
  alternates: {
    canonical: "/compliance/california",
  },
  openGraph: {
    title: "California Website Accessibility & the Unruh Act",
    description:
      "How California's Unruh Civil Rights Act applies to websites: $4,000 minimum statutory damages per violation, SB 1186, state-court filing trends, and practical steps.",
    url: "/compliance/california",
    type: "article",
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Compliance`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "California Website Accessibility & the Unruh Act",
    description:
      "The Unruh Act's $4,000-per-violation statutory damages, why California drives web accessibility litigation, and how to reduce your exposure.",
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Compliance`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    question: "What is the Unruh Civil Rights Act?",
    answer:
      "The Unruh Civil Rights Act (California Civil Code Section 51) is California's broad anti-discrimination law. It guarantees all persons full and equal accommodations, advantages, facilities, privileges, and services in all business establishments in California, regardless of disability and other protected characteristics. Critically for websites, the statute provides that any violation of the ADA is automatically a violation of the Unruh Act — and unlike the ADA, Unruh authorizes money damages: a minimum of $4,000 in statutory damages per violation, plus attorney's fees.",
  },
  {
    question: "Does the Unruh Act apply to websites?",
    answer:
      "Yes, though the path matters. When an Unruh claim is premised on an ADA violation, courts apply the ADA's Title III framework — and California appellate courts have held that a website with a nexus to a physical business is covered, while a purely online-only business generally is not a 'place of public accommodation' for ADA purposes (Martinez v. Cot'n Wash). Plaintiffs suing online-only businesses instead pursue Unruh directly, which typically requires showing intentional discrimination. Businesses with any California physical presence connected to their website face the clearest exposure.",
  },
  {
    question: "How much are Unruh Act damages for an inaccessible website?",
    answer:
      "The statute sets a minimum of $4,000 in statutory damages per violation, with no proof of actual monetary harm required, plus attorney's fees for prevailing plaintiffs. Courts have treated each occasion a plaintiff encountered the barrier — for example, each visit to the website that was blocked — as potentially a separate violation, so demands frequently stack multiple $4,000 increments. Combined with fee exposure, even a single-plaintiff case commonly settles in the five figures.",
  },
  {
    question: "Do I need to be a California business to be sued under the Unruh Act?",
    answer:
      "No. The Unruh Act protects people in California, so an out-of-state company whose website serves California customers can be sued by a California plaintiff, typically in California state court. E-commerce companies headquartered elsewhere are named in Unruh website claims routinely. Whether a particular out-of-state defendant can be forced to litigate in California is a personal-jurisdiction question for counsel, but selling into the state is generally enough to create real exposure.",
  },
  {
    question: "What did SB 1186 change, and does it protect websites?",
    answer:
      "SB 1186 (2012) was California's response to abusive physical-access lawsuits. It banned pre-litigation monetary demands in construction-related accessibility claims, required detailed pleading, and reduced statutory damages for defendants who fix violations quickly — but those protections apply to construction-related claims about physical premises. Website accessibility claims are generally not 'construction-related,' so SB 1186's safe harbors and damage reductions largely do not apply to them. That asymmetry is one reason plaintiff activity migrated from ramps and parking lots to websites.",
  },
  {
    question: "Why are so many web accessibility lawsuits filed in California state court instead of federal court?",
    answer:
      "Two reasons. First, money: the ADA alone offers no damages, while Unruh adds $4,000 minimum statutory damages per violation plus fees, and state court is the natural forum for a state-law claim. Second, case law: after California appellate decisions held that online-only businesses are not ADA places of public accommodation, federal ADA filings in California collapsed — from thousands historically to a handful in 2025 — and plaintiffs refiled the same kinds of claims in state court under Unruh. California's litigation volume did not disappear; it moved.",
  },
  {
    question: "What standard should California businesses target for website accessibility?",
    answer:
      "WCAG 2.1 Level AA at minimum, and ideally WCAG 2.2 Level AA, the current version. No California statute names a technical standard for private websites, but Unruh claims are usually premised on ADA violations, and WCAG is the de facto measure of ADA website accessibility — it is what the DOJ codified for public entities, what settlements specify, and what courts reference. Conforming to WCAG 2.2 AA addresses both the federal and state theories at once.",
  },
]

export default function CaliforniaCompliancePage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Compliance", url: "https://accessibility.build/compliance" },
          { name: "California", url: "https://accessibility.build/compliance/california" },
        ]}
      />
      <FAQStructuredData faqs={faqs} />

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
              <Link href="/compliance" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Compliance
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-900 dark:text-white" aria-current="page">
                California
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="text-blue-300 font-semibold text-sm tracking-wider uppercase mb-4">
              Compliance Guide &bull; California State Law
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              California Website Accessibility &{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                the Unruh Act
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              California turns web accessibility from an injunction risk into a damages risk. The
              Unruh Civil Rights Act attaches a $4,000 minimum statutory penalty to every ADA
              violation — which is why California drives more web accessibility litigation exposure
              than any other state, even as its federal filings have nearly vanished.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Minimum Damages</p>
              <p className="text-2xl md:text-3xl font-bold text-white">$4,000</p>
              <p className="text-slate-400 text-xs mt-1">Per violation, plus attorney&apos;s fees</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">ADA Violation =</p>
              <p className="text-2xl md:text-3xl font-bold text-white">Unruh Violation</p>
              <p className="text-slate-400 text-xs mt-1">Cal. Civ. Code &sect; 51(f)</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">2025 CA Federal Filings</p>
              <p className="text-2xl md:text-3xl font-bold text-white">4</p>
              <p className="text-slate-400 text-xs mt-1">Litigation moved to state court</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Primary Forum</p>
              <p className="text-2xl md:text-3xl font-bold text-white">State Court</p>
              <p className="text-slate-400 text-xs mt-1">Unruh claims + demand letters</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* Unruh Act */}
          <section aria-labelledby="unruh-heading">
            <h2 id="unruh-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The Unruh Civil Rights Act: The ADA Plus Damages
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Unruh Civil Rights Act (Cal. Civ. Code &sect; 51) guarantees full and equal
              access to the accommodations, advantages, facilities, privileges, and services of
              &ldquo;all business establishments of every kind whatsoever&rdquo; in California.
              Two features make it the most consequential state accessibility law in the country:
            </p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">Automatic incorporation of the ADA.</strong>{" "}
                Section 51(f) provides that a violation of the ADA is, by itself, a violation of
                the Unruh Act. A plaintiff who can establish an ADA Title III website violation
                does not need to separately prove intentional discrimination — the federal
                violation carries the state claim.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Statutory damages.</strong>{" "}
                While the ADA offers only injunctive relief and attorney&apos;s fees, Unruh
                authorizes actual damages and a statutory minimum of{" "}
                <strong>$4,000 per violation</strong> (Cal. Civ. Code &sect; 52), with no proof of
                monetary harm required. Because each blocked encounter with a barrier can count as
                a violation, demands routinely stack multiples of $4,000.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The combination converts every colorable ADA website claim against a business serving
              Californians into a claim with a built-in price tag — the economic engine behind
              California&apos;s demand-letter and lawsuit volume. For the federal baseline that
              Unruh builds on, see our{" "}
              <Link href="/compliance/ada" className="text-blue-600 dark:text-blue-400 hover:underline">
                ADA website compliance guide
              </Link>
              .
            </p>
          </section>

          {/* Why California leads */}
          <section aria-labelledby="volume-heading">
            <h2 id="volume-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Why California Leads Web Accessibility Litigation
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              For years California traded places with New York as the top venue for federal ADA
              website lawsuits. The incentives are structural:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong>Damages change the math.</strong> An ADA-only case is worth an injunction
                and fees; an ADA-plus-Unruh case starts at $4,000 per violation before fees. That
                supports both higher settlements and a professionalized plaintiffs&apos; bar.
              </li>
              <li>
                <strong>Serial plaintiffs.</strong> A small number of repeat plaintiffs and firms
                file large portfolios of near-identical complaints, typically citing the same
                categories of WCAG failures — missing alt text, unlabeled controls, keyboard
                inaccessibility — across dozens of defendants.
              </li>
              <li>
                <strong>The nation&apos;s largest consumer market.</strong> Almost any national
                e-commerce brand serves California customers, so almost any national brand is a
                potential defendant.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The venue, however, has shifted dramatically. After California appellate courts held
              in <em>Martinez v. Cot&apos;n Wash</em> (2022) that an online-only business is not a
              &ldquo;place of public accommodation&rdquo; under ADA Title III, the federal pipeline
              dried up: California recorded just <strong>4 federal website accessibility filings
              in 2025</strong>, down from over a thousand in peak years. The claims did not go away
              — they moved to state court as Unruh actions, which is why combined federal-plus-state
              national totals exceed 5,000 even though the federal-only count is 3,117. Full data
              is in our{" "}
              <Link href="/research/accessibility-lawsuits" className="text-blue-600 dark:text-blue-400 hover:underline">
                accessibility lawsuit tracker
              </Link>
              .
            </p>
          </section>

          {/* SB 1186 */}
          <section aria-labelledby="sb1186-heading">
            <h2 id="sb1186-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              SB 1186: Reform That Mostly Missed the Web
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              In 2012, responding to a wave of abusive physical-access suits, California enacted
              SB 1186. It prohibited pre-litigation demands for money in{" "}
              <strong>construction-related accessibility claims</strong>, imposed heightened
              pleading requirements, required attorneys to send copies of demand letters to state
              oversight bodies, and created reduced statutory damages ($1,000&ndash;$2,000 instead
              of $4,000) for defendants — such as small businesses and those with recent CASp
              inspections — who correct violations quickly.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The catch: those protections are keyed to <em>construction-related</em> claims —
              physical premises, parking, ramps, counters. Website accessibility claims generally
              fall outside that definition, so the demand-letter restrictions and quick-fix damage
              reductions largely <strong>do not apply to web claims</strong>. The reform made
              physical-access suits harder and left digital claims comparatively unregulated —
              one more push behind the migration of California accessibility litigation from
              storefronts to websites.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Periodic legislative proposals have sought to extend cure periods or safe harbors to
              digital accessibility claims, but businesses should not plan around a grace period
              that does not currently exist in the statute.
            </p>
          </section>

          {/* Filing trends */}
          <section aria-labelledby="trends-heading">
            <h2 id="trends-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              State-Court Filing Trends
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              California web accessibility activity now runs primarily through three channels:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong>Unruh Act suits in state court</strong>, typically against businesses with
                a physical California presence connected to their website (the post-
                <em>Martinez</em> sweet spot), where the ADA-premised theory works cleanly.
              </li>
              <li>
                <strong>Direct Unruh claims against online-only businesses</strong>, which require
                showing intentional discrimination — a higher bar, but one plaintiffs attempt,
                often framed around a business&apos;s failure to act after notice of barriers.
              </li>
              <li>
                <strong>Demand letters that never become lawsuits.</strong> Because SB 1186&apos;s
                demand-letter restrictions do not clearly cover web claims, monetary demands remain
                common, and many resolve quietly for a payment plus a remediation promise.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              E-commerce and retail dominate defendant lists, mirroring the national pattern where
              they represent roughly 70% of filings. Restaurants, healthcare providers, and
              hospitality follow. See how California compares with other states&apos; regimes in
              our{" "}
              <Link href="/research/accessibility-laws" className="text-blue-600 dark:text-blue-400 hover:underline">
                accessibility laws tracker
              </Link>
              , or check your own exposure with the{" "}
              <Link href="/tools/ada-compliance-risks" className="text-blue-600 dark:text-blue-400 hover:underline">
                ADA compliance risk checker
              </Link>
              .
            </p>
          </section>

          {/* Practical steps */}
          <section aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Practical Steps for Businesses Serving California
            </h2>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-slate-900 dark:text-white">Treat WCAG 2.1/2.2 AA as your target.</strong>{" "}
                Unruh claims are usually premised on ADA violations, and WCAG is how those are
                measured. Start with our{" "}
                <Link href="/wcag" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG guide
                </Link>{" "}
                and the{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>
                .
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Audit before a plaintiff does.</strong>{" "}
                Serial filers work from automated scans of the same high-traffic flows — home page,
                product pages, cart, checkout. A professional{" "}
                <Link href="/services/accessibility-audits" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessibility audit
                </Link>{" "}
                covering those flows with manual and screen-reader testing removes the easy targets.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Fix fast when notified.</strong>{" "}
                Because each subsequent blocked visit can add another $4,000 increment, speed
                directly limits damages exposure. Establish an intake process so accessibility
                complaints reach someone empowered to act within days, not months.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Mind the physical-digital nexus.</strong>{" "}
                If you operate California stores, restaurants, or offices, your website&apos;s
                connection to those locations is what makes the ADA-premised Unruh theory strongest
                — store locators, reservations, online ordering, and in-store pickup flows deserve
                remediation priority.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Do not rely on overlays.</strong>{" "}
                Overlay widgets neither fix WCAG failures nor deter California plaintiffs; sites
                running them are sued regularly. Remediate at the code level.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Budget realistically.</strong>{" "}
                Between statutory damages, fee-shifting, and defense costs, litigating usually
                costs multiples of proactive remediation — our{" "}
                <Link href="/guides/ada-website-lawsuit-cost" className="text-blue-600 dark:text-blue-400 hover:underline">
                  lawsuit cost guide
                </Link>{" "}
                breaks down the numbers.
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section aria-label="Disclaimer">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Educational Content — Not Legal Advice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This page is provided for general educational purposes only and does not constitute
                legal advice. California accessibility law — including how the Unruh Act applies to
                websites and online-only businesses — continues to evolve through court decisions
                and legislation. For advice about your specific situation, consult a California
                attorney experienced in accessibility law.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="California Unruh Act website accessibility statutory damages ADA lawsuits WCAG compliance state law"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
