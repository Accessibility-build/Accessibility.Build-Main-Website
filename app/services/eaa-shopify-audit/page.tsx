import Link from "next/link"
import type { Metadata } from "next"
import { AppWindow, BadgeCheck, ClipboardList, Code2, FileText, ShoppingBag } from "lucide-react"
import { ServiceHero } from "@/components/services/service-hero"
import { ProcessSteps } from "@/components/services/process-steps"
import { FAQSection } from "@/components/services/faq-section"
import { ServicePricing } from "@/components/services/service-pricing"
import { TriggerFacts, TriggerSources } from "@/components/services/trigger-facts"
import { ServiceStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { Button } from "@/components/ui/button"
import { servicePricing, toStructuredOffers } from "@/lib/service-pricing"

const pricing = servicePricing.eaaShopify
const path = "/services/eaa-shopify-audit"
const title = "European Accessibility Act Audit for Shopify Stores"
const pageDescription =
  "EAA accessibility audits for Shopify stores selling in the EU: theme, apps and content tested against EN 301 549, with an accessibility statement. Fixed prices from €590."
const ogImage = `/api/og?title=${encodeURIComponent("EAA Audit for Shopify Stores")}&section=Services`

export const metadata: Metadata = {
  title: "EAA Accessibility Audit for Shopify Stores | Accessibility.build",
  description: pageDescription,
  keywords: [
    "shopify accessibility audit",
    "european accessibility act shopify",
    "eaa shopify compliance",
    "shopify wcag audit",
    "shopify theme accessibility",
    "eaa audit ecommerce",
    "en 301 549 audit",
  ],
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    title: "EAA Audit for Shopify Stores",
    description: pageDescription,
    url: path,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "EAA Audit for Shopify Stores" }],
  },
  twitter: { card: "summary_large_image", title: "EAA Audit for Shopify Stores", description: pageDescription, images: [ogImage] },
}

const facts = [
  {
    title: "Online stores selling to EU consumers are covered",
    body: "E-commerce services are one of the services the EAA covers, including stores based outside the EU that sell to EU consumers. Only service microenterprises, with fewer than 10 staff and turnover or balance sheet of no more than €2 million, are exempt.",
  },
  {
    title: "Regulators are testing stores",
    body: "In March 2026 the Dutch regulator ACM tested about 100 large web shops and found that on 61% of them people using assistive technology could not complete an order. Sweden's PTS had opened 28 supervision cases against online stores by March 2026.",
  },
  {
    title: "You must publish how your store meets the requirements",
    body: "Service providers have to make information available on how their service meets the accessibility requirements, which in practice is an accessibility statement. Every package here includes one.",
  },
  {
    title: "Most problems are in the theme and the apps",
    body: "Shopify runs the platform and hosts checkout, but your theme's templates, the apps you install (reviews, pop-ups, chat, filters) and your product content are yours, and that is where most barriers are.",
  },
  {
    title: "A widget does not fix the store",
    body: "An overlay widget does not change your theme's code, so the barriers a regulator or customer meets are still there. The audit tests the store itself.",
  },
]

const process = [
  {
    title: "Pick the templates",
    description: "We agree which theme templates and journeys to test: usually home, collection, product, cart, search, account and a content page.",
    icon: ClipboardList,
  },
  {
    title: "Manual testing",
    description: "Keyboard, screen reader, zoom and contrast testing against WCAG 2.2 AA, the level EN 301 549 builds on, on desktop and mobile.",
    icon: ShoppingBag,
  },
  {
    title: "Theme, app or content",
    description: "Every issue is tagged as theme code, an installed app or content, so you know whether to fix it, ask the app developer, or edit a product page.",
    icon: AppWindow,
  },
  {
    title: "Fixes",
    description: "With Audit and Fix, I make the theme fixes in Liquid, CSS and JavaScript on an unpublished copy, ready for you to preview and publish.",
    icon: Code2,
  },
  {
    title: "Statement and retest",
    description: "You receive an accessibility statement drafted from the evidence, and the fixed templates are retested.",
    icon: BadgeCheck,
  },
]

