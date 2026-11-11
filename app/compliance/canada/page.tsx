import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { PageByline } from "@/components/seo/page-byline"
import { KeyFacts } from "@/components/research/key-facts"
import { clampDescription } from "@/lib/metadata"

const pageTitle = "Canada Web Accessibility Law: ACA, 2025 Rules and AODA"
const pageDescription = clampDescription(
  "Canada web accessibility law: the Accessible Canada Act, SOR/2025-255 digital rules (Dec 2027 and 2028), EN 301 549, penalties and Ontario's AODA."
)
const ogTitle = encodeURIComponent(pageTitle)

// Dates the page is pinned to. Restamp when SOR/2025-255 starts to come into
// force (5 December 2027), when ASC adopts a new CAN/ASC-EN 301 549 edition, or
// when a province adopts a web standard.
const REVIEWED_ON = "11 November 2026"
const REVIEWED_ISO = "2026-11-11"

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "canada web accessibility law",
    "accessible canada act website",
    "sor/2025-255",
    "accessible canada regulations ict",
    "can/asc-en 301 549",
    "aoda website requirements",
    "aoda wcag 2.0 aa",
    "manitoba accessible information and communication standard",
    "sgqri 008 3.0",
    "standard on web accessibility rescinded",
    "jodhan v canada",
    "wcag canada law",
  ],
  alternates: {
    canonical: "/compliance/canada",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/compliance/canada",
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
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Compliance`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const linkClass = "text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2"

const ACA = "https://laws-lois.justice.gc.ca/eng/acts/A-0.6/FullText.html"
const ACR = "https://laws-lois.justice.gc.ca/eng/regulations/SOR-2021-241/FullText.html"
const SOR_2025_255 = "https://gazette.gc.ca/rp-pr/p2/2025/2025-12-17/html/sor-dors255-eng.html"
const GAZETTE_I = "https://gazette.gc.ca/rp-pr/p1/2024/2024-12-21/html/reg5-eng.html"
const ESDC_PHASE_1 =
  "https://www.canada.ca/en/employment-social-development/programs/accessible-canada-regulations-guidance/digital-technologies-phase-1.html"
const ESDC_PHASE_2 =
  "https://www.canada.ca/en/employment-social-development/programs/accessible-canada/consultation-accessibility-regulations-information-communication-technologies-phase-two.html"
const ASC_RELEASE =
  "https://accessible.canada.ca/news/accessibility-standards-canada-adopts-globally-recognized-accessibility-standard-ict-products"
const ASC_SUMMARY =
  "https://accessible.canada.ca/creating-accessibility-standards/summary-can-asc-en-301-5492024-accessibility-requirements-ict-products-and-services-en-301-5492021-idt"
const TBS_DIRECTION =
  "https://www.canada.ca/en/government/system/digital-government/policies-standards/policy-service-digital-announcements/direction-information-communication-technologies-accessibility-towards-regulatory-implementation.html"
const ATPDR = "https://laws-lois.justice.gc.ca/eng/regulations/SOR-2019-244/FullText.html"
const COMMISSIONER_REPORT =
  "https://www.chrc-ccdp.gc.ca/sites/default/files/documents/aca-2025-2026-annual-report.pdf"
const JODHAN = "https://decisions.fca-caf.gc.ca/fca-caf/decisions/en/item/37507/index.do"
const AODA = "https://www.ontario.ca/laws/statute/05a11"
const IASR = "https://www.ontario.ca/laws/regulation/110191"
const ONTARIO_REPORTING = "https://www.ontario.ca/page/completing-your-accessibility-compliance-report"
const MANITOBA_REG = "https://web2.gov.mb.ca/laws/regs/current/_pdf-regs.php?reg=47/2022"
const QUEBEC_SGQRI =
  "https://www.quebec.ca/gouvernement/ministere/cybersecurite-numerique/publications/standard-accessibilite-sites-web"
const NOVA_SCOTIA = "https://novascotia.ca/accessibility/information-communication/"
const W3C_WCAG22_FR = "https://www.w3.org/WAI/news/2025-03-17/wcag-22-french"

const sources = [
  {
    label:
      "Regulations Amending the Accessible Canada Regulations, SOR/2025-255, P.C. 2025-886, registered 5 December 2025, with Regulatory Impact Analysis Statement, Canada Gazette Part II, Vol. 159, No. 26, 17 December 2025",
    href: SOR_2025_255,
  },
  {
    label:
      "Accessible Canada Regulations, SOR/2021-241, consolidated text including the SOR/2025-255 amendments not yet in force, Justice Laws Website (current to 19 October 2026)",
    href: ACR,
  },
  {
    label: "Accessible Canada Act, S.C. 2019, c. 10, Justice Laws Website (current to 19 October 2026)",
    href: ACA,
  },
  {
    label:
      "Proposed Regulations Amending the Accessible Canada Regulations, prepublication, Canada Gazette Part I, Vol. 158, No. 51, 21 December 2024",
    href: GAZETTE_I,
  },
  {
    label:
      "Overview of regulatory amendments: digital technologies (Phase 1), Employment and Social Development Canada guidance, 17 December 2025",
    href: ESDC_PHASE_1,
  },
  {
    label:
      "Consultation on accessibility regulations for information and communication technologies, Phase 2, Employment and Social Development Canada (status: planned)",
    href: ESDC_PHASE_2,
  },
  {
    label:
      "Accessibility Standards Canada adopts globally recognized accessibility standard for ICT products, news release, 31 May 2024",
    href: ASC_RELEASE,
  },
  {
    label:
      "Summary of CAN/ASC - EN 301 549:2024 Accessibility requirements for ICT products and services (EN 301 549:2021, IDT), Accessibility Standards Canada",
    href: ASC_SUMMARY,
  },
  {
    label:
      "Direction on Information Communication Technologies Accessibility; towards regulatory implementation, Chief Information Officer of Canada, Treasury Board of Canada Secretariat, page dated 12 March 2026",
    href: TBS_DIRECTION,
  },
  {
    label:
      "Accessible Transportation for Persons with Disabilities Regulations, SOR/2019-244, section 9, Justice Laws Website",
    href: ATPDR,
  },
  {
    label: "Accessibility Commissioner, Accessible Canada Act annual report 2025 to 2026, Canadian Human Rights Commission",
    href: COMMISSIONER_REPORT,
  },
  {
    label: "Canada (Attorney General) v. Jodhan, 2012 FCA 161, Federal Court of Appeal, 30 May 2012",
    href: JODHAN,
  },
  {
    label: "Accessibility for Ontarians with Disabilities Act, 2005, S.O. 2005, c. 11, Ontario e-Laws",
    href: AODA,
  },
  {
    label: "Integrated Accessibility Standards, O. Reg. 191/11, sections 14 and 83 and Schedule 3, Ontario e-Laws",
    href: IASR,
  },
  {
    label: "Completing your accessibility compliance report, Government of Ontario (updated 19 February 2026)",
    href: ONTARIO_REPORTING,
  },
  {
    label: "Accessible Information and Communication Standard Regulation, Man. Reg. 47/2022, Manitoba (PDF)",
    href: MANITOBA_REG,
  },
  {
    label:
      "Standard sur l'accessibilité des sites Web (SGQRI 008 3.0), Ministère de la Cybersécurité et du Numérique, Québec",
    href: QUEBEC_SGQRI,
  },
  {
    label: "Information and communication accessibility standard, Accessibility Directorate, Government of Nova Scotia",
    href: NOVA_SCOTIA,
  },
  {
    label: "W3C publishes authorized French translation of WCAG 2.2, W3C Web Accessibility Initiative, 17 March 2025",
    href: W3C_WCAG22_FR,
  },
]

const faqs = [
  {
    question: "Does the Accessible Canada Act apply to my website?",
    answer:
      "Only if your organisation is federally regulated. Section 7(1) of the Accessible Canada Act covers federal departments and agencies, Crown corporations, the Canadian Forces, Parliament, and private organisations operating a work, undertaking or business within the legislative authority of Parliament, such as banks, telecommunications and broadcasting companies, airlines, rail, interprovincial trucking, pipelines, ports, and postal and courier services. Most retailers, e-commerce stores and software companies are provincially regulated, so the Act does not reach them. Their web duties, if any, come from provincial law, such as Ontario's AODA or Manitoba's information and communication standard, and from human rights codes.",
  },
  {
    question: "When do the federal web accessibility rules start?",
    answer:
      "The digital rules are SOR/2025-255, registered on 5 December 2025 and published in the Canada Gazette Part II on 17 December 2025. They are final law but none of it is in force yet. Section 18 brings them in on two dates. On 5 December 2027, federal public sector web pages and their accessibility statements, and training for the public sector and for businesses with 100 or more employees, start. On 5 December 2028, business web pages, mobile apps, downloadable documents, large business accessibility statements and procurement checks start, and the federal public sector picks up the app, document and procurement duties on the same day.",
  },
  {
    question: "Which WCAG version does Canada require?",
    answer:
      "Federally, the rules point to CAN/ASC-EN 301 549, Accessibility Standards Canada's adoption of the European standard, as amended from time to time. The current edition, CAN/ASC-EN 301 549:2024, is EN 301 549 v3.2.1 adopted without change, and its web clause maps to WCAG 2.1 Level AA. Section 19.9 also lets an organisation conform to any newer ETSI EN 301 549 instead, which in our reading means EN 301 549 v4.1.1 and its WCAG 2.2 AA web clause would also satisfy the rule. Provincially, Ontario requires WCAG 2.0 AA, Manitoba WCAG 2.1 AA, and Quebec's public sector WCAG 2.1 plus some WCAG 2.2 criteria at a general AA target.",
  },
  {
    question: "Are small businesses exempt?",
    answer:
      "From the federal digital rules, yes. Federally regulated businesses with 99 or fewer employees, averaged over the preceding three years, have no web, app, document, statement, procurement or training duties under SOR/2025-255. Those with fewer than 10 employees are also exempt from the existing accessibility plan, feedback and progress report duties. Medium businesses with 100 to 499 employees must make new and updated web pages conform and train staff, but have no mobile app, document, statement or procurement duties; those apply to large businesses with 500 or more employees and to the federal public sector.",
  },
  {
    question: "Do I have to fix my existing website and apps?",
    answer:
      "Not under the federal rules as written. The web duty covers pages created or updated on or after the start date, and the regulatory impact statement treats any change to a page's content as an update. The app duty covers apps launched after the start date; for apps already on offer, large businesses and the public sector must obtain a conformity assessment and gap analysis rather than fix them by a deadline. The document duty covers documents made available for download after the start date. Heritage content and user-generated content are excluded throughout, and the duties apply to the extent feasible, with alternative means of access required where conformity is not feasible.",
  },
  {
    question: "What are the penalties for an inaccessible website in Canada?",
    answer:
      "Federally, every digital obligation in SOR/2025-255 is classified as a minor violation. For a regulated entity other than a small business, a minor violation carries a penalty of $1,000 to $10,000 for a first violation, $10,000 to $25,000 for a second, $25,000 to $50,000 for a third and $50,000 to $75,000 for a fourth or later one. A violation that continues for more than one day is a separate violation for each day, and the Accessibility Commissioner can publish the names of violators. The $250,000 often quoted is the statutory ceiling for any violation under the Act, reached only by very serious violations. In Ontario, administrative penalties for corporations run from $500 to $15,000, and the $100,000 a day figure applies to offences such as filing false information or ignoring an order, or to a daily penalty where both the impact and the history of a breach are major.",
  },
  {
    question: "What does Ontario's AODA require for websites?",
    answer:
      "Section 14 of the Integrated Accessibility Standards Regulation, O. Reg. 191/11, requires designated public sector organisations and large organisations, meaning those with 50 or more employees in Ontario, to make their internet websites and web content conform with WCAG 2.0 Level AA, other than success criteria 1.2.4 Captions (Live) and 1.2.5 Audio Descriptions (Pre-recorded). The Level AA deadline was 1 January 2021. The duty covers sites and web applications the organisation controls directly or through a contract that allows modification, covers content published after 1 January 2012, and applies except where meeting it is not practicable. Organisations with fewer than 50 employees have no website duty. Businesses and non-profits with 20 or more employees file a compliance report every three years, and the next deadline is 31 December 2026.",
  },
  {
    question: "Does the Standard on Web Accessibility still apply to federal departments?",
    answer:
      "No. The Treasury Board's 2011 Standard on Web Accessibility, which required WCAG 2.0 AA, was rescinded with immediate effect by a direction from the Chief Information Officer of Canada on a page dated 12 March 2026. During the transition to the new regulations, departments must keep public-facing websites and device-based mobile apps at a minimum of WCAG 2.0, and the direction points them to CAN/ASC-EN 301 549 and the technical summary of EN 301 549 v3.2.1. Pages that still describe the 2011 Standard as the binding rule are out of date.",
  },
]

const hero = [
  { label: "Digital Rules", value: "SOR/2025-255", note: "Final law; nothing in force yet" },
  { label: "Federal Public Sector", value: "5 Dec 2027", note: "New and updated web pages, statements, training" },
  { label: "Businesses with 100+", value: "5 Dec 2028", note: "Web pages; apps, documents, statements for 500+" },
  { label: "Standard", value: "WCAG 2.1 AA", note: "Via CAN/ASC-EN 301 549:2024 (EN 301 549 v3.2.1)" },
]

type DutyRow = {
  duty: string
  section: string
  publicSector: string
  large: string
  medium: string
}

const duties: DutyRow[] = [
  {
    duty: "Training in accessibility fundamentals for staff who develop, maintain or procure ICT, refreshed every three years",
    section: "19.8",
    publicSector: "5 Dec 2027",
    large: "5 Dec 2027",
    medium: "5 Dec 2027",
  },
  {
    duty: "New or updated employee-facing web pages conform (clauses 4 to 7 and 9)",
    section: "19.4",
    publicSector: "5 Dec 2027",
    large: "5 Dec 2028",
    medium: "5 Dec 2028",
  },
  {
    duty: "New or updated public-facing web pages conform (clauses 4 to 7 and 9)",
    section: "19.5",
    publicSector: "5 Dec 2027",
    large: "5 Dec 2028",
    medium: "5 Dec 2028",
  },
  {
    duty: "Accessibility statement, reviewed every 12 months",
    section: "19.6",
    publicSector: "5 Dec 2027 (web pages)",
    large: "5 Dec 2028",
    medium: "Not required",
  },
  {
    duty: "Mobile apps launched after the date conform, unless employee-facing (clauses 4 to 7 and 11)",
    section: "19.51(1)",
    publicSector: "5 Dec 2028",
    large: "5 Dec 2028",
    medium: "Not required",
  },
  {
    duty: "Conformity assessment and gap analysis of existing apps still on offer",
    section: "19.51(5)",
    publicSector: "5 Dec 2028",
    large: "5 Dec 2028",
    medium: "Not required",
  },
  {
    duty: "Documents (PDF, Word and similar) downloadable from public pages or apps conform (clauses 4 to 7 and 10)",
    section: "19.52",
    publicSector: "5 Dec 2028",
    large: "5 Dec 2028",
    medium: "Not required",
  },
  {
    duty: "Procurement: obtain a conformity assessment and gap analysis when buying web or app products or services",
    section: "19.61",
    publicSector: "5 Dec 2028",
    large: "5 Dec 2028",
    medium: "Not required",
  },
]

export default function CanadaCompliancePage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Compliance", url: "https://accessibility.build/compliance" },
          { name: "Canada", url: "https://accessibility.build/compliance/canada" },
        ]}
      />

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
                Canada
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-slate-900 via-red-950 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="text-red-200 font-semibold text-sm tracking-wider uppercase mb-4">
              Compliance Guide &bull; Canada
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Digital Accessibility Law in Canada:{" "}
              <span className="bg-gradient-to-r from-red-300 to-amber-200 bg-clip-text text-transparent">
                the ACA, the 2025 Rules and the AODA
              </span>
            </h1>
            <PageByline route="/compliance/canada" variant="hero" tone="inverse" className="mt-0 mb-5" />
            <p className="text-lg md:text-xl text-slate-300 mb-6 max-w-2xl">
              Canada now has a federal web accessibility rule with dates and penalties attached. The
              2025 amendments to the Accessible Canada Regulations make federally regulated
              organisations build new web pages, apps and documents to CAN/ASC-EN 301 549, the
              Canadian edition of the European standard with WCAG 2.1 AA inside. Most private
              businesses sit under provincial law instead, where Ontario has required WCAG 2.0 AA of
              larger organisations since 2021 and Manitoba WCAG 2.1 AA for new content since 2025.
            </p>
            <p
              className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-amber-300/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100 mb-10"
              aria-label="Page status"
            >
              <strong className="font-semibold text-amber-200">Status: final law, not yet in force.</strong>
              <span>
                SOR/2025-255 was registered 5 December 2025 and published 17 December 2025. It comes
                into force on 5 December 2027 and 5 December 2028. Reviewed{" "}
                <time dateTime={REVIEWED_ISO}>{REVIEWED_ON}</time>.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-2">
            {hero.map((t) => (
              <div key={t.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
                <p className="text-slate-300 text-sm font-medium mb-1">{t.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-white">{t.value}</p>
                <p className="text-slate-300 text-xs mt-1">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <KeyFacts
          title="Canada digital accessibility, the numbers"
          facts={[
            {
              value: "5 Dec 2027",
              label: "First SOR/2025-255 provisions come into force: federal public sector web pages and statements, and training for the public sector and businesses with 100+ employees",
              source: "SOR/2025-255, s. 18(1)",
              sourceHref: SOR_2025_255,
              asOf: "2025-12-17",
            },
            {
              value: "5 Dec 2028",
              label: "Remaining provisions come into force: business web pages, mobile apps, downloadable documents, large business statements and procurement checks",
              source: "SOR/2025-255, s. 18(2)",
              sourceHref: SOR_2025_255,
              asOf: "2025-12-17",
            },
            {
              value: "$75,000",
              label: "Top of the penalty range for a fourth or later minor violation by a non-small business; every digital duty is classed minor, and each day is a separate violation",
              source: "Accessible Canada Regulations, Sched. 2 Part 3; ACA s. 88",
              sourceHref: ACR,
              asOf: "2026-10-19",
            },
            {
              value: "1,101",
              label: "Organisations the government expects to be affected from the first period: about 183 federal public sector entities, 199 large and 719 medium businesses",
              source: "SOR/2025-255 Regulatory Impact Analysis Statement",
              sourceHref: SOR_2025_255,
              asOf: "2025-12-17",
            },
            {
              value: "27%",
              label: "Share of the population with a disability, nearly 8 million people, per the 2022 Canadian Survey on Disability cited by the government",
              source: "SOR/2025-255 Regulatory Impact Analysis Statement",
              sourceHref: SOR_2025_255,
              asOf: "2025-12-17",
            },
            {
              value: "1 Jan 2040",
              label: "The Accessible Canada Act's target date for a Canada without barriers, including in information and communication technologies",
              source: "Accessible Canada Act, s. 5",
              sourceHref: ACA,
              asOf: "2026-10-19",
            },
          ]}
        />

        <div className="max-w-3xl mx-auto space-y-16">
          {/* ACA */}
          <section aria-labelledby="aca-heading">
            <h2 id="aca-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The Accessible Canada Act: Who It Covers
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Accessible Canada Act (S.C. 2019, c. 10) received Royal Assent on 21 June 2019
              and, apart from section 205, came into force on 11 July 2019. Section 5 sets its
              purpose: a Canada without barriers on or before 1 January 2040, reached by
              identifying, removing and preventing barriers in employment, the built environment,
              information and communication technologies, other communication, procurement, the
              design and delivery of programs and services, and transportation.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              It is a federal law, so it reaches only what Parliament regulates. Section 7(1)
              applies it to:
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>Federal departments and agencies in Schedules I to V of the Financial Administration Act, Crown corporations, designated parts of the federal public administration and the Canadian Forces</li>
              <li>Any person or organisation operating a work, undertaking or business within the legislative authority of Parliament: in practice banks, telecommunications and broadcasting, airlines, rail, interprovincial and international transport, ports, pipelines, and postal and courier services</li>
              <li>Certain others, including First Nations band councils, and, with modifications under Part 9, Parliament itself</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The regulatory impact statement&apos;s examples of federally regulated private organisations are
              &ldquo;banking, parcel services, pipeline companies, trucking companies, feed, flour,
              seed and grain companies, uranium mining&rdquo;. Most retail, e-commerce and software
              businesses are provincially regulated and outside the Act. If that describes you,
              skip ahead to{" "}
              <a href="#provinces-heading" className={linkClass}>
                the provinces
              </a>
              .
            </p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              Enforcement, penalties and complaints
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Enforcement is split by sector. The Canadian Radio-television and Telecommunications
              Commission (CRTC) handles broadcasters and telecom carriers, the Canadian
              Transportation Agency (CTA) handles the transportation network, and the Accessibility
              Commissioner, a member of the Canadian Human Rights Commission, handles everyone else.
              The Commissioner can inspect (section 73), order production of documents (section 74),
              make compliance orders (section 75), issue notices of violation with a warning or a
              penalty (Part 5), enter compliance agreements (section 82), and publish the name of a
              violator, the nature of the violation and the penalty (section 93).
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The penalty figures need reading carefully. Section 91(2) caps any single violation at
              $250,000, but the regulations sort violations into minor, serious and very serious,
              and every digital duty in the 2025 amendments is classed minor. For a regulated
              entity other than a small business, the minor ranges are:
            </p>
            <div
              tabIndex={0}
              role="region"
              aria-label="Penalty ranges for a minor violation by a regulated entity other than a small business"
              className="overflow-x-auto mb-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <table className="w-full text-left text-sm border-collapse">
                <caption className="text-left text-sm font-medium text-slate-900 dark:text-white pb-2">
                  Penalty ranges for a minor violation by a regulated entity other than a small business
                </caption>
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Violation</th>
                    <th scope="col" className="py-3 font-semibold text-slate-900 dark:text-white">Penalty range</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  {[
                    ["First", "$1,000 to $10,000"],
                    ["Second", "$10,000 to $25,000"],
                    ["Third", "$25,000 to $50,000"],
                    ["Fourth or later", "$50,000 to $75,000"],
                  ].map(([n, range]) => (
                    <tr key={n} className="border-b border-slate-200 dark:border-slate-800">
                      <th scope="row" className="py-3 pr-4 font-medium text-slate-900 dark:text-white">{n}</th>
                      <td className="py-3">{range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Two things raise the stakes. Under section 88, a violation that continues on more than
              one day is a separate violation for each day. And the regulations&apos; lower
              &ldquo;small business&rdquo; ranges are for organisations with fewer than 100
              employees, who are exempt from the digital duties anyway, so every business covered by
              them faces the full ranges above. The $250,000 ceiling is reached only by the top
              range for very serious violations. There is a
              two-year limitation period (section 90).
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Individuals can complain too. Under section 94(1), anyone harmed or otherwise
              adversely affected by a breach of regulations made under section 117(1) may complain
              to the Accessibility Commissioner; federal public servants with grievance rights use
              that route instead. Remedies under section 102 include corrective measures, lost wages
              and expenses, extra costs of alternatives, and compensation for pain and suffering up
              to an amount that was $20,000 in the year the section came into force and is indexed
              annually, with the same amount again for a wilful or reckless practice. Because the
              digital duties sit in section 117 regulations, inaccessible new web content becomes
              complainable once they are in force. The Commissioner&apos;s 2025 to 2026 report puts
              it plainly: &ldquo;As new regulations come into force, the scope of complaints
              possible under the Accessible Canada Act will expand.&rdquo;
            </p>
          </section>

          {/* ACR */}
          <section aria-labelledby="acr-heading">
            <h2 id="acr-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The Accessible Canada Regulations: Plans, Feedback and Progress Reports
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Accessible Canada Regulations (SOR/2021-241) were registered on 13 December 2021
              and came into force that day. They already impose three duties on federally regulated
              organisations, and these are what the Commissioner has been inspecting:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">An accessibility plan.</strong>{" "}
                First plans were due 31 December 2021 for the federal public sector, 1 June 2022 for
                private organisations with 100 or more employees and 1 June 2023 for those with 10
                to 99. Plans are updated every 36 months, written in plain language, with a heading
                for each priority area and one for consultations.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">A feedback process.</strong>{" "}
                A person designated by title receives feedback by mail, phone, email and any other
                means used with the public, anonymous feedback is allowed, and receipt is
                acknowledged.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Progress reports.</strong>{" "}
                Published in the two years between plans, with a feedback section added.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Plans and progress reports must be published on the organisation&apos;s main digital
              platform, linked from the homepage, &ldquo;in a format that meets the requirements for
              Level AA conformance&rdquo; of WCAG, and the Commissioner must be notified within 48
              hours. Alternate formats (print, large print, Braille, audio, electronic) must be
              supplied on request: Braille and audio within 45 days, others within 15 days for the
              public sector and organisations with 100 or more employees, or 20 days for smaller
              ones. Records are kept for seven years. Private organisations with fewer than 10
              employees are exempt from all three duties.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              One detail is easy to miss. The regulations define WCAG as &ldquo;the most recent
              version that is available in both English and French&rdquo;. W3C published the
              authorised French translation of WCAG 2.2 on 17 March 2025, so in our analysis plans
              and progress reports should now be published to WCAG 2.2 AA. That is our reading of
              two verified facts, not a statement from the regulator.
            </p>
          </section>

          {/* SOR/2025-255 */}
          <section aria-labelledby="ict-heading">
            <h2 id="ict-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The 2025 Digital Amendments (SOR/2025-255): Who Must Do What, and When
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Regulations Amending the Accessible Canada Regulations, SOR/2025-255 (P.C.
              2025-886), were made on 5 December 2025 and published in the Canada Gazette Part II on
              17 December 2025, after a draft in Part I on 21 December 2024 and a consultation that
              drew about 800 participants to seven technical briefings and 170 written comments.
              They add a new Part 1.1, &ldquo;Information and Communication Technologies&rdquo;
              (sections 19.1 to 19.9), and they are final. As of {REVIEWED_ON}, the Justice Laws
              consolidation still lists them as amendments not in force, because section 18 sets
              two later dates: the second anniversary of registration, 5 December 2027, and the
              third, 5 December 2028.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Size is measured by the average number of employees over the preceding three-year
              period, counting dependent contractors and excluding students in student employment
              programmes. The government&apos;s guidance uses three tiers: small (99 or fewer, exempt
              from all of Part 1.1), medium (100 to 499) and large (500 or more).
            </p>
            <div
              tabIndex={0}
              role="region"
              aria-label="SOR/2025-255 duties and start dates by organisation type"
              className="overflow-x-auto mb-6 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <table className="w-full min-w-[640px] text-left text-sm border-collapse">
                <caption className="text-left text-sm font-medium text-slate-900 dark:text-white pb-2">
                  SOR/2025-255 duties and start dates by organisation type. Businesses with 99 or
                  fewer employees are exempt from every row.
                </caption>
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Duty</th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Section</th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Federal public sector</th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Large business (500+)</th>
                    <th scope="col" className="py-3 font-semibold text-slate-900 dark:text-white">Medium business (100 to 499)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  {duties.map((d) => (
                    <tr key={d.section} className="border-b border-slate-200 dark:border-slate-800 align-top">
                      <th scope="row" className="py-3 pr-4 font-medium text-slate-900 dark:text-white">{d.duty}</th>
                      <td className="py-3 pr-4 font-mono whitespace-nowrap">{d.section}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">{d.publicSector}</td>
                      <td className="py-3 pr-4 whitespace-nowrap">{d.large}</td>
                      <td className="py-3 whitespace-nowrap">{d.medium}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Conformity assessment reports and training records are kept for four years. The
              accessibility statement (section 19.6) must be in plain language and include its
              publication date, contact details with at least two of email, phone and mailing
              address, an acknowledgement of the organisation&apos;s obligations, its accessibility
              features, an overview of non-conformities, the alternative measures offered where
              conformity is not feasible, and &ldquo;plans and timelines for addressing gaps&rdquo;.
              It must be reachable from a prominent location on each web page, or from an
              app&apos;s home screen. Our{" "}
              <Link href="/guides/how-to-write-an-accessibility-statement" className={linkClass}>
                accessibility statement guide
              </Link>{" "}
              and{" "}
              <Link href="/tools/accessibility-statement-generator" className={linkClass}>
                statement generator
              </Link>{" "}
              cover most of these elements.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              What is and is not covered
            </h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-6">
              <li>
                <strong className="text-slate-900 dark:text-white">No retroactivity.</strong>{" "}
                The duties cover pages created or updated on or after the start date, apps launched
                after it and documents made available for download after it. The impact statement
                says organisations will not have to make pre-existing content conform, and treats
                any change to a page&apos;s content as an update. Existing apps need only the
                assessment and gap analysis.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">&ldquo;To the extent feasible&rdquo;.</strong>{" "}
                Section 19.3 weighs the availability of technology, significant obstacles and efforts
                to overcome them, and the organisation&apos;s degree of control over the content,
                including under agreements with third parties. Where conformity is not feasible and
                barriers result, the organisation must offer alternative means of accessing the key
                information or completing the task, except for maps, mapping services, technical
                drawings and images.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Exceptions.</strong>{" "}
                Heritage content (reproductions kept mainly for historical, artistic or aesthetic
                interest) and user-generated content are excluded, as is content in an
                employee-facing collaborative digital environment. Web pages include web
                applications and pages behind a login.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Broadcasters, telecoms and transport.</strong>{" "}
                Broadcasting and telecommunications entities (regulated by the CRTC) and
                transportation service providers (regulated by the CTA) are excluded from the
                public-facing web, app and document duties, and broadcasting and telecom entities
                from the procurement duty. They still have the employee-facing web and training
                duties and, if large, the statement duty. Transportation providers are covered only
                if they are subject to Part 1 of the transportation regulations and have 100 or more
                employees; their public websites are already governed by those regulations, below.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Contractors.</strong>{" "}
                Section 19.31 gives anyone acting in the name of, or for the benefit of, an obligated
                organisation the same obligations.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">First Nations band councils.</strong>{" "}
                Their exemption from the planning duties was due to lapse at the end of 2026.
                SOR/2025-255 extends it, and an exemption from Part 1.1, to 31 December 2033.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Content meant for Canada.</strong>{" "}
                The impact statement, though not the regulation text, says the rules apply only to
                digital content meant primarily for people in Canada or whose place of work is in
                Canada.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              The standard: CAN/ASC-EN 301 549, as amended from time to time
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The &ldquo;ICT Standard&rdquo; is CAN/ASC-EN 301 549, Accessibility requirements for
              ICT products and services, published by Accessibility Standards Canada &ldquo;as
              amended from time to time&rdquo;. ASC adopted the European standard on 31 May 2024 as
              CAN/ASC-EN 301 549:2024 (EN 301 549:2021, IDT), meaning ETSI{" "}
              <Link href="/compliance/en-301-549" className={linkClass}>
                EN 301 549
              </Link>{" "}
              v3.2.1 &ldquo;in its entirety and without modification&rdquo;, and makes it available
              free in English and French. The regulations call on clauses 4 (functional
              performance), 5 (generic requirements), 6 (two-way voice), 7 (video), 9 (web), 10
              (non-web documents) and 11 (software, including mobile apps). Clause 9 is the WCAG
              2.1 Level A and AA success criteria, so for web content the target today is WCAG 2.1
              AA. Our{" "}
              <Link href="/checklists/en-301-549" className={linkClass}>
                EN 301 549 checklist
              </Link>{" "}
              tracks every v3.2.1 requirement.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Section 19.9 adds flexibility. Instead of the current Canadian edition, an
              organisation may conform to &ldquo;any version&rdquo; of ETSI EN 301 549 published more
              recently, or to the immediately preceding CAN/ASC edition while the current one is
              less than three years old. ETSI published{" "}
              <Link href="/compliance/en-301-549-v4" className={linkClass}>
                EN 301 549 v4.1.1
              </Link>{" "}
              on 2 September 2026, aligned to WCAG 2.2.{" "}
              <strong className="text-slate-900 dark:text-white">Our interpretation</strong>, not
              official guidance: because v4.1.1 is newer than the 2021 edition the Canadian standard
              is based on, conforming to it, and so to WCAG 2.2 AA on the web, satisfies the rule. We
              found no notice that ASC plans to adopt v4.1.1 as a new Canadian edition.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The government estimates about 183 federal public sector entities, 199 large
              businesses and 719 medium businesses are affected from the first period, plus 112
              First Nations band councils from the tenth, with present-value costs of about $310
              million against benefits of about $1.21 billion over ten periods. A second phase is
              planned: ESDC lists it as &ldquo;Planned&rdquo; and names artificial intelligence
              systems including automated decision-making, software, hardware and emerging
              technologies as its topics.
            </p>
          </section>

          {/* TBS */}
          <section aria-labelledby="tbs-heading">
            <h2 id="tbs-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Federal Government Websites: the 2011 Standard Is Gone
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              For fifteen years, federal departments followed the Treasury Board&apos;s Standard on
              Web Accessibility (2011), which required WCAG 2.0 AA. A direction from the Chief
              Information Officer of Canada to deputy heads and departmental CIOs, on a page dated
              12 March 2026, rescinded it &ldquo;effective immediately&rdquo; in preparation for the
              new regulations.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              In the meantime, departments must keep public-facing websites and device-based mobile
              apps at a minimum of WCAG 2.0, and the direction points them to CAN/ASC-EN 301 549 and
              the technical summary of EN 301 549 v3.2.1. From 5 December 2027 their new and
              updated pages fall under SOR/2025-255 like any other federal public sector entity.
              Many widely read guides still present the 2011 Standard as the binding rule; it no
              longer is.
            </p>
          </section>

          {/* Transport */}
          <section aria-labelledby="transport-heading">
            <h2 id="transport-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Transportation Providers: WCAG AA Is Already Required
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              One federal sector already has a binding web rule. Section 9 of the Accessible
              Transportation for Persons with Disabilities Regulations (SOR/2019-244, as amended by
              SOR/2021-9) says a transportation service provider &ldquo;must ensure that every
              website, mobile website and application that it owns, operates or controls and that is
              made available to the public&rdquo; meets WCAG Level AA. WCAG is defined as WCAG 2.0
              &ldquo;as amended from time to time&rdquo;. The Canadian Transportation Agency enforces
              it, which is why SOR/2025-255 leaves transportation providers&apos; public content
              alone.
            </p>
          </section>

          {/* Provinces */}
          <section aria-labelledby="provinces-heading">
            <h2 id="provinces-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Provincial Laws: Ontario, Manitoba, Quebec and Nova Scotia
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Provincially regulated businesses, which is most of them, answer to provincial
              accessibility law where it exists, and everywhere to provincial human rights codes
              (the Quebec Charter in Quebec), under which web barriers can found a discrimination
              claim. Federally regulated organisations are bound by the Canadian Human Rights Act in
              the same way.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              Ontario: AODA and the Integrated Accessibility Standards Regulation
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Accessibility for Ontarians with Disabilities Act, 2005 aimed for an accessible
              Ontario by 1 January 2025, a date that has now passed. Its web rule is section 14 of
              the Integrated Accessibility Standards Regulation, O. Reg. 191/11:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">Who.</strong>{" "}
                Designated public sector organisations and large organisations, defined as those
                with 50 or more employees in Ontario. Small organisations (1 to 49 employees) have
                no website duty, though they still have accessible formats duties. The Government of
                Ontario and the Legislative Assembly have a wider duty covering intranets, at full
                WCAG 2.0 AA since 1 January 2020.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">What.</strong>{" "}
                Internet websites and web content, including web-based applications, must conform
                with WCAG 2.0. New sites had to meet Level A by 1 January 2014, and all internet
                websites and web content Level AA by 1 January 2021, other than success criteria
                1.2.4 Captions (Live) and 1.2.5 Audio Descriptions (Pre-recorded).
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Limits.</strong>{" "}
                The duty applies to sites the organisation controls directly or through a contract
                that allows modification, to content published after 1 January 2012, and
                &ldquo;except where meeting the requirement is not practicable&rdquo;.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Reporting.</strong>{" "}
                Businesses and non-profits with 20 or more employees file an accessibility
                compliance report every three years, and the current deadline is{" "}
                <strong className="text-slate-900 dark:text-white">31 December 2026</strong>.
                Designated public sector organisations report every two years; their last deadline
                was 31 December 2025. Organisations with fewer than 20 employees do not report but
                must still comply.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The penalties are often misquoted. Ordinary administrative penalties for a
              corporation under section 83 and Schedule 3 of the regulation run from $500 (minor
              impact, minor history) to $15,000 (major and major). Only where both the impact and
              the history are major may a director treat the penalty as daily, up to $100,000 a day
              for a corporation and $50,000 for an individual or unincorporated organisation.
              Separately, section 37 of the Act makes it an offence to give false or misleading
              information in a report, fail to comply with a director&apos;s or Tribunal order, or
              take reprisals, with fines on conviction of up to $100,000 a day for a corporation and
              $50,000 a day for anyone else. Neither $100,000 figure is a standard fine for an
              inaccessible website.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              The web standard itself has not moved since 2011. The AODA Alliance, an advocacy group,
              reported in December 2025 that the government had made no revisions to the
              regulation despite a standards development committee&apos;s final report in 2020.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              Manitoba: WCAG 2.1 AA for the private sector since May 2025
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Accessible Information and Communication Standard Regulation, Man. Reg. 47/2022,
              made under the Accessibility for Manitobans Act, came into force on 1 May 2022 and
              phased in over three years: government departments from 1 May 2023; government
              agencies, health authorities, Winnipeg and other cities, educational institutions and
              libraries from 1 May 2024; and all other organisations from{" "}
              <strong className="text-slate-900 dark:text-white">1 May 2025</strong>.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Section 7(1) requires web content to &ldquo;meet or exceed&rdquo; WCAG 2.1 Level AA if
              it was published on or after the day the regulation applies to the organisation, or
              if it is needed to access the organisation&apos;s goods and services. Section 8
              applies the same standard to web applications published or significantly updated
              after that date. Exceptions cover content where conformity is not technically
              feasible, technology is not readily available, it would cause undue hardship, the
              organisation lacks direct control, and product labels or product information. The
              regulation also requires a feedback process, training and accessible formats on
              request. Some secondary sources cite the regulation as 171/2022; the official register
              shows 47/2022.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              Quebec: SGQRI 008 3.0 for public bodies
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Quebec&apos;s Standard sur l&apos;accessibilité des sites Web, SGQRI 008 3.0, came
              into force on 29 April 2024. It applies to the public bodies covered by section 2 of
              the Loi sur la gouvernance et la gestion des ressources informationnelles
              (chapter G-1.03), not to private businesses. It requires the most recent
              WCAG version available in French, which the standard identifies as WCAG 2.1, plus
              some WCAG 2.2 criteria, with Level AA as the general target. It applies to new content
              from the design stage and to significant changes, not retroactively. Some vendor
              guides still cite the older SGQRI 008 2.0.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              Nova Scotia: a standard expected in 2028 to 2029
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Nova Scotia&apos;s Accessibility Act (S.N.S. 2017, c. 2) works towards what the
              province calls an accessible Nova Scotia by 2030. Its information and communication
              accessibility standard is &ldquo;expected in 2028-29&rdquo;, so there is no binding
              web or WCAG rule yet. The built environment standard is already law.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              Other provinces
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              British Columbia, Saskatchewan, New Brunswick and Newfoundland and Labrador have
              accessibility statutes, and government sources indicate their regulations focus on
              public sector planning and standards still in development, with no web or WCAG
              standard in force.{" "}
              <strong className="text-slate-900 dark:text-white">Not confirmed:</strong> we could not
              verify this against the regulation texts when this page was reviewed, so check the
              provincial source before relying on it.
            </p>
          </section>

          {/* Jodhan */}
          <section aria-labelledby="jodhan-heading">
            <h2 id="jodhan-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Case Law: Jodhan v. Canada
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The leading Canadian web accessibility judgment is{" "}
              <a href={JODHAN} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Canada (Attorney General) v. Jodhan, 2012 FCA 161
              </a>
              . In 2010 FC 1197, the Federal Court found that the government&apos;s failure to
              monitor and ensure compliance with its own 2001 web accessibility standards (the
              Common Look and Feel standards) infringed the equality guarantee in section 15 of the
              Charter for a blind applicant. It gave the government 15 months to comply and kept
              supervisory jurisdiction.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              On 30 May 2012 the Federal Court of Appeal (Nadon J.A., Sharlow and Dawson JJ.A.
              concurring) allowed the appeal in part. It upheld the declaration that she had been
              denied equal access to, and benefit from, government information and services
              provided online, a breach of section 15(1), and kept the declaration that the
              government should comply within a reasonable time such as 15 months. It removed the
              supervisory order, finding &ldquo;no factual or legal basis to justify&rdquo; it.
              Archived information was excluded where it is provided accessibly on request.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Enforcement under the Accessible Canada Act is still young. The Commissioner&apos;s
              2025 to 2026 report records over 250 inspections initiated, with over 95 of the more
              than 160 resolved inspections finding non-compliance, and one complaint received.
              Complaints so far have been limited to plans, feedback and progress reports. We found
              no published notice of violation with a monetary penalty.
            </p>
          </section>

          {/* Cross-border */}
          <section aria-labelledby="crossborder-heading">
            <h2 id="crossborder-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Canadian Companies Selling Into the EU and US
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Where you are incorporated does not decide your exposure abroad. The{" "}
              <Link href="/compliance/eaa" className={linkClass}>
                European Accessibility Act
              </Link>{" "}
              has applied since 28 June 2025 to covered products and services offered on the EU
              market, wherever the company is based, and its harmonised standard is EN 301 549. In
              the United States,{" "}
              <Link href="/compliance/ada" className={linkClass}>
                ADA Title III
              </Link>{" "}
              exposure follows your customers, not your head office.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The federal rules were drafted with this in mind: the impact statement says using the
              most recent ICT Standard minimises regulatory differences with Canada&apos;s major
              trading partners. In our analysis, because SOR/2025-255 uses EN 301 549 and section
              19.9 accepts any newer ETSI edition, one EN 301 549 conformance programme can serve
              both Canada and the EU.
            </p>
          </section>

          {/* What to do now */}
          <section aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What To Do Now
            </h2>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-slate-900 dark:text-white">Work out which regime you are under.</strong>{" "}
                Federally regulated (banking, telecom, broadcasting, transport, federal government)
                means the Accessible Canada Act. Otherwise check the provinces you operate in:
                Ontario with 50 or more employees there, any organisation in Manitoba, and Quebec
                public bodies have web standards today.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Count your employees the federal way.</strong>{" "}
                Average over the preceding three years, including dependent contractors. Under 100:
                no digital duties. 100 to 499: web pages and training. 500 or more: everything in the
                table above.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Train before December 2027.</strong>{" "}
                Training for staff who develop, maintain or procure ICT is the first business duty,
                due 5 December 2027 for every covered organisation with 100 or more employees, a
                year before the web duty. Keep the records for four years.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Build new work to EN 301 549 now.</strong>{" "}
                Everything you create or update after the start date must conform, so templates and
                components built today will be in scope. Target WCAG 2.1 AA as the floor, or WCAG
                2.2 AA with the{" "}
                <Link href="/checklists/wcag-2-2" className={linkClass}>
                  WCAG 2.2 checklist
                </Link>{" "}
                to cover Canada, the EU and the newer EN edition together.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Assess your apps and documents.</strong>{" "}
                Large businesses and the public sector need a conformity assessment and gap analysis
                of every existing app still on offer by 5 December 2028, and accessible downloadable
                documents from that date.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Change procurement.</strong>{" "}
                Ask vendors of web and app products and services for a conformity assessment and gap
                analysis against CAN/ASC-EN 301 549, and write it into contracts that run past 2028.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Draft the accessibility statement.</strong>{" "}
                List your non-conformities, alternative measures and a timeline for fixing gaps, with
                two contact routes. The{" "}
                <Link href="/tools/accessibility-statement-generator" className={linkClass}>
                  accessibility statement generator
                </Link>{" "}
                gives you a starting draft to adapt.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">In Ontario, file by 31 December 2026.</strong>{" "}
                Businesses and non-profits with 20 or more employees owe their three-yearly
                compliance report this year. See the{" "}
                <Link href="/compliance/deadlines" className={linkClass}>
                  accessibility deadlines calendar
                </Link>{" "}
                for other dates.
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <FaqSection faqs={faqs} title="Frequently Asked Questions" as="h2" className="scroll-mt-24" />

          {/* Sources */}
          <section aria-labelledby="sources-heading">
            <h2 id="sources-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Sources
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Every figure on this page was read from the documents below on{" "}
              <time dateTime={REVIEWED_ISO}>{REVIEWED_ON}</time>, unless the text says otherwise.
              Secondary sources are named where used.
            </p>
            <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-decimal pl-5">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </section>

          {/* Disclaimer */}
          <section aria-label="Disclaimer">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Educational Content, Not Legal Advice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This page is provided for general educational purposes only and does not constitute
                legal advice. The SOR/2025-255 provisions described here are not yet in force,
                guidance may change before they are, and statements marked as our interpretation are
                not official positions. For advice about your specific situation, consult a lawyer
                experienced in Canadian accessibility and human rights law.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="Canada accessibility law Accessible Canada Act AODA Ontario EN 301 549 WCAG 2.1 accessibility statement procurement checklist"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
