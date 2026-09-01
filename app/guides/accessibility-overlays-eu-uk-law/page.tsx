import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { PageByline } from "@/components/seo/page-byline"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"

const ogTitle = encodeURIComponent("Do Accessibility Overlays Meet the EAA and UK Law?")

export const metadata: Metadata = {
  title: "Do Accessibility Overlays Meet the EAA and UK Law?",
  description:
    "Overlay widgets do not make a site EAA or Equality Act compliant. What EN 301 549 requires, what EU institutions say, and what actually satisfies the law.",
  keywords: [
    "accessibility overlay eaa",
    "overlay european accessibility act",
    "accessibility overlay legal",
    "overlay equality act",
    "accessibe eaa compliance",
    "userway eaa",
    "overlay wcag compliance",
    "accessibility widget legal",
  ],
  alternates: {
    canonical: "/guides/accessibility-overlays-eu-uk-law",
  },
  openGraph: {
    title: "Do Accessibility Overlays Meet the EAA and UK Law?",
    description:
      "Overlay widgets do not make a site EAA or Equality Act compliant. What EN 301 549 requires, what EU institutions say, and what actually satisfies the law.",
    url: "/guides/accessibility-overlays-eu-uk-law",
    type: "article",
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Guides`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Do Accessibility Overlays Meet the EAA and UK Law?",
    description:
      "No law in the EU or UK treats an overlay widget as a compliance route. The legal tests are outcome-based, and overlays do not change the delivered code.",
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Guides`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    question: "Will an overlay make my site EAA compliant?",
    answer:
      "No. The European Accessibility Act requires that in-scope services meet accessibility requirements, and conformity is presumed when the service conforms to the harmonised standard EN 301 549, which incorporates WCAG at Level AA. WCAG conformance is evaluated on the content as delivered: if a button is unlabeled in your markup, it remains unlabeled with an overlay widget running on top. No provision of the EAA, EN 301 549, or any national transposition names an overlay as a route to compliance. What satisfies the law is remediating the underlying code and verifying it through testing.",
  },
  {
    question: "Can I be sued in Europe if I use an overlay?",
    answer:
      "Yes. Installing an overlay does not remove the underlying barriers, so it does not remove the legal exposure. In the US, where the litigation data is most developed, UsableNet's mid-year 2026 reporting found that roughly 20% of companies sued for digital accessibility in 2026 had an accessibility widget or overlay installed. In the EU, enforcement runs through market surveillance authorities, consumer complaints, and the courts, and each of those channels looks at whether the service actually works for disabled users, not at which third-party scripts are loaded on the page.",
  },
  {
    question: "Does an overlay count as a reasonable adjustment under the Equality Act?",
    answer:
      "Installing an overlay is unlikely to discharge the duty by itself. The Equality Act 2010 imposes an anticipatory duty to make reasonable adjustments, and the practical question is whether disabled users can actually use the service. Testing consistently shows that the core barriers on a page, such as missing labels, broken keyboard access, and inaccessible custom widgets, persist with an overlay active. If a blind customer still cannot complete checkout with the widget switched on, the adjustment has not been made, whatever the tool's marketing says.",
  },
  {
    question: "Why do overlay vendors claim compliance?",
    answer:
      "Because compliance is what they are selling, and the claims have outrun the technology. Vendor marketing has promised automated conformance with WCAG, the ADA, and now the EAA. Those claims have drawn regulatory action: in January 2025 the US Federal Trade Commission ordered overlay vendor accessiBe to pay $1 million over claims it misrepresented what its AI product could do for compliance. Treat compliance guarantees from any overlay vendor as marketing claims, and test the actual service with the widget running before relying on them.",
  },
  {
    question: "Do regulators test sites with the overlay running?",
    answer:
      "Market surveillance under the EAA tests the delivered service, and an overlay does not fix the markup underneath. An assessment against EN 301 549 examines the content as it is served: the accessibility tree, the labels, the keyboard behaviour, the contrast of the actual pages. The Dutch regulator ACM, for example, reported in March 2026 that 61% of the largest Dutch webshops fail accessibility requirements, a finding based on testing the services themselves. A widget menu offering font resizing does not change what an audit of the underlying pages finds.",
  },
  {
    question: "What should I do if I already bought an overlay?",
    answer:
      "Do not panic, but do not treat the subscription as compliance either. First, get an honest picture: run an audit of your key user journeys against WCAG 2.2 AA with the overlay disabled, because that is what your code actually delivers. Second, budget the overlay fee toward real remediation of the issues the audit finds. Third, once the underlying code is fixed and verified, the overlay has no compliance job left to do and most teams remove it. Keeping it while remediating is a commercial choice, not a legal shield.",
  },
]

