import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

const ogTitle = encodeURIComponent("How to Write an Accessibility Statement (2026 Guide)")

export const metadata: Metadata = {
  title: "How to Write an Accessibility Statement (2026 Guide)",
  description:
    "Who must publish an accessibility statement under PSBAR, the EU directive, and the EAA, what every good statement contains, and a free generator.",
  keywords: [
    "how to write an accessibility statement",
    "accessibility statement example",
    "accessibility statement template",
    "psbar accessibility statement",
    "eaa accessibility statement",
    "wcag accessibility statement",
    "accessibility statement generator",
  ],
  alternates: {
    canonical: "/guides/how-to-write-an-accessibility-statement",
  },
  openGraph: {
    title: "How to Write an Accessibility Statement (2026 Guide)",
    description:
      "Who must publish an accessibility statement under PSBAR, the EU directive, and the EAA, what every good statement contains, and a free generator.",
    url: "/guides/how-to-write-an-accessibility-statement",
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
    title: "How to Write an Accessibility Statement (2026 Guide)",
    description:
      "PSBAR, the EU Web Accessibility Directive, and the EAA each ask for something different. Learn which applies to you and write an honest statement.",
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
    question: "Do I legally need an accessibility statement?",
    answer:
      "It depends on who you are and where you operate. UK public sector bodies must publish one under PSBAR, in the government's model format. Public sector bodies in EU member states must publish one under the Web Accessibility Directive, following the model statement in Commission Implementing Decision (EU) 2018/1523. Private companies covered by the European Accessibility Act are not handed a statement template at all: since 28 June 2025 they must provide information, in their general terms and conditions or an equivalent document, explaining how the service meets the accessibility requirements, and most meet that duty with a public statement. For private US websites, no law requires a statement, but a voluntary one demonstrates good faith, gives users a working contact route, and is commonly requested in procurement.",
  },
  {
    question: "What must a PSBAR accessibility statement include?",
    answer:
      "PSBAR statements must follow the UK government's model format and state the compliance status (fully compliant, partially compliant, or not compliant with WCAG at level AA), list non-accessible content with the reason for each item (non-compliance with the regulations, a disproportionate burden claim, or content out of scope), explain how to request content in accessible formats, explain how to report accessibility problems, describe the enforcement procedure (EASS, the Equality Advisory and Support Service, and the EHRC in Great Britain; the ECNI in Northern Ireland), and give the date the statement was prepared and the date it was last reviewed. GDS checks statements as part of its PSBAR monitoring, which now tests against WCAG 2.2 AA.",
  },
  {
    question: "Does the EAA require an accessibility statement?",
    answer:
      "Not in the way many pages claim. There is no single mandated EAA statement template; the official EU model statement belongs to the Web Accessibility Directive for the public sector, not to the EAA. What the EAA actually requires of service providers is an information duty: under the Directive's Annex V, they must describe the service, explain how it meets the applicable accessibility requirements, and make that information available to the public in written and oral format, in a way accessible to persons with disabilities, in their general terms and conditions or an equivalent document. A public accessibility statement is the most practical way to satisfy that duty, and good practice besides, but the legal hook is the information requirement, not a template.",
  },
  {
    question: "Can I write an accessibility statement before testing my site?",
    answer:
      "You can, but you should not. A statement is a factual claim about the current state of your site, so it should follow testing, not precede it. A statement written before any evaluation is guesswork, and if it guesses optimistically it becomes a liability: claiming full compliance while your homepage fails basic checks contradicts user experience, destroys trust, and can be cited in a dispute as evidence that you knew accessibility mattered and misrepresented your status anyway. Run at least an automated scan, and ideally a manual audit, before you publish a conformance claim.",
  },
  {
    question: "What does \"partially compliant\" mean in an accessibility statement?",
    answer:
      "Partially compliant means the site meets most of the target standard, typically WCAG 2.1 or 2.2 at level AA, but has known exceptions, and the statement lists them. It is the honest status for the majority of real websites. Fully compliant means every applicable success criterion passes, a claim you should only make after thorough testing. Not compliant means the site has not been evaluated against the standard or fails it broadly. Choosing partially compliant and itemizing the gaps, with plans to fix them, is far more credible than an unsupported claim of full compliance.",
  },
  {
    question: "Does an accessibility statement protect me from being sued?",
    answer:
      "No. A statement is not a legal shield: it does not immunize you against Equality Act claims in the UK, ADA lawsuits in the US, or EAA enforcement in the EU. What it does is provide transparency about where your site stands and a communication channel that lets users report problems to you before they escalate elsewhere. That can reduce friction and demonstrate good faith, but the underlying obligation is an accessible service, not a published document. An inaccurate statement can even make things worse by showing awareness without action.",
  },
  {
    question: "How often should I review my accessibility statement?",
    answer:
      "Review it at least annually, and update it whenever the site changes significantly or after each audit or remediation round. PSBAR statements must carry both a preparation date and a last review date, and GDS monitoring checks that statements are kept current. Even for voluntary statements, a review date from several years ago signals that the commitments inside are stale, and users and procurement teams read it exactly that way. Put the review on a calendar, and tie it to your regular testing cycle so the status you publish always reflects a recent evaluation.",
  },
]

