import Link from "next/link"
import {
  ArrowRight,
  Landmark,
  Scale,
  Gavel,
  FileText,
  FormInput,
  ServerCog,
  Navigation,
  ShoppingBag,
  CheckCircle2,
  Wrench,
  CalendarClock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"

export const metadata = {
  title: "Government Web Accessibility: 508 & Title II",
  description:
    "How Section 508 and the ADA Title II web rule apply to federal, state, and local government sites — deadlines, standards, and a practical path to compliance.",
  alternates: { canonical: "/industries/government" },
  openGraph: {
    type: "website",
    title: "Government Web Accessibility: 508 & Title II",
    description:
      "How Section 508 and the ADA Title II web rule apply to federal, state, and local government sites — deadlines, standards, and a practical path to compliance.",
    url: "/industries/government",
    images: [
      {
        url: "/api/og?title=Government%20Web%20Accessibility%3A%20508%20%26%20Title%20II&section=Industries",
        width: 1200,
        height: 630,
        alt: "Government Web Accessibility: 508 & Title II",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Government Web Accessibility: 508 & Title II",
    description:
      "How Section 508 and the ADA Title II web rule apply to federal, state, and local government sites — deadlines, standards, and a practical path to compliance.",
    images: ["/api/og?title=Government%20Web%20Accessibility%3A%20508%20%26%20Title%20II&section=Industries"],
  },
}

const stats = [
  {
    value: "Since 2018",
    label:
      "federal agencies have been bound to WCAG-based ICT standards under the Revised Section 508 rules — no grace period left",
  },
  {
    value: "2027 / 2028",
    label:
      "current ADA Title II web deadlines for state and local governments after the DOJ's April 2026 one-year extension",
  },
  {
    value: "WCAG 2.1 AA",
    label: "the technical standard the Title II rule adopts for public entities' web content and mobile apps",
  },
  {
    value: "1 in 4",
    label:
      "US adults has a disability — and unlike private customers, residents cannot take government services elsewhere",
  },
]

const legalExposure = [
  {
    icon: Gavel,
    title: "Section 508 — the federal baseline",
    description:
      "Section 508 of the Rehabilitation Act requires federal agencies to make their information and communication technology (ICT) accessible to employees and members of the public with disabilities. The Revised 508 Standards, in force since January 2018, incorporate WCAG 2.0 Level AA for web content and apply it to electronic documents and software as well. Crucially, 508 governs procurement: agencies must buy accessible ICT, which is why vendors selling to the federal government live and die by their Accessibility Conformance Reports (VPATs). Agencies must also handle 508 complaints and report on compliance — and inaccessible systems routinely surface in Inspector General findings and litigation by federal employees.",
  },
  {
    icon: Scale,
    title: "The ADA Title II web rule — state and local governments",
    description:
      "The DOJ's April 2024 final rule under ADA Title II gave state and local governments their first explicit web accessibility standard: WCAG 2.1 Level AA for web content and mobile apps. Original deadlines were April 24, 2026 for entities serving 50,000 or more people and April 26, 2027 for smaller entities and special districts; a DOJ Interim Final Rule in April 2026 extended both by one year, to April 26, 2027 and April 26, 2028. The rule covers everything a public entity offers online — services, programs, activities — including content provided through contractors. The extension moved dates only; the standard, scope, and exceptions are unchanged, and private Title II lawsuits and state-law claims continue regardless.",
  },
  {
    icon: CalendarClock,
    title: "State accessibility laws with their own teeth",
    description:
      "Several states legislate beyond the federal floor. Colorado's HB21-1110 makes inaccessible state and local government ICT a civil rights violation with statutory damages, with obligations live since July 2024. Illinois's Information Technology Accessibility Act binds state agencies and universities, and many states pin their standards to current WCAG or Section 508 by policy. The DOJ's federal extension does not pause any of these — a Colorado municipality, for example, has been exposed to state claims since 2024 no matter what the federal Title II timeline says.",
  },
  {
    icon: ShoppingBag,
    title: "Procurement liability flows both ways",
    description:
      "Government does not build most of its technology; it buys it. Payment processors, permit systems, agenda-management platforms, transit apps, and emergency-alert services are vendor products — but Section 508 and the Title II rule hold the government entity responsible for what residents experience, including services delivered through contractors. That makes accessibility clauses, honest ACRs/VPATs, independent verification, and remediation commitments in contracts a compliance requirement, not a nice-to-have. For vendors, it means WCAG conformance is now the price of admission to the public-sector market.",
  },
]

const wcagIssues = [
  {
    icon: FileText,
    title: "The PDF backlog",
    criteria: [
      { label: "WCAG 1.3.1 Info and Relationships", href: "/wcag/1-3-1" },
      { label: "WCAG 1.1.1 Non-text Content", href: "/wcag/1-1-1" },
    ],
    description:
      "Government's defining accessibility problem is documents: decades of meeting minutes, ordinances, permit applications, budgets, and reports published as untagged or scanned PDFs that screen readers cannot parse. The Title II rule's exception for pre-existing documents evaporates the moment a document is needed to access a current service or program. Triage rather than boil the ocean — tag the documents residents actually use, convert forms and high-traffic content to accessible HTML, fix the templates that generate new documents, and test with our free PDF accessibility checker.",
  },
  {
    icon: FormInput,
    title: "Online forms and resident services",
    criteria: [
      { label: "WCAG 3.3.2 Labels or Instructions", href: "/wcag/3-3-2" },
      { label: "WCAG 3.3.1 Error Identification", href: "/wcag/3-3-1" },
    ],
    description:
      "Benefits applications, permit and license forms, tax payments, records requests, and service complaints are the core transactions of digital government — and they are riddled with unlabeled fields, inaccessible CAPTCHAs, rigid session timeouts, and error messages that never reach assistive technology. A resident who cannot complete the online benefits form is not inconvenienced; they are denied a government service, which is precisely what Title II and Section 508 prohibit.",
  },
  {
    icon: ServerCog,
    title: "Legacy systems and vendor portals",
    criteria: [
      { label: "WCAG 2.1.1 Keyboard", href: "/wcag/2-1-1" },
      { label: "WCAG 4.1.2 Name, Role, Value", href: "/wcag/4-1-2" },
    ],
    description:
      "Court records systems, utility-billing portals, GIS map viewers, and job-application platforms often run on decade-old vendor software with custom widgets that have no accessible names, no keyboard support, and no ARIA semantics. These systems fail hardest and are slowest to fix, so start the vendor conversations now: demand conformance roadmaps at renewal, require ACRs for replacements, and where remediation is genuinely infeasible, stand up an accessible alternative channel while the replacement is procured.",
  },
  {
    icon: Navigation,
    title: "Navigation, structure, and findability",
    criteria: [
      { label: "WCAG 2.4.1 Bypass Blocks", href: "/wcag/2-4-1" },
      { label: "WCAG 2.4.6 Headings and Labels", href: "/wcag/2-4-6" },
    ],
    description:
      "Government sites are sprawling — hundreds of departments, thousands of pages — and without skip links, sane heading hierarchies, and descriptive link text, screen reader users must wade through repeated menus on every page to find anything. Information architecture is an accessibility issue at this scale: consistent templates, landmarks, and a working site search determine whether residents with disabilities can locate the service at all.",
  },
  {
    icon: Landmark,
    title: "Emergency information and multimedia",
    criteria: [
      { label: "WCAG 1.2.2 Captions (Prerecorded)", href: "/wcag/1-2-2" },
      { label: "WCAG 1.4.3 Contrast (Minimum)", href: "/wcag/1-4-3" },
    ],
    description:
      "Council-meeting streams and recordings need captions; emergency alerts published as images of text on social media are unreadable to screen readers exactly when the stakes are highest. Public-meeting video is explicitly within the Title II rule's scope going forward, and effective communication during emergencies is a long-standing ADA obligation — publish alerts as real text, caption public videos, and keep contrast and legibility high in crisis communications.",
  },
]

const roadmap = [
  {
    step: "Establish governance and inventory",
    detail:
      "Name an accessibility coordinator with authority, then inventory the full estate: websites and subdomains, mobile apps, vendor portals, document repositories, kiosks, and social channels. Government estates are federated across departments — compliance fails where ownership is ambiguous, so assign every property an owner and a deadline.",
  },
  {
    step: "Audit against the applicable standard",
    detail:
      "Federal agencies audit against the Revised 508 Standards (WCAG 2.0 AA baseline, with WCAG 2.1/2.2 AA as good practice); state and local entities against WCAG 2.1 AA per the Title II rule. Combine automated crawls — invaluable at government scale — with manual keyboard and screen reader testing of the top resident transactions, and validate against the WCAG 2.2 checklist.",
  },
  {
    step: "Triage by resident impact",
    detail:
      "Fix the services residents depend on first: payments, benefits, permits, emergency information, and the documents those services require. A tagged budget PDF from 2015 helps no one if the water-bill portal is unusable. Publish your prioritization — transparency about the plan is itself a defensible posture under Title II.",
  },
  {
    step: "Fix procurement so the problem stops growing",
    detail:
      "Add explicit WCAG/508 conformance requirements, ACR/VPAT submission, independent verification, and remediation obligations to every ICT solicitation and renewal. Section 508 has made accessible procurement mandatory federally since the standards took effect; state and local entities need the same discipline or every new purchase adds to the backlog.",
  },
  {
    step: "Operationalize: train, monitor, and report",
    detail:
      "Train content authors (the people publishing agendas and notices daily), enforce accessible templates in the CMS, run continuous automated monitoring with scheduled manual re-audits, and publish an accessibility statement with a responsive barrier-reporting channel. Document everything — under both 508 and Title II, a dated record of progress is your best evidence in any complaint or investigation.",
  },
]

const faqs = [
  {
    question: "What is the difference between Section 508 and the ADA Title II web rule?",
    answer:
      "Section 508 applies to federal agencies (and is contractually flowed down to their vendors), requiring accessible ICT under the Revised 508 Standards, which incorporate WCAG 2.0 AA — it also governs what the federal government may buy. The ADA Title II web rule applies to state and local governments and adopts WCAG 2.1 AA for web content and mobile apps, with compliance deadlines phased by population size. Many states additionally require 508-equivalent standards for their own agencies by statute or policy, so a given system can be subject to several regimes at once.",
  },
  {
    question: "What are the current Title II compliance deadlines for state and local governments?",
    answer:
      "The 2024 final rule originally required WCAG 2.1 AA conformance by April 24, 2026 for public entities serving populations of 50,000 or more, and by April 26, 2027 for smaller entities and special district governments. In April 2026, the DOJ issued an Interim Final Rule extending both deadlines by one year — to April 26, 2027 and April 26, 2028. Nothing else changed, and state laws like Colorado's HB21-1110 and private litigation did not pause, so prudent entities are keeping the original dates as internal targets.",
  },
  {
    question: "Do decades of old PDFs on our site all have to be remediated?",
    answer:
      "Not all at once. The Title II rule contains exceptions for archived web content and for pre-existing electronic documents — but the exceptions end where current use begins: any document someone needs to apply for, access, or participate in a current service, program, or activity must be accessible, and individuals can always request accessible versions as effective communication. The practical strategy is triage: tag the actively used documents, move forms and high-traffic content to accessible HTML, fix generating templates so new documents are born accessible, and handle true archives on request.",
  },
  {
    question: "Are third-party systems like payment portals and agenda platforms our responsibility?",
    answer:
      "Yes. Both Section 508 and the Title II rule hold the government entity responsible for the accessibility of services it provides through contractors and vendor platforms — residents experience the permit system as the city, not as the software company. That is why procurement is the main lever: require WCAG conformance and current ACRs/VPATs in solicitations, verify claims through your own testing, and negotiate remediation timelines. If a legacy vendor system cannot be fixed promptly, provide an equally effective accessible alternative in the interim.",
  },
  {
    question: "How is government web accessibility actually enforced?",
    answer:
      "Through several channels at once. The DOJ can investigate and sue under Title II, and individuals can file DOJ complaints or private lawsuits — Title II carries a private right of action. Section 508 requires agencies to accept complaints, and federal employees and members of the public have litigated under it. Funding agencies enforce Section 504 against grantees, state attorneys general and private plaintiffs enforce state laws like Colorado's, and advocacy organizations routinely test public-sector sites. The volume across all channels is tracked in our lawsuit and enforcement research.",
  },
  {
    question: "Which WCAG version should a government team build to in 2026?",
    answer:
      "Build to WCAG 2.2 Level AA. It is the current W3C recommendation and is backwards-compatible: meeting 2.2 AA automatically satisfies the Title II rule's 2.1 AA requirement and the 2.0 AA baseline in the Revised 508 Standards, while adding criteria — focus appearance, target size, accessible authentication — that materially help residents. Building to the newest standard also future-proofs procurement specs and avoids re-auditing when regulations inevitably move forward.",
  },
]

export default function GovernmentIndustryPage() {
  return (
    <div className="container-wide py-12 px-4 sm:px-6">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Industries", url: "https://accessibility.build/industries" },
          { name: "Government", url: "https://accessibility.build/industries/government" },
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
            <span className="text-foreground font-medium">Government</span>
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-4 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-300 mb-6">
          <Landmark className="h-4 w-4" aria-hidden="true" />
          Industry Guide
        </div>
        <h1 className="text-4xl font-bold mb-4">Government Web Accessibility: Section 508 &amp; Title II</h1>
        <p className="text-xl text-muted-foreground">
          Residents cannot choose a different government. That is why federal agencies answer to Section 508, state
          and local entities now face explicit WCAG deadlines under the ADA Title II rule, and inaccessible PDFs,
          forms, and legacy systems have become legal liabilities. Here is the full picture.
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
        <h2 className="text-3xl font-bold mb-6">Why accessibility matters in government</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Government services are the one category of digital service no one can opt out of. Paying taxes, renewing
            a license, applying for benefits, requesting records, registering to vote, and receiving emergency alerts
            all increasingly happen online — and the residents most likely to depend on those services are
            disproportionately likely to have disabilities. One in four US adults has a disability, with higher rates
            among older adults, veterans, and lower-income residents. When a benefits portal fails a screen reader
            user, there is no competitor to switch to; the service is simply denied.
          </p>
          <p>
            Digital accessibility is also an equity multiplier for government. The same structural quality that
            serves assistive technology — semantic HTML, plain language, logical forms, real text instead of image
            scans — makes services work for residents on old phones, slow connections, and limited English. Agencies
            that invested in accessible digital services consistently report fewer call-center escalations and
            in-person visits, because the online channel finally works for everyone it was built to replace.
          </p>
          <p>
            And government sets the market. Because Section 508 and state procurement rules require agencies to buy
            accessible technology, every RFP that takes accessibility seriously pushes the entire vendor ecosystem —
            the same platforms that private-sector sites then reuse. Public-sector compliance work, tracked alongside
            private litigation in our{" "}
            <Link href="/research/accessibility-lawsuits" className="text-primary hover:underline">
              lawsuit and enforcement research
            </Link>
            , is where accessibility standards become industry norms.
          </p>
        </div>
      </section>

      {/* Legal exposure */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-2 text-center">The legal framework for public sector digital services</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          Which rules bind you depends on your level of government. Full statutory detail lives in our{" "}
          <Link href="/compliance/section-508" className="text-primary hover:underline">Section 508 guide</Link> and{" "}
          <Link href="/compliance/ada" className="text-primary hover:underline">ADA compliance guide</Link>.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {legalExposure.map((item, i) => {
            const IconComponent = item.icon
            return (
              <div key={i} className="bg-background rounded-2xl border p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-2">
                    <IconComponent className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            )
          })}
        </div>
        <p className="text-sm text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
          Deep dive: our analysis of the{" "}
          <Link href="/guides/doj-title-ii-deadline-extension" className="text-primary hover:underline">
            DOJ Title II deadline extension
          </Link>{" "}
          and what it does — and does not — change.
        </p>
      </section>

      {/* WCAG issues */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-2 text-center">The WCAG issues that dominate government audits</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          Public-sector estates share a distinctive failure profile: documents, forms, and legacy systems. Each issue
          links to the relevant WCAG success criterion.
        </p>
        <div className="space-y-6 max-w-4xl mx-auto">
          {wcagIssues.map((issue, i) => {
            const IconComponent = issue.icon
            return (
              <div key={i} className="bg-background rounded-2xl border p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-2.5 flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
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
      </section>

      {/* Roadmap */}
      <section className="mb-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-2 text-center">A compliance roadmap for public entities</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          Sized for the realities of government: federated ownership, procurement cycles, and estates measured in
          thousands of pages.
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
      </section>

      {/* Resources */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Tools and resources for government teams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/tools/pdf-accessibility-checker"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <FileText className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">PDF Accessibility Checker</h3>
            <p className="text-sm text-muted-foreground">
              Triage your document backlog — test agendas, forms, and reports for tagging and structure.
            </p>
          </Link>
          <Link
            href="/checklists/wcag-2-2"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <CheckCircle2 className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">WCAG 2.2 Checklist</h3>
            <p className="text-sm text-muted-foreground">
              Meets and exceeds both the Title II standard and the Section 508 baseline.
            </p>
          </Link>
          <Link
            href="/services/accessibility-audits"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <Wrench className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Accessibility Audits</h3>
            <p className="text-sm text-muted-foreground">
              Estate-wide audits against 508 or Title II, with triage built for public-sector scale.
            </p>
          </Link>
          <Link
            href="/compliance/eaa"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <Scale className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Global Standards</h3>
            <p className="text-sm text-muted-foreground">
              Operating internationally? See how the European Accessibility Act compares.
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
          <h2 className="text-2xl font-bold mb-2">Turn your deadline into a plan</h2>
          <p className="text-muted-foreground">
            We audit government estates against Section 508 and the Title II rule, triage by resident impact, and
            deliver remediation plans and procurement language your teams can execute before the deadlines land.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/contact?service=audit" className="flex items-center">
              Request a Government Audit
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
