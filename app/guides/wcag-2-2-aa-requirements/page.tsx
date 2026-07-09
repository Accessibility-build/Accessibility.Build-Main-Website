import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  FAQStructuredData,
  BreadcrumbStructuredData,
  ChecklistStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { wcagCriteria, type SuccessCriterion } from "@/lib/wcag-data"

const pageTitle = "WCAG 2.2 Level AA Requirements: Complete List"
const pageDescription =
  "Every requirement for WCAG 2.2 Level AA conformance: all 55 Level A and AA success criteria in one checklist, grouped by POUR principle, plus how to verify."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "WCAG 2.2 AA requirements",
    "WCAG 2.2 AA checklist",
    "WCAG 2.2 Level AA success criteria",
    "WCAG 2.2 AA conformance",
    "WCAG AA compliance list",
    "level A and AA criteria",
    "WCAG 2.2 requirements list",
    "POUR principles",
  ],
  alternates: {
    canonical: "/guides/wcag-2-2-aa-requirements",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/wcag-2-2-aa-requirements",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
        alt: "Complete WCAG 2.2 Level AA requirements list",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [`/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`],
  },
}

const slugFor = (number: string) => number.replace(/\./g, "-")

// WCAG 2.2 Level AA conformance = satisfying every Level A criterion AND
// every Level AA criterion. Both lists are derived from the canonical
// criterion data in lib/wcag-data.ts, so this page stays in sync with the
// /wcag reference pages.
const aaScopeCriteria = wcagCriteria.filter(
  (c) => c.level === "A" || c.level === "AA"
)
const levelACount = aaScopeCriteria.filter((c) => c.level === "A").length
const levelAACount = aaScopeCriteria.filter((c) => c.level === "AA").length
const totalCount = aaScopeCriteria.length

// New-in-2.2 criteria within the AA scope, flagged in the checklist.
const NEW_IN_2_2 = new Set(["2.4.11", "2.5.7", "2.5.8", "3.2.6", "3.3.7", "3.3.8"])

interface GuidelineGroup {
  guideline: string
  criteria: SuccessCriterion[]
}

interface PrincipleGroup {
  principle: string
  criteria: SuccessCriterion[]
  guidelines: GuidelineGroup[]
}

// Group by POUR principle, then by guideline, preserving the numeric order
// of the source data.
const principleGroups: PrincipleGroup[] = aaScopeCriteria.reduce<PrincipleGroup[]>(
  (groups, criterion) => {
    let principleGroup = groups.find((g) => g.principle === criterion.principle)
    if (!principleGroup) {
      principleGroup = { principle: criterion.principle, criteria: [], guidelines: [] }
      groups.push(principleGroup)
    }
    principleGroup.criteria.push(criterion)

    let guidelineGroup = principleGroup.guidelines.find(
      (g) => g.guideline === criterion.guideline
    )
    if (!guidelineGroup) {
      guidelineGroup = { guideline: criterion.guideline, criteria: [] }
      principleGroup.guidelines.push(guidelineGroup)
    }
    guidelineGroup.criteria.push(criterion)
    return groups
  },
  []
)

const principleIntros: Record<string, string> = {
  "1. Perceivable":
    "Information and user interface components must be presentable to users in ways they can perceive — text alternatives for images, captions for media, adaptable structure, and sufficient contrast.",
  "2. Operable":
    "User interface components and navigation must be operable — everything works with a keyboard, users get enough time, nothing triggers seizures, and targets are easy to find and hit.",
  "3. Understandable":
    "Information and the operation of the user interface must be understandable — readable language, predictable behavior, and help avoiding and correcting mistakes.",
  "4. Robust":
    "Content must be robust enough to be interpreted reliably by a wide variety of user agents, including assistive technologies like screen readers.",
}

