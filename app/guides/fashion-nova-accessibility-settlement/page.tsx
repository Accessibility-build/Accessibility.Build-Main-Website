import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  FAQStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title:
    "The $5.15M Fashion Nova Web Accessibility Settlement: What It Means for E-Commerce",
  description:
    "Alcazar v. Fashion Nova settled for $5.15 million in 2025 — the second-largest web accessibility settlement on record. A breakdown of the case, the ADA and California Unruh Act claims, the class structure, WCAG 2.1 remediation terms, and the lessons for every online retailer.",
  keywords: [
    "Fashion Nova settlement",
    "Fashion Nova accessibility lawsuit",
    "Alcazar v Fashion Nova",
    "5.15 million web accessibility settlement",
    "web accessibility class action",
    "ADA website settlement",
    "Unruh Act website lawsuit",
    "ecommerce accessibility lawsuit",
    "screen reader lawsuit",
    "largest ADA website settlement",
  ],
  alternates: {
    canonical:
      "https://accessibility.build/guides/fashion-nova-accessibility-settlement",
  },
  openGraph: {
    title:
      "The $5.15M Fashion Nova Web Accessibility Settlement: What It Means",
    description:
      "Alcazar v. Fashion Nova settled for $5.15M — the second-largest web accessibility settlement ever. What happened, what the class got, and what it means for e-commerce.",
    url: "https://accessibility.build/guides/fashion-nova-accessibility-settlement",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fashion Nova $5.15M Web Accessibility Settlement — Case Study",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The $5.15M Fashion Nova Web Accessibility Settlement",
    description:
      "The second-largest web accessibility settlement on record. What happened in Alcazar v. Fashion Nova and what it means for online retailers.",
  },
}

const faqs = [
  {
    question: "What was the Fashion Nova accessibility lawsuit about?",
    answer:
      "Alcazar v. Fashion Nova was a class action brought by Juan Alcazar, a legally blind shopper, who alleged that Fashion Nova's website could not be used with screen-reading software. The complaint claimed the barriers violated Title III of the Americans with Disabilities Act (ADA) and California's Unruh Civil Rights Act, which ties statutory damages to ADA violations for California residents.",
  },
  {
    question: "How much did Fashion Nova pay?",
    answer:
      "Fashion Nova agreed to a $5.15 million class-action settlement in 2025 without admitting wrongdoing. It is the second-largest publicly known web accessibility settlement on record, behind only the National Federation of the Blind v. Target class settlement from 2008. Class counsel's fees were capped at roughly 25% ($1,287,500), with additional amounts for litigation costs, and the remainder available to eligible class members.",
  },
  {
    question: "Who was eligible for a payment?",
    answer:
      "The settlement created a nationwide class of blind individuals for injunctive relief (website fixes) and a California subclass for cash payments. Legally blind California residents who tried to use Fashion Nova's website with a screen reader between February 26, 2018 and 2025 could file a claim for up to $4,000 — the amount tied to the Unruh Act's statutory damages. The claim deadline was October 20, 2025.",
  },
  {
    question: "What did Fashion Nova agree to fix?",
    answer:
      "As part of the settlement, Fashion Nova agreed to bring its website into 'substantial conformance' with the Web Content Accessibility Guidelines (WCAG) 2.1 — which in practice means conforming to most Level AA success criteria. Injunctive terms like this are common in web accessibility settlements because plaintiffs' primary goal under the ADA is remediation, not just damages.",
  },
  {
    question: "Why does the Unruh Act make California cases more expensive?",
    answer:
      "California's Unruh Civil Rights Act provides for statutory damages of at least $4,000 per violation and treats an ADA violation as an automatic Unruh violation. That means a plaintiff does not have to prove actual monetary harm to recover damages, and in a class action those $4,000 increments multiply across every affected class member. This is why California-linked cases — like Fashion Nova's — can reach settlement figures far above the typical $5,000–$50,000 single-plaintiff range.",
  },
  {
    question: "What should online retailers learn from this settlement?",
    answer:
      "Three things. First, class-action exposure is real: most accessibility cases settle quietly for five figures, but a well-pleaded class claim under a statutory-damages regime like the Unruh Act can reach seven figures. Second, an accessibility overlay or widget would not have prevented this — courts and the FTC have rejected overlays as a compliance substitute. Third, the cheapest path is proactive remediation: an audit and WCAG 2.2 AA remediation program costs a fraction of a single class settlement.",
  },
]

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Fashion Nova Accessibility Settlement",
    url: "https://accessibility.build/guides/fashion-nova-accessibility-settlement",
  },
]

