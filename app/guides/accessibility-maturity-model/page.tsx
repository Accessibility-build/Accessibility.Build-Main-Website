import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Building2,
  ClipboardCheck,
  Gauge,
  ListChecks,
  Route,
  Scale,
  ShieldCheck,
} from "lucide-react"
import { PageByline } from "@/components/seo/page-byline"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { clampDescription } from "@/lib/metadata"
import { ALL_PROOF_POINTS, MATURITY_MODEL_SOURCE } from "@/lib/maturity/model"

const ROUTE = "/guides/accessibility-maturity-model"
const pageTitle = "W3C Accessibility Maturity Model: A Practical Guide"
const pageDescription =
  "A practical guide to the W3C Accessibility Maturity Model: its seven dimensions, the four levels from Inactive to Optimize, and how to run an assessment."

const ogImage = `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "accessibility maturity model",
    "accessibility maturity model w3c",
    "w3c accessibility maturity model",
    "accessibility maturity assessment",
    "digital accessibility maturity model",
    "accessibility maturity levels",
    "inactive launch integrate optimize",
    "accessibility maturity dimensions",
    "accessibility proof points",
    "accessibility programme maturity",
    "accessibility program maturity",
    "accessibility governance",
    "accessibility maturity self assessment",
    "accessibility roadmap",
    "accessibility procurement",
    "ISO 30071-1",
    "european accessibility act maturity",
  ],
  alternates: {
    canonical: ROUTE,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "article",
    siteName: "Accessibility.build",
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [{ url: ogImage, width: 1200, height: 630 }],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Accessibility Maturity Model",
    url: `https://accessibility.build${ROUTE}`,
  },
]

const linkClass =
  "text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2"

const proofPointCount = ALL_PROOF_POINTS.length

const faqs = [
  {
    question: "What is an accessibility maturity model?",
    answer:
      "An accessibility maturity model is a framework for judging how well an organisation has built accessibility into the way it works: its leadership, policies, buying, design and development, training, hiring and support. Instead of testing one website against WCAG, it asks whether the organisation can keep producing accessible products and services over time. It describes levels of maturity and the evidence that shows each one, so you can see where you are, what the next level requires and what to work on first.",
  },
  {
    question: "Is the W3C Accessibility Maturity Model a standard?",
    answer: `No. It is a W3C Group Note, published on ${MATURITY_MODEL_SOURCE.publishedLabel} by the Accessible Platform Architectures Working Group. A Group Note is endorsed by the working group that wrote it, not by W3C and its Members as a whole, and it is not a W3C Recommendation like WCAG. There is nothing to conform to and no certification. It is a free framework you can use and adapt, as long as you record your changes.`,
  },
  {
    question: "What are the four accessibility maturity levels?",
    answer:
      "The W3C model uses four levels. Inactive means little or no awareness and almost no activity. Launch means the need is recognised and planning has begun, but the work is not yet organised. Integrate means there is a roadmap and a defined, organised approach. Optimize means accessibility is part of how the whole organisation works, is checked consistently, and the results lead to action. The levels are cumulative, and each dimension is given its own level.",
  },
  {
    question: "What are the seven dimensions of the W3C Accessibility Maturity Model?",
    answer:
      "Communications; ICT Development Lifecycle; Knowledge and Skills; Oversight and Culture; Personnel; Procurement; and Support. Together they cover what an organisation publishes, how it builds digital products, what its people know, how it is led and governed, whether disabled people work there and shape decisions, how it buys technology, and how it helps disabled employees and customers.",
  },
  {
    question: "How do you carry out an accessibility maturity assessment?",
    answer:
      "Decide the scope, whole organisation or one unit. Form a cross-functional team with an owner for each dimension. For each proof point, gather the evidence that exists today, such as policies, training records, contract wording, test results and feedback logs, and rate the level it supports. Validate the ratings with accessibility specialists and disabled people, turn the gaps into a corrective action plan with owners and dates, and reassess on a regular cycle.",
  },
  {
    question: "How often should you reassess accessibility maturity?",
    answer:
      "The W3C Note says to reassess regularly, to track progress and catch areas that slip back, but it does not set an interval. Once a year, timed to your planning and budget cycle, suits most organisations, with an extra check after a major change such as a reorganisation, a new platform or a new legal obligation. Keep each assessment so you can compare them.",
  },
  {
    question: "Does the European Accessibility Act require an accessibility maturity model?",
    answer:
      "No. The European Accessibility Act sets accessibility requirements for the products and services in its scope and never mentions maturity models. It does, though, require service providers to have procedures that keep their services conformant as things change, to publish information on how services meet the requirements, and to document any disproportionate burden assessment. A maturity assessment is a practical way to see whether those processes exist. It is not evidence that a product or service conforms.",
  },
]