export default function HowToWriteAccessibilityStatementPage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Guides", url: "https://accessibility.build/guides" },
          {
            name: "How to Write an Accessibility Statement",
            url: "https://accessibility.build/guides/how-to-write-an-accessibility-statement",
          },
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
              <Link href="/guides" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Guides
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-900 dark:text-white" aria-current="page">
                How to Write an Accessibility Statement
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
              Guide &bull; Accessibility Statements
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              How to Write an{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Accessibility Statement
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              Three different legal regimes ask for three different documents, and most guides
              blur them together. This one keeps the UK&apos;s PSBAR model statement, the EU Web
              Accessibility Directive&apos;s model statement, and the EAA&apos;s Annex V
              information duty separate, then shows you exactly what to write and how to avoid
              publishing a statement that makes things worse.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Legal Regimes</p>
              <p className="text-2xl md:text-3xl font-bold text-white">3</p>
              <p className="text-slate-400 text-xs mt-1">PSBAR, WAD, and EAA all differ</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">EAA Legal Hook</p>
              <p className="text-2xl md:text-3xl font-bold text-white">Annex V</p>
              <p className="text-slate-400 text-xs mt-1">An information duty, not a template</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Report Against</p>
              <p className="text-2xl md:text-3xl font-bold text-white">WCAG 2.2 AA</p>
              <p className="text-slate-400 text-xs mt-1">The standard behind your status</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Our Tool</p>
              <p className="text-2xl md:text-3xl font-bold text-white">Free Generator</p>
              <p className="text-slate-400 text-xs mt-1">Builds a statement interactively</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* What it is and which law requires one */}
          <section aria-labelledby="which-law-heading">
            <h2 id="which-law-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What an Accessibility Statement Is, and Which Law Requires One
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              An accessibility statement is a public page that tells users which accessibility
              standard your website targets, how far it actually meets that standard, what the
              known gaps are, and how to reach you when something does not work. Whether the law
              requires you to publish one depends entirely on which of three distinct regimes you
              fall under, and the single most common error on this topic is treating them as one:
            </p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">UK public sector: PSBAR.</strong>{" "}
                The Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility
                Regulations 2018 require public sector bodies to publish an accessibility
                statement in the government&apos;s model format. The content is prescribed, and
                GDS monitors published statements. Our{" "}
                <Link href="/compliance/uk" className="text-blue-600 dark:text-blue-400 hover:underline">
                  UK compliance guide
                </Link>{" "}
                covers the wider context.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">EU public sector: the Web Accessibility Directive.</strong>{" "}
                Directive (EU) 2016/2102 requires public sector bodies in EU member states to
                publish statements following the model in Commission Implementing Decision (EU)
                2018/1523. This is where the official EU model statement lives. It applies to the
                public sector, not to private companies under the EAA.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">EU private sector: the European Accessibility Act.</strong>{" "}
                The{" "}
                <Link href="/compliance/eaa" className="text-blue-600 dark:text-blue-400 hover:underline">
                  EAA
                </Link>
                , which has applied since 28 June 2025, mandates no statement template at all.
                Instead it imposes an information requirement, explained in detail below.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Everywhere else: voluntary.</strong>{" "}
                No law requires a private US website to publish a statement. A voluntary one still
                demonstrates good faith, gives users a working contact route, and is commonly
                requested in procurement. The W3C publishes guidance and a free generator, and our
                own{" "}
                <Link
                  href="/tools/accessibility-statement-generator"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  accessibility statement generator
                </Link>{" "}
                produces one interactively.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Many competitor pages tell private companies to follow &ldquo;the official EU
              accessibility statement template&rdquo; for EAA compliance. There is no such thing:
              the model statement belongs to the public sector directive, and the EAA asks for
              something different. Getting this distinction right is the point of this guide.
            </p>
          </section>

          {/* PSBAR */}
          <section aria-labelledby="psbar-heading">
            <h2 id="psbar-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The UK Public Sector Statement Under PSBAR
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              If you are a UK public sector body, the statement is not optional and its structure
              is not up to you. PSBAR requires a statement in the government&apos;s model format,
              containing:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">Compliance status:</strong>{" "}
                fully compliant, partially compliant, or not compliant with WCAG at level AA.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Non-accessible content, with reasons:</strong>{" "}
                each item listed as a non-compliance with the regulations, a claim of
                disproportionate burden, or content that is out of scope of the regulations.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Accessible formats:</strong>{" "}
                how users can request content in an accessible format.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Reporting route:</strong> how
                users can report accessibility problems with the site.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Enforcement procedure:</strong>{" "}
                in Great Britain, EASS (the Equality Advisory and Support Service) and the EHRC;
                in Northern Ireland, the ECNI.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Dates:</strong> when the
                statement was prepared and when it was last reviewed.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              GDS reviews statements as part of its PSBAR monitoring programme, and that
              monitoring now tests against WCAG 2.2 AA, so the status you declare should be
              measured against the current standard. Our{" "}
              <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                WCAG 2.2 checklist
              </Link>{" "}
              and{" "}
              <Link href="/compliance/uk" className="text-blue-600 dark:text-blue-400 hover:underline">
                UK compliance guide
              </Link>{" "}
              cover what that testing looks for.
            </p>
          </section>

          {/* EAA */}
          <section aria-labelledby="eaa-heading">
            <h2 id="eaa-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The EAA and Private Companies: An Information Duty, Not a Template
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The European Accessibility Act has applied to in-scope products and services since
              28 June 2025, and it takes a different approach from the public sector directive.
              There is no single mandated statement template. What service providers must do is
              provide information, in their general terms and conditions or an equivalent
              document, explaining how the service meets the accessibility requirements. That
              duty comes from the Directive&apos;s Annex V, and it breaks down into three parts:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">Describe the service</strong>{" "}
                in a general way, so it is clear what the information covers.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Explain how it meets the accessibility requirements</strong>{" "}
                that apply to it. In practice, conformance is assessed against{" "}
                <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                  EN 301 549
                </Link>
                , the European standard that incorporates WCAG for web content.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Make the information available in accessible form</strong>{" "}
                to the public, including for persons with disabilities.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              A public accessibility statement is the practical way most businesses satisfy this:
              one well-structured page can describe the service, state its conformance status
              against EN 301 549 and WCAG, list known limitations, and be accessible itself. That
              is good practice and we recommend it. But be precise about the legal position: the
              hook is the Annex V information requirement, not a statement template, and copying
              the public sector model statement does not automatically discharge it.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Enforcement is national, and it has teeth. Ireland, for example, enforces the EAA
              with criminal penalties; see our{" "}
              <Link href="/compliance/eaa-ireland" className="text-blue-600 dark:text-blue-400 hover:underline">
                EAA Ireland guide
              </Link>{" "}
              for the details, and the{" "}
              <Link href="/compliance/eaa" className="text-blue-600 dark:text-blue-400 hover:underline">
                EAA overview
              </Link>{" "}
              for who is in scope.
            </p>
          </section>

          {/* What every good statement contains */}
          <section aria-labelledby="contents-heading">
            <h2 id="contents-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What Every Good Statement Contains
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Across all three regimes, and for voluntary statements too, the same core elements
              separate a useful statement from filler:
            </p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">The standard you target.</strong>{" "}
                Name the version and level, normally WCAG 2.2 Level AA. Our{" "}
                <Link
                  href="/guides/wcag-2-2-aa-requirements"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.2 AA requirements guide
                </Link>{" "}
                explains what that commitment covers.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Your actual conformance status, told honestly.</strong>{" "}
                Fully compliant, partially compliant, or not compliant. Most live sites are
                partially compliant, and saying so is a strength, not a confession.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Known limitations, listed specifically.</strong>{" "}
                &ldquo;Some older PDFs are not tagged&rdquo; and &ldquo;the store locator map has
                no keyboard alternative&rdquo; are useful; &ldquo;some content may not be fully
                accessible&rdquo; is not.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">A real contact channel with a response commitment.</strong>{" "}
                An email address or form that reaches someone empowered to act, and a stated
                timeframe for replying.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Dates.</strong> When the
                statement was prepared and when it was last reviewed.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">How the site was evaluated.</strong>{" "}
                Say whether the status rests on self-evaluation or a third-party{" "}
                <Link
                  href="/services/accessibility-audits"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  accessibility audit
                </Link>
                , and when. Our{" "}
                <Link
                  href="/guides/how-to-audit-website-accessibility"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  auditing guide
                </Link>{" "}
                walks through both approaches.
              </li>
            </ul>
          </section>

          {/* Mistakes */}
          <section aria-labelledby="mistakes-heading">
            <h2 id="mistakes-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Statement Mistakes That Create Risk
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              A bad statement is worse than no statement. The failure patterns are consistent:
            </p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">Overclaiming.</strong>{" "}
                Declaring &ldquo;fully compliant&rdquo; while the homepage fails basic automated
                checks contradicts what users experience, and in a dispute the statement becomes
                evidence that you knew accessibility was an obligation and misstated your
                position. A statement is a claim about your site, so it should follow testing,
                not precede it.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Vagueness.</strong> A page of
                &ldquo;we care about accessibility&rdquo; sentiment with no conformance status,
                no contact route, and no date commits you to nothing and helps no one. It reads
                as decoration because it is.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Stale dates.</strong> A
                statement last reviewed years ago tells users, monitors, and procurement teams
                that nothing behind it is being maintained either.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">No contact route.</strong> The
                contact channel is the most practically valuable part of the whole document: it
                lets a blocked user reach you instead of an enforcement body or a law firm.
                Omitting it wastes the statement&apos;s best feature.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              And keep expectations realistic: a statement is not a legal shield. It does not
              immunize you against Equality Act claims, ADA lawsuits, or EAA enforcement. It is
              transparency plus a communication channel, and its value depends entirely on being
              accurate.
            </p>
          </section>

          {/* Write yours now */}
          <section aria-labelledby="write-heading">
            <h2 id="write-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Write Yours Now
            </h2>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-slate-900 dark:text-white">Draft it with the generator.</strong>{" "}
                Our free{" "}
                <Link
                  href="/tools/accessibility-statement-generator"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  accessibility statement generator
                </Link>{" "}
                walks you through the elements above interactively: the standard you target, your
                conformance status, known limitations, evaluation method, contact details, and
                dates, and produces a statement you can publish.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Validate every claim before you publish.</strong>{" "}
                Run your key pages through the{" "}
                <Link
                  href="/tools/url-accessibility-auditor"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  URL accessibility auditor
                </Link>{" "}
                for an automated baseline, and remember that automated tools catch only part of
                WCAG. For a conformance status you can stand behind, commission a{" "}
                <Link
                  href="/services/accessibility-audits"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  professional audit
                </Link>{" "}
                with manual and screen reader testing; our{" "}
                <Link href="/sample-audit-report" className="text-blue-600 dark:text-blue-400 hover:underline">
                  sample audit report
                </Link>{" "}
                shows what that evidence looks like.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Publish it where users look.</strong>{" "}
                Link the statement from your site footer on every page, and make sure the
                statement page itself meets the standard it describes.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Keep it current.</strong>{" "}
                Update the statement after each remediation round or audit, review it at least
                annually, and refresh the review date so readers can see it is maintained.
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
                Educational Content, Not Legal Advice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This page is provided for general educational purposes only and does not
                constitute legal advice. Accessibility statement obligations differ by
                jurisdiction and sector, and enforcement practice under PSBAR, the Web
                Accessibility Directive, and the European Accessibility Act continues to develop.
                For advice about your specific obligations, consult a lawyer experienced in
                accessibility law in the relevant jurisdiction.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="accessibility statement WCAG conformance PSBAR EAA compliance statement generator template"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
