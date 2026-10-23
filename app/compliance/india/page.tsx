import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { PageByline } from "@/components/seo/page-byline"
import { KeyFacts } from "@/components/research/key-facts"

const pageTitle = "India Web Accessibility Law: RPwD Act, IS 17802, ACRs"
const pageDescription =
  "India's web accessibility law: RPwD Act 2016, the 2024 Supreme Court ruling, draft 2026 rules mandating IS 17802 (WCAG 2.1 AA), public ACRs, deadlines and fines."
const ogTitle = encodeURIComponent(pageTitle)

// Dates the page is pinned to. Restamp both when the final rules are notified.
const REVIEWED_ON = "19 October 2026"
const REVIEWED_ISO = "2026-10-19"

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "india web accessibility law",
    "rpwd act website accessibility",
    "is 17802",
    "rights of persons with disabilities amendment rules 2026",
    "accessibility conformance report india",
    "digital accessibility india",
    "gigw 3.0",
    "rajive raturi v union of india",
    "en 301 549 india",
    "wcag india law",
  ],
  alternates: {
    canonical: "/compliance/india",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/compliance/india",
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

const DRAFT_PDF = "https://egazette.gov.in/WriteReadData/2026/274669.pdf"
const JUDGMENT_PDF =
  "https://api.sci.gov.in/supremecourt/2005/9321/9321_2005_1_1503_56986_Judgement_08-Nov-2024.pdf"
const AMENDMENT_2023_PDF =
  "https://cdnbbsr.s3waas.gov.in/s3ee8fe9093fbbb687bef15a38facc44d2/uploads/2024/09/202409171961604271.pdf"
const ACT_INDIA_CODE = "https://www.indiacode.nic.in/handle/123456789/15939"
const IS_17802_ARCHIVE = "https://archive.org/details/gov.in.is.17802.1.2021"
const GIGW_MANUAL =
  "https://cdnbbsr.s3waas.gov.in/s3c92a10324374fac681719d63979d00fe/uploads/2026/07/2026072438.pdf"
const STQC_TRANSITION = "https://www.stqc.gov.in/sites/default/files/tenders/Transition%20Plan.pdf"
const SC_JULY_2026_REPORT =
  "https://www.verdictum.in/supreme-court/expert-inputs-for-robust-lacunae-free-accessibility-rules-under-rpwd-act-1618751"
const EN_301_549_V321 =
  "https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf"

const sources = [
  {
    label:
      "Draft Rights of Persons with Disabilities (Amendment) Rules, 2026, notification S.O. 3962(E) dated 16 July 2026, Gazette of India Extraordinary, Part II Section 3(ii), issued 20 July 2026 (eGazette ID CG-DL-E-23072026-274669)",
    href: DRAFT_PDF,
  },
  {
    label:
      "Rajive Raturi v. Union of India and Others, 2024 INSC 858, Writ Petition (Civil) 243 of 2005 with 228 of 2006, Supreme Court of India, 8 November 2024",
    href: JUDGMENT_PDF,
  },
  {
    label:
      "Rights of Persons with Disabilities (Amendment) Rules, 2023, G.S.R. 359(E) dated 10 May 2023 (Gazette No. 287, 11 May 2023), with the BIS notifications establishing IS 17802 Parts 1 and 2 annexed",
    href: AMENDMENT_2023_PDF,
  },
  {
    label: "Rights of Persons with Disabilities Act, 2016 (Act 49 of 2016), sections 2, 40 to 46 and 89, India Code",
    href: ACT_INDIA_CODE,
  },
  {
    label:
      "IS 17802 (Part 1): 2021, Accessibility for the ICT Products and Services, Part 1 Requirements, Bureau of Indian Standards, December 2021 (foreword and contents)",
    href: IS_17802_ARCHIVE,
  },
  {
    label: "EN 301 549 V3.2.1 (2021-03), Accessibility requirements for ICT products and services, ETSI, CEN and CENELEC",
    href: EN_301_549_V321,
  },
  {
    label: "Guidelines for Indian Government Websites and Apps (GIGW) 3.0, manual, National Informatics Centre, MeitY",
    href: GIGW_MANUAL,
  },
  {
    label: "Transition Plan from GIGW: 2018 to GIGW: 2023, STQC Directorate, MeitY, dated 23 May 2023",
    href: STQC_TRANSITION,
  },
  {
    label:
      "Supreme Court hearing of 29 July 2026 in the Rajive Raturi proceedings, as reported by Verdictum and PTI (press report, not the order text)",
    href: SC_JULY_2026_REPORT,
  },
]

const faqs = [
  {
    question: "Is website accessibility legally required in India right now?",
    answer:
      "Yes, on paper. Since 11 May 2023, item (iii) of rule 15(1)(c) of the Rights of Persons with Disabilities Rules, 2017 has said that websites, apps, ICT-based public facilities and services, everyday electronic goods and ICT-based consumer products shall comply with IS 17802 (Part 1): 2021 and IS 17802 (Part 2): 2022. The problem is enforcement: on 8 November 2024 the Supreme Court held rule 15(1) ultra vires the Act because, taken as a whole, it offered persuasive guidelines rather than a non-negotiable floor, and directed the government to frame mandatory rules. The draft 2026 rules are that response, and until they are notified there is no deadline clock, no conformance-report duty and no defined enforcement route for ICT. Government websites and apps separately must follow GIGW 3.0, which is built on WCAG 2.1 Level AA.",
  },
  {
    question: "What is IS 17802 and how does it relate to WCAG?",
    answer:
      "IS 17802 is the Bureau of Indian Standards' two-part accessibility standard for ICT products and services. Part 1 (2021) sets the requirements and Part 2 (2022) sets how conformance is determined. The foreword of Part 1 states that it is the technical adoption of EN 301 549 V3.2.1, the European ICT accessibility standard, with modifications limited to referencing the RPwD Act and India's official languages; the technical coverage is otherwise identical. That means clause 9 of IS 17802 is the WCAG 2.1 Level A and AA success criteria applied to web pages, clause 10 applies them to documents, and clause 11 applies them to software and mobile apps. Building to WCAG 2.1 AA, or to WCAG 2.2 AA which contains it, satisfies the web clauses of IS 17802.",
  },
  {
    question: "Have the 2026 accessibility rules been notified yet?",
    answer:
      "No. As of 19 October 2026 the Rights of Persons with Disabilities (Amendment) Rules, 2026 existed only as draft notification S.O. 3962(E) of 16 July 2026, issued in the Gazette of India Extraordinary on 20 July 2026 with a thirty-day window for objections and suggestions, which closed in August 2026. On 29 July 2026 the Supreme Court asked the Union to consider the suggestions of experts and litigants before finalising and gazetting the rules, and listed the matter again for January 2027. No final notification appeared in the Ministry of Social Justice and Empowerment's Gazette entries for July to October 2026 when this page was reviewed.",
  },
  {
    question: "Does the draft apply to foreign companies serving Indian users?",
    answer:
      "Yes. Clause (B) of the draft applies to every establishment that manufactures, designs, develops, exercises decisive technical control over, or makes available, directly or indirectly, a covered item to persons in India for public or consumer use, whether the establishment is located within India or outside India. Covered items include websites, mobile and tablet apps, software, digital content and electronic documents, ICT-based public services and ICT hardware. The turnover test that sets your deadline counts the consolidated turnover of the group, including entities that make items available in India through platforms or intermediaries, so a foreign parent cannot shrink its Indian subsidiary below the threshold on paper.",
  },
  {
    question: "What are the compliance deadlines in the draft rules?",
    answer:
      "Every clock starts on the date the final rules are published, which has not happened. Establishments with turnover of five hundred crore rupees or more must meet the non-negotiable clauses in Schedule I (websites, apps, software, documents and ICT-based public services) and Schedule II (hardware and ICT consumer products) within one year. Establishments below that turnover get eighteen months. Every establishment must comply with IS 17802 in its entirety within two years, which the draft ties to section 46 of the Act. Government establishments must also stop procuring non-compliant items and revise their procurement documents within ninety days. Archived content that is clearly labelled as such is exempt.",
  },
  {
    question: "What is an Accessibility Conformance Report and who can prepare it?",
    answer:
      "Under clause (D) of the draft, an ACR is a documented statement of the extent to which a covered item conforms with IS 17802 (Part 1): 2021, tested in accordance with IS 17802 (Part 2): 2022, with supporting explanations and the test methodology. It must be published free of cost on the establishment's website or app in both a human-readable format (accessible HTML or PDF) and a machine-readable format (JSON, XML or similar); publishing only one is itself non-compliance. It must state conformance requirement by requirement, disclose whether automated, manual and assistive-technology testing was done, be re-tested before any major change is deployed, be refreshed at least every two years, and be prepared, reviewed or verified by people or organisations with demonstrable accessibility testing expertise and recognised certifications, whose credentials are published in the report. A nodal officer or a manager at Director or designated-partner level must sign it. The draft names the VPAT as an acceptable format and asks BIS to notify a reporting format within ninety days.",
  },
  {
    question: "What are the penalties for non-compliance in India?",
    answer:
      "Section 89 of the RPwD Act punishes any contravention of the Act or its rules with a fine of up to ten thousand rupees for a first contravention and, for any subsequent contravention, a fine of not less than fifty thousand rupees and up to five lakh rupees. The draft rules add teeth around that: the Chief Commissioner or a State Commissioner for Persons with Disabilities can inquire and fine, sectoral regulators can add their own sanctions for continued non-compliance, a non-compliant establishment must remedy within ninety days of an order and furnish an updated ACR, failure attracts enhanced fines, and continued non-compliance can lead to suspension or cancellation of a registration, certification, authorisation or approval. Where an item needs a licence or approval, the authority must require an ACR or compliance undertaking as a condition of grant or renewal, and a false or misleading ACR exposes the establishment to action under whatever law governs it.",
  },
  {
    question: "Is building to WCAG 2.2 AA enough for India?",
    answer:
      "For the technical content, yes: WCAG 2.2 keeps every WCAG 2.1 Level A and AA success criterion except 4.1.1 Parsing, which it removes, so work done against WCAG 2.2 AA covers the clause 9 requirements of IS 17802. Two cautions. First, 4.1.1 is still clause 9.4.1.1 of IS 17802 and sits in Schedule I of the draft, so keep your HTML free of duplicate IDs and malformed markup. Second, the draft does not ask for a WCAG claim; it asks for an ACR against the clauses of IS 17802 tested per Part 2, which also covers documents (clause 10), software and apps (clause 11) and documentation and support services (clause 12). A WCAG-only audit of the website leaves the rest of the report blank.",
  },
]

const scheduleOneWebClauses = [
  ["9.1.1.1", "Non-text content"],
  ["9.1.2.1", "Audio-only and video-only (prerecorded)"],
  ["9.1.2.2", "Captions (prerecorded)"],
  ["9.1.2.3", "Audio description or media alternative (prerecorded)"],
  ["9.1.3.1", "Info and relationships"],
  ["9.1.3.2", "Meaningful sequence"],
  ["9.1.3.3", "Sensory characteristics"],
  ["9.1.4.1", "Use of colour"],
  ["9.1.4.2", "Audio control"],
  ["9.2.1.1", "Keyboard"],
  ["9.2.1.2", "No keyboard trap"],
  ["9.2.1.4", "Character key shortcuts"],
  ["9.2.2.1", "Timing adjustable"],
  ["9.2.2.2", "Pause, stop, hide"],
  ["9.2.3.1", "Three flashes or below threshold"],
  ["9.2.4.1", "Bypass blocks"],
  ["9.2.4.2", "Page titled"],
  ["9.2.4.3", "Focus order"],
  ["9.2.4.4", "Link purpose (in context)"],
  ["9.2.5.1", "Pointer gestures"],
  ["9.2.5.2", "Pointer cancellation"],
  ["9.2.5.3", "Label in name"],
  ["9.2.5.4", "Motion actuation"],
  ["9.3.1.1", "Language of page"],
  ["9.3.2.1", "On focus"],
  ["9.3.2.2", "On input"],
  ["9.3.3.1", "Error identification"],
  ["9.3.3.2", "Labels or instructions"],
  ["9.4.1.1", "Parsing"],
  ["9.4.1.2", "Name, role, value"],
]

export default function IndiaCompliancePage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Compliance", url: "https://accessibility.build/compliance" },
          { name: "India", url: "https://accessibility.build/compliance/india" },
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
                India
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
              Compliance Guide &bull; India
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Web Accessibility Law in India:{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                the RPwD Act and IS 17802
              </span>
            </h1>
            <PageByline route="/compliance/india" variant="hero" tone="inverse" className="mt-0 mb-5" />
            <p className="text-lg md:text-xl text-slate-300 mb-6 max-w-2xl">
              India already names a technical standard for digital accessibility. Since May 2023,
              rule 15 of the Rights of Persons with Disabilities Rules has required websites, apps
              and other ICT to comply with IS 17802, the Indian adoption of EN 301 549 with WCAG
              2.1 AA inside. What has been missing is enforcement. The Supreme Court said so in
              November 2024, and the government&apos;s answer, the draft 2026 rules, would add
              deadlines by turnover, publicly disclosed conformance reports and fines, and would
              reach any business offering into India, wherever it is based.
            </p>
            <p
              className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-amber-300/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100 mb-10"
              aria-label="Page status"
            >
              <strong className="font-semibold text-amber-200">Status: draft rules, not yet notified.</strong>
              <span>
                Draft published 20 July 2026; no final notification found. Reviewed{" "}
                <time dateTime={REVIEWED_ISO}>{REVIEWED_ON}</time>.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Standard Required</p>
              <p className="text-2xl md:text-3xl font-bold text-white">IS 17802</p>
              <p className="text-slate-400 text-xs mt-1">EN 301 549 V3.2.1 adopted; WCAG 2.1 AA inside</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Draft Rules Status</p>
              <p className="text-2xl md:text-3xl font-bold text-white">Not notified</p>
              <p className="text-slate-400 text-xs mt-1">S.O. 3962(E); comments closed August 2026</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Turnover ₹500 Crore or More</p>
              <p className="text-2xl md:text-3xl font-bold text-white">1 year</p>
              <p className="text-slate-400 text-xs mt-1">Below the threshold: 18 months, for the Schedule clauses</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Full Compliance</p>
              <p className="text-2xl md:text-3xl font-bold text-white">2 years</p>
              <p className="text-slate-400 text-xs mt-1">From publication of the final rules, section 46</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <KeyFacts
          title="India digital accessibility, the numbers"
          facts={[
            {
              value: "16 Jul 2026",
              label: "Draft Rights of Persons with Disabilities (Amendment) Rules, 2026 signed as S.O. 3962(E); issued in the Gazette of India Extraordinary on 20 July 2026",
              source: "eGazette, CG-DL-E-23072026-274669",
              sourceHref: DRAFT_PDF,
              asOf: "2026-07-23",
            },
            {
              value: "₹500 crore",
              label: "Turnover threshold in the draft: at or above it, one year to meet the Schedule I and II clauses; below it, eighteen months",
              source: "Draft rules, clause (E)(1) and (2)",
              sourceHref: DRAFT_PDF,
              asOf: "2026-07-16",
            },
            {
              value: "2 years",
              label: "Full compliance with IS 17802 for every establishment, counted from publication of the final rules, tied to section 46 of the Act",
              source: "Draft rules, clause (E)(4)",
              sourceHref: DRAFT_PDF,
              asOf: "2026-07-16",
            },
            {
              value: "30",
              label: "Web clauses of IS 17802 in Schedule I of the draft, the same thirty as the WCAG 2.1 Level A success criteria",
              source: "Draft rules, Schedule I",
              sourceHref: DRAFT_PDF,
              asOf: "2026-07-16",
            },
            {
              value: "₹5 lakh",
              label: "Maximum fine for a repeat contravention under section 89 of the RPwD Act; up to ₹10,000 for a first contravention",
              source: "RPwD Act 2016, section 89",
              sourceHref: ACT_INDIA_CODE,
              asOf: "2016",
            },
            {
              value: "8 Nov 2024",
              label: "Supreme Court held rule 15(1) ultra vires the Act and gave the Union three months to frame mandatory rules",
              source: "Rajive Raturi v. Union of India, 2024 INSC 858, paras 75 to 76",
              sourceHref: JUDGMENT_PDF,
              asOf: "2024-11-08",
            },
          ]}
        />

        <div className="max-w-3xl mx-auto space-y-16">
          {/* The law today */}
          <section aria-labelledby="act-heading">
            <h2 id="act-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What the Law Says Today: RPwD Act 2016, Sections 40 to 46
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Rights of Persons with Disabilities Act, 2016 (Act 49 of 2016) is India&apos;s
              implementation of the UN Convention on the Rights of Persons with Disabilities. Chapter
              VIII puts accessibility duties on the state and on establishments, and five sections
              carry the weight for digital products:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">Section 40, Accessibility.</strong>{" "}
                The Central Government shall, in consultation with the Chief Commissioner for
                Persons with Disabilities, formulate rules laying down standards of accessibility
                for the physical environment, transportation, information and communications,
                including appropriate technologies and systems, and other facilities and services
                provided to the public. The word is &ldquo;shall&rdquo;: the standards are a duty,
                not an option.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Section 42, Access to information and communication technology.</strong>{" "}
                The appropriate Government must take measures so that content in audio, print and
                electronic media is in accessible formats, that electronic media is accessible
                through audio description, sign language interpretation and closed captioning, and
                that everyday electronic goods are universally designed.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Sections 44 and 45.</strong>{" "}
                New buildings cannot get permission or a completion certificate without meeting
                the accessibility rules, and existing public buildings had five years from the
                notification of the rules. These are the physical-world consequences the Court
                later pointed to as the model for enforcement.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Section 46, Time limit for accessibility by service providers.</strong>{" "}
                Service providers, whether Government or private, shall provide services in
                accordance with the section 40 rules within two years from the date those rules are
                notified. The Central Government may extend the period for categories of services.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Section 89, Punishment for contravention.</strong>{" "}
                Any contravention of the Act or of a rule made under it is punishable with a fine of
                up to ten thousand rupees for a first contravention and, for any subsequent
                contravention, a fine of not less than fifty thousand rupees and up to five lakh
                rupees.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              &ldquo;Establishment&rdquo; is defined widely in section 2: it includes Government
              establishments and private establishments, and a private establishment means a
              company, firm, cooperative or other society, association, trust, agency, institution,
              organisation, union, factory or any other establishment the appropriate Government
              notifies. There is no small-business carve-out in the Act.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The section 40 rules are rule 15 of the Rights of Persons with Disabilities Rules,
              2017 (G.S.R. 591(E), 15 June 2017). As notified, rule 15(1) said every establishment
              shall comply with the listed standards, and for ICT clause (c) pointed at the
              Guidelines for Indian Government Websites as the website standard and required
              documents on websites to be in ePUB or OCR-based PDF. The section 46 two-year window
              from that notification ran out in June 2019, a point the Supreme Court made in 2024.
            </p>
          </section>

          {/* Timeline: 2023 amendment and 2024 judgment */}
          <section aria-labelledby="judgment-heading">
            <h2 id="judgment-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What Changed: the 2023 IS 17802 Mandate and the 2024 Judgment
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">May 2023: IS 17802 enters rule 15.</strong>{" "}
              The Rights of Persons with Disabilities (Amendment) Rules, 2023 (G.S.R. 359(E), signed
              10 May 2023, published 11 May 2023, in force on publication) inserted item (iii) into
              rule 15(1)(c). Websites, apps, ICT-based public facilities and services, electronic
              goods and equipment for everyday use, and ICT-based consumer products and
              accessories &ldquo;shall comply with&rdquo; IS 17802 (Part 1): 2021 and IS 17802
              (Part 2): 2022, as amended from time to time. From that day India had a named,
              mandatory ICT standard. What it did not have was a deadline, a reporting duty or an
              enforcement route for ICT.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              <strong className="text-slate-900 dark:text-white">8 November 2024: Rajive Raturi v. Union of India.</strong>{" "}
              A bench of Chief Justice D. Y. Chandrachud and Justices J. B. Pardiwala and Manoj
              Misra decided a public interest petition filed in 2005 (2024 INSC 858). Relying on a
              nationwide audit by the court-appointed Centre for Disability Studies at NALSAR
              University of Law, the Court compared the Act&apos;s mandatory scheme in sections 40,
              44, 45, 46 and 89 with the content of rule 15. Rule 15(1) uses &ldquo;shall&rdquo;,
              so its clauses are mandatory in form, but most of the documents it points to are
              ministry guidelines that describe themselves as illustrative, broad or to be achieved
              over time. The Court held that rule 15 &ldquo;does not provide for non-negotiable
              compulsory standards, but only persuasive guidelines&rdquo;, that a ceiling without
              a floor is hardly a sturdy structure, and that rule 15(1) is therefore ultra vires
              the Act (paragraphs 74 and 75).
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The directions in paragraphs 76 to 78 shape everything that followed. The Union was
              directed to delineate mandatory rules under section 40 within three months, by
              segregating the non-negotiable rules from the expansive guidelines already in rule
              15, in consultation with all stakeholders and with NALSAR-CDS involved. Progressive
              compliance with the existing standards was to continue, but a baseline of
              non-negotiable rules had to be prescribed. Once those rules exist, the Union, States
              and Union Territories must implement the consequences in sections 44, 45, 46 and 89,
              including fines. Among the principles the Court listed for the exercise was mandating
              the integration of assistive technologies such as screen readers, audio descriptions
              and accessible digital interfaces across public and private platforms.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The three-month deadline fell in February 2025. The ICT draft arrived twenty months
              after the judgment, and at a hearing on 29 July 2026 Justices Pardiwala and K. V.
              Viswanathan asked the Additional Solicitor General to consider the suggestions of
              experts and litigants before the draft is finalised and published in the Gazette, so
              that no deficiencies are left behind, and listed the matter for January 2027 with
              compliance affidavits due. For a broader view of how India sits next to other
              regimes, see the{" "}
              <Link href="/research/accessibility-laws" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                accessibility laws tracker
              </Link>
              .
            </p>
          </section>

          {/* The draft rules */}
          <section aria-labelledby="draft-heading">
            <h2 id="draft-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The Draft 2026 Rules: What They Require and When
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Draft Rights of Persons with Disabilities (Amendment) Rules, 2026 were signed on
              16 July 2026 as notification S.O. 3962(E) by the Department of Empowerment of
              Persons with Disabilities (Divyangjan) in the Ministry of Social Justice and
              Empowerment, and issued in the Gazette of India Extraordinary, Part II Section 3(ii),
              on 20 July 2026. Objections and suggestions were invited for thirty days from the
              date the Gazette was made available to the public. The notification recites the
              Supreme Court&apos;s direction as its reason for being, and its explanatory note
              describes the aim as &ldquo;a mandatory accessibility floor&rdquo; for ICT products
              and services.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Rather than adding another item, the draft replaces clause (c) of rule 15(1) wholesale
              with a self-contained code in ten parts: definitions, scope, applicable standards, the
              Accessibility Conformance Report, non-negotiable standards and timelines, enforcement,
              quality control orders, grievance redressal, a National Accessibility ICT Committee,
              and a three-yearly review. The timelines are the part most businesses need first.
              Every one of them is counted from the date the final rules are published, so none
              has started.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-sm border-collapse">
                <caption className="sr-only">
                  Compliance timelines in the draft Rights of Persons with Disabilities (Amendment)
                  Rules, 2026, all counted from publication of the final rules
                </caption>
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Who</th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Must do what</th>
                    <th scope="col" className="py-3 font-semibold text-slate-900 dark:text-white">Within</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">Establishments with turnover of ₹500 crore or more</td>
                    <td className="py-3 pr-4">Meet the Schedule I clauses for websites, apps, software, digital content, documents and ICT-based public services, and the Schedule II clauses for ICT hardware and consumer products</td>
                    <td className="py-3">1 year</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">Establishments below ₹500 crore</td>
                    <td className="py-3 pr-4">The same Schedule I and Schedule II clauses</td>
                    <td className="py-3">18 months</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">Every establishment</td>
                    <td className="py-3 pr-4">Comply with IS 17802 Parts 1 and 2 in their entirety (the section 46 outer limit)</td>
                    <td className="py-3">2 years</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">Government establishments</td>
                    <td className="py-3 pr-4">Stop procuring, deploying, upgrading or renewing non-compliant items; revise procurement policies, tenders, RFPs and contracts to make accessibility a mandatory condition</td>
                    <td className="py-3">Immediately; 90 days for the documents</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">Ministries, authorities and sectoral regulators</td>
                    <td className="py-3 pr-4">Designate a Deputy Nodal Officer (Director rank) and a Chief Nodal Officer (Joint Secretary rank) and publish their details; modify quality control orders</td>
                    <td className="py-3">90 days</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">Department of Empowerment of Persons with Disabilities</td>
                    <td className="py-3 pr-4">Constitute the National Accessibility ICT Committee, at least half of whose members are persons with disabilities</td>
                    <td className="py-3">90 days</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">Bureau of Indian Standards</td>
                    <td className="py-3 pr-4">Notify the ACR reporting format as part of IS 17802</td>
                    <td className="py-3">90 days</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">User-generated content platforms</td>
                    <td className="py-3 pr-4">Provide the capability to embed captions, transcripts, alternative text, audio description and accessible document formats, if not already available</td>
                    <td className="py-3">6 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Turnover is read from the immediately preceding financial year and, for applicability,
              includes the consolidated turnover of the establishment together with any entity
              that controls it, is controlled by it or is under common control, where those entities
              make covered items available to persons in India, including through platforms or
              intermediaries. The only exemption is archived content, clearly identified as such and
              not intended for active public use or update.
            </p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              Schedule I for the web is WCAG 2.1 Level A
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Schedule I lists the non-negotiable clauses of IS 17802 (Part 1) for websites,
              documents and software. Its web column names thirty clauses of clause 9, and they are
              exactly the thirty WCAG 2.1 Level A success criteria, from 9.1.1.1 Non-text content to
              9.4.1.2 Name, role, value. The document column (clause 10) and the two software
              columns (clause 11, open and closed functionality) list the same criteria as adapted
              for non-web content. The Level AA criteria, including contrast, reflow, resize text,
              focus visible and consistent navigation, arrive with the full-compliance duty at two
              years. The Schedule also says references follow the latest BIS version of the
              standard, so a future revision of IS 17802 would flow through automatically.
            </p>
            <details className="group rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40 mb-4">
              <summary className="cursor-pointer font-medium text-slate-900 dark:text-white">
                The thirty Schedule I web clauses, with their WCAG 2.1 names
              </summary>
              <ul className="mt-3 grid gap-x-6 gap-y-1 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2">
                {scheduleOneWebClauses.map(([clause, name]) => (
                  <li key={clause}>
                    <span className="font-mono text-slate-900 dark:text-white">{clause}</span> {name}
                  </li>
                ))}
              </ul>
            </details>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Schedule II covers hardware: clause 6 of IS 17802 (ICT with two-way voice
              communication), clause 7 (ICT with video communication) and clause 8 (hardware) for
              the hardware, electronic goods, consumer products and accessories in items (d) to (h)
              of the scope. Read the full text of the draft in the{" "}
              <a href={DRAFT_PDF} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                Gazette PDF
              </a>
              ; the English text starts on page 11.
            </p>
          </section>

          {/* Scope */}
          <section aria-labelledby="scope-heading">
            <h2 id="scope-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Who Is Covered, Including Entities Outside India
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Clause (B) applies to every establishment that manufactures, designs, develops,
              exercises decisive technical control over, or makes available, directly or
              indirectly, any of the covered items to persons in India for public or consumer use,
              &ldquo;whether such establishment is located within India or outside India&rdquo;,
              including automated systems that enable user interaction with ICT. The covered items
              are:
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>Websites, mobile applications, tablet applications, other touch-based applications and software, including their documentation and support services</li>
              <li>All digital content and electronic documents, including non-web documents</li>
              <li>ICT-based public facilities and services, including services that embed or integrate an ICT-based user interface</li>
              <li>Hardware with two-way voice communication and hardware with video-based communication</li>
              <li>All other ICT-based hardware and electronic goods intended for everyday use</li>
              <li>ICT-based consumer products and ICT-based accessories for general use by persons with disabilities</li>
              <li>ICT-based products used as part of public facilities and services</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Three consequences follow. A foreign SaaS vendor, marketplace or app publisher with
              Indian users is an establishment for these purposes; the Act&apos;s definition of a
              private establishment already reaches companies, firms, trusts and institutions
              without reference to where they are incorporated. The ₹500 crore turnover line changes
              the deadline, not the duty: smaller establishments get eighteen months rather than
              one year, and everyone meets the full standard at two years. And where a sectoral
              regulator, for example in banking, securities, insurance or telecoms, has notified its
              own accessibility requirements, those apply as well, and the higher or more stringent
              requirement prevails.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If you also sell into Europe, the scope logic will feel familiar: the{" "}
              <Link href="/compliance/eaa" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                European Accessibility Act
              </Link>{" "}
              likewise reaches non-EU businesses serving EU consumers, and both regimes resolve to
              the same technical standard family.
            </p>
          </section>

          {/* Standards mapping */}
          <section aria-labelledby="standards-heading">
            <h2 id="standards-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              IS 17802, EN 301 549 and WCAG: How the Standards Map
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              IS 17802 was developed under the Ministry of Electronics and Information
              Technology&apos;s Knowledge and Resource Centre for Accessibility in ICT (KAI) project
              led by C-DAC, and finalised by BIS sectional committee LITD 35. Part 1
              (Requirements) was established on 24 December 2021 and Part 2 (Determination of
              conformance) on 29 April 2022. The foreword of Part 1 settles the relationship with
              Europe: it is &ldquo;the technical adoption of the European Standard EN 301 549 v
              3.2.1&rdquo;, with modifications limited to referencing the RPwD Act and the official
              languages of India, and &ldquo;the technical coverage is otherwise identical&rdquo;.
              Because{" "}
              <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                EN 301 549
              </Link>{" "}
              incorporates WCAG 2.1 Level AA, so does IS 17802.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-sm border-collapse">
                <caption className="sr-only">
                  Clauses of IS 17802 (Part 1): 2021 mapped to EN 301 549 V3.2.1 and WCAG 2.1
                </caption>
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">IS 17802 clause</th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Covers</th>
                    <th scope="col" className="py-3 font-semibold text-slate-900 dark:text-white">WCAG relationship</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">9 Web</td>
                    <td className="py-3 pr-4">Web pages and web applications</td>
                    <td className="py-3">9.1 to 9.4 are the WCAG 2.1 Level A and AA success criteria, numbered to match (9.1.4.3 is WCAG 1.4.3); 9.6 is the WCAG conformance requirements</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">10 Non-web documents</td>
                    <td className="py-3 pr-4">PDF, office documents, EPUB and other downloadable content</td>
                    <td className="py-3">The same criteria applied to documents following the W3C WCAG2ICT note</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">11 Software</td>
                    <td className="py-3 pr-4">Native and mobile apps, desktop software, platforms, authoring tools</td>
                    <td className="py-3">The same criteria adapted for software, split into open and closed functionality, plus interoperability with assistive technology, user preferences and authoring tool duties</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">12 Documentation and support</td>
                    <td className="py-3 pr-4">Product documentation and support services</td>
                    <td className="py-3">Accessible documentation and support channels; no WCAG equivalent</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">5 to 8 and 13</td>
                    <td className="py-3 pr-4">Generic requirements, voice and video communication, hardware, relay and emergency services</td>
                    <td className="py-3">Outside WCAG; these are the Schedule II clauses for hardware</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The practical upshot is that an audit against EN 301 549 V3.2.1 is an audit against
              IS 17802, clause for clause. Our{" "}
              <Link href="/checklists/en-301-549" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                EN 301 549 checklist
              </Link>{" "}
              tracks every requirement of V3.2.1 with WCAG cross-links and Excel export, so it works
              as an interim IS 17802 checklist until BIS publishes the ACR format the draft asks for.
              Work done against WCAG 2.2 AA with the{" "}
              <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                WCAG 2.2 checklist
              </Link>{" "}
              covers the WCAG 2.1 clauses, with one caveat: WCAG 2.2 removed 4.1.1 Parsing, but
              9.4.1.1 remains a Schedule I clause in India, so keep your markup free of duplicate
              IDs and broken nesting.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              ETSI published EN 301 549 V4.1.1, aligned to WCAG 2.2, on 2 September 2026. The draft
              rules cite the 2021 edition of IS 17802, and nothing in them moves until BIS revises
              the Indian standard; when it does, the Schedules say the references follow the latest
              version.
            </p>
          </section>

          {/* ACR */}
          <section aria-labelledby="acr-heading">
            <h2 id="acr-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The Accessibility Conformance Report Duty
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The draft&apos;s central compliance document is the Accessibility Conformance Report.
              Clause (D) requires one for every covered item, whether built in-house, procured from
              a supplier or otherwise made available, within the same timelines as the Schedules.
              Its requirements read like a specification for the report itself:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">Published, free, in two formats.</strong>{" "}
                The ACR goes on the establishment&apos;s website or app at no cost, in a
                human-readable version (accessible HTML or accessible PDF) and a machine-readable
                version (JSON, XML or another structured format). Publishing only one is
                non-compliance. If the two disagree, the human-readable version prevails.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Clause by clause, against Part 2 testing.</strong>{" "}
                It states conformance with IS 17802 (Part 1) for each applicable requirement, as
                tested under the procedures in IS 17802 (Part 2), using a recognised format such as
                the VPAT or the format BIS is asked to notify within ninety days. Supporting
                explanations must cite test results and methods; generic or blanket statements of
                conformance are prohibited, and the report must disclose whether automated testing,
                manual inspection and assistive-technology testing were performed, with the scope
                and limitations of each.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Reviewed before launch, retested on change.</strong>{" "}
                The establishment must review and verify every ACR before deployment and fix
                identified non-conformities before release; relying on a supplier&apos;s ACR
                without that due diligence is no defence. Any major change, meaning one that
                materially alters functionality, interface, design, usability or accessibility
                features, triggers re-testing before the change ships, and the revised ACR shows
                its revision date. Decisions that a change was not major must be recorded and
                produced on request. Even with no change, a fresh review is due at least every two
                years.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Credentialed preparers, senior signature.</strong>{" "}
                The ACR must be prepared, reviewed or verified by individuals or organisations with
                demonstrable expertise in accessibility evaluation, familiarity with the standard
                and assistive technologies, and relevant training or recognised certifications,
                whose contact details and credentials are published in the report. It is signed by
                the nodal officer or by a manager not below Director or designated-partner level,
                who is responsible for its accuracy. The Grievance Redressal Officer&apos;s contact
                details appear in it too.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Content is covered at the system level.</strong>{" "}
                For content, the ACR obligation attaches to the content management system,
                publishing workflow or authoring tool rather than to each document, provided the
                output is accessible. User-generated content platforms report at platform level
                and must give users the means to add captions, transcripts, alternative text, audio
                description and structured documents, with guidance at upload time.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If you already produce VPAT-based reports for US federal or European buyers, the shape
              is familiar; the Indian additions are the machine-readable copy, the mandatory
              methodology disclosure, the named reviewer credentials and the senior sign-off. Our{" "}
              <Link href="/guides/vpat-accessibility-conformance-report" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                VPAT and ACR guide
              </Link>{" "}
              explains the template and how to fill it honestly.
            </p>
          </section>

          {/* Enforcement */}
          <section aria-labelledby="enforcement-heading">
            <h2 id="enforcement-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Enforcement: Fines, Grievance Officers and Licence Conditions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The fines come from the Act. Section 89 caps a first contravention at ten thousand
              rupees and a subsequent one at five lakh rupees, amounts that are small next to the
              EU&apos;s member-state penalties. The draft&apos;s clause (F) is where the pressure
              really sits:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-6">
              <li>The Chief Commissioner or the State Commissioner for Persons with Disabilities may inquire into non-compliance and impose the section 89 fines; sectoral regulators may add penalties, sanctions or corrective measures under their own statutes where non-compliance continues after a fine.</li>
              <li>A non-compliant establishment must remedy the breach within ninety days of the order and furnish an updated ACR. Missing that attracts enhanced fines; continued non-compliance can lead to suspension or cancellation of a registration, certification, authorisation or approval by the regulator or ministry, on its own motion or on the Commissioner&apos;s recommendation.</li>
              <li>Where a covered item needs a licence, registration, certification or approval, the authority must require an ACR or a compliance undertaking as a condition of grant, renewal or continuation. Where no such regime exists, the ACR must be disclosed with the product documentation or on the website or app.</li>
              <li>An ACR that is not furnished, or is false, misleading or materially inaccurate, exposes the establishment to action under whatever law governs it, in addition to the Act.</li>
              <li>Government establishments may not procure, deploy, upgrade or renew non-compliant items at all.</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Complaints follow a fixed ladder under clause (H), with the clock at each rung:
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-sm border-collapse">
                <caption className="sr-only">Grievance escalation ladder in the draft rules</caption>
                <thead>
                  <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Step</th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">Who</th>
                    <th scope="col" className="py-3 font-semibold text-slate-900 dark:text-white">Time limit</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">1. Complaint</td>
                    <td className="py-3 pr-4">The establishment&apos;s Grievance Redressal Officer, a senior member of management named in the ACR</td>
                    <td className="py-3">Redress within 30 days</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">2. Escalation</td>
                    <td className="py-3 pr-4">Deputy Nodal Officer (Director rank) of the relevant ministry, authority or regulator; complaint within 30 days of the decision or of the deadline passing</td>
                    <td className="py-3">Dispose within 45 days</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">3. Appeal</td>
                    <td className="py-3 pr-4">Chief Nodal Officer (Joint Secretary rank); appeal within 30 days</td>
                    <td className="py-3">Dispose within 45 days</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">4. Statutory complaint</td>
                    <td className="py-3 pr-4">Chief Commissioner or State Commissioner for Persons with Disabilities under the Act, without prejudice to other remedies</td>
                    <td className="py-3">Per the Act</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Above all of this sits the National Accessibility ICT Committee, which the Department
              must constitute within ninety days with representatives of ministries, authorities
              and regulators and at least fifty per cent persons with disabilities. It meets at
              least quarterly, publishes its proceedings, reviews compliance trends from ACRs and
              complaints, can issue binding directions to remedy systemic gaps, and will set the
              certification and empanelment framework for accessibility professionals, auditors and
              testing agencies. That last function is worth watching: it is where the market for
              credentialed ACR preparers will be defined.
            </p>
          </section>

          {/* GIGW */}
          <section aria-labelledby="gigw-heading">
            <h2 id="gigw-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Government Websites and Apps: GIGW 3.0 and STQC Certification
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Government properties have had an operational standard for longer. The Guidelines for
              Indian Government Websites and Apps, GIGW 3.0, were formulated by the National
              Informatics Centre with the STQC Directorate of MeitY and CERT-In and released in
              March 2023, replacing GIGW 2.0 of 2018. The manual states that the guidelines are
              based on WCAG 2.1 and the RPwD Act, that the current version ensures conformity with
              Level AA of WCAG 2.1 with seventeen new success criteria over the WCAG 2.0-based
              previous edition, and that all websites and apps owned by government organisations
              must comply with them. GIGW 3.0 carries 25 quality, 50 accessibility, 3 cybersecurity
              and 10 lifecycle-management guidelines, and it is the basis of STQC&apos;s Website
              Quality Certification, which has accepted applications under the 3.0 edition since
              1 October 2023.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The two regimes now converge. The original rule 15(1)(c) pointed government websites
              at GIGW; the 2023 amendment added IS 17802 for everyone; the draft replaces the whole
              clause with IS 17802 and bars government establishments from procuring anything that
              does not meet it. In practice a government site that passes GIGW 3.0 is meeting the
              WCAG 2.1 AA core of IS 17802 clause 9, but it will still need an ACR, a grievance
              officer and the procurement changes the draft demands. For how other public-sector
              regimes handle the same convergence, compare the UK&apos;s{" "}
              <Link href="/compliance/uk" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                PSBAR monitoring model
              </Link>
              .
            </p>
          </section>

          {/* What to do now */}
          <section aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What To Do Now
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              The draft may change before notification, and the Supreme Court has asked for exactly
              that. The standard will not change: IS 17802 has been the mandated ICT standard since
              May 2023, and the Court&apos;s direction was to add a floor, not to lower it. Everything
              below is useful under the current rules and becomes required under the draft.
            </p>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-slate-900 dark:text-white">Work out your position.</strong>{" "}
                List the websites, apps, documents, software and ICT hardware you make available to
                people in India, including from abroad. Compute consolidated group turnover against
                ₹500 crore and note which clock you are on: one year, eighteen months, and two years
                for full compliance, all from the final notification.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Audit against clause 9 now, Level A first.</strong>{" "}
                Use the{" "}
                <Link href="/checklists/en-301-549" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                  EN 301 549 checklist
                </Link>{" "}
                as your interim IS 17802 checklist and clear the thirty Schedule I clauses before
                the AA set. A{" "}
                <Link href="/services/accessibility-audits" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                  WCAG 2.2 AA audit
                </Link>{" "}
                gives you the clause-level findings an ACR has to cite; the{" "}
                <Link href="/sample-audit-report" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                  sample audit report
                </Link>{" "}
                shows the format.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Start producing the ACR.</strong>{" "}
                Build a VPAT-style report against the IS 17802 clauses with per-requirement
                evidence, a methodology statement covering automated, manual and assistive-technology
                testing, the reviewer&apos;s credentials, and a Director-level signature. Publish it
                as HTML and as JSON. The{" "}
                <Link href="/guides/vpat-accessibility-conformance-report" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                  VPAT and ACR guide
                </Link>{" "}
                covers the structure.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Fix procurement and supplier contracts.</strong>{" "}
                Require an ACR from every vendor whose product you deploy, review it before launch
                and make accessibility a condition of acceptance. Government establishments have
                ninety days from notification to rewrite tenders and RFPs, so start the templates.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Name a Grievance Redressal Officer.</strong>{" "}
                Appoint a senior manager, publish their contact details, and run a thirty-day
                complaint process. Pair it with a public accessibility statement; our{" "}
                <Link href="/guides/how-to-write-an-accessibility-statement" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                  accessibility statement guide
                </Link>{" "}
                and{" "}
                <Link href="/tools/accessibility-statement-generator" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                  statement generator
                </Link>{" "}
                give you a draft.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Make the content pipeline accessible.</strong>{" "}
                The ACR for content attaches to your CMS, document workflow and authoring tools, so
                fix templates, PDF export and video publishing once rather than document by
                document. Platforms with user-generated content need captioning, alt text and
                audio-description capability within six months.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Watch two dates.</strong>{" "}
                The final notification in the Gazette, which starts every clock, and the Supreme
                Court&apos;s January 2027 hearing, where the Union must file compliance affidavits.
                This page will be restamped when either moves.
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
              <time dateTime={REVIEWED_ISO}>{REVIEWED_ON}</time>. Law-firm summaries were used only to
              find the primary texts, not as sources.
            </p>
            <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-decimal pl-5">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </section>

          {/* Disclaimer */}
          <section aria-label="Disclaimer">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Educational Content, Not Legal Advice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This page is provided for general educational purposes only and does not constitute
                legal advice. The 2026 rules described here are a draft and may be changed before
                they are notified, and the Supreme Court proceedings that prompted them are
                continuing. For advice about your specific situation, consult an advocate
                experienced in Indian disability rights and technology law.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="India accessibility law RPwD Act IS 17802 EN 301 549 WCAG 2.1 accessibility conformance report VPAT checklist audit"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
