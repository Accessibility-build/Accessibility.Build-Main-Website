import Link from "next/link"
import {
  ArrowRight,
  HeartPulse,
  Scale,
  Gavel,
  FileText,
  FormInput,
  Video,
  Contrast,
  Languages,
  CalendarClock,
  CheckCircle2,
  Stethoscope,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"

export const metadata = {
  title: "Healthcare Website Accessibility & Compliance",
  description:
    "How the ADA, Section 1557, and the HHS Section 504 web rule apply to hospitals, clinics, telehealth, and patient portals — plus the WCAG fixes that matter most.",
  alternates: { canonical: "/industries/healthcare" },
  openGraph: {
    type: "website",
    title: "Healthcare Website Accessibility & Compliance",
    description:
      "How the ADA, Section 1557, and the HHS Section 504 web rule apply to hospitals, clinics, telehealth, and patient portals — plus the WCAG fixes that matter most.",
    url: "/industries/healthcare",
    images: [
      {
        url: "/api/og?title=Healthcare%20Website%20Accessibility%20%26%20Compliance&section=Industries",
        width: 1200,
        height: 630,
        alt: "Healthcare Website Accessibility & Compliance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healthcare Website Accessibility & Compliance",
    description:
      "How the ADA, Section 1557, and the HHS Section 504 web rule apply to hospitals, clinics, telehealth, and patient portals — plus the WCAG fixes that matter most.",
    images: ["/api/og?title=Healthcare%20Website%20Accessibility%20%26%20Compliance&section=Industries"],
  },
}

const stats = [
  {
    value: "May 11, 2026",
    label:
      "HHS Section 504 web rule deadline for most covered entities — already in effect, and it was not extended",
  },
  {
    value: "1 in 4",
    label: "US adults has a disability, and people with disabilities use healthcare services more than any other group",
  },
  {
    value: "WCAG 2.1 AA",
    label: "the technical standard the HHS Section 504 rule adopts for websites, patient portals, and mobile apps",
  },
  {
    value: "Rising",
    label: "healthcare's share of private accessibility litigation is climbing as regulators set explicit standards",
  },
]

const legalExposure = [
  {
    icon: Gavel,
    title: "The HHS Section 504 web rule — the deadline that already passed",
    description:
      "In May 2024, HHS finalized a rule under Section 504 of the Rehabilitation Act requiring recipients of HHS funding — hospitals that bill Medicare or Medicaid, clinics, state health agencies, health plans, and grantees — to make websites, patient portals, kiosks, and mobile apps conform to WCAG 2.1 Level AA. The compliance date for most covered entities was May 11, 2026, with smaller entities on phased timelines. Unlike the DOJ's Title II web rule, this deadline was not extended. If your organization takes HHS money and your digital front door is not WCAG 2.1 AA conformant today, you are out of compliance. See our Section 504 deadline guide for who is covered and what to do if you missed it.",
  },
  {
    icon: Scale,
    title: "Section 1557 of the Affordable Care Act",
    description:
      "The 2024 Section 1557 final rule prohibits disability discrimination in health programs and activities that receive federal financial assistance, and it explicitly extends to services delivered through websites, mobile apps, and telehealth. Covered entities must ensure telehealth services are accessible to patients with disabilities and provide effective communication — captions, interpreters, accessible documents — as part of care delivery. HHS's Office for Civil Rights enforces 1557 through complaint investigations, resolution agreements, and, ultimately, the threat of losing federal funding.",
  },
  {
    icon: HeartPulse,
    title: "ADA Title II and Title III",
    description:
      "Private hospitals, physician practices, dental offices, pharmacies, and health insurers are places of public accommodation under ADA Title III; public hospitals and county health systems fall under Title II. Courts have applied both to digital services, and DOJ has repeatedly taken the position that the ADA covers web content. Private plaintiffs have sued health systems over inaccessible appointment scheduling, portals, and vaccine-booking sites — pandemic-era vaccine registration lawsuits were an early warning of how quickly digital health barriers become litigation. A public hospital covered by both Title II and Section 504 must meet the earlier, stricter Section 504 deadline.",
  },
  {
    icon: CalendarClock,
    title: "Effective-communication obligations that predate every web rule",
    description:
      "Independent of any WCAG rulemaking, the ADA and Section 504 have always required effective communication with patients — auxiliary aids, accessible formats, and interpreters. OCR has resolved cases against providers whose inaccessible billing statements, discharge instructions, and consent forms denied blind and deaf patients equal access to their own health information. Digital accessibility is the modern form of an obligation healthcare has carried since 1990: a patient portal a screen reader cannot operate is legally equivalent to a printed form a blind patient cannot read.",
  },
]

const wcagIssues = [
  {
    icon: FormInput,
    title: "Patient intake, registration, and scheduling forms",
    criteria: [
      { label: "WCAG 3.3.2 Labels or Instructions", href: "/wcag/3-3-2" },
      { label: "WCAG 3.3.1 Error Identification", href: "/wcag/3-3-1" },
      { label: "WCAG 1.3.1 Info and Relationships", href: "/wcag/1-3-1" },
    ],
    description:
      "Healthcare runs on forms — new-patient registration, symptom questionnaires, insurance verification, consent, appointment booking. Fields without programmatic labels, required-field indicators conveyed only by color, error messages that never reach a screen reader, and date pickers that trap keyboard users all block patients at the first step of care. Multi-step intake flows must preserve entered data and announce progress and validation errors accessibly.",
  },
  {
    icon: FileText,
    title: "Untagged medical PDFs",
    criteria: [
      { label: "WCAG 1.3.1 Info and Relationships", href: "/wcag/1-3-1" },
      { label: "WCAG 1.1.1 Non-text Content", href: "/wcag/1-1-1" },
    ],
    description:
      "After-visit summaries, lab results, billing statements, consent forms, and plan documents are overwhelmingly delivered as PDFs — and most are untagged scans or exports with no reading order, no heading structure, and no alt text. An untagged PDF is effectively blank to a screen reader, which means a blind patient cannot privately read their own diagnosis or bill. Run key documents through our free PDF accessibility checker, fix templates at the source system, and prefer accessible HTML over PDF wherever possible.",
  },
  {
    icon: Video,
    title: "Telehealth video platforms",
    criteria: [
      { label: "WCAG 1.2.2 Captions (Prerecorded)", href: "/wcag/1-2-2" },
      { label: "WCAG 2.1.1 Keyboard", href: "/wcag/2-1-1" },
      { label: "WCAG 4.1.2 Name, Role, Value", href: "/wcag/4-1-2" },
    ],
    description:
      "Section 1557 explicitly requires accessible telehealth. That means the join flow, waiting room, and in-call controls must be keyboard operable and screen-reader compatible; live visits need real-time captioning or interpreter support for deaf and hard-of-hearing patients; and prerecorded patient-education video needs accurate captions. Because most telehealth runs on third-party platforms, providers must vet vendors — the legal obligation to the patient stays with the covered entity.",
  },
  {
    icon: Contrast,
    title: "Low-contrast text and fragile layouts in portals",
    criteria: [
      { label: "WCAG 1.4.3 Contrast (Minimum)", href: "/wcag/1-4-3" },
      { label: "WCAG 2.4.6 Headings and Labels", href: "/wcag/2-4-6" },
    ],
    description:
      "Healthcare skews older: the heaviest users of patient portals are also the most likely to have reduced vision. Light gray lab values, thin fonts over hero imagery, and dense unstructured result tables make portals unusable well before legal blindness. Clear heading hierarchies, descriptive section labels, and 4.5:1 contrast minimums are low-cost fixes with outsized impact on the actual patient population.",
  },
  {
    icon: Languages,
    title: "Missing language attributes and impenetrable content",
    criteria: [
      { label: "WCAG 3.1.1 Language of Page", href: "/wcag/3-1-1" },
    ],
    description:
      "Health systems serve multilingual populations and publish translated content, but pages frequently omit the lang attribute — so screen readers pronounce Spanish text with English phonetics, rendering translations useless. Pair correct language markup with plain-language writing for critical instructions; comprehension barriers are accessibility barriers when the reader has a cognitive disability, low literacy, or is in crisis.",
  },
]

const roadmap = [
  {
    step: "Map your regulatory position",
    detail:
      "Determine which rules bind you: HHS funding triggers Section 504 (deadline passed) and usually Section 1557; public ownership adds ADA Title II; private status adds Title III. Inventory every patient-facing digital property — main site, portal, mobile app, telehealth platform, kiosks, and document delivery systems — because the Section 504 rule covers all of them.",
  },
  {
    step: "Audit the patient journey end to end",
    detail:
      "Audit finding a provider, booking, intake, the telehealth visit, results retrieval, and bill payment as one continuous journey, combining automated scans with manual screen reader and keyboard testing. Prioritize the portal and scheduling first — they are the highest-traffic and highest-obligation surfaces.",
  },
  {
    step: "Fix forms, then documents, then video",
    detail:
      "Remediate intake and scheduling forms at the template level so every deployment inherits the fix. Retag high-volume PDF templates (statements, summaries, consents) in the generating system rather than one document at a time, and migrate what you can to accessible HTML. Establish a captioning pipeline for all patient-education video.",
  },
  {
    step: "Hold EHR and telehealth vendors to the standard",
    detail:
      "Most patient-facing healthcare software is vendor-built (portals, telehealth, scheduling). Require WCAG 2.1 AA conformance and a current ACR/VPAT in contracts and renewals, test vendor releases yourself, and document remediation commitments — OCR expects covered entities to manage their vendors, not hide behind them.",
  },
  {
    step: "Institutionalize and document",
    detail:
      "Adopt an accessibility policy, train clinical-content and portal teams, publish an accessibility statement with a monitored contact channel, and schedule recurring audits. Under Section 504 and 1557, documented good-faith processes materially change how OCR treats a complaint.",
  },
]

const faqs = [
  {
    question: "Which accessibility laws apply to a private medical practice?",
    answer:
      "At minimum, ADA Title III applies to private practices as places of public accommodation, covering websites, portals, and apps under prevailing DOJ and court interpretations. If the practice bills Medicare or Medicaid or receives any other HHS funding — which nearly all do — the HHS Section 504 web rule also applies, imposing WCAG 2.1 AA on web content, mobile apps, and kiosks, and Section 1557 of the ACA adds effective-communication and telehealth accessibility obligations. State civil rights laws such as California's Unruh Act can add statutory damages on top.",
  },
  {
    question: "What is the Section 504 web accessibility deadline, and what if we missed it?",
    answer:
      "The HHS Section 504 rule set a compliance date of May 11, 2026 for most covered entities, with smaller entities on phased later timelines — and unlike the DOJ Title II rule, it was not extended. If you missed it, do not wait for a complaint: commission an audit immediately, fix the highest-impact barriers (portal login, scheduling, forms, key PDFs) first, and document a dated remediation plan. Demonstrable progress and a credible plan are the strongest position you can be in if OCR opens an investigation.",
  },
  {
    question: "Do patient portals and mobile health apps have to meet WCAG?",
    answer:
      "Yes. The Section 504 rule explicitly covers web content and mobile applications that covered entities provide or make available, which includes patient portals, telehealth apps, and prescription-refill apps — even when a vendor like an EHR company builds and hosts them. The covered entity remains legally responsible, so vendor contracts should require WCAG 2.1 AA conformance, current accessibility documentation, and remediation timelines for known defects.",
  },
  {
    question: "How does accessibility apply to telehealth visits?",
    answer:
      "Section 1557 and the ADA's effective-communication rules require that telehealth be as accessible as in-person care. Practically: the scheduling and join flow must work with screen readers and keyboards, video visits must support real-time captioning or qualified sign-language interpreters when needed for effective communication, in-call controls need accessible names and states, and any prerecorded instructional video needs captions. If your telehealth vendor cannot support these, the compliance failure is yours, not just theirs.",
  },
  {
    question: "Are medical PDFs like lab results and billing statements really a compliance issue?",
    answer:
      "Yes — documents are one of the most common findings in healthcare accessibility reviews and OCR resolutions. An untagged PDF has no structure a screen reader can navigate, which denies blind patients private, independent access to their own health information — precisely what effective-communication rules protect. Fix the templates in the systems that generate documents at volume, tag the high-traffic static PDFs, and prefer HTML delivery for new content.",
  },
  {
    question: "Does healthcare face accessibility lawsuits, or just regulators?",
    answer:
      "Both. Healthcare's share of private accessibility litigation is smaller than retail's but rising, with suits over appointment scheduling, portals, and pharmacy sites — and the Section 504 rule taking effect in May 2026 gives plaintiffs and regulators an explicit technical standard to measure against. Section 504 also carries a private right of action, so missing the WCAG 2.1 AA requirement creates exposure on two fronts at once. Our lawsuit tracker follows the trend.",
  },
]

export default function HealthcareIndustryPage() {
  return (
    <div className="container-wide py-12 px-4 sm:px-6">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Industries", url: "https://accessibility.build/industries" },
          { name: "Healthcare", url: "https://accessibility.build/industries/healthcare" },
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
            <span className="text-foreground font-medium">Healthcare</span>
          </li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-6">
          <HeartPulse className="h-4 w-4" aria-hidden="true" />
          Industry Guide
        </div>
        <h1 className="text-4xl font-bold mb-4">Healthcare Website Accessibility &amp; Compliance</h1>
        <p className="text-xl text-muted-foreground">
          Healthcare's digital front door — portals, scheduling, telehealth, and medical documents — now sits under
          the strictest accessibility rules in US law, and the first hard WCAG deadline has already passed. Here is
          what applies to you and how to close the gap.
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
        <h2 className="text-3xl font-bold mb-6">Why accessibility matters in healthcare</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            No industry's users need accessibility more. People with disabilities are healthcare's core constituency,
            not an edge case: roughly one in four US adults lives with a disability, disability prevalence rises
            steeply with age, and the patients who interact with health systems most frequently — older adults and
            people managing chronic conditions — are exactly those most likely to rely on screen readers, magnification,
            captions, voice control, or keyboard navigation. A health system whose portal fails these users is failing
            its highest-utilization patients.
          </p>
          <p>
            The stakes are also categorically higher than in other sectors. An inaccessible checkout loses a sale; an
            inaccessible patient portal delays a lab result, blocks a medication refill, or prevents a deaf patient
            from conducting a telehealth visit. Research consistently shows people with disabilities experience worse
            health outcomes and more barriers to care — and since the pandemic pushed intake, scheduling, and visits
            online, digital barriers have become clinical barriers. Accessibility failures here translate directly
            into delayed care, privacy loss (needing a sighted helper to read your own diagnosis), and health
            inequity.
          </p>
          <p>
            The business case follows: portals and telehealth only reduce cost if patients can actually self-serve.
            Every patient who cannot book online books by phone; every unreadable statement becomes a billing call.
            Accessible digital care pathways raise portal adoption, telehealth completion rates, and patient
            satisfaction scores — while keeping you inside the legal lines described below.
          </p>
        </div>
      </section>

      {/* Legal exposure */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-2 text-center">Healthcare's legal exposure</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          Healthcare organizations typically sit under several regimes at once. For background on the ADA generally,
          see our <Link href="/compliance/ada" className="text-primary hover:underline">ADA compliance guide</Link>;
          public health systems should also review{" "}
          <Link href="/compliance/section-508" className="text-primary hover:underline">Section 508</Link> if they
          touch federal programs.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {legalExposure.map((item, i) => {
            const IconComponent = item.icon
            return (
              <div key={i} className="bg-background rounded-2xl border p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-2">
                    <IconComponent className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            )
          })}
        </div>
        <p className="text-sm text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
          Deep dive: read our guide to the{" "}
          <Link href="/guides/section-504-web-accessibility-deadline" className="text-primary hover:underline">
            Section 504 web accessibility deadline
          </Link>{" "}
          — the rule that was not extended.
        </p>
      </section>

      {/* WCAG issues */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-2 text-center">The WCAG issues that block patients most</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          Healthcare audits surface the same categories again and again. Each links to the relevant WCAG success
          criterion.
        </p>
        <div className="space-y-6 max-w-4xl mx-auto">
          {wcagIssues.map((issue, i) => {
            const IconComponent = issue.icon
            return (
              <div key={i} className="bg-background rounded-2xl border p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-2.5 flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
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
        <h2 className="text-3xl font-bold mb-2 text-center">A compliance roadmap for health organizations</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
          With the Section 504 deadline already passed for most covered entities, the sequence below is built for
          catching up fast and documenting progress.
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
        <h2 className="text-2xl font-bold mb-6 text-center">Tools and resources for healthcare teams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/tools/pdf-accessibility-checker"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <FileText className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">PDF Accessibility Checker</h3>
            <p className="text-sm text-muted-foreground">
              Test statements, consents, and after-visit summaries for tagging and structure.
            </p>
          </Link>
          <Link
            href="/checklists/wcag-2-2"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <CheckCircle2 className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">WCAG 2.2 Checklist</h3>
            <p className="text-sm text-muted-foreground">
              Covers everything WCAG 2.1 AA requires — the Section 504 standard — and more.
            </p>
          </Link>
          <Link
            href="/services/accessibility-audits"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <Stethoscope className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Accessibility Audits</h3>
            <p className="text-sm text-muted-foreground">
              Portal, scheduling, and telehealth audits mapped to Section 504 and 1557 obligations.
            </p>
          </Link>
          <Link
            href="/research/accessibility-lawsuits"
            className="group bg-background rounded-2xl border p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
          >
            <Scale className="h-8 w-8 text-primary mb-3" aria-hidden="true" />
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Lawsuit Tracker</h3>
            <p className="text-sm text-muted-foreground">
              Litigation data, including healthcare's rising share of accessibility suits.
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
          <h2 className="text-2xl font-bold mb-2">The Section 504 deadline has passed — know where you stand</h2>
          <p className="text-muted-foreground">
            We audit patient portals, scheduling flows, telehealth platforms, and document pipelines against WCAG 2.1
            AA, and deliver a remediation plan you can show a regulator.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/contact?service=audit" className="flex items-center">
              Request a Healthcare Audit
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