const dimensions = [
  {
    name: "Communications",
    section: "3.1",
    covers:
      "Everything the organisation tells people, inside and outside, formal or informal, whether staff or contractors produce it. The question is whether all of it can be used by as many people as possible and meets accessibility standards.",
    proof: [
      "Accessible templates for documents, slides, marketing material and Accessibility Conformance Reports (ACRs)",
      "Captions, transcripts and audio description for video and audio where needed",
      "Accessible meeting, webinar and chat tools",
      "An accessibility statement where one is needed, and a way to send accessibility questions or complaints",
    ],
    owners: "Communications, marketing, legal and document owners",
  },
  {
    name: "ICT Development Lifecycle",
    section: "3.2",
    covers:
      "Whether accessibility is part of every stage of a digital product's life: research, design, development, testing, conformance reporting, maintenance and retirement.",
    proof: [
      "Disabled people take part in user research, with the adjustments they need",
      "Design reviews, accessible design system components and annotated handoffs to developers",
      "An accessibility category in the bug tracker and a defined way to triage defects",
      "Automated tests plus documented manual checks with assistive technology, and releases that cannot ship without passing them",
    ],
    owners: "Product, design, engineering and quality assurance",
  },
  {
    name: "Knowledge and Skills",
    section: "3.3",
    covers:
      "Whether people at every level know enough about accessibility for their role and see how their work supports the organisation's goals. Skills that belong to a particular dimension are assessed in that dimension.",
    proof: [
      "Skills surveys that find the gaps",
      "Role-based training plans, tracked in the learning system",
      "Accessibility training for every new starter",
      "Accessibility responsibilities in job descriptions, and specialists placed around the organisation to coach colleagues",
    ],
    owners: "Learning and development, HR and the accessibility lead",
  },
  {
    name: "Oversight and Culture",
    section: "3.4",
    covers:
      "Whether leadership, values, policy and governance make disability inclusion part of how the organisation runs, rather than a side project.",
    proof: [
      "A named executive sponsor and a public commitment from executives",
      "A financial plan for raising maturity, with money formally committed",
      "Accessibility written into strategy, values, the code of conduct and staff objectives",
      "A written exception process for any inaccessible asset, needing a reason, a time limit and executive approval",
    ],
    owners: "The executive team, governance and finance",
  },
  {
    name: "Personnel",
    section: "3.5",
    covers:
      "Whether qualified disabled people work at every level and in every part of the organisation, so that lived experience informs its decisions.",
    proof: [
      "Goals and initiatives for recruiting disabled employees",
      "Hiring tools, job boards, the careers site and the application process audited for accessibility",
      "A disabled staff network with an executive sponsor that helps shape accessibility work",
      "Disabled employees in product focus groups, and a mentoring programme",
    ],
    owners: "HR, talent acquisition and inclusion teams",
  },
  {
    name: "Procurement",
    section: "3.6",
    covers:
      "Whether accessibility is part of how the organisation finds, chooses and contracts for products and services. Most technology arrives this way, so this is where accessibility is often won or lost.",
    proof: [
      "A published procurement policy for digital accessibility",
      "Standard accessibility wording in tenders, bid templates and contracts",
      "A written method for evaluating and scoring bids for accessibility",
      "Vendors supply testing evidence, warranties and remediation plans, and complaints involving a vendor have a defined route",
    ],
    owners: "Procurement, legal and vendor management",
  },
  {
    name: "Support",
    section: "3.7",
    covers:
      "Whether disabled employees and customers get the help they need with the organisation's digital products, from workplace adjustments to customer support.",
    proof: [
      "Accessibility help topics, and support and IT staff trained in assistive technology and disability etiquette",
      "A written policy for how employees request and receive adjustments to digital tools",
      "Accessible support channels in plain language",
      "Accessibility feedback that is collected, triaged and used to improve products",
    ],
    owners: "Customer support, the IT helpdesk and HR",
  },
]

const pitfalls = [
  {
    bad: "Treating the result as a compliance certificate.",
    why: "The Note separates maturity from conformance. A mature programme can still ship an inaccessible page.",
    fix: "Pair the assessment with audits and testing, and report both.",
  },
  {
    bad: "Rating plans as if they were practice.",
    why: "Aspirational evidence inflates the levels and hides the gaps you most need to see.",
    fix: "Rate only what exists today, and record the evidence for each rating.",
  },
  {
    bad: "One person fills it in alone.",
    why: "Nobody sees procurement, HR, engineering and support at once, so whole dimensions get guessed.",
    fix: "Use a cross-functional team with an owner for each dimension.",
  },
  {
    bad: "Averaging everything into one score.",
    why: "The Note defines no overall score, and an average hides the dimension that is holding you back.",
    fix: "Report a level per dimension, with the spread of ratings behind it.",
  },
  {
    bad: "Aiming for Optimize everywhere at once.",
    why: "A roadmap that tries to jump several levels in every dimension stalls in the first quarter.",
    fix: "Move each dimension up one level, in an order that follows dependencies.",
  },
  {
    bad: "Leaving disabled people out.",
    why: "Personnel is a whole dimension, and the Note asks for findings to be validated with disabled people.",
    fix: "Involve disabled employees and users in rating, validation and planning.",
  },
  {
    bad: "Skipping procurement.",
    why: "If you keep buying inaccessible tools, new barriers arrive faster than you remove the old ones.",
    fix: "Add standard clauses and a scoring method early; they are cheap and fast.",
  },
  {
    bad: "Editing the model quietly.",
    why: "Partners, customers and auditors cannot compare or map results they do not know were changed.",
    fix: "Record every omission and rewording, and state the scope in any report you share.",
  },
  {
    bad: "Assessing once and filing it.",
    why: "Maturity slips when people, priorities and platforms change.",
    fix: "Reassess on a set cycle and keep each export for comparison.",
  },
]

