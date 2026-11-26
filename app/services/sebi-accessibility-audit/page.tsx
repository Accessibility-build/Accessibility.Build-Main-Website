import Link from "next/link"
import type { Metadata } from "next"
import { BadgeCheck, ClipboardList, FileCheck2, Landmark, MonitorSmartphone, Users } from "lucide-react"
import { ServiceHero } from "@/components/services/service-hero"
import { ProcessSteps } from "@/components/services/process-steps"
import { FAQSection } from "@/components/services/faq-section"
import { ServicePricing } from "@/components/services/service-pricing"
import { TriggerFacts, TriggerSources } from "@/components/services/trigger-facts"
import { ServiceStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { Button } from "@/components/ui/button"
import { servicePricing, toStructuredOffers } from "@/lib/service-pricing"

const pricing = servicePricing.sebiAudit
const path = "/services/sebi-accessibility-audit"
const title = "SEBI IAAP Accessibility Audit"
const pageDescription =
  "SEBI accessibility audits by an IAAP-certified auditor, with usability testing by persons with disabilities. Fixed prices from ₹39,999 for brokers, AMCs, RTAs and advisers."
const ogImage = `/api/og?title=${encodeURIComponent(title)}&section=Services`

export const metadata: Metadata = {
  title: `${title} for Brokers, AMCs and RTAs | Accessibility.build`,
  description: pageDescription,
  keywords: [
    "sebi accessibility audit",
    "sebi iaap auditor",
    "iaap certified accessibility auditor india",
    "sebi digital accessibility circular",
    "accessibility audit for stock brokers",
    "accessibility audit mutual fund amc",
    "sebi accessibility compliance 31 january 2027",
  ],
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    title,
    description: pageDescription,
    url: path,
    images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: "summary_large_image", title, description: pageDescription, images: [ogImage] },
}

const facts = [
  {
    title: "The auditor must be IAAP-certified",
    body: "SEBI requires regulated entities to have their websites, apps and portals audited by IAAP-certified accessibility professionals. The appointment form asks for the professional's name and IAAP certificate number; a firm-level certification or empanelment is not required by the circular.",
  },
  {
    title: "Persons with disabilities must test it",
    body: "The audit has to include usability testing by persons with disabilities. Every package here includes moderated sessions with screen-reader, low-vision and other participants.",
  },
  {
    title: "It is every year, not once",
    body: "After the first audit and remediation, the audit is repeated annually, with a compliance confirmation due within 30 days of each financial year end, starting 30 April 2027.",
  },
  {
    title: "Investors can complain on SCORES",
    body: "Investors can raise an accessibility complaint on SCORES, and the entity has to fix the problem to close it, so issues missed in the audit can come back as grievances.",
  },
  {
    title: "Brokers on vendor platforms are not fully exempt",
    body: "NSE lets a broker rely on its vendor's IAAP audit for an uncustomised platform, but the broker's own website, KYC journey and customised apps still need their own audit.",
  },
]

const process = [
  {
    title: "Scope and appointment",
    description:
      "We list your platforms and pick the templates and journeys investors use most. You receive the auditor details the SEBI appointment form asks for.",
    icon: ClipboardList,
  },
  {
    title: "Expert audit",
    description:
      "Manual testing against WCAG 2.2 AA (which includes WCAG 2.1) with keyboard, NVDA, TalkBack and VoiceOver, mapped to GIGW 3.0 and IS 17802.",
    icon: MonitorSmartphone,
  },
  {
    title: "Usability testing by persons with disabilities",
    description:
      "Moderated sessions where participants with disabilities attempt real tasks such as account opening, placing an order or downloading a statement.",
    icon: Users,
  },
  {
    title: "Report and remediation",
    description:
      "A signed report with each finding, its evidence and how to fix it, walked through with your team or vendor so remediation can start immediately.",
    icon: FileCheck2,
  },
  {
    title: "Retest and closure",
    description:
      "After fixes, the affected screens are retested and you receive a closure report for the remediation part of the requirement.",
    icon: BadgeCheck,
  },
]