const faqs = [
  {
    question: "What does WCAG 2.2 Level AA conformance actually mean?",
    answer: `WCAG 2.2 Level AA conformance means your content satisfies every Level A success criterion (${levelACount} criteria) plus every Level AA success criterion (${levelAACount} criteria) — ${totalCount} requirements in total. The levels are cumulative: you cannot claim AA while failing any Level A criterion. Level AAA criteria (a further 31) are not required for an AA conformance claim. Conformance applies per page, and every page in the claimed scope must pass all ${totalCount} criteria.`,
  },
  {
    question: "How many success criteria are in WCAG 2.2 Level AA?",
    answer: `${totalCount}. WCAG 2.2 contains 86 success criteria in total: ${levelACount} at Level A, ${levelAACount} at Level AA, and 31 at Level AAA. A Level AA conformance claim covers the Level A and Level AA criteria — ${levelACount} + ${levelAACount} = ${totalCount}. Six of those ${totalCount} are new in WCAG 2.2: 2.4.11 Focus Not Obscured (Minimum), 2.5.7 Dragging Movements, 2.5.8 Target Size (Minimum), 3.2.6 Consistent Help, 3.3.7 Redundant Entry, and 3.3.8 Accessible Authentication (Minimum).`,
  },
  {
    question: "Why is Level AA the standard instead of A or AAA?",
    answer:
      "Level A alone leaves major barriers in place — it does not even require sufficient color contrast. Level AAA is not achievable for all content (for example, some media simply cannot meet every AAA requirement), and the W3C itself says AAA should not be required as a general policy for entire sites. Level AA is the balance point: it removes the most significant barriers while remaining achievable for real-world products, which is why regulators worldwide — the DOJ under ADA Title II, the EU via EN 301 549, and courts in ADA Title III settlements — consistently set AA as the requirement.",
  },
  {
    question: "Do U.S. laws require WCAG 2.2 AA or WCAG 2.1 AA?",
    answer:
      "Current U.S. regulations cite WCAG 2.1 AA (the DOJ ADA Title II rule) or WCAG 2.0 AA (Section 508); the EU's EN 301 549 also references 2.1 AA. No major law names 2.2 yet. But WCAG 2.2 is backwards compatible — conforming to 2.2 AA automatically satisfies 2.1 AA — so targeting 2.2 AA meets every current legal reference while future-proofing you for when standards bodies update their citations. There is no scenario where meeting 2.2 AA leaves you short of a 2.1 AA obligation.",
  },
  {
    question: "How do I verify WCAG 2.2 AA conformance?",
    answer:
      "Combine three methods. First, automated scanning catches machine-detectable failures like missing alt text, contrast issues, and unlabeled form fields — typically 30-40% of real issues. Second, manual testing covers what automation cannot: keyboard-only navigation, screen reader output, focus order, and reflow. Third, work criterion by criterion through a structured checklist so nothing is skipped. For high-stakes conformance claims (legal exposure, procurement, VPAT/ACR documentation), commission a professional audit that tests representative pages against all 55 criteria and documents the evidence.",
  },
  {
    question: "Does every page of my site need to meet all 55 criteria?",
    answer:
      "Yes — WCAG conformance is defined per page, and a conformance claim covers full pages, not fragments. If one criterion fails anywhere on a page, that page does not conform. In practice, teams audit a representative sample: key templates (home, navigation, search, forms, checkout), highest-traffic pages, and each distinct component pattern. Because most sites are template-driven, fixing a template or design-system component usually fixes every page that uses it.",
  },
  {
    question: "How long does it take to reach WCAG 2.2 AA?",
    answer:
      "It depends on the starting point. A site built with semantic HTML and an accessible design system may need only weeks of focused fixes. A legacy site with custom widgets, PDF libraries, and third-party embeds can take several months of prioritized remediation. The efficient sequence is: run an automated scan and fix everything it flags, then remediate keyboard and screen reader blockers found in manual testing, then close the remaining criterion-by-criterion gaps — highest-traffic templates first. Document progress as you go; demonstrated, ongoing remediation also reduces legal risk before you reach full conformance.",
  },
]

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "WCAG 2.2 AA Requirements",
    url: "https://accessibility.build/guides/wcag-2-2-aa-requirements",
  },
]

const levelBadgeClasses: Record<string, string> = {
  A: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  AA: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
}

const principleAccent: Record<string, string> = {
  "1. Perceivable": "border-l-blue-500",
  "2. Operable": "border-l-emerald-500",
  "3. Understandable": "border-l-amber-500",
  "4. Robust": "border-l-purple-500",
}

