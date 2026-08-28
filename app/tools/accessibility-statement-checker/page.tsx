import type { Metadata } from "next"
import Link from "next/link"
import { FileCheck2, ShieldCheck, Scale, Clock } from "lucide-react"
import AccessibilityStatementChecker from "@/components/tools/accessibility-statement-checker"
import { Badge } from "@/components/ui/badge"
import { ToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection, type FaqItem } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "Accessibility Statement Checker for UK PSBAR & EAA",
  description:
    "Check whether an accessibility statement contains what the law requires: compliance status, non-accessible content, feedback route, enforcement body, and review date.",
  keywords: [
    "accessibility statement checker",
    "accessibility statement validator",
    "PSBAR accessibility statement",
    "accessibility statement requirements",
    "EAA accessibility statement",
    "model accessibility statement",
    "public sector accessibility statement",
    "accessibility statement compliance",
    "Implementing Decision 2018/1523",
  ],
  alternates: {
    canonical: "https://accessibility.build/tools/accessibility-statement-checker",
  },
  openGraph: {
    title: "Accessibility Statement Checker: does yours meet the rules?",
    description:
      "Most published accessibility statements are missing mandatory information. Check yours against UK PSBAR, the EU Web Accessibility Directive, or the European Accessibility Act.",
    type: "website",
    url: "https://accessibility.build/tools/accessibility-statement-checker",
    siteName: "Accessibility.build",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Statement Checker: does yours meet the rules?",
    description:
      "Check an accessibility statement against UK PSBAR, the EU Web Accessibility Directive, or the EAA.",
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  {
    name: "Accessibility Statement Checker",
    url: "https://accessibility.build/tools/accessibility-statement-checker",
  },
]

const faqs: FaqItem[] = [
  {
    question: "Is an accessibility statement actually a legal requirement?",
    answer:
      "For UK public sector bodies, yes. Regulation 8 of the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 requires one, in a prescribed form. EU public sector bodies have the same duty under the Web Accessibility Directive, with the format set by Commission Implementing Decision (EU) 2018/1523. Under the European Accessibility Act, private sector providers of in-scope services must publish information under Annex V explaining how the service meets the accessibility requirements.",
  },
  {
    question: "What is the most common thing missing from an accessibility statement?",
    answer:
      "The enforcement route. A statement typically explains the problems and gives a contact address, then stops, without telling people where to escalate if the response is unsatisfactory. In the UK that means naming the Equality Advisory and Support Service, and the Equality Commission for Northern Ireland where relevant. Missing review dates are a close second.",
  },
  {
    question: "How many organisations get this wrong?",
    answer:
      "When the Government Digital Service monitored 593 UK public sector websites between February 2020 and November 2021, only 39 of them, about 7 percent, had a fully compliant accessibility statement. A further 461, about 83 percent, had published a statement that was missing mandatory information. Only 10 percent had no statement at all, so the dominant failure is an incomplete statement rather than an absent one. After GDS wrote to those organisations, compliance rose to 80 percent, which shows these are cheap fixes once someone points them out.",
  },
  {
    question: "Does passing every check mean my site is accessible?",
    answer:
      "No, and it is important not to read it that way. This tool grades the document, not the website. A statement can contain every mandatory element while honestly describing a site with serious barriers. In fact a good statement often admits to more problems than a bad one. Use an audit of the pages themselves to judge the site.",
  },
  {
    question: "How often should a statement be reviewed?",
    answer:
      "At least once a year, and after any significant change to the site. GDS reported in December 2024 that many public sector statements had not been reviewed in the previous 12 months. A statement carrying a review date from several years ago undercuts everything else it says, because it tells a reader the known issues list is probably out of date.",
  },
  {
    question: "Why does the checker warn about accessibility overlays?",
    answer:
      "Because naming an overlay widget as your accessibility measure is a documented weak point rather than a remedy. The European Commission has warned that overlay tools may make a website less accessible. A statement that points at a widget instead of describing the underlying fixes tends to attract scrutiny rather than deflect it.",
  },
]