const faqs = [
  {
    question: "Who has to comply with SEBI's digital accessibility circular?",
    answer:
      "All SEBI-regulated entities: stock exchanges, clearing corporations, depositories and every registered intermediary, including stock brokers, depository participants, mutual funds and AMCs, portfolio managers, alternative investment funds, registrars and transfer agents, KYC registration agencies, investment advisers and research analysts. The circular does not phase the requirement by size.",
  },
  {
    question: "What is the current SEBI deadline?",
    answer:
      "SEBI's circular of 30 October 2026 extended the deadline for appointing an IAAP auditor, conducting the accessibility audit of digital platforms and remediating the findings to 31 January 2027. The earlier dates have been extended several times, so check SEBI's website for any later change. After that, audits are annual.",
  },
  {
    question: "Does an individual IAAP-certified auditor meet SEBI's requirement?",
    answer:
      "Yes. SEBI's appointment format asks for the name of the IAAP-certified accessibility professional and their IAAP certificate number, and its reporting formats accept a professional or a firm. The circular itself does not require DEPwD or STQC empanelment, although some entities add such conditions to their own RFPs.",
  },
  {
    question: "Which standards do you audit against?",
    answer:
      "The circular refers to WCAG 2.1 or its latest version and the latest GIGW. I test against WCAG 2.2 Level AA, which contains every WCAG 2.1 AA criterion, and map findings to GIGW 3.0 and IS 17802 so one report serves the SEBI filing and any other Indian requirement.",
  },
  {
    question: "Our trading platform is built by a vendor. What do we need?",
    answer:
      "If you use the vendor's platform without customisation, NSE allows you to rely on the vendor's own IAAP audit report for that platform. Your own website, KYC and onboarding journey and any customised app still need an independent audit. I can review the vendor's report and audit the parts that remain yours.",
  },
  {
    question: "Do you provide a certificate?",
    answer:
      "You receive a signed audit report and, after remediation and a retest, a closure report confirming which findings were fixed. I do not issue a blanket 'compliance certificate' for platforms that still have open issues, because SEBI asks for remediation, not a badge.",
  },
  {
    question: "Can you fix the issues as well?",
    answer:
      "Yes. Every package includes fix guidance and a walkthrough with your developers or vendor. Hands-on remediation is available separately and can be quoted once the audit shows how much work there is.",
  },
]

const sources = [
  {
    label: "SEBI circular SEBI/HO/ITD-1/ITD_VIAP/P/CIR/2025/111, 31 July 2025, and compliance guidelines of 25 September 2025",
    href: "https://www.sebi.gov.in/legal/circulars/sep-2025/compliance-guidelines-for-digital-accessibility-circular-rights-of-persons-with-disabilities-act-2016-and-rules-made-thereunder-mandatory-compliance-by-all-regulated-entities-dated-july-31-2025-_96862.html",
  },
  {
    label: "SEBI circular of 30 October 2026 extending the deadline to 31 January 2027",
    href: "https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1793363799724.pdf",
  },
]

export default function SebiAccessibilityAuditPage() {
  return (
    <div className="container-wide py-12">
      <ServiceStructuredData
        name={title}
        description={pageDescription}
        serviceType="Accessibility Audit"
        url={`https://accessibility.build${path}`}
        areaServed={["India"]}
        offers={toStructuredOffers(pricing)}
        serviceOutput="IAAP-signed WCAG 2.2 AA audit report with usability testing by persons with disabilities, issue register and closure report"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Services", url: "https://accessibility.build/services" },
          { name: title, url: `https://accessibility.build${path}` },
        ]}
      />
      <ServiceHero
        title={title}
        description="Audits for SEBI-regulated entities by an IAAP-certified auditor, including usability testing by persons with disabilities, with fixed prices in rupees."
        cta="Book a SEBI audit"
        ctaLink={`/contact?service=audit&package=${pricing.tiers[1].slug}`}
        icon={Landmark}
        gradientFrom="rgba(14, 116, 144, 0.8)"
        gradientTo="rgba(30, 64, 175, 0.8)"
        startingPrice={pricing.tiers[0].price}
        delivery={pricing.tiers[0].timeline}
        currency={pricing.currency}
      />

      <TriggerFacts
        heading="What SEBI requires"
        intro="SEBI made digital accessibility mandatory for every regulated entity under the Rights of Persons with Disabilities Act, 2016. In practice that means five things."
        deadlineLabel="Current SEBI deadline"
        deadline="31 January 2027"
        deadlineNote="To appoint an IAAP auditor, complete the audit and remediate the findings, per SEBI's circular of 30 October 2026."
        facts={facts}
      />

      <section className="py-16 bg-muted/30 rounded-3xl px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How the audit works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            One process, from the appointment form to the closure report, so the evidence SEBI and the exchanges ask
            for is produced as you go.
          </p>
        </div>
        <ProcessSteps steps={process} />
      </section>

      <ServicePricing pricing={pricing} />

      <FAQSection faqs={faqs} />

      <section className="py-16">
        <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 text-center">
          <h2 className="text-3xl font-bold mb-4">Get your audit booked before the deadline</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Tell me which platforms you run and I will reply with the right package and a start date.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href={`/contact?service=audit&package=${pricing.tiers[1].slug}`}>Book a SEBI audit</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/compliance/india">India accessibility law overview</Link>
            </Button>
          </div>
        </div>
      </section>

      <TriggerSources
        sources={sources}
        note="Summarised from SEBI's circulars as of 26 November 2026. This page is regulatory context, not legal advice."
      />
    </div>
  )
}
