import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

const ogTitle = encodeURIComponent("ADA Website Compliance: Requirements & Deadlines")

export const metadata: Metadata = {
  title: "ADA Website Compliance: Requirements & Deadlines",
  description:
    "How the ADA applies to websites: Title II vs Title III, the DOJ web rule and WCAG 2.1 AA deadlines, the circuit split, lawsuit trends, and practical compliance steps.",
  keywords: [
    "ada website compliance",
    "ada title iii website",
    "ada title ii web rule",
    "wcag 2.1 aa legal requirement",
    "ada website lawsuit",
    "doj web accessibility rule",
    "ada demand letter",
    "website accessibility law",
  ],
  alternates: {
    canonical: "/compliance/ada",
  },
  openGraph: {
    title: "ADA Website Compliance: Requirements & Deadlines",
    description:
      "How the ADA applies to websites: Title II vs Title III, the DOJ web rule and WCAG 2.1 AA deadlines, the circuit split, lawsuit trends, and practical compliance steps.",
    url: "/compliance/ada",
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
    title: "ADA Website Compliance: Requirements & Deadlines",
    description:
      "Title II vs Title III for websites, the DOJ web rule's WCAG 2.1 AA standard and deadlines, the circuit split, and practical compliance steps.",
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
    question: "Is WCAG legally required under the ADA?",
    answer:
      "It depends on which title of the ADA covers you. For state and local governments (Title II), yes: the DOJ's 2024 web accessibility rule explicitly requires WCAG 2.1 Level AA for websites and mobile apps, on a tiered timeline based on population size. For private businesses (Title III), no regulation formally names WCAG — but courts, the DOJ, and virtually every settlement agreement use WCAG as the benchmark for whether a website is accessible. In practice, WCAG conformance is how ADA website compliance is measured everywhere.",
  },
  {
    question: "What WCAG level does the ADA require?",
    answer:
      "The DOJ Title II rule requires WCAG 2.1 Level AA. For Title III (private businesses), settlements and consent decrees overwhelmingly specify Level AA as well — Level A alone is almost never accepted as sufficient, and Level AAA is not expected. Many organizations now target WCAG 2.2 Level AA, the current version of the standard, since it includes everything in 2.1 AA plus additional criteria and future-proofs remediation work.",
  },
  {
    question: "Does the ADA apply to small business websites?",
    answer:
      "Generally yes. ADA Title III applies to businesses open to the public regardless of size — there is no small-business exemption comparable to the employment provisions of Title I (which only apply at 15+ employees). Small e-commerce shops, restaurants, medical practices, and local service businesses are regularly named in website accessibility lawsuits and demand letters. Small businesses may have more flexibility in arguing that specific fixes are not 'readily achievable,' but that is a case-by-case defense, not an exemption.",
  },
  {
    question: "Who can sue over an inaccessible website?",
    answer:
      "Any person with a disability who encounters barriers on a covered website can sue under ADA Title III, and the DOJ can also bring enforcement actions. Title III plaintiffs can obtain injunctive relief (an order to fix the site) and attorney's fees, but not damages — which is why many suits are filed in states like California and New York, where state civil rights laws (the Unruh Act, the NY Human Rights Laws) add statutory damages on top of ADA claims. A large share of filings come from a relatively small group of repeat plaintiffs and law firms.",
  },
  {
    question: "What is the difference between ADA Title II and Title III for websites?",
    answer:
      "Title II covers state and local government entities — cities, counties, public schools, transit agencies, courts — and now has a formal DOJ regulation requiring WCAG 2.1 AA for web content and mobile apps, with fixed compliance deadlines. Title III covers private businesses open to the public — stores, restaurants, banks, hotels, healthcare providers — and has no formal web regulation; instead, courts apply the ADA's general nondiscrimination requirements to websites, using WCAG as the practical measuring stick.",
  },
  {
    question: "What should I do if I receive an ADA website demand letter?",
    answer:
      "Do not ignore it — unanswered demand letters routinely become lawsuits. Involve counsel experienced in ADA digital accessibility, preserve evidence of your site's current state, and get an independent audit so you know your actual exposure rather than relying on the letter's claims. Most demand letters settle for a monetary payment plus a remediation commitment; the remediation is usually the more expensive and more important part. Fixing the site is also what prevents the follow-on lawsuit from the next plaintiff.",
  },
  {
    question: "Do accessibility overlays or widgets make a website ADA compliant?",
    answer:
      "No. Overlay widgets do not reliably fix underlying WCAG failures, and sites using overlays are sued regularly — in recent years roughly a fifth of website accessibility lawsuits have targeted sites that already had an overlay installed. Courts and the FTC have both rejected overlay marketing claims. Durable protection comes from remediating the site's actual code and content to WCAG 2.1/2.2 AA and maintaining it with ongoing testing.",
  },
  {
    question: "Has the ADA Title II web deadline changed?",
    answer:
      "Yes. The original 2024 rule set compliance dates of April 2026 for public entities serving populations of 50,000 or more and April 2027 for smaller entities. In April 2026, the DOJ issued an Interim Final Rule extending each deadline by one year — to April 26, 2027 and April 26, 2028 respectively. The WCAG 2.1 AA standard, the rule's scope, and its exceptions are unchanged; only the dates moved. The separate HHS Section 504 web rule for healthcare entities was not extended.",
  },
]

