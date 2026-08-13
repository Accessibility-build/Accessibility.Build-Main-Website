import type { Metadata } from "next"
import Link from "next/link"
import AccessibilityReportGenerator from "@/components/tools/accessibility-report-generator"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload, FileSpreadsheet, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Accessibility Report Generator | PDF & Excel",
  description:
    "Generate professional accessibility audit reports in PDF, Excel, HTML, or Markdown format. Import violation data or create reports manually with our free report generator.",
  keywords: [
    "accessibility report generator",
    "accessibility audit report",
    "WCAG report generator",
    "accessibility report PDF",
    "accessibility report Excel",
    "generate accessibility report",
    "accessibility compliance report",
    "WCAG 2.2 report",
    "accessibility audit template",
    "vpat report generator",
    "accessibility testing report",
    "free accessibility report tool"
  ],
  openGraph: {
    title: "Accessibility Report Generator - Professional PDF & Excel Reports",
    description: "Generate professional accessibility audit reports in PDF, Excel, HTML, or Markdown format. Free tool for creating compliance reports.",
    type: "website",
    url: "https://accessibility.build/tools/accessibility-report-generator",
    images: [
      {
        url: "https://accessibility.build/images/tools/report-generator-og.png",
        width: 1200,
        height: 630,
        alt: "Accessibility Report Generator Tool"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Report Generator - Professional Reports",
    description: "Generate professional accessibility audit reports in multiple formats. Free tool.",
    images: ["https://accessibility.build/images/tools/report-generator-og.png"]
  },
  alternates: {
    canonical: "/tools/accessibility-report-generator"
  },
  robots: {
    index: true,
    follow: true
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Accessibility Report Generator", url: "https://accessibility.build/tools/accessibility-report-generator" }
]

// Rendered on the page AND emitted as FAQPage schema by <FaqSection>, from this
// one array, so the two can never drift apart.
const faqs: FaqItem[] = [
  {
    question: "What formats can I export accessibility reports in?",
    answer:
      "You can export as PDF for a professional layout to hand to a client or stakeholder, Excel for detailed data across multiple sheets that a team can filter and assign, HTML for publishing on an intranet, or Markdown for a repository or docs site. Every format includes the summary statistics, the detailed violation listings, and the recommendations, so the choice is about who is reading it rather than what it contains.",
  },
  {
    question: "Can I import violation data from other tools?",
    answer:
      "Yes. The generator accepts violation data from JSON files, including the output formats produced by axe-core, WAVE, and other common testing tools. Importing means you do not retype findings, which is where transcription errors normally creep in. You can also build a report manually if your findings came from a manual audit rather than a scanner, which is usually the case for the more serious issues.",
  },
  {
    question: "What information is included in the report?",
    answer:
      "Organisation and scope details, summary statistics broken down by severity (critical, serious, moderate, and minor), the detailed violation listing with the WCAG success criterion each one maps to, recommendations, and suggested next steps. Every section is editable, so you can cut what does not apply and expand what matters to your audience.",
  },
  {
    question: "How should I set severity on each finding?",
    answer:
      "Severity should reflect user impact, not how hard the fix is. A useful rule: critical means a user cannot complete the task at all (a keyboard trap, an unlabelled checkout button), serious means they can complete it but only with significant difficulty, moderate means real friction with a workaround available, and minor means a defect worth fixing that rarely blocks anyone. Ranking by impact rather than effort keeps the report honest and stops easy-but-cosmetic items crowding out blockers.",
  },
  {
    question: "Is an automated report enough for a compliance audit?",
    answer:
      "No. Automated testing reliably catches only a portion of WCAG failures and cannot judge whether alt text is meaningful, whether focus order preserves meaning, or whether an error message actually helps someone recover. A report built purely from scanner output should say so plainly in its methodology section. For a report that supports a conformance claim you need a manual pass with a keyboard and a screen reader on a representative sample of pages and flows.",
  },
  {
    question: "Is this the same as a VPAT or an ACR?",
    answer:
      "No, though they are often confused. This produces an audit report: what is broken, how badly, and what to do about it, aimed at the team doing the work. A VPAT is a specific vendor-supplied template, and the completed document is called an Accessibility Conformance Report, which walks every applicable criterion and states supports, partially supports, or does not support. Procurement usually asks for the latter. An audit report like this is normally the evidence you draw on to fill one in accurately.",
  },
  {
    question: "Who should the report be written for?",
    answer:
      "Decide before you export, because it changes what to include. Developers need the selector, the failing code, and the criterion. Designers need the pattern and the visual rule. Executives and clients need the severity counts, the risk, and the trend, not a list of CSS selectors. The Excel export suits triage and assignment; the PDF suits a summary for someone who will read it once. Producing two exports from the same data is usually better than one document that half-serves both audiences.",
  },
  {
    question: "Is the report generator free?",
    answer:
      "Yes, the accessibility report generator is completely free, with no registration or payment required.",
  },
]

export default function AccessibilityReportGeneratorPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="Accessibility Report Generator"
        description="Generate professional accessibility audit reports in PDF, Excel, HTML, or Markdown format. Import violation data or create reports manually."
        url="https://accessibility.build/tools/accessibility-report-generator"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        accessibilityFeatures={[
          "keyboardNavigation",
          "screenReaderSupport",
          "highContrastDisplay"
        ]}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container-wide py-16">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Accessibility Report Generator
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create professional accessibility audit reports in minutes. 
              Generate PDF, Excel, HTML, or Markdown reports with customizable content and branding.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Multiple Export Formats</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>Data Import Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>Professional Templates</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <h2 className="sr-only">Report generator capabilities</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <Upload className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Import or Manual Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Import violation data from JSON files or manually enter violations with full control
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <FileSpreadsheet className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">Multiple Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Export to PDF (professional layout), Excel (detailed data), HTML, or Markdown
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Customizable Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Add recommendations, next steps, and customize all report sections to your needs
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Main Generator */}
          <AccessibilityReportGenerator />

          {/* Supporting guidance */}
          <div className="mt-16 max-w-3xl mx-auto space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What a Useful Accessibility Report Contains
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A report gets acted on when a developer can go straight from a
                finding to a fix without asking follow-up questions. That means
                every finding carries five things:
              </p>
              <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">Where it is.</strong>{" "}
                  The page URL and a selector or screenshot precise enough to
                  locate the element without hunting.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">What is wrong.</strong>{" "}
                  The actual failure in plain language, not just the rule ID a
                  scanner emitted.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Which criterion it fails.</strong>{" "}
                  The specific WCAG success criterion, so the finding is traceable
                  to the standard. Browse the{" "}
                  <Link href="/wcag" className="text-blue-600 dark:text-blue-400 hover:underline">
                    WCAG 2.2 reference
                  </Link>{" "}
                  for exact wording.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Who it affects and how badly.</strong>{" "}
                  Severity based on user impact, plus which assistive technology or
                  input method hits the barrier.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">What to do about it.</strong>{" "}
                  A concrete remediation, ideally with the corrected markup.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Setting Severity by Impact, Not Effort
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The most common way a report goes wrong is ranking findings by how
                easy they are to fix, which floats cosmetic items to the top and
                buries the blockers. Rank by what it costs the user instead:
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Severity levels for accessibility findings and what each one
                    means for the user
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Severity</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it means for the user</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">Critical</th>
                      <td className="px-4 py-3">Cannot complete the task at all</td>
                      <td className="px-4 py-3">A keyboard trap in checkout, or an unlabelled submit button</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">Serious</th>
                      <td className="px-4 py-3">Can finish, but only with significant difficulty</td>
                      <td className="px-4 py-3">Form errors announced nowhere, so the user must guess what failed</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">Moderate</th>
                      <td className="px-4 py-3">Real friction, workaround available</td>
                      <td className="px-4 py-3">A skipped heading level that makes the page harder to skim</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">Minor</th>
                      <td className="px-4 py-3">Worth fixing, rarely blocks anyone</td>
                      <td className="px-4 py-3">A redundant ARIA role on a native element</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Audit Report, VPAT, or Conformance Report?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These three get used interchangeably and they are not the same
                document. An{" "}
                <strong className="text-slate-900 dark:text-white">audit report</strong>{" "}
                (what this tool produces) tells your team what is broken and how to
                fix it. A{" "}
                <strong className="text-slate-900 dark:text-white">VPAT</strong>{" "}
                is a specific vendor-supplied template, and the filled-in result is
                called an{" "}
                <strong className="text-slate-900 dark:text-white">Accessibility Conformance Report</strong>
                , which walks every applicable criterion and records supports,
                partially supports, or does not support. Procurement teams normally
                ask for that one.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The relationship is sequential: you audit, you fix what you can,
                and the audit evidence is what lets you fill in a conformance
                report honestly. If you need to publish a user-facing summary of
                where you stand instead, use the{" "}
                <Link href="/tools/accessibility-statement-generator" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessibility statement generator
                </Link>
                . For the end-to-end process behind the findings, see the{" "}
                <Link href="/guides/how-to-audit-website-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  website accessibility audit guide
                </Link>
                .
              </p>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                  A scanner-only report cannot support a conformance claim
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Automated testing catches a portion of WCAG failures and cannot
                  judge meaningful alt text, sensible focus order, or whether an
                  error message helps. State your methodology in the report, and
                  add a manual keyboard and screen reader pass before anyone treats
                  it as evidence of conformance. The{" "}
                  <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    automated versus manual testing guide
                  </Link>{" "}
                  covers what each layer can and cannot find.
                </p>
              </div>
            </section>

            <FaqSection faqs={faqs} />
          </div>

          {/* Related Content */}
          <div className="mt-16">
            <RelatedContent
              content="accessibility report generator audit report WCAG 2.2 violation severity critical serious moderate minor VPAT accessibility conformance report ACR PDF Excel export remediation"
              title="Related Tools & Resources"
              maxItems={4}
              showDescriptions={true}
            />
          </div>
        </div>
      </div>
    </>
  )
}