const faqs = [
  {
    question: "Does the European Accessibility Act apply to my Shopify store?",
    answer:
      "If you sell products or services online to consumers in the EU, your store is an e-commerce service under the EAA, which has applied since 28 June 2025. That includes stores based in the UK, the US or elsewhere when they sell to EU consumers. Service microenterprises, with fewer than 10 staff and annual turnover or balance sheet of no more than €2 million, are exempt from the service requirements.",
  },
  {
    question: "Isn't Shopify responsible for accessibility?",
    answer:
      "Partly. Shopify maintains the platform and the checkout it hosts. Your theme, any edits to it, the apps you add and your content are your responsibility, and they are where most problems are found. The audit separates the two, so issues in Shopify's checkout or a third-party app are documented for you to raise with them.",
  },
  {
    question: "Which standard do you test against?",
    answer:
      "EN 301 549, the harmonised European standard, which uses WCAG Level AA for web content. I test against WCAG 2.2 AA, which matches the newest edition of EN 301 549 and contains every WCAG 2.1 AA criterion required by the earlier one.",
  },
  {
    question: "Will an accessibility app or overlay make my store compliant?",
    answer:
      "No. Overlays add a toolbar on top of the store but leave the theme's code unchanged, so keyboard traps, unlabelled buttons and missing form labels remain for anyone using their own assistive technology. Several overlays also introduce new problems. If you have one installed, the audit tests the store with and without it.",
  },
  {
    question: "Do you change my live theme?",
    answer:
      "No. Fixes are made on a duplicate, unpublished copy of your theme. You preview the changes and publish when you are happy, and nothing on the live store changes until then.",
  },
  {
    question: "What does the accessibility statement contain?",
    answer:
      "It describes how your store meets the accessibility requirements, which parts do not yet and why, how customers can report a problem or get information in another format, and when it was last reviewed. It is written from the audit evidence, so it does not claim more than the store does.",
  },
  {
    question: "Can you work in languages other than English?",
    answer:
      "Reports and statements are written in English. A translated storefront can be added to the audit as an extra market, and statements can be supplied for translation.",
  },
]

const sources = [
  {
    label: "Directive (EU) 2019/882, the European Accessibility Act (Articles 4, 13 and 31, Annex V)",
    href: "https://www.legislation.gov.uk/eudr/2019/882/contents",
  },
  {
    label: "European Commission: European Accessibility Act",
    href: "https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en",
  },
  {
    label: "ACM (Netherlands): majority of large online stores not accessible to customers with disabilities",
    href: "https://www.acm.nl/en/publications/acm-majority-large-online-stores-are-not-accessible-customers-disabilities",
  },
  {
    label: "PTS (Sweden): review of e-commerce services' accessibility",
    href: "https://pts.se/nyheter-och-pressmeddelanden/pts-granskar-ytterligare-11-e-handelstjansters-tillganglighet/",
  },
]

export default function EaaShopifyAuditPage() {
  return (
    <div className="container-wide py-12">
      <ServiceStructuredData
        name={title}
        description={pageDescription}
        serviceType="Accessibility Audit"
        url={`https://accessibility.build${path}`}
        areaServed={["European Union", "United Kingdom"]}
        offers={toStructuredOffers(pricing)}
        serviceOutput="WCAG 2.2 AA and EN 301 549 audit of a Shopify store, theme fixes, and an accessibility statement"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Services", url: "https://accessibility.build/services" },
          { name: "EAA Audit for Shopify Stores", url: `https://accessibility.build${path}` },
        ]}
      />
      <ServiceHero
        title="EAA Audit for Shopify Stores"
        description="A manual accessibility audit of your Shopify theme, apps and content against EN 301 549, with the accessibility statement the European Accessibility Act expects and fixed prices in euros."
        cta="Book a store audit"
        ctaLink={`/contact?service=audit&package=${pricing.tiers[0].slug}`}
        icon={ShoppingBag}
        gradientFrom="rgba(21, 128, 61, 0.8)"
        gradientTo="rgba(30, 64, 175, 0.8)"
        startingPrice={pricing.tiers[0].price}
        delivery={pricing.tiers[0].timeline}
        currency={pricing.currency}
      />

      <TriggerFacts
        heading="Why Shopify merchants are being asked about the EAA"
        intro="The European Accessibility Act turned accessibility from good practice into a legal requirement for online stores selling to EU consumers."
        deadlineLabel="In force since"
        deadline="28 June 2025"
        deadlineNote="The EAA's requirements have applied to e-commerce services since this date, and national regulators are now checking stores."
        facts={facts}
      />

      <section className="py-16 bg-muted/30 rounded-3xl px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How a Shopify audit works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Built around how a Shopify store is made, so every finding tells you who can fix it.
          </p>
        </div>
        <ProcessSteps steps={process} />
      </section>

      <ServicePricing pricing={pricing} />

      <FAQSection faqs={faqs} />

      <section className="py-16">
        <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 text-center">
          <FileText className="mx-auto mb-4 h-8 w-8 text-primary" aria-hidden="true" />
          <h2 className="text-3xl font-bold mb-4">Send me your store URL</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Tell me your theme and the apps you use, and I will confirm the right package and a start date.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href={`/contact?service=audit&package=${pricing.tiers[0].slug}`}>Book a store audit</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/compliance/eaa">European Accessibility Act guide</Link>
            </Button>
          </div>
        </div>
      </section>

      <TriggerSources
        sources={sources}
        note="Summarised as of 26 November 2026. This page is regulatory context, not legal advice."
      />
    </div>
  )
}
