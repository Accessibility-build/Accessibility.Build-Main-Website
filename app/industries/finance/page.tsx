import Link from "next/link"
import {
  ArrowRight,
  Landmark,
  Scale,
  Gavel,
  CreditCard,
  KeyRound,
  Timer,
  FormInput,
  Table2,
  FileText,
  Contrast,
  ScanSearch,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { PageByline } from "@/components/seo/page-byline"

export const metadata = {
  title: "Banking & Financial Services Accessibility",
  description:
    "How the EAA, the UK Consumer Duty, and the ADA apply to banks, insurers, and fintechs, plus the WCAG fixes for login, payments, statements, and apps.",
  keywords: [
    "banking accessibility",
    "financial services accessibility",
    "accessible banking website",
    "eaa banking compliance",
    "fintech accessibility",
    "wcag banking",
    "insurance website accessibility",
  ],
  alternates: { canonical: "/industries/finance" },
  openGraph: {
    type: "website",
    title: "Banking & Financial Services Accessibility",
    description:
      "How the EAA, the UK Consumer Duty, and the ADA apply to banks, insurers, and fintechs, plus the WCAG fixes for login, payments, statements, and apps.",
    url: "/industries/finance",
    images: [
      {
        url: "/api/og?title=Banking%20%26%20Financial%20Services%20Accessibility&section=Industries",
        width: 1200,
        height: 630,
        alt: "Banking & Financial Services Accessibility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Banking & Financial Services Accessibility",
    description:
      "How the EAA, the UK Consumer Duty, and the ADA apply to banks, insurers, and fintechs, plus the WCAG fixes for login, payments, statements, and apps.",
    images: ["/api/og?title=Banking%20%26%20Financial%20Services%20Accessibility&section=Industries"],
  },
}

const stats = [
  {
    value: "28 June 2025",
    label:
      "the date European Accessibility Act obligations began applying to consumer banking services offered to consumers in the EU",
  },
  {
    value: "1 in 4",
    label:
      "US adults lives with a disability (28.7% per CDC data), and banking is an essential service nobody can simply opt out of",
  },
  {
    value: "~1.2%",
    label:
      "of the roughly 5,000 US federal and state digital accessibility lawsuits reported for 2025 targeted banking and finance: a small share of volume, but high-stakes defendants",
  },
  {
    value: "95.9%",
    label:
      "of the top million homepages had detectable WCAG failures in the 2026 WebAIM Million, and financial sites are not exempt from the pattern",
  },
]

const legalExposure = [
  {
    icon: Gavel,
    title: "The European Accessibility Act reaches consumer banking",
    description:
      "The EAA explicitly covers consumer banking services, and it also captures payment terminals and ATMs as self-service terminals. Obligations apply since 28 June 2025 for services provided to consumers in the EU, so any bank, insurer, or fintech serving EU consumers is already inside the enforcement window. Enforcement runs through national regulators: in Ireland, S.I. No. 636/2023 designates the Central Bank of Ireland as the regulator for the accessibility of consumer banking services, and Irish penalties are criminal, with fines of up to EUR 60,000 and/or up to 18 months imprisonment on indictment. Conformity is demonstrated against EN 301 549, the European standard that incorporates WCAG.",
  },
  {
    icon: Scale,
    title: "UK: the Equality Act and the FCA Consumer Duty",
    description:
      "The Equality Act 2010 imposes an anticipatory reasonable-adjustments duty on service providers, meaning firms must plan for disabled customers in advance rather than react to individual complaints. On top of that, the FCA Consumer Duty, in force since July 2023, requires firms to deliver good outcomes for retail customers, including customers in vulnerable circumstances. A login flow a blind customer cannot complete, or a statement a screen reader cannot parse, is hard to square with either obligation: digital accessibility sits squarely inside both regimes.",
  },
  {
    icon: Landmark,
    title: "US: ADA Title III lawsuits name banks and credit unions",
    description:
      "Banks and credit unions are regular defendants in ADA Title III website lawsuits. Banking and finance made up about 1.2% of the roughly 5,000 combined federal and state digital accessibility lawsuits reported for 2025, per UsableNet-derived data on our lawsuit tracker. That is a small share of overall volume, but the defendants are high stakes: financial institutions hold sensitive customer relationships, operate under regulator scrutiny, and cannot easily argue their websites are peripheral to the services they provide.",
  },
  {
    icon: CreditCard,
    title: "ATMs and payment terminals are in scope too",
    description:
      "Accessibility obligations do not stop at the website. The EAA treats payment terminals and ATMs as self-service terminals, which means the hardware and its interface fall under the same regime as the digital channels. Terminals already in use before the 2025 application date benefit from a transition period that can run up to 20 years, but new deployments must comply, so procurement decisions made today determine your exposure for the life of the fleet.",
  },
]

const wcagIssues = [
  {
    icon: KeyRound,
    title: "Login, 2FA, and CAPTCHA barriers",
    criteria: [
      { label: "WCAG 3.3.8 Accessible Authentication", href: "/wcag/3-3-8" },
      { label: "WCAG 1.1.1 Non-text Content", href: "/wcag/1-1-1" },
    ],
    description:
      "Banking runs the heaviest authentication of any consumer service, and every layer can exclude. WCAG 2.2 added 3.3.8 Accessible Authentication precisely because memorizing passwords and transcribing one-time codes under time pressure are cognitive-function tests that many users cannot pass. Support paste in code fields, allow password managers, and never rely on memory alone. CAPTCHAs add a second wall: a visual puzzle with no accessible alternative locks blind customers out of their own accounts at the front door.",
  },
  {
    icon: Timer,
    title: "Session timeouts that race the customer",
    criteria: [{ label: "WCAG 2.2.1 Timing Adjustable", href: "/wcag/2-2-1" }],
    description:
      "Security timeouts are standard in banking, but a timeout that cannot be extended logs out screen reader and magnification users before they finish a transfer or a loan application. WCAG 2.2.1 requires that users be warned before time expires and given a simple way to extend it. Pair the warning with an accessible dialog that keyboard and screen reader users can actually reach, and preserve entered data across a re-authentication so the customer does not start from zero.",
  },
  {
    icon: FormInput,
    title: "Unlabeled fields in applications and transfers",
    criteria: [
      { label: "WCAG 3.3.2 Labels or Instructions", href: "/wcag/3-3-2" },
      { label: "WCAG 1.3.1 Info and Relationships", href: "/wcag/1-3-1" },
    ],
    description:
      "Account opening, loan applications, payee setup, and transfers are long, high-consequence forms. Fields without programmatic labels, placeholder text doing a label's job, required indicators conveyed only by color, and error messages that never reach assistive technology all stall customers at the exact moments that generate support calls and abandonment. Because the same form templates power dozens of journeys, fixing labels and validation at the component level pays off across the whole product.",
  },
  {
    icon: Table2,
    title: "Transaction histories without table semantics",
    criteria: [{ label: "WCAG 1.3.1 Info and Relationships", href: "/wcag/1-3-1" }],
    description:
      "A transaction history is a data table: dates, descriptions, debits, credits, balances. When it is built from styled divs, or from a table element without proper header cells, a screen reader reads an undifferentiated stream of numbers with no way to tell a debit from a balance. Real table markup with column headers, captions, and sensible sort controls turns the same data back into something a customer can audit independently.",
  },
  {
    icon: FileText,
    title: "Statements delivered as untagged PDFs",
    criteria: [
      { label: "WCAG 1.3.1 Info and Relationships", href: "/wcag/1-3-1" },
      { label: "WCAG 1.1.1 Non-text Content", href: "/wcag/1-1-1" },
    ],
    description:
      "Monthly statements, policy documents, and confirmations are overwhelmingly delivered as PDFs, and untagged PDFs have no structure a screen reader can navigate. A blind customer who cannot privately read their own statement must hand their finances to a sighted helper, which is exactly the kind of dignity and privacy harm accessibility law exists to prevent. Fix the statement templates in the generating system so every document inherits the tagging, and prefer accessible HTML delivery where you can.",
  },
  {
    icon: Contrast,
    title: "Low-contrast fintech design trends",
    criteria: [{ label: "WCAG 1.4.3 Contrast (Minimum)", href: "/wcag/1-4-3" }],
    description:
      "Fintech visual language leans on thin type, light gray on white, and subtle balance displays. It photographs well and fails real users: account balances, interest rates, and due dates rendered below the 4.5:1 contrast minimum are illegible to customers with low vision, older customers, and anyone on a phone in daylight. Contrast is one of the cheapest failures to fix and one of the most common findings in financial audits.",
  },
]

const roadmap = [
  {
    step: "Map your regulatory footprint",
    detail:
      "Work out which regimes bind you: serving EU consumers triggers the EAA (in force since 28 June 2025, enforced nationally, in Ireland by the Central Bank); UK operations sit under the Equality Act 2010 and the FCA Consumer Duty; US operations face ADA Title III litigation risk. Then inventory every customer-facing digital property: public site, online banking, mobile apps, statement delivery, onboarding flows, and self-service terminals.",
  },
  {
    step: "Audit the money journeys end to end",
    detail:
      "Audit onboarding, login and 2FA, payments and transfers, statement retrieval, and support as continuous journeys, combining automated scans with manual screen reader and keyboard testing. Authentication and payments deserve priority: they gate everything else, and they are where timeouts, CAPTCHAs, and cognitive load concentrate.",
  },
  {
    step: "Fix authentication, forms, and documents at the source",
    detail:
      "Remediate shared components first: the design system's form fields, the session-timeout dialog, the 2FA flow, and the statement templates in the document-generation system. A fix at the template level flows into every product that uses it; a page-by-page approach in banking never catches up with release velocity.",
  },
  {
    step: "Hold platform and fintech vendors to the standard",
    detail:
      "Core banking platforms, mobile app frameworks, payment widgets, and chat tools are mostly vendor-built, but the legal obligation to the customer stays with you. Require WCAG 2.2 AA conformance and a current ACR/VPAT in contracts and renewals, test vendor releases yourself, and document remediation commitments with dates.",
  },
  {
    step: "Institutionalize and document",
    detail:
      "Adopt an accessibility policy, train product and content teams, publish an accessibility statement with a monitored contact channel, and schedule recurring audits. Under the EAA, documented conformity is part of the obligation itself, and in every regime a dated, evidenced remediation program is the strongest position to hold when a regulator or plaintiff comes asking.",
  },
]

const faqs = [
  {
    question: "Is our online banking covered by the European Accessibility Act?",
    answer:
      "If you provide consumer banking services to consumers in the EU, yes. The EAA explicitly lists consumer banking services among the covered services, and its obligations apply since 28 June 2025. Enforcement is national: in Ireland, S.I. No. 636/2023 designates the Central Bank of Ireland as the regulator for consumer banking services accessibility, and the Irish penalties are criminal, with fines of up to EUR 60,000 and/or up to 18 months imprisonment on indictment. Other member states have their own designated regulators and penalty regimes.",
  },
  {
    question: "What does the FCA Consumer Duty have to do with accessibility?",
    answer:
      "The Consumer Duty, in force since July 2023, requires firms to deliver good outcomes for retail customers, and it pays particular attention to customers in vulnerable circumstances, which includes many disabled customers. A digital journey a disabled customer cannot complete is a poor outcome by definition, so accessibility is one of the clearest ways the Duty translates into concrete product requirements. It sits alongside the Equality Act 2010, which already imposes an anticipatory duty to make reasonable adjustments rather than waiting for a complaint.",
  },
  {
    question: "What accessibility standard should a bank target?",
    answer:
      "Target WCAG 2.2 Level AA. For the EAA, conformity is demonstrated against EN 301 549, the European standard that incorporates WCAG, so building to WCAG 2.2 AA positions you for European enforcement while also addressing the criteria US courts and UK regulators look to in practice. WCAG 2.2 matters specifically for banking because it added Accessible Authentication, which targets exactly the login and 2FA patterns financial services rely on.",
  },
  {
    question: "Are banking apps covered, or just websites?",
    answer:
      "Both. The EAA covers consumer banking services however they are delivered, which includes mobile apps, and WCAG applies to mobile interfaces as well as websites. In practice the mobile app is often the primary channel for retail customers, so an accessible website with an inaccessible app still leaves the service inaccessible. Audit the app's native screens, its embedded web views, and the hand-offs between them.",
  },
  {
    question: "What are the most common accessibility failures in banking?",
    answer:
      "The recurring set: authentication and 2FA flows that demand memorization or transcription under time pressure, session timeouts that log users out before assistive technology users can finish, unlabeled form fields in applications and transfers, transaction tables without proper headers, statements delivered as untagged PDFs that screen readers cannot read, low-contrast text from fintech design trends, and CAPTCHAs with no accessible alternative. Each maps to a specific WCAG success criterion, which makes them auditable and fixable.",
  },
  {
    question: "Do ATMs and payment terminals count?",
    answer:
      "Yes. The EAA covers payment terminals and ATMs as self-service terminals, so the accessibility regime extends to hardware interfaces, not just websites and apps. Terminals already in service before the 2025 application date benefit from a transition period that can run up to 20 years, but newly deployed terminals must comply, which makes accessibility a procurement requirement for every fleet refresh from now on.",
  },
  {
    question: "Does US law require our bank's website to be accessible?",
    answer:
      "Banks and credit unions are regular defendants in ADA Title III website lawsuits, and courts have repeatedly allowed such claims to proceed against financial institutions. Banking and finance accounted for about 1.2% of the roughly 5,000 combined federal and state digital accessibility lawsuits reported for 2025, a small slice of volume but one where defendants have deep pockets, regulated reputations, and essential-service customer relationships. Waiting for a demand letter is the most expensive way to find out.",
  },
]

export default function FinanceIndustryPage() {
  return (
    <div className="container-wide py-12 px-4 sm:px-6">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Industries", url: "https://accessibility.build/industries" },
          { name: "Finance", url: "https://accessibility.build/industries/finance" },
        ]}
      />
      <FAQStructuredData faqs={faqs} />

      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/industries" className="hover:text-primary transition-colors">
              Industries
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span className="text-foreground font-medium">Finance</span>
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 px-4 py-1.5 text-sm font-medium text-sky-700 dark:text-sky-300 mb-6">
          <Landmark className="h-4 w-4" aria-hidden="true" />
          Industry Guide
        </div>
        <h1 className="text-4xl font-bold mb-4">Banking &amp; Financial Services Accessibility</h1>
        <PageByline route="/industries/finance" className="mb-5" />
        <p className="text-xl text-muted-foreground">
          Banking is an essential service, and its digital front door now sits under binding accessibility law on
          both sides of the Atlantic: the European Accessibility Act applies to consumer banking since June 2025,
          the UK&apos;s Consumer Duty and Equality Act reach digital journeys, and US banks remain steady ADA lawsuit
          targets. Here is what applies to you and how to close the gap.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, i) => (
          <div key={i} className="bg-background rounded-2xl border p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Why it matters */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-6">Why accessibility matters in banking and finance</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            One in four US adults lives with a disability, 28.7% per CDC data on our{" "}
            <Link href="/research/disability-statistics" className="text-primary hover:underline">
              disability statistics research
            </Link>
            , and disabled customers control significant spending power. Unlike most sectors, banking is not
            optional: everyone needs to receive wages, pay bills, check balances, and move money. When an online
            banking flow is inaccessible, the customer cannot simply shop elsewhere in the moment; they are locked
            out of their own funds. That is why exclusion in financial services carries outsized human impact and
            outsized regulatory attention.
          </p>
          <p>
            The stakes compound because financial tasks are private by nature. A customer who cannot read their own
            statement, complete a transfer, or pass a login flow independently must hand control of their finances
            to someone else. Accessibility here is not a nice-to-have UX polish; it is the difference between
            financial independence and financial dependence for a quarter of the adult population, and it is
            precisely the kind of harm that anticipatory duties in UK law and service obligations in EU law are
            written to prevent.
          </p>
          <p>
            The industry also has no room for complacency about its baseline. The 2026 WebAIM Million found
            detectable WCAG failures on 95.9% of the top million homepages, and financial sites are not exempt from
            the pattern; see our{" "}
            <Link href="/research/state-of-accessibility" className="text-primary hover:underline">
              State of Accessibility research
            </Link>{" "}
            for the full picture. The business case follows the compliance case: accessible self-service journeys
            reduce call-center load, raise digital adoption, and keep an essential-service brand out of headlines it
            does not want.
          </p>
        </div>
      </section>

      {/* Legal exposure */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-2 text-center">Legal exposure in banking, insurance, and fintech</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          Financial institutions typically operate under several regimes at once. For the European framework, start
          with our <Link href="/compliance/eaa" className="text-primary hover:underline">European Accessibility Act guide</Link>{" "}
          and the <Link href="/compliance/en-301-549" className="text-primary hover:underline">EN 301 549 standard</Link>;
          US litigation trends live on our{" "}
          <Link href="/research/accessibility-lawsuits" className="text-primary hover:underline">lawsuit tracker</Link>.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {legalExposure.map((item, i) => {
            const IconComponent = item.icon
            return (
              <div key={i} className="bg-background rounded-2xl border p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-sky-50 dark:bg-sky-950/30 p-2">
                    <IconComponent className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            )
          })}
        </div>
        <p className="text-sm text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
          Deep dives: the{" "}
          <Link href="/compliance/eaa-ireland" className="text-primary hover:underline">
            EAA in Ireland
          </Link>
          , where the Central Bank regulates banking accessibility, and our{" "}
          <Link href="/compliance/uk" className="text-primary hover:underline">
            UK accessibility law guide
          </Link>{" "}
          covering the Equality Act and the Consumer Duty.
        </p>
      </section>

      {/* WCAG issues */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-2 text-center">The WCAG issues that block banking customers most</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          Financial services audits surface the same categories again and again. Each links to the relevant WCAG
          success criterion.
        </p>
        <div className="space-y-6 max-w-4xl mx-auto">
          {wcagIssues.map((issue, i) => {
            const IconComponent = issue.icon
            return (
              <div key={i} className="bg-background rounded-2xl border p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-sky-50 dark:bg-sky-950/30 p-2.5 flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{issue.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {issue.criteria.map((criterion) => (
                        <Link
                          key={criterion.href}
                          href={criterion.href}
                          className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
                        >
                          {criterion.label}
                        </Link>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-sm text-muted-foreground text-center mt-6 max-w-3xl mx-auto">
          Fix-it guides:{" "}
          <Link href="/guides/accessible-forms" className="text-primary hover:underline">accessible forms</Link>,{" "}
          <Link href="/guides/accessible-form-validation" className="text-primary hover:underline">form validation</Link>,{" "}
          <Link href="/guides/accessible-data-tables" className="text-primary hover:underline">data tables</Link>,{" "}
          <Link href="/guides/pdf-accessibility" className="text-primary hover:underline">PDF accessibility</Link>,{" "}
          <Link href="/guides/cognitive-accessibility" className="text-primary hover:underline">cognitive accessibility</Link>, and{" "}
          <Link href="/guides/mobile-accessibility" className="text-primary hover:underline">mobile accessibility</Link>.
        </p>
      </section>

      {/* Roadmap */}
      <section className="mb-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">A compliance roadmap for financial institutions</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          With EAA obligations already in force for consumer banking, the sequence below is built for closing the
          gap fast and documenting progress as you go.
        </p>
        <ol className="space-y-4">
          {roadmap.map((item, i) => (
            <li key={i} className="bg-background rounded-2xl border p-6 shadow-sm flex gap-4">
              <div
                className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold"
                aria-hidden="true"
              >
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{item.step}</h3>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
          Asking vendors for accessibility documentation? Our{" "}
          <Link href="/guides/vpat-accessibility-conformance-report" className="text-primary hover:underline">
            VPAT and ACR guide
          </Link>{" "}
          explains what to request and how to read it, and our{" "}
          <Link href="/sample-audit-report" className="text-primary hover:underline">
            sample audit report
          </Link>{" "}
          shows what a full audit deliverable looks like.
        </p>
      </section>

      {/* Resources */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Tools and resources for financial services teams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/tools/contrast-checker"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <Contrast className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Contrast Checker</h3>
            <p className="text-sm text-muted-foreground">
              Test balances, rates, and UI text against the 4.5:1 minimum before design ships.
            </p>
          </Link>
          <Link
            href="/tools/url-accessibility-auditor"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <ScanSearch className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">URL Accessibility Auditor</h3>
            <p className="text-sm text-muted-foreground">
              Run a free automated scan of your public pages to see where you stand today.
            </p>
          </Link>
          <Link
            href="/checklists/wcag-2-2"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <CheckCircle2 className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">WCAG 2.2 Checklist</h3>
            <p className="text-sm text-muted-foreground">
              Every criterion, including Accessible Authentication, the one written for login flows.
            </p>
          </Link>
          <Link
            href="/services/accessibility-audits"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <ShieldCheck className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Accessibility Audits</h3>
            <p className="text-sm text-muted-foreground">
              Online banking, app, and document audits mapped to EAA, UK, and ADA obligations.
            </p>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-background rounded-2xl border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="max-w-4xl mx-auto bg-primary/5 rounded-2xl p-8 border border-primary/20">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">The EAA clock is already running. Know where you stand</h2>
          <p className="text-muted-foreground">
            We audit online banking, mobile apps, authentication flows, and statement pipelines against WCAG 2.2 AA
            and EN 301 549, and deliver a remediation plan you can show a regulator.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/contact?service=audit" className="flex items-center">
              Request a Finance Audit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/industries">Explore Other Industries</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