export default function FashionNovaSettlementPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ArticleStructuredData
        headline="The $5.15M Fashion Nova Web Accessibility Settlement: What It Means for E-Commerce"
        description="A case study of Alcazar v. Fashion Nova — the $5.15 million web accessibility class-action settlement, the ADA and Unruh Act claims behind it, the class structure, WCAG 2.1 remediation terms, and the lessons for online retailers."
        author={{
          name: "Accessibility.build Editorial",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-09"
        dateModified="2026-07-09"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/guides/fashion-nova-accessibility-settlement"
        wordCount={2100}
        keywords={[
          "Fashion Nova settlement",
          "web accessibility class action",
          "Unruh Act website lawsuit",
          "ecommerce accessibility lawsuit",
        ]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
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
                    Fashion Nova Settlement
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-200 text-xs font-semibold uppercase tracking-wide mb-5">
              <span aria-hidden="true">●</span>
              Case Study · Updated July 9, 2026
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              A $5.15 Million Reminder That Websites Are Places of Business
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              In 2025, online fashion retailer Fashion Nova agreed to a{" "}
              <strong>$5.15 million</strong> class-action settlement after
              blind shoppers alleged its website could not be used with a screen
              reader. It is the second-largest publicly known web accessibility
              settlement ever recorded — behind only the landmark 2008 Target
              case. Here is what happened, how the money was structured, and why
              every e-commerce operator should read it as a warning.
            </p>
          </header>

          <section className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">$5.15M</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total settlement</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">#2</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Largest on record</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">$4,000</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Max per CA claimant</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">WCAG 2.1</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Remediation standard</p>
            </div>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>What happened</h2>
            <p>
              The case, <em>Alcazar v. Fashion Nova</em>, was filed by Juan
              Alcazar, a legally blind Californian who relies on screen-reading
              software to navigate the web. His complaint alleged that Fashion
              Nova&apos;s online store — one of the most trafficked
              fast-fashion sites in the United States — presented barriers that
              made it impossible to browse and buy independently: unlabeled
              images and buttons, form fields a screen reader could not
              interpret, and navigation that broke down without a mouse.
            </p>
            <p>
              Those are textbook{" "}
              <Link href="/wcag/1-1-1">WCAG 1.1.1 (Non-text Content)</Link>,{" "}
              <Link href="/wcag/4-1-2">4.1.2 (Name, Role, Value)</Link>, and{" "}
              <Link href="/wcag/2-1-1">2.1.1 (Keyboard)</Link> failures. The
              legal theory was equally standard: under Title III of the ADA, a
              retailer&apos;s website is an extension of a place of public
              accommodation and must be accessible. Because Alcazar is a
              California resident, the complaint also invoked the{" "}
              <strong>Unruh Civil Rights Act</strong>, which converts an ADA
              violation into a state-law claim carrying statutory damages of at
              least $4,000 per person.
            </p>

            <h2>How the $5.15 million breaks down</h2>
            <p>
              Fashion Nova settled without admitting wrongdoing — the norm in
              these cases. The settlement was structured as a class action with
              two groups:
            </p>
            <ul>
              <li>
                <strong>A nationwide injunctive-relief class</strong> — every
                blind U.S. user benefits from the website being fixed, but this
                group does not receive cash.
              </li>
              <li>
                <strong>A California damages subclass</strong> — legally blind
                California residents who tried to use the site with a screen
                reader between February 26, 2018 and 2025 could file a claim for
                up to <strong>$4,000</strong> each, reflecting the Unruh
                Act&apos;s statutory damages. The exact per-person payout
                depended on how many valid claims were filed against the net
                fund. The claim deadline was October 20, 2025.
              </li>
            </ul>
            <p>
              Of the $5.15 million, roughly 25% (about $1,287,500) was allocated
              to class counsel&apos;s fees, with additional amounts reimbursing
              out-of-pocket litigation costs. Fashion Nova also agreed to bring
              the site into &ldquo;substantial conformance&rdquo; with WCAG 2.1
              — the injunctive heart of the deal.
            </p>

            <div className="not-prose rounded-xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-6 my-8">
              <p className="text-sm font-bold uppercase tracking-wide text-amber-800 dark:text-amber-200 mb-3">
                Why California cases cost more
              </p>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                The ADA itself does not provide money damages to private
                plaintiffs — only injunctive relief and attorney&apos;s fees.
                California&apos;s Unruh Act is what turns an accessibility case
                into a damages case: it grants a minimum of $4,000{" "}
                <em>per violation</em>, and a plaintiff need not prove any actual
                financial loss. In a class action, those $4,000 increments stack
                across every affected member, which is how a single
                inaccessible checkout flow becomes a seven-figure exposure.
              </p>
            </div>

            <h2>Where it ranks</h2>
            <p>
              The $5.15 million figure puts Fashion Nova second only to{" "}
              <em>National Federation of the Blind v. Target Corp.</em>, the 2008
              case that first established a retailer&apos;s website could be sued
              under the ADA and settled for roughly $6 million plus remediation.
              For seventeen years no case came close. That Fashion Nova now sits
              in the number-two spot signals how much the stakes have risen as
              online retail has grown and plaintiff&apos;s firms have
              industrialized these filings.
            </p>
            <p>
              It is worth keeping perspective: the overwhelming majority of the{" "}
              <Link href="/research/accessibility-lawsuits">
                5,000+ web accessibility suits filed each year
              </Link>{" "}
              resolve quietly for $5,000–$50,000. Fashion Nova is the tail of
              the distribution, not the median. But it is the tail that ends
              careers and board meetings.
            </p>

            <h2>Three lessons for e-commerce</h2>
            <h3>1. Class actions are a different category of risk</h3>
            <p>
              A single-plaintiff demand letter is a nuisance you can budget for.
              A class action under a statutory-damages regime is an existential
              line item. If you sell into California — and virtually every
              national e-commerce brand does — you carry Unruh Act exposure
              whether or not you have ever been sued. The trigger is the same
              inaccessible code either way.
            </p>
            <h3>2. Overlays would not have saved them</h3>
            <p>
              Accessibility overlay widgets market themselves as instant
              compliance. They are not. In the first half of 2025 alone,
              hundreds of lawsuits named sites that <em>had</em> an overlay
              installed, and in 2025 the FTC settled with a major overlay vendor
              over misleading claims. If you are relying on a script to defend
              you, read our{" "}
              <Link href="/guides/accessibility-overlays">
                guide on why overlays fail
              </Link>{" "}
              and check your own site with the{" "}
              <Link href="/tools/overlay-detector">overlay detector</Link>.
            </p>
            <h3>3. Remediation is the cheap option</h3>
            <p>
              A thorough{" "}
              <Link href="/guides/how-to-audit-website-accessibility">
                WCAG 2.2 AA audit and remediation program
              </Link>{" "}
              for a large e-commerce site costs a small fraction of a single
              class settlement — and unlike a settlement, it also improves
              conversion, SEO, and reach to the ~27% of U.S. adults who live
              with a disability. Run the numbers with our{" "}
              <Link href="/tools/accessibility-roi-calculator">
                ROI calculator
              </Link>{" "}
              and you will almost always find that proactive work pays for
              itself before litigation is even in the picture.
            </p>

            <h2>What to do this week</h2>
            <ol>
              <li>
                <strong>Test your checkout and product pages with a screen
                reader.</strong> Those are the flows plaintiffs target first,
                because a broken checkout is the clearest &ldquo;denial of
                goods and services.&rdquo; See our{" "}
                <Link href="/guides/screen-reader-testing">
                  screen reader testing guide
                </Link>
                .
              </li>
              <li>
                <strong>Run an automated scan for the quick wins.</strong>{" "}
                Missing alt text, empty links, and unlabeled buttons are the
                most-cited violations. Use the{" "}
                <Link href="/tools/url-accessibility-auditor">
                  URL accessibility auditor
                </Link>{" "}
                to find them fast.
              </li>
              <li>
                <strong>Publish an honest accessibility statement</strong> with
                a real feedback channel — it demonstrates good faith and gives
                users an alternative to a lawsuit.
              </li>
              <li>
                <strong>Budget for remediation, not just defense.</strong>{" "}
                Fixing the code ends the exposure; paying a settlement without
                fixing it just invites the next plaintiff.
              </li>
            </ol>
          </section>

          <section className="mb-16">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Find your exposure before a plaintiff does
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                The barriers in the Fashion Nova complaint are the same ones on
                most e-commerce sites. Find and fix them first.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/tools/url-accessibility-auditor"
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Scan Your Site
                </Link>
                <Link
                  href="/research/accessibility-lawsuits"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Lawsuit Tracker
                </Link>
                <Link
                  href="/guides/ada-website-lawsuit-cost"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  What Lawsuits Cost
                </Link>
              </div>
            </div>
          </section>

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
                    <span aria-hidden="true" className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0">
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
            content="accessibility lawsuit ecommerce settlement cost ADA Unruh Act overlay WCAG audit litigation"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