export default function Page() {
  return (
    <>
      <ToolStructuredData
        name="Accessibility Statement Checker"
        description="Checks whether a published accessibility statement contains the information required by UK PSBAR, the EU Web Accessibility Directive, or the European Accessibility Act."
        url="https://accessibility.build/tools/accessibility-statement-checker"
        applicationCategory="WebApplication"
        operatingSystem="Any"
        offers={{ price: "0", priceCurrency: "USD" }}
      />
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <div className="container-wide py-12">
        <header className="mb-10 max-w-3xl">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-950">
            <FileCheck2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold text-slate-950 dark:text-white">
            Accessibility Statement Checker
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Almost every accessibility tool scans a site for contrast and labelling faults. This one
            reads the accessibility statement instead, and checks whether it contains what the law
            actually asks for.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge className="bg-green-100 px-4 py-2 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <ShieldCheck className="mr-2 h-4 w-4" aria-hidden="true" />
              Free
            </Badge>
            <Badge className="bg-blue-100 px-4 py-2 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              <Scale className="mr-2 h-4 w-4" aria-hidden="true" />
              UK PSBAR, EU WAD, EAA
            </Badge>
            <Badge className="bg-amber-100 px-4 py-2 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
              <Clock className="mr-2 h-4 w-4" aria-hidden="true" />
              Flags stale statements
            </Badge>
          </div>
        </header>

        <AccessibilityStatementChecker />

        <section className="mt-16 max-w-3xl" aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-2xl font-semibold text-slate-950 dark:text-white">
            Why check the statement and not just the site
          </h2>
          <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">
            When the Government Digital Service monitored 593 UK public sector websites between
            February 2020 and November 2021, it found that{" "}
            <strong>only about 7 percent had a fully compliant accessibility statement</strong>. Around
            83 percent had published one that was missing mandatory information, and only 10 percent had
            none at all. The common failure is not a missing statement. It is a statement that looks
            finished and quietly omits the parts a disabled user actually needs, most often the route to
            escalate a complaint.
          </p>
          <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">
            That is invisible to a scanner. An automated WCAG test can tell you a button has no
            accessible name; it has nothing to say about whether your statement names an enforcement
            body, dates its last review, or claims a level of conformance you cannot evidence. Those are
            the parts a regulator reads first, and they are cheap to fix once someone points at them:
            after GDS wrote to the organisations it monitored, statement compliance rose from 7 percent
            to 80 percent.
          </p>

          <h2 className="mt-10 text-2xl font-semibold text-slate-950 dark:text-white">What it checks</h2>
          <ul className="mt-4 space-y-2 leading-7 text-slate-700 dark:text-slate-300">
            <li>Whether a statement exists at all, including statements linked by wording rather than URL.</li>
            <li>The compliance status, in the prescribed fully, partially, or not compliant wording.</li>
            <li>The standard claimed against, such as WCAG 2.2 AA or EN 301 549.</li>
            <li>A list of non-accessible content, rather than silence about known problems.</li>
            <li>A working feedback route, so a person can report a barrier.</li>
            <li>The enforcement procedure and the body that handles escalation.</li>
            <li>Preparation and review dates, and whether the statement has gone stale past 12 months.</li>
            <li>How the assessment was made, by self-assessment or third-party audit.</li>
            <li>Overclaiming, such as &quot;100% compliant&quot;, and reliance on an overlay widget as the remedy.</li>
          </ul>

          <h2 className="mt-10 text-2xl font-semibold text-slate-950 dark:text-white">
            What it deliberately does not do
          </h2>
          <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">
            It does not tell you whether your website is accessible. A statement can pass every check
            here and still describe a site with serious barriers, and an honest statement often lists
            more problems than a careless one. For the site itself, use the{" "}
            <Link href="/tools/url-accessibility-auditor" className="text-blue-600 underline dark:text-blue-400">
              URL accessibility auditor
            </Link>
            . To find out whether the EAA applies to you in the first place, use the{" "}
            <Link href="/tools/eaa-scope-checker" className="text-blue-600 underline dark:text-blue-400">
              EAA scope checker
            </Link>
            .
          </p>
        </section>

        <div className="mt-16 max-w-3xl">
          <FaqSection faqs={faqs} />
        </div>

        <div className="mt-16">
          <RelatedContent
            links={[
              {
                url: "/guides/how-to-write-an-accessibility-statement",
                title: "How to write an accessibility statement",
                description: "The required sections, the right conformance wording, and the overclaiming to avoid.",
                type: "guide" as const,
              },
              {
                url: "/tools/accessibility-statement-generator",
                title: "Accessibility statement generator",
                description: "Produce a statement that contains the mandatory elements from the start.",
                type: "tool" as const,
              },
              {
                url: "/compliance/uk",
                title: "UK accessibility law",
                description: "Equality Act 2010 and the public sector accessibility regulations.",
                type: "resource" as const,
              },
              {
                url: "/compliance/eaa",
                title: "European Accessibility Act",
                description: "Who is in scope, what it requires, and the deadlines that already passed.",
                type: "resource" as const,
              },
            ]}
          />
        </div>
      </div>
    </>
  )
}