export default function OverlaysEuUkLawPage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Guides", url: "https://accessibility.build/guides" },
          {
            name: "Overlays and EU/UK Law",
            url: "https://accessibility.build/guides/accessibility-overlays-eu-uk-law",
          },
        ]}
      />
      <GuideArticleSchema route="/guides/accessibility-overlays-eu-uk-law" title="Do Accessibility Overlays Meet the EAA and UK Law?" description="Overlay widgets do not make a site EAA or Equality Act compliant. What EN 301 549 requires, what EU institutions say, and what actually satisfies the law." datePublished="2026-08-27" />

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
              <Link href="/guides" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Guides
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-900 dark:text-white" aria-current="page">
                Overlays and EU/UK Law
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
              Legal Guide &bull; EAA &amp; UK Equality Act
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Do Accessibility Overlays Comply with{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                the EAA and UK Law?
              </span>
            </h1>
            <PageByline route="/guides/accessibility-overlays-eu-uk-law" className="mb-5" />
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              Overlay vendors now market their widgets as a shortcut to European Accessibility Act
              and Equality Act compliance. But every relevant legal test in the EU and UK is
              outcome-based: it asks whether the service actually works for disabled users, not
              which scripts the page loads. This guide walks through what the law really requires
              and where overlays fall short of it.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">2026 Lawsuit Defendants</p>
              <p className="text-2xl md:text-3xl font-bold text-white">~20%</p>
              <p className="text-slate-400 text-xs mt-1">Had an overlay installed (UsableNet)</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">FTC Order vs. accessiBe</p>
              <p className="text-2xl md:text-3xl font-bold text-white">$1M</p>
              <p className="text-slate-400 text-xs mt-1">Over compliance claims, Jan 2025</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">The Caen Court&apos;s Framing</p>
              <p className="text-xl md:text-2xl font-bold text-white">Obligation of result</p>
              <p className="text-slate-400 text-xs mt-1">Accessibility judged by outcomes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Laws Naming Overlays</p>
              <p className="text-xl md:text-2xl font-bold text-white">0 exemptions</p>
              <p className="text-slate-400 text-xs mt-1">No statute treats a widget as compliance</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* The short answer */}
          <section aria-labelledby="short-answer-heading">
            <h2 id="short-answer-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The Short Answer
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              No. No law in the EU or the UK recognises an accessibility overlay as a route to
              compliance. The European Accessibility Act tests whether a service meets accessibility
              requirements. The UK Equality Act tests whether disabled people can actually use the
              service. Neither test mentions widgets, toolbars, or AI remediation layers, and neither
              can be satisfied by a tool that leaves the underlying barriers in place.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              A quick recap for anyone new to the topic: overlays are third-party JavaScript widgets,
              from vendors such as accessiBe and UserWay, that promise to detect and fix
              accessibility problems automatically at page load, usually adding a floating toolbar of
              display options. Independent testing consistently finds that they fail to fix the
              barriers that matter and sometimes introduce new ones. Our{" "}
              <Link href="/guides/accessibility-overlays" className="text-blue-600 dark:text-blue-400 hover:underline">
                accessibility overlays guide
              </Link>{" "}
              covers the technical evidence in depth; this page focuses on the legal question for the
              EU and UK.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The pattern across every jurisdiction examined below is the same: regulators,
              disability organisations, and courts evaluate outcomes. An overlay changes what a page
              looks like with a widget menu open. It does not change what the page delivers to
              assistive technology, and the law cares about the latter.
            </p>
          </section>

          {/* What the EAA requires */}
          <section aria-labelledby="eaa-heading">
            <h2 id="eaa-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What the EAA Actually Requires
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The European Accessibility Act requires that in-scope products and services, including
              e-commerce, banking, and transport services, <strong>meet</strong> its accessibility
              requirements: the actual service must be perceivable, operable, understandable, and
              robust for people with disabilities. Conformity is presumed when a service conforms to
              the harmonised standard{" "}
              <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                EN 301 549
              </Link>
              , which incorporates WCAG at Level AA for web content. In practice, meeting the EAA
              means your pages conform to WCAG 2.2 AA.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Here is where overlays run into a structural problem. WCAG conformance is evaluated on
              the content as delivered. An overlay widget layered on top of a page does not change
              the page&apos;s underlying conformance: a button that is unlabeled in the markup
              remains unlabeled in the markup, a form without programmatic error messages still has
              none, and a custom dropdown that traps keyboard focus still traps it. The widget adds
              its own UI alongside the broken one; it does not repair the code that assistive
              technology reads.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              So a service owner claiming EAA conformity via EN 301 549 has to show that the
              delivered content conforms, and an overlay contributes nothing to that showing. For how
              the EAA is enforced in a specific member state, see our{" "}
              <Link href="/compliance/eaa-ireland" className="text-blue-600 dark:text-blue-400 hover:underline">
                EAA in Ireland guide
              </Link>
              .
            </p>
          </section>

          {/* European institutions */}
          <section aria-labelledby="institutions-heading">
            <h2 id="institutions-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What European Institutions Say About Overlays
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              This is not just an outside analysis. The European Disability Forum (EDF), the umbrella
              organisation of persons with disabilities in Europe, has stated publicly that
              accessibility overlays &ldquo;do not guarantee compliance&rdquo; with European
              legislation (edf-feph.org). That statement matters because EDF is the body that
              represents the very users the EAA exists to protect, and it is the organisation
              regulators and standards bodies consult on disability issues.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              EDF has also reported the European Commission&apos;s position that overlay tools may
              make a website <em>less</em> accessible. That is consistent with what disabled users
              have said for years: overlay widgets can interfere with the screen readers, magnifiers,
              and custom settings people already have configured, overriding working assistive
              technology with the vendor&apos;s inferior version. A tool the Commission views as a
              potential step backwards is a strange foundation for a compliance claim.
            </p>
          </section>

          {/* Obligation of result */}
          <section aria-labelledby="caen-heading">
            <h2 id="caen-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The Obligation of Result: What Caen Signals
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              In June 2026 the Tribunal judiciaire de Caen ordered Carrefour to make its e-commerce
              site and app accessible. Two features of the ruling matter far beyond France. First,
              the court treated accessibility as an <strong>obligation of result</strong>: the duty
              is discharged by achieving an accessible service, not by making efforts toward one.
              Second, the court rejected a partial conformance rate as insufficient; being mostly
              accessible was not accessible.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              To be clear, the Carrefour case did not involve an overlay, and we are not suggesting
              it did. Its relevance is the principle. An obligation of result is measured by actual
              outcomes for users: can a blind customer find the product, add it to the basket, and
              pay? That is precisely the measure on which overlays fail. If courts in EAA member
              states follow Caen&apos;s framing, the question in every case becomes &ldquo;does the
              service work for disabled users?&rdquo;, and installing a widget is not an answer to
              that question.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              An outcome-based standard also cuts off the most common overlay defence, good-faith
              effort. Under an obligation of result, having bought a tool that promised accessibility
              is not the same as having delivered it.
            </p>
          </section>

          {/* UK Equality Act */}
          <section aria-labelledby="uk-heading">
            <h2 id="uk-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The UK Equality Act Question
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The UK is no longer bound by the EAA, but its own law asks a similar question. The
              Equality Act 2010 places a duty on service providers to make reasonable adjustments
              for disabled people, and that duty is <strong>anticipatory</strong>: you must plan for
              disabled users in advance, not react after someone is excluded. The measure of whether
              the duty is met is practical: can disabled users actually use the service?
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              That framing leaves overlays in the same position they occupy under the EAA. If the
              underlying barriers persist with the widget active, and{" "}
              <Link href="/guides/accessibility-overlays" className="text-blue-600 dark:text-blue-400 hover:underline">
                testing consistently shows they do
              </Link>
              , then the disabled user is still excluded and the duty is not met by having installed
              one. The Equality Act does not grade tools; it grades access. A retailer whose checkout
              is unusable with a screen reader is in the same legal position whether or not a
              floating accessibility button sits in the corner of the page.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              For the wider UK picture, including the public sector regulations that already mandate
              WCAG-based standards, see our{" "}
              <Link href="/compliance/uk" className="text-blue-600 dark:text-blue-400 hover:underline">
                UK accessibility compliance guide
              </Link>
              .
            </p>
          </section>

          {/* Evidence */}
          <section aria-labelledby="evidence-heading">
            <h2 id="evidence-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The Evidence Overlays Do Not Stop Legal Action
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              If overlays worked as a legal shield, companies running them would not get sued. They
              do, at scale. Per UsableNet&apos;s mid-year 2026 reporting, roughly{" "}
              <strong>20% of companies sued for digital accessibility in 2026 had an accessibility
              widget or overlay installed</strong>. Plaintiffs&apos; firms are not deterred by
              overlays; some treat the widget itself as evidence that the defendant knew about
              accessibility obligations and chose a shortcut.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The vendors&apos; own compliance claims have also drawn regulatory fire. In January
              2025, the US Federal Trade Commission ordered overlay vendor accessiBe to pay{" "}
              <strong>$1 million</strong> over claims it misrepresented what its AI-powered product
              could do for compliance. A regulator formally acting against the flagship vendor&apos;s
              compliance marketing is about as direct a warning as buyers will get.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              European enforcement is heading the same way, because it tests outcomes. The Dutch
              regulator ACM reported in March 2026 that 61% of the largest Dutch webshops fail
              accessibility requirements, findings produced by examining the services themselves.
              Market surveillance under the EAA works on the delivered service, which is exactly the
              thing an overlay does not change.
            </p>
          </section>

          {/* What to do instead */}
          <section aria-labelledby="instead-heading">
            <h2 id="instead-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What To Do Instead
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              What satisfies both the EAA and the Equality Act is the unglamorous thing: remediation
              of the underlying code to WCAG 2.2 AA and EN 301 549, verified by testing. That is the
              standard the law presumes conformity against, the thing market surveillance measures,
              and the outcome an obligation of result demands.
            </p>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-slate-900 dark:text-white">Find out where you stand.</strong>{" "}
                A professional{" "}
                <Link href="/services/accessibility-audits" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessibility audit
                </Link>{" "}
                against WCAG 2.2 AA, covering your critical user journeys with manual and
                screen-reader testing, tells you what a regulator or claimant would find.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Fix the code, not the presentation layer.</strong>{" "}
                Label the controls, repair the keyboard traps, fix the contrast and the focus order
                in your actual markup and components. Our{" "}
                <Link href="/guides/accessibility-overlay-alternatives" className="text-blue-600 dark:text-blue-400 hover:underline">
                  overlay alternatives guide
                </Link>{" "}
                maps out the remediation options at every budget level.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Verify and document.</strong>{" "}
                Re-test after remediation, publish an accurate accessibility statement, and keep the
                evidence. Under the EAA, being able to demonstrate conformity with{" "}
                <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                  EN 301 549
                </Link>{" "}
                is the point of the exercise.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Check what your site is running today.</strong>{" "}
                Inherited an overlay from an agency or a previous team? Our free{" "}
                <Link href="/tools/overlay-detector" className="text-blue-600 dark:text-blue-400 hover:underline">
                  overlay detector
                </Link>{" "}
                shows whether a site is running an overlay, and which one.
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <FaqSection faqs={faqs} />

          {/* Disclaimer */}
          <section aria-label="Disclaimer">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Educational Content, Not Legal Advice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This page is provided for general educational purposes only and does not constitute
                legal advice. The European Accessibility Act is transposed and enforced differently
                across member states, UK equality law continues to develop through the courts, and
                the analysis here reflects the position at the time of writing. For advice about
                your specific situation, consult a lawyer experienced in accessibility law in the
                relevant jurisdiction.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="accessibility overlay EAA Equality Act compliance legal widget accessiBe UserWay EN 301 549 remediation"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