export default function Wcag22AaRequirementsPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ArticleStructuredData
        headline={pageTitle}
        description={pageDescription}
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-09"
        dateModified="2026-07-09"
        image={`https://accessibility.build/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`}
        url="https://accessibility.build/guides/wcag-2-2-aa-requirements"
        wordCount={3200}
        keywords={[
          "WCAG 2.2 AA requirements",
          "WCAG 2.2 AA checklist",
          "Level AA success criteria",
          "WCAG 2.2 conformance",
        ]}
      />
      <FAQStructuredData faqs={faqs} />
      <ChecklistStructuredData
        name="WCAG 2.2 Level AA Requirements"
        description={`All ${totalCount} success criteria (Level A and AA) required for WCAG 2.2 Level AA conformance.`}
        url="https://accessibility.build/guides/wcag-2-2-aa-requirements"
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        datePublished="2026-07-09"
        dateModified="2026-07-09"
        itemListElement={aaScopeCriteria.map((criterion, index) => ({
          name: `${criterion.number} ${criterion.title} (Level ${criterion.level})`,
          description: criterion.description,
          position: index + 1,
        }))}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/" className="hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <Link href="/guides" className="hover:text-blue-600 transition-colors">
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    WCAG 2.2 AA Requirements
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 text-xs font-semibold uppercase tracking-wide mb-5">
              <span aria-hidden="true">●</span>
              WCAG Reference
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              WCAG 2.2 Level AA Requirements: The Complete List
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              &ldquo;WCAG 2.2 AA conformance&rdquo; means satisfying{" "}
              <strong>
                all {totalCount} Level A and Level AA success criteria
              </strong>{" "}
              — {levelACount} at Level A plus {levelAACount} at Level AA — on
              every page you claim conformance for. This page lists every one of
              them, grouped by the four POUR principles, with each requirement
              linking to a full reference page with examples and testing steps.
            </p>
          </header>

          {/* At-a-glance stats */}
          <section aria-label="WCAG 2.2 AA at a glance" className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Criteria required for AA
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {levelACount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Level A criteria
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {levelAACount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Level AA criteria
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {NEW_IN_2_2.size}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                New in WCAG 2.2
              </p>
            </div>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>What &ldquo;WCAG 2.2 AA conformance&rdquo; means</h2>
            <p>
              WCAG organizes its requirements into three cumulative conformance
              levels. <strong>Level A</strong> covers the most basic barriers —
              things like text alternatives for images and keyboard
              operability. <strong>Level AA</strong> adds the requirements that
              make content usable in practice: sufficient color contrast, text
              resizing, visible focus, consistent navigation, and error
              recovery. <strong>Level AAA</strong> is the enhanced tier, which
              even the W3C does not recommend requiring for entire sites.
            </p>
            <p>
              The levels nest: a Level AA conformance claim requires passing{" "}
              <em>every</em> Level A criterion and <em>every</em> Level AA
              criterion. In WCAG 2.2 that is {levelACount} + {levelAACount} ={" "}
              {totalCount} success criteria. The {NEW_IN_2_2.size} criteria
              marked <strong>New in 2.2</strong> below were added in the October
              2023 release — if you previously met WCAG 2.1 AA, those are your
              entire gap (see our{" "}
              <Link href="/guides/wcag-2-1-vs-2-2">
                WCAG 2.1 vs 2.2 comparison
              </Link>{" "}
              for the details).
            </p>
            <p>
              Conformance is assessed per page: a single failing criterion
              anywhere on a page means that page does not conform. The
              requirements below are grouped by WCAG&apos;s four founding
              principles — Perceivable, Operable, Understandable, Robust
              (POUR). Every criterion links to its entry in our{" "}
              <Link href="/wcag">WCAG 2.2 reference hub</Link>.
            </p>
          </section>

          {/* The complete checklist, generated from lib/wcag-data.ts */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
              The complete WCAG 2.2 AA requirements checklist
            </h2>

            <div className="space-y-12">
              {principleGroups.map((group) => (
                <section key={group.principle} aria-labelledby={`principle-${group.principle.charAt(0)}`}>
                  <div
                    className={`border-l-4 ${principleAccent[group.principle] ?? "border-l-blue-500"} pl-4 mb-6`}
                  >
                    <h3
                      id={`principle-${group.principle.charAt(0)}`}
                      className="text-2xl font-bold text-slate-900 dark:text-white"
                    >
                      {group.principle}{" "}
                      <span className="text-base font-medium text-slate-500 dark:text-slate-400">
                        ({group.criteria.length} criteria)
                      </span>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                      {principleIntros[group.principle]}
                    </p>
                  </div>

                  <div className="space-y-8">
                    {group.guidelines.map((guidelineGroup) => (
                      <div key={guidelineGroup.guideline}>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                          Guideline {guidelineGroup.guideline}
                        </h4>
                        <ul className="space-y-3 list-none pl-0">
                          {guidelineGroup.criteria.map((criterion) => (
                            <li
                              key={criterion.number}
                              className="rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                            >
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <Link
                                  href={`/wcag/${slugFor(criterion.number)}`}
                                  className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                  {criterion.number} {criterion.title}
                                </Link>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-semibold ${levelBadgeClasses[criterion.level]}`}
                                >
                                  Level {criterion.level}
                                </span>
                                {NEW_IN_2_2.has(criterion.number) && (
                                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                    New in 2.2
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {criterion.description}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>Why Level AA is the legal standard</h2>
            <p>
              Regulators around the world have converged on Level AA as the
              enforceable benchmark, because Level A alone leaves obvious
              barriers (it does not even require minimum color contrast) while
              Level AAA is not achievable for all content:
            </p>
            <ul>
              <li>
                <strong>ADA Title II (U.S. public sector):</strong> the
                Department of Justice rule requires state and local government
                web content to meet WCAG 2.1 AA — see our{" "}
                <Link href="/guides/doj-title-ii-deadline-extension">
                  Title II deadline analysis
                </Link>
                .
              </li>
              <li>
                <strong>ADA Title III (U.S. private sector):</strong> no formal
                regulation names a standard, but WCAG AA is the benchmark in
                virtually every settlement and consent decree, and thousands of
                lawsuits are filed each year — tracked in our{" "}
                <Link href="/research/accessibility-lawsuits">
                  accessibility lawsuit database
                </Link>
                .
              </li>
              <li>
                <strong>Section 508 (U.S. federal):</strong> requires WCAG 2.0
                AA for federal agencies and their procurement.
              </li>
              <li>
                <strong>European Accessibility Act / EN 301 549 (EU):</strong>{" "}
                the harmonized standard maps to WCAG 2.1 AA and applies to
                private-sector products and services sold in the EU.
              </li>
            </ul>
            <p>
              All of these cite WCAG 2.0 or 2.1 today, and WCAG 2.2 AA
              conformance satisfies them all — WCAG versions are backwards
              compatible, so meeting the 2.2 AA list above automatically meets
              the older references. Meeting WCAG 2.2 AA is therefore the single
              target that covers current U.S. and EU obligations and the ones
              coming next. (The next generation,{" "}
              <Link href="/wcag-3">WCAG 3.0</Link>, is still years away and will
              not change this picture soon.)
            </p>

            <h2>How to verify WCAG 2.2 AA conformance</h2>
            <p>
              No single method covers all {totalCount} criteria. A credible
              verification process layers three approaches:
            </p>
            <ol>
              <li>
                <strong>Automated scanning.</strong> Tools catch the
                machine-detectable failures — missing alt text, low contrast,
                unlabeled fields, empty links — quickly and repeatably, but
                they can only detect a minority of WCAG issues. Start with our{" "}
                <Link href="/tools/url-accessibility-auditor">
                  URL accessibility auditor
                </Link>{" "}
                and the rest of our <Link href="/tools">free tools</Link>,
                including the{" "}
                <Link href="/tools/contrast-checker">contrast checker</Link> for
                1.4.3 and 1.4.11.
              </li>
              <li>
                <strong>Manual, criterion-by-criterion testing.</strong>{" "}
                Keyboard-only navigation, screen reader passes, 200% zoom and
                reflow checks, and focus-order review cover what automation
                cannot. Work through the{" "}
                <Link href="/checklists/wcag-2-2">
                  interactive WCAG 2.2 checklist
                </Link>{" "}
                so every criterion gets an explicit pass/fail, and use our{" "}
                <Link href="/guides/keyboard-accessibility">
                  keyboard accessibility
                </Link>{" "}
                and{" "}
                <Link href="/guides/screen-reader-testing">
                  screen reader testing
                </Link>{" "}
                guides for the manual techniques.
              </li>
              <li>
                <strong>Professional audit.</strong> When conformance carries
                legal or contractual weight — a VPAT/ACR, procurement
                requirement, or litigation exposure — have experts test
                representative pages against all {totalCount} criteria and
                document the evidence. Our{" "}
                <Link href="/services/accessibility-audits">
                  accessibility audit service
                </Link>{" "}
                delivers exactly that, with prioritized remediation guidance.
              </li>
            </ol>
            <p>
              Then keep it conformant: re-scan on every release, include
              accessibility checks in code review and QA, and re-audit after
              major redesigns. Conformance is a property of the current state
              of a page, not a one-time certificate.
            </p>
          </section>

          {/* CTA */}
          <section className="mb-16">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Start checking your site against all {totalCount} criteria
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Scan for the machine-detectable failures first, then track your
                manual review in the interactive checklist.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/checklists/wcag-2-2"
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  WCAG 2.2 Checklist
                </Link>
                <Link
                  href="/tools/url-accessibility-auditor"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Scan Your Site
                </Link>
                <Link
                  href="/services/accessibility-audits"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Get a Professional Audit
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
                >
                  <summary className="cursor-pointer text-lg font-semibold text-slate-900 dark:text-white list-none flex justify-between items-start gap-4">
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0"
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </article>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="WCAG 2.2 AA requirements checklist conformance success criteria level A level AA POUR perceivable operable understandable robust compliance audit legal standard"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