const checklist = [
  {
    title: "Scope agreed.",
    text: "Whole organisation or a named unit, written down, and stated in anything you share outside.",
  },
  {
    title: "Team assembled.",
    text: "A cross-functional group with an owner for each of the seven dimensions, including disabled colleagues.",
  },
  {
    title: "Evidence gathered.",
    text: "Current documents, records and results for each proof point, not plans or intentions.",
  },
  {
    title: "Every proof point rated.",
    text: "Inactive, Launch, Integrate or Optimize, with Not applicable where it genuinely does not apply.",
  },
  {
    title: "A level per dimension.",
    text: "Judged from the evidence, with no overall average; Optimize only where every proof point is complete.",
  },
  {
    title: "Findings validated.",
    text: "Checked with accessibility specialists and with disabled employees or users.",
  },
  {
    title: "Customisations recorded.",
    text: "Any omitted, renamed or reworded proof points listed, with the dimensions and levels unchanged.",
  },
  {
    title: "Corrective action plan written.",
    text: "Goals, milestones, owners and dates, each tied to a proof point, inside your normal planning tools.",
  },
  {
    title: "Conformance tested separately.",
    text: "Products and content still audited against WCAG 2.2 and, where it applies, EN 301 549.",
  },
  {
    title: "Next assessment booked.",
    text: "A date in the planning cycle, and this assessment exported so the next one can be compared.",
  },
]

function AssessmentCallout({ id, text }: { id: string; text: string }) {
  return (
    <div
      role="group"
      aria-labelledby={id}
      className="not-prose my-6 flex flex-col gap-4 rounded-lg border border-blue-200 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/20 sm:flex-row sm:items-center"
    >
      <Gauge className="h-8 w-8 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
      <div className="flex-1">
        <p id={id} className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-200">
          Free tool: Accessibility Maturity Assessment
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
      <Button asChild className="shrink-0 gap-2">
        <Link href="/tools/accessibility-maturity-assessment">
          Start the maturity assessment
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
  )
}

