import Link from "next/link"
import type { Metadata } from "next"
import { ServiceHero } from "@/components/services/service-hero"
import { ProcessSteps } from "@/components/services/process-steps"
import { FAQSection } from "@/components/services/faq-section"
import { PdfPricing } from "@/components/services/pdf-pricing"
import { ServiceStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { Button } from "@/components/ui/button"
import { pdfPricing } from "@/lib/service-pricing"
import { Check, FileCheck2, FileSearch, FileStack, ListChecks, ScanLine, Table2 } from "lucide-react"

const pageDescription =
  "PDF accessibility remediation priced per page, from $3 for standard pages. Tagged to PDF/UA and WCAG 2.2 AA, with a conformance check on every file before delivery."

export const metadata: Metadata = {
  title: "PDF Accessibility Remediation",
  description: pageDescription,
  keywords: [
    "PDF accessibility remediation",
    "PDF remediation cost per page",
    "PDF/UA tagging service",
    "accessible PDF service",
    "508 compliant PDF",
  ],
  alternates: { canonical: "/services/pdf-remediation" },
  openGraph: {
    type: "website",
    title: "PDF Accessibility Remediation",
    description: pageDescription,
    url: "/services/pdf-remediation",
    images: [
      {
        url: "/api/og?title=PDF%20Accessibility%20Remediation&section=Services",
        width: 1200,
        height: 630,
        alt: "PDF Accessibility Remediation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Accessibility Remediation",
    description: pageDescription,
    images: ["/api/og?title=PDF%20Accessibility%20Remediation&section=Services"],
  },
}

const remediationProcess = [
  {
    title: "Document Triage",
    description:
      "We open every file and band each page as standard, structured, or complex, then confirm a fixed total before any work begins.",
    icon: FileSearch,
  },
  {
    title: "Structure and Tagging",
    description:
      "We build the tag tree by hand: headings, lists, links, and a reading order that matches how the document is meant to be read.",
    icon: ListChecks,
  },
  {
    title: "Tables, Forms, and Figures",
    description:
      "Table headers get scope and span associations, form fields get labels and tab order, and charts get described alternatives.",
    icon: Table2,
  },
  {
    title: "Text Recovery",
    description:
      "Scanned and image-only pages are put through OCR and the recovered text layer is proofread, so the content is real text rather than a picture of text.",
    icon: ScanLine,
  },
  {
    title: "Conformance Check",
    description:
      "Every file is verified against PDF/UA and WCAG 2.2 AA, and spot-checked with a screen reader before it is handed back.",
    icon: FileCheck2,
  },
]

const faqs = [
  {
    question: "How much does PDF remediation cost per page?",
    answer: `Standard text-led pages are $${pdfPricing.tiers[0].pricePerPage} per page, structured pages with tables or multi-column layouts are $${pdfPricing.tiers[1].pricePerPage} per page, and complex pages with forms, charts, or scanned content are $${pdfPricing.tiers[2].pricePerPage} per page. Pages are banded individually inside a document, so you are not charged the highest rate for the whole file. A minimum order of $${pdfPricing.minimumOrder} applies per project.`,
  },
  {
    question: "How do you decide which band a page falls into?",
    answer:
      "By what has to be built in the tag tree, not by how the page looks. A page with running text, headings, and links is standard. Once meaning depends on a data table, multiple columns, or footnote relationships, it is structured. When a page needs labelled form fields, a described chart, or OCR to recover text from an image, it is complex. We band every page from the real document and show you the split before you commit.",
  },
  {
    question: "What standard do you remediate to?",
    answer:
      "PDF/UA (ISO 14289-1) together with the applicable WCAG 2.2 Level AA criteria. That combination is what the European Accessibility Act, Section 508, and most procurement rules expect for documents. If you need a specific profile such as PDF/UA-2 or a Section 508 attestation, say so at quoting and we will confirm it in scope.",
  },
  {
    question: "Can you fix the source file so future exports are accessible?",
    answer: `Yes, and for documents you republish regularly it is usually the cheaper path. The Source file rebuild add-on is $18 per page and repairs the styles, alt text, and table structure in the InDesign or Word original, so every future export starts accessible instead of needing remediation again. For a quarterly report, that pays for itself within a year.`,
  },
  {
    question: "Do you handle confidential or regulated documents?",
    answer:
      "Yes. Financial statements, patient materials, and HR documents are routine. Files containing personal or regulated data are handled under a signed agreement covering transfer, storage, and deletion before anything is sent. Documents are processed on encrypted storage and removed on request once the work is accepted.",
  },
  {
    question: "How long does remediation take?",
    answer: `Standard pages are typically returned in ${pdfPricing.tiers[0].turnaround}, structured pages in ${pdfPricing.tiers[1].turnaround}, and complex pages in ${pdfPricing.tiers[2].turnaround}, measured from the point the final files are confirmed. Large sets are delivered in batches so you can publish the first documents while the rest are still in progress. The Accessibility rush add-on roughly halves the window.`,
  },
]

export default function PdfRemediationPage() {
  return (
    <div className="container-wide py-12">
      <ServiceStructuredData
        name="PDF Accessibility Remediation"
        description={pageDescription}
        serviceType="PDF Accessibility Remediation"
        url="https://accessibility.build/services/pdf-remediation"
        areaServed={["Worldwide"]}
        offers={pdfPricing.tiers.map((tier) => ({
          name: `${tier.name} remediation`,
          description: tier.description,
          price: tier.pricePerPage,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        }))}
        serviceOutput="Tagged PDF/UA and WCAG 2.2 AA conformant documents with a conformance check per file"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Services", url: "https://accessibility.build/services" },
          { name: "PDF Accessibility Remediation", url: "https://accessibility.build/services/pdf-remediation" },
        ]}
      />
      <ServiceHero
        title="PDF Accessibility Remediation"
        description="Tagged, PDF/UA-conformant documents priced per page by complexity, starting at $3 for standard pages."
        cta="Send documents to quote"
        ctaLink="/contact?service=pdf-remediation"
        icon={FileStack}
        gradientFrom="rgba(220, 38, 38, 0.8)"
        gradientTo="rgba(234, 88, 12, 0.8)"
        startingPrice={pdfPricing.tiers[0].pricePerPage}
        priceLabel="From"
        priceSuffix="per page"
        delivery={pdfPricing.tiers[0].turnaround}
      />

      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why PDFs Fail</h2>
            <div className="space-y-4">
              <p className="text-lg">
                A PDF that looks finished on screen is usually the least accessible thing an organisation publishes. The
                visual layout carries the meaning, and none of it is written into the file, so assistive technology gets
                a wall of undifferentiated text. The most common failures are:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>No tag tree at all</strong>, so there are no headings to navigate by and the document is one
                    continuous block
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Reading order that follows the layout</strong> rather than the meaning, so a two-column page
                    is read straight across and the sentences interleave
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Tables without header associations</strong>, so a figure is announced with no indication of
                    which row and column it belongs to
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Scanned pages</strong> that are images of text, invisible to a screen reader and
                    unsearchable
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Form fields with no labels</strong>, so the person filling it in cannot tell what any box is
                    asking for
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-muted/30 p-8 rounded-2xl border border-border">
            <h3 className="text-2xl font-bold mb-4">Why It Is Worth Fixing</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <FileCheck2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Documents Are In Scope</h4>
                  <p className="text-muted-foreground">
                    The European Accessibility Act and Section 508 both cover published documents, not just web pages. A
                    compliant site with inaccessible PDFs is still exposed.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <FileSearch className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Auditors Look Here First</h4>
                  <p className="text-muted-foreground">
                    Annual reports, policies, and application forms are the documents complaints and procurement reviews
                    tend to cite, because they are the ones people actually need.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <ScanLine className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Searchable and Reusable</h4>
                  <p className="text-muted-foreground">
                    Tagging and OCR make a document searchable, indexable, and easier to convert to other formats, which
                    benefits every reader.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-4 mt-1">
                  <Table2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">Fixed Price Before You Commit</h4>
                  <p className="text-muted-foreground">
                    Pages are banded from the real files, so you approve a total up front rather than an hourly estimate
                    that moves.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30 rounded-3xl px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Remediation Process</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Every document is tagged by hand and verified before it goes back to you. Automated tagging alone reliably
            produces a file that passes a checker and still fails a reader.
          </p>
        </div>
        <ProcessSteps steps={remediationProcess} />
      </section>

      <PdfPricing pricing={pdfPricing} />

      <FAQSection faqs={faqs} />

      <section className="py-16">
        <div className="bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 text-center">
          <h2 className="text-3xl font-bold mb-4">Send Us Your Documents</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Share the files you need remediated and we will band the pages and return a fixed total. If you would rather
            check the current state first, the free PDF checker gives you a baseline in a few seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/contact?service=pdf-remediation">Request a Quote</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/tools/pdf-accessibility-checker">Check a PDF Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full">
              <Link href="/guides/pdf-accessibility">Read the PDF Guide</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