export default function AdaCompliancePage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Compliance", url: "https://accessibility.build/compliance" },
          { name: "ADA", url: "https://accessibility.build/compliance/ada" },
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
                ADA
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
              Compliance Guide &bull; United States Federal Law
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              ADA Website{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Compliance
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              How the Americans with Disabilities Act applies to websites and mobile apps: the
              DOJ&apos;s Title II web rule and its WCAG 2.1 AA standard, the Title III case-law
              landscape for private businesses, demand letters and lawsuit trends, and the
              practical steps that actually reduce risk.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Title II Standard</p>
              <p className="text-2xl md:text-3xl font-bold text-white">WCAG 2.1 AA</p>
              <p className="text-slate-400 text-xs mt-1">Codified by DOJ rule (2024)</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Title III Web Rule</p>
              <p className="text-2xl md:text-3xl font-bold text-white">None</p>
              <p className="text-slate-400 text-xs mt-1">Courts apply the ADA case by case</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">2025 Federal Lawsuits</p>
              <p className="text-2xl md:text-3xl font-bold text-white">3,117</p>
              <p className="text-slate-400 text-xs mt-1">+27% year over year</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Title III Damages</p>
              <p className="text-2xl md:text-3xl font-bold text-white">$0</p>
              <p className="text-slate-400 text-xs mt-1">Injunctions + fees; states add damages</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* Title II vs Title III */}
          <section aria-labelledby="titles-heading">
            <h2 id="titles-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Title II vs. Title III: Which Part of the ADA Covers Your Website?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Americans with Disabilities Act (1990) predates the commercial web, and its text
              never mentions websites. Digital accessibility obligations flow from two of its
              titles, and which one covers you determines whether you face a codified technical
              standard or a body of case law.
            </p>
            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Title II — Public Entities
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed list-disc pl-5">
                  <li>State and local governments: cities, counties, public schools and universities, transit agencies, courts, libraries.</li>
                  <li>Now has a <strong>formal DOJ web accessibility regulation</strong> with a named technical standard (WCAG 2.1 AA) and fixed deadlines.</li>
                  <li>Enforced by the DOJ and through private lawsuits; Section 504 of the Rehabilitation Act often applies in parallel to federally funded entities.</li>
                </ul>
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Title III — Private Businesses
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed list-disc pl-5">
                  <li>&ldquo;Places of public accommodation&rdquo;: retail, restaurants, hotels, banks, healthcare providers, entertainment venues — regardless of company size.</li>
                  <li><strong>No formal web regulation.</strong> Courts apply the ADA&apos;s general nondiscrimination mandate to websites, and the DOJ has long taken the position that the ADA covers web content.</li>
                  <li>Remedies are injunctive relief and attorney&apos;s fees — no damages under the ADA itself, which is why state-law claims are frequently attached.</li>
                </ul>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The practical upshot: a city&apos;s website has a regulation with a deadline, while a
              retailer&apos;s website has thousands of court decisions and settlements pointing at
              the same technical standard. Either way, the work converges on WCAG conformance. For
              a global view of how other jurisdictions regulate this, see our{" "}
              <Link href="/research/accessibility-laws" className="text-blue-600 dark:text-blue-400 hover:underline">
                accessibility laws tracker
              </Link>
              .
            </p>
          </section>

          {/* DOJ Title II rule */}
          <section aria-labelledby="title-ii-rule-heading">
            <h2 id="title-ii-rule-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The DOJ Title II Web Rule: WCAG 2.1 AA Becomes Law
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              In April 2024, the Department of Justice published its first-ever regulation setting
              a specific technical standard for web accessibility under the ADA. The rule requires
              state and local government websites and mobile apps to conform to{" "}
              <strong>WCAG 2.1 Level AA</strong>, with limited exceptions for things like archived
              content and certain third-party materials.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The original rule set compliance dates of <strong>April 2026</strong> for public
              entities serving populations of 50,000 or more and <strong>April 2027</strong> for
              smaller entities and special-district governments. In April 2026, the DOJ issued an
              Interim Final Rule extending each deadline by one year — to April 26, 2027 and
              April 26, 2028 respectively — without changing the standard, the scope, or the
              exceptions. Our{" "}
              <Link href="/guides/doj-title-ii-deadline-extension" className="text-blue-600 dark:text-blue-400 hover:underline">
                Title II deadline extension guide
              </Link>{" "}
              covers exactly what moved and what did not.
            </p>
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl p-6 my-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Healthcare entities: a separate, earlier deadline
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                The HHS Section 504 web accessibility rule — covering hospitals, providers, and
                other recipients of HHS funding — also requires WCAG 2.1 AA, and it was{" "}
                <strong>not extended</strong>. Its May 2026 compliance date has already arrived for
                most covered entities. Where an organization is covered by both rules, the earlier
                deadline controls. See our{" "}
                <Link href="/guides/section-504-web-accessibility-deadline" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Section 504 deadline guide
                </Link>
                .
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Beyond its direct reach, the Title II rule matters for everyone: it is the federal
              government&apos;s clearest statement that WCAG 2.1 AA is what &ldquo;accessible&rdquo;
              means under the ADA, and plaintiffs&apos; counsel and courts cite it as persuasive
              authority in private-sector Title III cases.
            </p>
          </section>

          {/* Title III case law */}
          <section aria-labelledby="title-iii-heading">
            <h2 id="title-iii-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Title III Case Law: The Circuit Split Over Websites
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Because there is no Title III web regulation, the private-sector rules have been
              built by courts — and the federal circuits do not fully agree on when a website is a
              &ldquo;place of public accommodation.&rdquo;
            </p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong>Nexus approach (Ninth Circuit and others):</strong> the ADA covers a
                website when it has a sufficient connection to a physical place of business. In{" "}
                <em>Robles v. Domino&apos;s Pizza</em>, the Ninth Circuit held the ADA applied to
                Domino&apos;s website and app because they connected customers to physical
                restaurants; the Supreme Court declined to review the decision.
              </li>
              <li>
                <strong>Broad approach (First Circuit line of cases; many SDNY/EDNY decisions):</strong>{" "}
                public accommodations are not limited to physical spaces, so a website can be
                covered on its own. This reading has made New York federal courts a magnet for
                filings, including against online-only businesses.
              </li>
              <li>
                <strong>Physical-place approach (Eleventh Circuit and similar reasoning elsewhere):</strong>{" "}
                courts have been more skeptical that a standalone website is itself a public
                accommodation. The Eleventh Circuit&apos;s <em>Gil v. Winn-Dixie</em> opinion —
                later vacated as moot, but still influential in reasoning — reflected this narrower
                view.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The split affects <em>where</em> cases get filed far more than <em>whether</em>{" "}
              businesses get sued: plaintiffs simply choose plaintiff-friendly venues (New York
              federal courts, California state courts). Any business selling nationally should
              assume it can be reached in a favorable forum. See our state-specific guides for{" "}
              <Link href="/compliance/new-york" className="text-blue-600 dark:text-blue-400 hover:underline">
                New York
              </Link>{" "}
              and{" "}
              <Link href="/compliance/california" className="text-blue-600 dark:text-blue-400 hover:underline">
                California
              </Link>
              .
            </p>
          </section>

          {/* Demand letters and lawsuits */}
          <section aria-labelledby="lawsuits-heading">
            <h2 id="lawsuits-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Demand Letters and the Lawsuit Landscape
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Website accessibility litigation is high-volume and heavily concentrated. Federal
              courts saw <strong>3,117 website accessibility lawsuits in 2025</strong> — up 27%
              year over year — and more than 5,000 cases including state-court filings, with 2026
              on pace to set another record. E-commerce and retail account for roughly 70% of
              filings, and a large share of cases come from repeat plaintiffs represented by a
              small group of law firms. Our{" "}
              <Link href="/research/accessibility-lawsuits" className="text-blue-600 dark:text-blue-400 hover:underline">
                accessibility lawsuit tracker
              </Link>{" "}
              maintains the full dataset by year, state, and industry.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Formal lawsuits are only part of the picture. Thousands of{" "}
              <strong>demand letters</strong> are sent each year that never appear in court
              statistics: a letter asserts your site violates the ADA (often attaching an automated
              scan), demands a settlement payment and remediation, and threatens suit. Because ADA
              Title III offers prevailing plaintiffs attorney&apos;s fees — and state laws like
              California&apos;s Unruh Act add statutory damages — settling is usually cheaper than
              litigating, which sustains the volume.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Defense costs, settlement ranges, and total exposure are covered in detail in our{" "}
              <Link href="/guides/ada-website-lawsuit-cost" className="text-blue-600 dark:text-blue-400 hover:underline">
                ADA website lawsuit cost guide
              </Link>
              . To gauge your own exposure, try our free{" "}
              <Link href="/tools/ada-compliance-risks" className="text-blue-600 dark:text-blue-400 hover:underline">
                ADA compliance risk checker
              </Link>
              .
            </p>
          </section>

          {/* WCAG as de facto standard */}
          <section aria-labelledby="wcag-heading">
            <h2 id="wcag-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              WCAG: The De Facto Standard for ADA Compliance
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Web Content Accessibility Guidelines are not a law, but they are the measuring
              stick every serious actor uses. The DOJ codified WCAG 2.1 AA in the Title II rule and
              has required WCAG conformance in Title III settlement agreements for years. Courts
              reference WCAG when framing injunctive relief, expert witnesses audit against it, and
              essentially every private settlement specifies WCAG 2.1 or 2.2 Level AA as the
              remediation target.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              For teams starting out: learn the framework in our{" "}
              <Link href="/wcag" className="text-blue-600 dark:text-blue-400 hover:underline">
                WCAG guide
              </Link>{" "}
              and work through the{" "}
              <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                WCAG 2.2 checklist
              </Link>
              . Targeting 2.2 AA satisfies every 2.1 AA obligation while covering the current
              version of the standard.
            </p>
          </section>

          {/* Practical steps */}
          <section aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Practical Steps Toward ADA Website Compliance
            </h2>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-slate-900 dark:text-white">Audit against WCAG 2.1/2.2 AA.</strong>{" "}
                Combine automated scanning with manual and assistive-technology testing — automated
                tools alone catch only a fraction of issues. A professional{" "}
                <Link href="/services/accessibility-audits" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessibility audit
                </Link>{" "}
                gives you a defensible baseline.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Prioritize by user impact and legal exposure.</strong>{" "}
                Fix blockers first: keyboard traps, missing form labels, inaccessible checkout and
                navigation, missing alt text on functional images. These are the failures demand
                letters cite most.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Remediate the code, not the symptoms.</strong>{" "}
                Skip overlay widgets — they do not confer compliance and appear frequently in
                lawsuits. Fix templates, components, and content at the source.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Publish an accessibility statement</strong>{" "}
                with a working feedback channel, and actually respond to reports. Documented
                responsiveness matters in negotiations and in court.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Build accessibility into your process.</strong>{" "}
                Add automated checks to CI, test new features before release, train designers and
                developers, and re-audit periodically. Compliance is a practice, not a milestone.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Keep records.</strong>{" "}
                Audit reports, remediation tickets, and testing logs demonstrate good-faith,
                ongoing effort — often the difference between a quick resolution and an expensive
                one.
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
                legal advice. ADA case law varies by circuit and changes over time, and regulations
                and deadlines can be amended. For advice about your specific situation, consult an
                attorney experienced in digital accessibility law.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="ADA website compliance Title II Title III WCAG legal requirements lawsuits demand letters accessibility audit"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