function CodeBlock({ code }: { code: string }) {
  // Each scrollable code region needs its own name; the first line of the code says what it is.
  const firstLine = code.trim().split("\n")[0].replace(/^[/*<!\-\s]+|[*/>\-\s{]+$/g, "").trim()
  return (
    <div tabIndex={0} role="region" aria-label={`Code example: ${firstLine}`} className="not-prose my-4 overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
      <pre className="p-4 text-sm text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default function AccessibilityMaturityModelGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema
        route={ROUTE}
        title={pageTitle}
        description={pageDescription}
        datePublished="2026-10-28"
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Accessibility Maturity Model
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article>
          {/* Hero */}
          <section className="pt-12 pb-8 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                Programme Guide
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                The W3C Accessibility Maturity Model: Dimensions, Levels and
                Assessment
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                WCAG tells you whether a page is accessible. A maturity model
                asks a harder question: can your organisation keep producing
                accessible pages, documents, products and services, year after
                year, without relying on a few determined people? The W3C
                Accessibility Maturity Model is the free, open framework for that
                question. This guide explains its status, its seven dimensions
                and four levels in plain terms, how to run an assessment that
                rests on evidence rather than opinion, how it relates to other
                models, the European Accessibility Act, procurement rules and
                ISO/IEC 30071-1, and how to turn the result into a roadmap.
              </p>
              <PageByline
                route={ROUTE}
                variant="hero"
                align="center"
                source={{
                  label: "W3C Accessibility Maturity Model (Group Note)",
                  href: MATURITY_MODEL_SOURCE.url,
                }}
              />
            </div>
          </section>

          <section className="pb-4 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <AssessmentCallout
                id="assessment-callout-top"
                text={`Rate all ${proofPointCount} proof points across the seven dimensions as Inactive, Launch, Integrate or Optimize, with notes on your evidence. You get a level for each dimension, a chart, next steps for the weakest areas, and Excel and PDF exports. Your answers stay in your browser.`}
              />
            </div>
          </section>

          {/* What it is */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Building2 className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                What an Accessibility Maturity Model Is
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A maturity model describes the stages an organisation moves
                  through as a capability becomes part of how it works, and the
                  evidence that shows each stage. For accessibility, the
                  capability is producing accessible products, content and
                  services as a matter of routine. The W3C Note draws the line
                  clearly: conformance testing tells you how accessible one product
                  is at one moment, while maturity modelling looks at whether the
                  organisation can deliver accessible work over the long term.
                </p>
              </div>
              <div tabIndex={0} role="region" aria-label="How a conformance audit and a maturity assessment differ" className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    How a conformance audit and a maturity assessment differ
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        <span className="sr-only">Aspect</span>
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">Conformance audit</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Maturity assessment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Question</th>
                      <td className="px-4 py-3 align-top">Does this product meet WCAG or EN 301 549 today?</td>
                      <td className="px-4 py-3 align-top">Can the organisation keep producing accessible products?</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">What is examined</th>
                      <td className="px-4 py-3 align-top">Pages, screens, documents, components</td>
                      <td className="px-4 py-3 align-top">Policies, processes, people, budgets, contracts, support</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Evidence</th>
                      <td className="px-4 py-3 align-top">Test results against success criteria</td>
                      <td className="px-4 py-3 align-top">Proof points: documents, records, results and working processes</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Output</th>
                      <td className="px-4 py-3 align-top">A list of failures, a conformance report or an ACR</td>
                      <td className="px-4 py-3 align-top">A level for each dimension and a corrective action plan</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Shelf life</th>
                      <td className="px-4 py-3 align-top">Until the next release</td>
                      <td className="px-4 py-3 align-top">Until the organisation changes, so reassess regularly</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Who it is for
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Note is written for executives, for the managers who are
                  responsible for accessibility, and for the people who own
                  policy and business processes. It is meant to work for any kind
                  of organisation, public or private, from a one-person
                  consultancy or a small charity to a government department or a
                  multinational, and it covers internal activity such as HR as
                  well as public-facing products and services.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Its appendix of sample use cases shows the situations it is
                  built for: a software company answering a tender that asks it to
                  prove it can keep its ACRs accurate and current, a government
                  agency putting that question into its own tender, an employer
                  facing complaints about disability inclusion in its hiring, a
                  consultancy showing its own maturity, an organisation looking at
                  a supplier of content or of tools and code libraries, and a
                  multinational assessing a single business unit.
                </p>
              </div>
            </div>
          </section>

          {/* Status */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                Status: A W3C Group Note, Not a Standard
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The{" "}
                  <a href={MATURITY_MODEL_SOURCE.url} className={linkClass}>
                    Accessibility Maturity Model
                  </a>{" "}
                  was published as a{" "}
                  <strong className="text-slate-900 dark:text-white">
                    W3C Group Note on {MATURITY_MODEL_SOURCE.publishedLabel}
                  </strong>{" "}
                  by the Accessible Platform Architectures (APA) Working Group,
                  which developed it through a dedicated task force. That status
                  matters, and it is often misreported:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      It is not a W3C Recommendation.
                    </strong>{" "}
                    WCAG is a W3C Recommendation, the end point of the W3C&rsquo;s
                    standards track. A Group Note is endorsed by the working group
                    that wrote it, not by W3C and its Members as a whole.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      There is nothing to conform to.
                    </strong>{" "}
                    No organisation can be &ldquo;certified&rdquo; against it, and
                    any level you report is your own judgement unless someone
                    independent has checked the evidence.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      It does not replace WCAG, EN 301 549 or the law.
                    </strong>{" "}
                    It describes the organisation that produces accessible work;
                    those standards and laws describe the work itself.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      You may adapt it.
                    </strong>{" "}
                    The Note allows organisations to omit, rename or reword proof
                    points, provided the dimensions, levels and progression stay
                    the same and the changes are recorded.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Note links to an assessment spreadsheet with one sheet per
                  dimension, which its editors describe as an experimental
                  prototype, with a more robust tool planned. Feedback goes to the
                  W3C through issues on its GitHub repository. Our{" "}
                  <Link href="/tools/accessibility-maturity-assessment" className={linkClass}>
                    accessibility maturity assessment
                  </Link>{" "}
                  is an independent tool built on the {MATURITY_MODEL_SOURCE.publishedLabel}{" "}
                  version, with every proof point paraphrased in our own words.
                </p>
              </div>
            </div>
          </section>

          {/* Dimensions */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                The Seven Dimensions
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The model divides an organisation into seven dimensions, the
                  areas where better maturity leads to better conformance with
                  accessibility standards and regulations. Each dimension has{" "}
                  <strong className="text-slate-900 dark:text-white">proof points</strong>
                  : concrete deliverables, such as a policy, a template, a
                  training record or a signed contract, that show which level it
                  has reached. Each dimension also has its own goals and metrics,
                  and almost every one includes a proof point for training that
                  keeps the relevant skills current. The descriptions and
                  examples below are our own summaries of the Note.
                </p>
              </div>
              <div className="mt-6 space-y-6">
                {dimensions.map((dimension) => (
                  <div
                    key={dimension.name}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6"
                  >
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {dimension.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Section {dimension.section} of the Note
                    </p>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {dimension.covers}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                      Example proof points
                    </p>
                    <ul className="mt-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
                      {dimension.proof.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm text-muted-foreground">
                      <strong className="text-slate-900 dark:text-white">Usually owned by:</strong>{" "}
                      {dimension.owners}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Levels */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Gauge className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                The Four Maturity Levels
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every dimension is judged on the same four levels. The middle
                column is our summary of what each level means across the model;
                the right-hand column shows how it plays out in one dimension,
                Procurement.
              </p>
              <div tabIndex={0} role="region" aria-label="The four levels of the W3C Accessibility Maturity Model, what each means, and an example from the Procurement dimension" className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The four levels of the W3C Accessibility Maturity Model, what
                    each means, and an example from the Procurement dimension
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Level</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it means</th>
                      <th scope="col" className="px-4 py-3 font-semibold">In Procurement, for example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Inactive</th>
                      <td className="px-4 py-3 align-top">Little or no awareness that accessibility is needed, and almost nothing being done.</td>
                      <td className="px-4 py-3 align-top">Tenders and contracts do not mention accessibility, apart from the odd one-off.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Launch</th>
                      <td className="px-4 py-3 align-top">The need is recognised and planning has started, but the work is not yet organised.</td>
                      <td className="px-4 py-3 align-top">Work has begun on adding accessibility to tenders, and some procurement training is planned.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Integrate</th>
                      <td className="px-4 py-3 align-top">A roadmap exists and the approach is defined and organised.</td>
                      <td className="px-4 py-3 align-top">Contract wording is complete and reviewed, vendors must supply accessibility documentation, accessibility is monitored through the contract, and training has started.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Optimize</th>
                      <td className="px-4 py-3 align-top">Accessibility is part of how the whole organisation works, is checked consistently, and the results drive action.</td>
                      <td className="px-4 py-3 align-top">The processes and wording are used across all purchasing and refined over time, and training is required and measured.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none mt-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  The rules that sit behind the levels
                </h3>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">The levels are cumulative.</strong>{" "}
                    A dimension can only reach a level by meeting the ones below it
                    first.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Optimize means complete.</strong>{" "}
                    Proof points can be partly done at Launch and Integrate, but
                    must be fully in place for Optimize.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Not applicable is allowed.</strong>{" "}
                    If something does not apply, such as a policy clause about
                    native apps for an organisation that has none, mark it N/A
                    rather than forcing a rating.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Each dimension has its own level.</strong>{" "}
                    An organisation can be at Integrate in Communications and
                    Inactive in Personnel. The Note defines no overall score and no
                    way of combining the seven.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">The names are borrowed.</strong>{" "}
                    The four level names come from the Policy Driven Adoption for
                    Accessibility (PDAA) model of NASCIO, the US National
                    Association of State Chief Information Officers, which some US
                    state and local agencies already use.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to run */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ClipboardCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                How to Run an Accessibility Maturity Assessment
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Note&rsquo;s own advice comes down to a short sequence:
                  form a cross-functional team, gather current evidence, validate
                  the findings with experts and disabled people, write a
                  corrective action plan, and reassess regularly. Here is how to
                  put that into practice.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  1. Decide the scope
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The model covers the whole organisation, but you can apply it to
                  one business unit, region or product line. If you do, the Note
                  asks you to say so plainly in any report you give to a third
                  party, such as a customer answering a tender. A first assessment
                  of one unit is often a sensible pilot.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  2. Assemble the team
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  No single person sees procurement, engineering, HR and customer
                  support at once, so the Note recommends a cross-functional review
                  team. Its appendix maps roles to dimensions: some, such as a
                  chief accessibility officer, employees with disabilities and an
                  accessibility consultant, contribute to all seven, while others
                  touch only a few. It also suggests naming a lead for each
                  dimension who has taken at least basic accessibility training.
                  In practice that means one coordinator, seven dimension owners,
                  and disabled colleagues involved from the start rather than
                  consulted at the end.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  3. Gather evidence, not intentions
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Note is explicit that evidence should describe what exists
                  now, not what is planned. Useful evidence includes policies,
                  procedures and templates; training plans and completion records;
                  goals and metrics; ACRs; contract clauses and signed contracts;
                  test and audit results; and feedback and tracking systems. Keep
                  a simple log for each proof point so the next assessment can see
                  exactly what you saw:
                </p>
              </div>
              <CodeBlock
                code={`Dimension:    Procurement
Proof point:  Contracts for custom development include accessibility checkpoints
Rating:       Launch
Evidence:     2 of the 9 development contracts signed this year include
              a WCAG 2.2 AA clause (links to both contracts)
Gap:          No clause in the standard contract template; no acceptance testing
Owner:        Head of Procurement
Next step:    Add the clause and an acceptance test to the template by March
Checked on:   2026-10-28`}
              />
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  4. Rate the proof points, then the dimension
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For each dimension the Note describes three steps: pick the proof
                  points that apply, list the documentation that supports them, and
                  decide which level that evidence supports. Because it defines no
                  formula, the judgement is yours. Our assessment tool adds a
                  transparent rule to help: a dimension sits at the level that at
                  least half of its rated proof points have reached, it reaches
                  Optimize only when every rated proof point is at Optimize, and a
                  summary that rests on fewer than half of a dimension&rsquo;s
                  proof points is marked provisional.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  5. Validate the findings
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Before anything goes in a report, check the ratings with
                  accessibility specialists and with disabled people, as the Note
                  advises. Self-assessment tends to be generous: a policy can exist
                  without being followed, and a training course can be available
                  without anyone taking it.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  6. Record any customisation
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If a proof point does not fit your sector, you may drop, rename
                  or reword it, but keep the seven dimensions, the four levels and
                  the way they build on each other, and write down every change so
                  a third party can map your results back to the Note.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  7. Reassess on a cycle
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Note asks for regular reassessment to track progress and spot
                  regressions, without fixing an interval. Once a year, timed to
                  your planning and budget cycle, works for most organisations,
                  plus a check after any major change such as a reorganisation, a
                  new platform or a new legal duty. Keep every assessment so you
                  can compare them.
                </p>
              </div>
              <AssessmentCallout
                id="assessment-callout-run"
                text="Work through the seven dimensions one at a time, record the evidence for each rating in the notes, and export to Excel or PDF to share with dimension owners and compare next year."
              />
            </div>
          </section>

          {/* Roadmap */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Route className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                Turning Results into a Roadmap
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Note asks for a corrective action plan with goals,
                  milestones, owners and timelines, managed inside the systems you
                  already use. A few principles make that plan realistic:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">Aim for the next level, not Optimize.</strong>{" "}
                    Moving one dimension up a single level is a solid goal for a
                    year; trying to reach the top everywhere at once is how
                    roadmaps stall.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Start with the dimensions that unlock the rest.</strong>{" "}
                    An executive sponsor, a policy and a budget (Oversight and
                    Culture) make every other dimension easier. Procurement clauses
                    stop new barriers arriving while you fix old ones.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Tie every action to a proof point.</strong>{" "}
                    If an action does not change a proof point, the next assessment
                    will not see it.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Put it where work is planned.</strong>{" "}
                    Backlog items, objectives and budget lines get done; a separate
                    spreadsheet does not.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Here is an illustrative first-year roadmap for an organisation
                  whose assessment found most dimensions at Inactive or Launch:
                </p>
              </div>
              <div tabIndex={0} role="region" aria-label="An illustrative first-year accessibility maturity roadmap by quarter, with dimension, target level, actions and the evidence each produces" className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    An illustrative first-year accessibility maturity roadmap by
                    quarter, with dimension, target level, actions and the evidence
                    each produces
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Quarter</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Dimension and target</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Evidence at the end</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Q1</th>
                      <td className="px-4 py-3 align-top">Oversight and Culture: Inactive to Launch</td>
                      <td className="px-4 py-3 align-top">Name an executive sponsor, approve an accessibility policy, agree a budget line</td>
                      <td className="px-4 py-3 align-top">Signed policy, board minutes, budget entry</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Q1</th>
                      <td className="px-4 py-3 align-top">Procurement: Inactive to Launch</td>
                      <td className="px-4 py-3 align-top">Add a standard accessibility clause to the tender template; ask vendors of new software for an ACR</td>
                      <td className="px-4 py-3 align-top">Updated template, first tenders using it</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Q2</th>
                      <td className="px-4 py-3 align-top">ICT Development Lifecycle: Launch to Integrate</td>
                      <td className="px-4 py-3 align-top">Automated checks in the build pipeline, an accessibility bug label with triage rules, a manual screen reader test script for releases</td>
                      <td className="px-4 py-3 align-top">Pipeline configuration, triage document, test records</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Q3</th>
                      <td className="px-4 py-3 align-top">Knowledge and Skills: Launch to Integrate</td>
                      <td className="px-4 py-3 align-top">Role-based training plans for designers, developers and content authors; track completion</td>
                      <td className="px-4 py-3 align-top">Curricula, learning system records</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Q4</th>
                      <td className="px-4 py-3 align-top">Communications and Support: Launch to Integrate</td>
                      <td className="px-4 py-3 align-top">Accessible document and slide templates, an accessibility statement with a contact route, a process for triaging feedback</td>
                      <td className="px-4 py-3 align-top">Templates, statement URL, feedback log</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">Q4</th>
                      <td className="px-4 py-3 align-top">All seven</td>
                      <td className="px-4 py-3 align-top">Reassess, compare with the baseline, plan year two</td>
                      <td className="px-4 py-3 align-top">Second assessment export</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Useful building blocks for those actions: the{" "}
                  <Link href="/guides/how-to-write-an-accessibility-statement" className={linkClass}>
                    guide to writing an accessibility statement
                  </Link>{" "}
                  and the{" "}
                  <Link href="/tools/accessibility-statement-generator" className={linkClass}>
                    statement generator
                  </Link>
                  , the{" "}
                  <Link href="/guides/vpat-accessibility-conformance-report" className={linkClass}>
                    VPAT and ACR guide
                  </Link>{" "}
                  for procurement, the{" "}
                  <Link href="/guides/how-to-audit-website-accessibility" className={linkClass}>
                    website audit guide
                  </Link>{" "}
                  and{" "}
                  <Link href="/guides/automated-vs-manual-accessibility-testing" className={linkClass}>
                    automated versus manual testing
                  </Link>{" "}
                  for the lifecycle, and the{" "}
                  <Link href="/tools/accessibility-roi-calculator" className={linkClass}>
                    accessibility ROI calculator
                  </Link>{" "}
                  for the budget conversation.
                </p>
              </div>
            </div>
          </section>

          {/* Other models */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                How It Compares with Other Maturity Models
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The W3C model is not the only one, and its own appendix lists
                several others. They differ more in who publishes them and how you
                use them than in what they look at.
              </p>
              <div tabIndex={0} role="region" aria-label="Accessibility maturity models and related standards, who publishes them, their structure, and how they are used" className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Accessibility maturity models and related standards, who
                    publishes them, their structure, and how they are used
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Model</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Published by</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Structure</th>
                      <th scope="col" className="px-4 py-3 font-semibold">How it is used</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        W3C Accessibility Maturity Model
                      </th>
                      <td className="px-4 py-3 align-top">W3C APA Working Group, Group Note, 2025</td>
                      <td className="px-4 py-3 align-top">Seven dimensions, four levels, proof points</td>
                      <td className="px-4 py-3 align-top">Free and open; self-assessment or independent review</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Digital Accessibility Maturity Model (DAMM)
                      </th>
                      <td className="px-4 py-3 align-top">Level Access, an accessibility software and services company</td>
                      <td className="px-4 py-3 align-top">Seven dimensions, five levels: Initial, Repeatable, Defined, Managed, Optimizing</td>
                      <td className="px-4 py-3 align-top">A free short Quick Check, plus a programme-building tool and expert-led assessments as services</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Accessibility Maturity Model (BDF)
                      </th>
                      <td className="px-4 py-3 align-top">Business Disability Forum, a UK membership organisation, through its Technology Taskforce</td>
                      <td className="px-4 py-3 align-top">Self-assessment linked to BDF&rsquo;s Accessible Technology Charter, covering areas such as IT governance and procurement</td>
                      <td className="px-4 py-3 align-top">Offered through BDF; check the current version and access terms with BDF</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Policy-Driven Adoption for Accessibility (PDAA)
                      </th>
                      <td className="px-4 py-3 align-top">NASCIO</td>
                      <td className="px-4 py-3 align-top">A high-level, policy-led assessment; the source of the W3C level names</td>
                      <td className="px-4 py-3 align-top">Used by some US state and local agencies; can be tuned for procurement</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        Accessibility Capability Maturity Model (CCC ACMM)
                      </th>
                      <td className="px-4 py-3 align-top">California Community Colleges</td>
                      <td className="px-4 py-3 align-top">Five stages across governance, content creation, procurement and staff development</td>
                      <td className="px-4 py-3 align-top">Built for decentralised higher education institutions</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                        ISO/IEC 30071-1:2019
                      </th>
                      <td className="px-4 py-3 align-top">ISO and IEC, international standard</td>
                      <td className="px-4 py-3 align-top">A code of practice for accessible ICT, not a maturity scale</td>
                      <td className="px-4 py-3 align-top">A paid standard describing the processes to follow</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                Sources: the W3C Note&rsquo;s appendix of related models; Level
                Access&rsquo;s{" "}
                <a href="https://www.levelaccess.com/digital-accessibility-maturity-model/" className={linkClass}>
                  DAMM overview
                </a>{" "}
                and{" "}
                <a href="https://www.levelaccess.com/the-digital-accessibility-maturity-model-maturity-levels/" className={linkClass}>
                  DAMM maturity levels
                </a>
                ; the ILO Global Business and Disability Network&rsquo;s{" "}
                <a href="https://www.businessanddisability.org/node/1196" className={linkClass}>
                  listing of the BDF Accessibility Maturity Model
                </a>
                .
              </p>
              <div className="prose prose-slate dark:prose-invert max-w-none mt-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The models overlap heavily: governance, communications, the
                  development lifecycle, procurement, skills and support appear in
                  almost all of them. The practical differences are openness, cost
                  and comparability. The W3C model is free, can be adapted with a
                  record of changes, and gives a shared vocabulary that a customer,
                  a supplier and an auditor can all read. If you already use another
                  model, there is no need to switch; you can map your results onto
                  the W3C dimensions when a partner asks for them.
                </p>
              </div>
            </div>
          </section>

          {/* EAA, procurement, ISO */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Scale className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                How It Relates to the EAA, Procurement Rules and ISO/IEC 30071-1
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  The European Accessibility Act
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The{" "}
                  <Link href="/compliance/eaa" className={linkClass}>
                    European Accessibility Act
                  </Link>{" "}
                  (Directive (EU) 2019/882), which has applied since 28 June 2025,
                  sets accessibility requirements for the products and services in
                  its scope. It never mentions maturity models and does not require
                  one. But several of its duties are about process, and those are
                  exactly what the maturity model measures:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <strong className="text-slate-900 dark:text-white">Article 13(3):</strong>{" "}
                    service providers must have procedures that keep their services
                    conformant, taking account of changes to the service, to the
                    requirements and to the standards. Article 7(4) asks the same of
                    manufacturers for series production. That is the ICT Development
                    Lifecycle dimension: release gates, regression testing and
                    checks on changes between releases.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Article 13(2) and Annex V:</strong>{" "}
                    service providers must publish, in accessible formats,
                    information explaining how their services meet the requirements,
                    and keep it for as long as the service runs. That sits in
                    Communications and Support.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Article 13(4):</strong>{" "}
                    when a service does not conform, the provider must correct it and
                    inform the national authorities. Defect triage and feedback
                    handling are proof points in the lifecycle and Support
                    dimensions.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">Article 14:</strong>{" "}
                    businesses relying on the disproportionate burden exception
                    must document their assessment (microenterprises dealing in
                    products are excused from the paperwork), and service providers
                    must renew it when the service changes, when an authority asks,
                    and in any case at least every five years. That needs the
                    governance and record-keeping of Oversight and Culture.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A maturity assessment is not evidence that anything conforms.
                  Conformance is about the products and services themselves, tested
                  against the Act&rsquo;s requirements and the standards that support
                  them, such as{" "}
                  <Link href="/compliance/en-301-549" className={linkClass}>
                    EN 301 549
                  </Link>
                  . Use the{" "}
                  <Link href="/checklists/eaa" className={linkClass}>
                    EAA readiness checklist
                  </Link>{" "}
                  for the obligations themselves and the maturity model for the
                  organisation that has to keep meeting them.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Public procurement
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In the EU, Article 42(1) of the public procurement Directive
                  2014/24/EU says that technical specifications for anything people
                  will use must, except in justified cases, take accessibility into
                  account, and must refer to any mandatory accessibility
                  requirements set by EU law. Article 24(1) of the EAA makes its
                  Annex I requirements those mandatory requirements for the products
                  and services it covers. In the United States,{" "}
                  <Link href="/compliance/section-508" className={linkClass}>
                    Section 508
                  </Link>{" "}
                  requires federal agencies to make the technology they develop,
                  buy, maintain or use accessible, and suppliers usually answer with
                  an Accessibility Conformance Report, often built on the VPAT
                  template.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The maturity model helps on both sides of a tender. For buyers,
                  the Procurement dimension is a checklist for their own process:
                  policy, standard clauses, evaluation and scoring, contract
                  remedies and monitoring. For suppliers, an ACR describes a product
                  on the day it was tested, and two of the Note&rsquo;s sample use
                  cases revolve around tenders that ask suppliers to show they can
                  keep their ACRs accurate and current.
                  Evidence from the ICT Development Lifecycle, Knowledge and Skills
                  and Personnel dimensions is a credible answer.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  ISO/IEC 30071-1
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ISO/IEC 30071-1:2019, a code of practice for creating accessible
                  ICT products and services, grew out of the UK standard BS 8878.
                  It is about process rather than technical criteria: it asks
                  organisations to adopt an accessibility policy, consider
                  accessibility at every stage of a system&rsquo;s life, document
                  and justify their decisions, and publish an accessibility
                  statement when a system launches, and it applies to any
                  organisation and to technologies from websites and apps to
                  connected devices. The W3C Note lists it among related models.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The two fit together well. ISO/IEC 30071-1 describes the
                  processes to follow; the maturity model measures how far those
                  processes have taken root. An organisational accessibility policy
                  shows up in Oversight and Culture, lifecycle decisions and their
                  justification in the ICT Development Lifecycle, procurement in
                  Procurement, and the accessibility statement in Communications and
                  Support.
                </p>
              </div>
            </div>
          </section>

          {/* Pitfalls */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Pitfalls and How to Avoid Them
              </h2>
              <div tabIndex={0} role="region" aria-label="Common accessibility maturity assessment pitfalls, why they hurt, and what to do instead" className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common accessibility maturity assessment pitfalls, why they
                    hurt, and what to do instead
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Pitfall</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Why it hurts</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Do this instead</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {pitfalls.map((row) => (
                      <tr key={row.bad}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          {row.bad}
                        </th>
                        <td className="px-4 py-3 align-top">{row.why}</td>
                        <td className="px-4 py-3 align-top">{row.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                Accessibility Maturity Assessment Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                {checklist.map((item) => (
                  <li key={item.title}>
                    <strong className="text-slate-900 dark:text-white">{item.title}</strong>{" "}
                    {item.text}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Find Out Where Your Programme Stands
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Rate your organisation against all seven dimensions, then test
                  your products so you know both how mature you are and how
                  accessible your work is today.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/accessibility-maturity-assessment">
                      Take the maturity assessment
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/checklists/wcag-2-2">Open the WCAG 2.2 checklist</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <FaqSection faqs={faqs} />
            </div>
          </section>

          {/* Related Content */}
          <section className="pb-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <RelatedContent
                content="accessibility maturity model w3c maturity assessment programme governance policy procurement training audit accessibility statement vpat acr european accessibility act en 301 549 section 508 organisation roadmap"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
