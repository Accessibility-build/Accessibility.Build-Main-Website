import Link from "next/link"
import type { Metadata } from "next"
import { BadgeCheck, ClipboardList, FileSignature, Leaf, MonitorCheck, ScrollText } from "lucide-react"
import { ServiceHero } from "@/components/services/service-hero"
import { ProcessSteps } from "@/components/services/process-steps"
import { FAQSection } from "@/components/services/faq-section"
import { ServicePricing } from "@/components/services/service-pricing"
import { TriggerFacts, TriggerSources } from "@/components/services/trigger-facts"
import { ServiceStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { Button } from "@/components/ui/button"
import { servicePricing, toStructuredOffers } from "@/lib/service-pricing"

const pricing = servicePricing.aoda
const path = "/services/aoda-compliance"
const title = "AODA Website Compliance"
const pageDescription =
  "AODA website audits against WCAG 2.0 AA and the documents behind your 2026 compliance report, for Ontario organizations. Fixed prices in Canadian dollars from CA$1,190."
const ogImage = `/api/og?title=${encodeURIComponent(title)}&section=Services`

export const metadata: Metadata = {
  title: "AODA Website Compliance Audit and Report Support | Accessibility.build",
  description: pageDescription,
  keywords: [
    "aoda compliance",
    "aoda website audit",
    "aoda compliance report 2026",
    "aoda wcag 2.0 aa",
    "ontario website accessibility audit",
    "iasr section 14",
    "aoda multi-year accessibility plan",
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
    title: "Websites must meet WCAG 2.0 AA",
    body: "Section 14 of the Integrated Accessibility Standards Regulation requires designated public sector organizations and organizations with 50 or more employees in Ontario to make their websites and web content conform with WCAG 2.0 Level AA, apart from live captions and pre-recorded audio description. The deadline was 1 January 2021.",
  },
  {
    title: "The compliance report is due 31 December 2026",
    body: "Businesses and non-profits with 20 or more employees in Ontario file an accessibility compliance report every three years, and the current deadline is 31 December 2026. It asks whether your website meets the standard.",
  },
  {
    title: "Policies and a plan sit behind the report",
    body: "Larger organizations also need accessibility policies, a statement of commitment, a multi-year accessibility plan, a feedback process and accessible formats on request. The Compliance Pack prepares these with the audit.",
  },
  {
    title: "Penalties are real, if usually modest",
    body: "Administrative penalties for corporations run from $500 to $15,000. The $100,000-a-day figure often quoted applies to offences such as filing false information or ignoring an order, not to an ordinary late website fix.",
  },
  {
    title: "Federally regulated? The Accessible Canada Act adds more",
    body: "Banks, telecoms, airlines and other federally regulated organizations also have Accessible Canada Act duties, including digital rules that phase in from December 2027. The Canada Accessibility Programme covers both.",
  },
]

const process = [
  {
    title: "Confirm what applies",
    description: "We confirm your employee count and sector, which decides your AODA and Accessible Canada Act duties, and agree the templates and journeys to test.",
    icon: ClipboardList,
  },
  {
    title: "Website audit",
    description: "Manual testing against WCAG 2.0 AA, the AODA standard, with keyboard and screen readers. WCAG 2.1 and 2.2 gaps are noted so you can plan ahead.",
    icon: MonitorCheck,
  },
  {
    title: "Policies and plan",
    description: "With the Compliance Pack, your accessibility policy, statement of commitment and multi-year plan are drafted from what the audit found.",
    icon: ScrollText,
  },
  {
    title: "Report evidence",
    description: "You receive notes for each compliance report question, pointing to the evidence on file, so filing is quick and every answer can be backed up.",
    icon: FileSignature,
  },
  {
    title: "Retest",
    description: "After fixes, the affected templates are retested and your conformance summary is updated.",
    icon: BadgeCheck,
  },
]

const faqs = [
  {
    question: "Does my organization need an AODA website audit?",
    answer:
      "If you are a designated public sector organization, or a business or non-profit with 50 or more employees in Ontario, section 14 of the IASR requires your website and web content published after 1 January 2012 to conform with WCAG 2.0 Level AA, other than success criteria 1.2.4 and 1.2.5. The regulation does not name an audit, but an audit is how you find out whether you conform and keep evidence that you checked. Organizations with fewer than 50 employees have no website duty under the AODA.",
  },
  {
    question: "When is the AODA compliance report due?",
    answer:
      "Businesses and non-profits with 20 or more employees in Ontario file an accessibility compliance report every three years. The current deadline is 31 December 2026. Organizations with 50 or more employees report on all standards, including the website requirement.",
  },
  {
    question: "Why WCAG 2.0 and not WCAG 2.2?",
    answer:
      "The AODA standard has not changed since 2011, so WCAG 2.0 AA is still the legal requirement in Ontario. The audit tests WCAG 2.0 AA and notes where you would also fall short of WCAG 2.1 or 2.2, which the Accessible Canada Act's rules and most procurement teams now expect.",
  },
  {
    question: "Do you file the compliance report for us?",
    answer:
      "No. The report must be filed by your organization through the Ontario government's reporting portal, and someone in your organization certifies it. The Compliance Pack gives you evidence notes for each question so filing is quick and accurate.",
  },
  {
    question: "Our website is managed by an agency. Does that matter?",
    answer:
      "Section 14 covers sites you control directly or through a contract that allows you to modify them, so an agency-built site is still your responsibility. The audit report is written so your agency can act on it directly.",
  },
  {
    question: "Do you audit French versions of our site?",
    answer:
      "Yes, as an add-on. The French version of the same templates is tested and reported alongside the English site.",
  },
]

const sources = [
  { label: "Accessibility for Ontarians with Disabilities Act, 2005", href: "https://www.ontario.ca/laws/statute/05a11" },
  { label: "Integrated Accessibility Standards, O. Reg. 191/11 (section 14)", href: "https://www.ontario.ca/laws/regulation/110191" },
  { label: "Government of Ontario: Completing your accessibility compliance report", href: "https://www.ontario.ca/page/completing-your-accessibility-compliance-report" },
  { label: "Government of Ontario: How to make websites accessible", href: "https://www.ontario.ca/page/how-make-websites-accessible" },
]

export default function AodaCompliancePage() {
  return (
    <div className="container-wide py-12">
      <ServiceStructuredData
        name={title}
        description={pageDescription}
        serviceType="Accessibility Audit"
        url={`https://accessibility.build${path}`}
        areaServed={["Ontario, Canada", "Canada"]}
        offers={toStructuredOffers(pricing)}
        serviceOutput="WCAG 2.0 AA website audit, conformance summary, AODA policies, multi-year accessibility plan and compliance report evidence notes"
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
        description="A WCAG 2.0 AA website audit and the policies, plan and evidence behind your 2026 AODA compliance report, with fixed prices in Canadian dollars."
        cta="Book an AODA audit"
        ctaLink={`/contact?service=audit&package=${pricing.tiers[1].slug}`}
        icon={Leaf}
        gradientFrom="rgba(185, 28, 28, 0.8)"
        gradientTo="rgba(30, 64, 175, 0.8)"
        startingPrice={pricing.tiers[0].price}
        delivery={pricing.tiers[0].timeline}
        currency={pricing.currency}
      />

      <TriggerFacts
        heading="What the AODA asks of your website"
        intro="Ontario's accessibility law has required accessible websites since 2021. The 2026 compliance report is when organizations have to say whether they meet it."
        deadlineLabel="AODA compliance report due"
        deadline="31 December 2026"
        deadlineNote="For businesses and non-profits with 20 or more employees in Ontario, filed every three years."
        facts={facts}
      />

      <section className="py-16 bg-muted/30 rounded-3xl px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From the website audit to the evidence behind each compliance report answer.
          </p>
        </div>
        <ProcessSteps steps={process} />
      </section>

      <ServicePricing pricing={pricing} />

      <FAQSection faqs={faqs} />

      <section className="py-16">
        <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 text-center">
          <h2 className="text-3xl font-bold mb-4">Get your evidence in place before 31 December</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Send your website address and employee count, and I will confirm which package fits and a start date.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href={`/contact?service=audit&package=${pricing.tiers[1].slug}`}>Book an AODA audit</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/compliance/canada">Canada accessibility law guide</Link>
            </Button>
          </div>
        </div>
      </section>

      <TriggerSources
        sources={sources}
        note="Summarised from Ontario legislation and government guidance as of 26 November 2026. This page is regulatory context, not legal advice."
      />
    </div>
  )
}
