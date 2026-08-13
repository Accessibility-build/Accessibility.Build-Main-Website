import type { Metadata } from "next"
import Link from "next/link"
import AccessibilityStatementGenerator from "@/components/tools/accessibility-statement-generator"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Code, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Free Accessibility Statement Generator",
  description:
    "Generate a WCAG 2.2 accessibility statement free: what to include, the right conformance wording, when you must publish one, and the overclaiming to avoid.",
  keywords: [
    "accessibility statement generator",
    "WCAG accessibility statement",
    "accessibility statement template",
    "ADA accessibility statement",
    "website accessibility statement",
    "generate accessibility statement",
    "accessibility statement from scan results",
    "accessibility compliance statement",
    "WCAG 2.2 statement",
    "Section 508 statement",
    "accessibility policy generator",
    "free accessibility statement",
    "accessibility declaration"
  ],
  openGraph: {
    title: "Accessibility Statement Generator - Free WCAG Compliant Tool",
    description: "Generate accessibility statements from scan results or manual inputs. Export to HTML, Markdown, PDF, or plain text.",
    type: "website",
    url: "https://accessibility.build/tools/accessibility-statement-generator",
    images: [
      {
        url: "https://accessibility.build/images/tools/statement-generator-og.png",
        width: 1200,
        height: 630,
        alt: "Accessibility Statement Generator Tool"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Statement Generator - Free Tool",
    description: "Generate WCAG 2.2 accessibility statements from scan results and export in multiple formats.",
    images: ["https://accessibility.build/images/tools/statement-generator-og.png"]
  },
  alternates: {
    canonical: "/tools/accessibility-statement-generator"
  },
  robots: {
    index: true,
    follow: true
  }
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Accessibility Statement Generator", url: "https://accessibility.build/tools/accessibility-statement-generator" }
]

// Rendered on the page AND emitted as FAQPage schema by <FaqSection>, from this
// one array, so the two can never drift apart.
const faqs: FaqItem[] = [
  {
    question: "What is an accessibility statement?",
    answer:
      "An accessibility statement is a public page explaining how accessible your website or app is and what you are doing about the parts that are not. A useful one names the standard you are measuring against (normally WCAG 2.2 at Level AA), states how far you currently conform, lists the known problems, explains how someone can report a barrier and what response they can expect, and records when it was last reviewed. It is a commitment and a contact route, not a compliance badge.",
  },
  {
    question: "Am I legally required to publish an accessibility statement?",
    answer:
      "It depends entirely on where you operate and what kind of organisation you are, so treat this as orientation rather than legal advice. WCAG itself does not require you to publish a statement; conformance claims are optional under the standard. In the EU, the Web Accessibility Directive (2016/2102) does require public sector bodies to publish an accessibility statement, and Commission Implementing Decision 2018/1523 sets out a model for it. The European Accessibility Act extends accessibility obligations to many private sector products and services. In the United States, neither the ADA nor Section 508 requires a public statement in the way the EU directive does, though a statement is common good practice and is often requested during procurement. Check your own jurisdiction and sector.",
  },
  {
    question: "What should an accessibility statement contain?",
    answer:
      "At minimum: the scope (which sites, apps, or documents it covers), the standard and level you are measuring against, your conformance status, the known limitations written plainly with what a user should do instead, a feedback mechanism with a real contact route and a response time, how the assessment was carried out (self-assessment or third-party audit), and the date it was last reviewed. If your jurisdiction requires an enforcement or escalation route, include that too. The generator on this page collects each of these in turn.",
  },
  {
    question: "What conformance wording should I use?",
    answer:
      "The EU model statement uses three levels of claim and they are a good vocabulary to borrow even outside the EU. \"Fully conformant\" means the content meets the standard completely, with no exceptions. \"Partially conformant\" means most of the content conforms but some parts do not. \"Not conformant\" means the content largely does not meet the standard. Most real sites are partially conformant, and saying so is the honest and defensible position. Only claim full conformance if you have actually tested every page and pattern against every applicable criterion, because a false claim is worse than an honest partial one.",
  },
  {
    question: "Can I claim full WCAG conformance based on an automated scan?",
    answer:
      "No. Automated tools reliably catch only a portion of WCAG failures, typically around a third, and they cannot judge things like whether alt text is meaningful, whether focus order preserves meaning, or whether an error message actually helps. A clean automated report tells you that you have no detectable violations of the rules the tool checks, not that you conform. If your statement rests only on a scan, say so in the assessment section: describe it as a self-assessment using automated testing, and avoid a full conformance claim. Pair the scan with manual keyboard and screen reader testing before making stronger claims.",
  },
  {
    question: "How often should I update the statement?",
    answer:
      "Review it whenever the site changes materially and on a fixed schedule otherwise, with annually being a common minimum and every six months being better for actively developed products. The review date is part of the statement's credibility: a statement dated three years ago tells a reader that nobody is watching, even if the content happens to still be accurate. If a known limitation gets fixed, remove it and update the date rather than leaving a stale list.",
  },
  {
    question: "What formats can I export?",
    answer:
      "You can export a draft as HTML that is ready to paste into a page, Markdown for a docs site or repository, plain text, or PDF. Whichever you choose, review the wording for accuracy before publishing, because the generator can only structure what you tell it. Then test the published page itself for accessibility: an accessibility statement that fails the standard it describes is a poor first impression, and it is the one page guaranteed to be read by people who will notice.",
  },
  {
    question: "Is this tool free?",
    answer:
      "Yes, the accessibility statement generator is completely free, with no account or payment required. Nothing you enter is needed for it to work beyond producing your draft.",
  },
]

export default function AccessibilityStatementGeneratorPage() {
  return (
    <>
      <AccessibilityToolStructuredData
        name="Accessibility Statement Generator"
        description="Generate professional accessibility statements from your scan results or manual inputs. Create HTML, Markdown, PDF, or plain text statements."
        url="https://accessibility.build/tools/accessibility-statement-generator"
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
              Accessibility Statement Generator
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Create structured accessibility statement drafts based on WCAG 2.2 guidance.
              Import scan results instantly or build manually, then export to HTML, Markdown, PDF, or plain text.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>WCAG 2.2 Structure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>Multiple Export Formats</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>Free to Use</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <h2 className="sr-only">Statement generator capabilities</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <FileText className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Step-by-Step Wizard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Guided 4-step process with optional scan import to collect everything needed for your statement
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Download className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle className="text-lg">Multiple Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Export to HTML (ready to embed), Markdown, PDF, or plain text format
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Code className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Template Options</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Choose from basic, comprehensive, policy-focused, or developer-friendly templates
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Main Generator */}
          <AccessibilityStatementGenerator />

          {/* Supporting guidance */}
          <div className="mt-16 max-w-3xl mx-auto space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                What Goes in an Accessibility Statement
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A statement is only useful if a reader can work out three things
                from it: how accessible this thing actually is, what to do if they
                hit a barrier, and whether anyone is still maintaining it. Those
                map onto seven parts, all of which the generator above collects:
              </p>
              <ol className="text-muted-foreground leading-relaxed list-decimal pl-6 space-y-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">Scope.</strong>{" "}
                  Which sites, subdomains, apps, and documents this statement
                  covers, and anything deliberately excluded.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Standard and level.</strong>{" "}
                  Normally{" "}
                  <Link href="/guides/wcag-2-2-aa-requirements" className="text-blue-600 dark:text-blue-400 hover:underline">
                    WCAG 2.2 at Level AA
                  </Link>
                  , which is the level referenced by most laws and procurement
                  rules.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Conformance status.</strong>{" "}
                  Fully, partially, or not conformant. See the wording section
                  below.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Known limitations.</strong>{" "}
                  Named plainly, with what a user should do instead and, if you
                  have one, a target fix date.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Feedback route.</strong>{" "}
                  A real email address or form, and the response time someone can
                  expect. This is the part users actually need.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">How you assessed it.</strong>{" "}
                  Self-assessment or third-party audit, which tools, and whether
                  manual testing was involved.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Date last reviewed.</strong>{" "}
                  A stale date undermines everything above it.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Getting the Conformance Wording Right
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The EU model statement defines three claims, and the vocabulary is
                worth borrowing wherever you are:{" "}
                <strong className="text-slate-900 dark:text-white">fully conformant</strong>{" "}
                (meets the standard completely, no exceptions),{" "}
                <strong className="text-slate-900 dark:text-white">partially conformant</strong>{" "}
                (most content conforms, some does not), and{" "}
                <strong className="text-slate-900 dark:text-white">not conformant</strong>{" "}
                (largely does not meet the standard).
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Almost every real site is partially conformant, and writing that
                down is the honest and defensible position. The temptation is to
                claim full conformance because it reads better, but a claim you
                cannot support is worse than an honest partial one: it is a
                statement in your own words, on your own site, that a complainant
                can quote back to you. Only claim full conformance if you have
                genuinely tested every page and pattern against every applicable
                criterion.
              </p>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                  An automated scan does not support a full conformance claim
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Automated tools catch only a portion of WCAG failures and cannot
                  judge whether alt text is meaningful, whether focus order
                  preserves meaning, or whether an error message helps. If your
                  statement rests on a scan, describe it as a self-assessment
                  using automated testing and avoid a full claim. The{" "}
                  <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    automated versus manual testing guide
                  </Link>{" "}
                  explains where the line falls.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Common Accessibility Statement Mistakes
              </h2>
              <ul className="text-muted-foreground leading-relaxed list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-slate-900 dark:text-white">Claiming full conformance on the strength of a scan.</strong>{" "}
                  The single most common overclaim, and the easiest to disprove.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No contact route, or one nobody monitors.</strong>{" "}
                  The feedback mechanism is the part with practical value to a
                  user who is stuck. A dead address makes the statement decorative.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No date, or a date years old.</strong>{" "}
                  Readers use it to judge whether anyone is still paying attention.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">An empty limitations section.</strong>{" "}
                  Every site has known gaps. Listing none reads as not having
                  looked rather than as perfection.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Boilerplate with the standard left vague.</strong>{" "}
                  &ldquo;We are committed to accessibility&rdquo; with no standard,
                  level, or scope communicates nothing and cannot be checked.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">A statement page that is itself inaccessible.</strong>{" "}
                  It is the one page guaranteed to be read by people who will
                  notice. Test it with a keyboard and a screen reader.
                </li>
              </ul>
            </section>

            <FaqSection faqs={faqs} />
          </div>

          {/* Related Content */}
          <div className="mt-16">
            <RelatedContent
              content="accessibility statement generator WCAG 2.2 conformance claim partially conformant EU web accessibility directive EN 301 549 accessibility statement template known limitations feedback mechanism VPAT procurement"
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
