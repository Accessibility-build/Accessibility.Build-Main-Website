import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getWCAGStats, wcagCriteria, type SuccessCriterion } from "@/lib/wcag-data"
import { WcagCriteriaChecklist, type PrincipleGroup } from "@/components/checklists/wcag-criteria-checklist"

const stats = getWCAGStats()

export const metadata: Metadata = {
  title: "Interactive WCAG Checklist",
  description: `A self-assessment checklist of all ${stats.total} WCAG 2.2 success criteria grouped by principle, with a link to each criterion and progress saved in your browser.`,
  keywords: "interactive checklist, WCAG, accessibility compliance, web accessibility audit",
  alternates: { canonical: "/checklists/interactive" },
}

// Group the canonical criteria list by principle, then guideline, preserving
// spec order. Built once at module load; the data is static.
function groupByPrinciple(criteria: SuccessCriterion[]): PrincipleGroup[] {
  const principles: PrincipleGroup[] = []
  for (const criterion of criteria) {
    let principle = principles.find((p) => p.principle === criterion.principle)
    if (!principle) {
      principle = { principle: criterion.principle, guidelines: [] }
      principles.push(principle)
    }
    let guideline = principle.guidelines.find((g) => g.guideline === criterion.guideline)
    if (!guideline) {
      guideline = { guideline: criterion.guideline, criteria: [] }
      principle.guidelines.push(guideline)
    }
    guideline.criteria.push(criterion)
  }
  return principles
}

const groups = groupByPrinciple(wcagCriteria)

export default function InteractiveChecklistPage() {
  return (
    <div className="container-wide py-12">
      <div className="mb-10">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/checklists">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checklists
          </Link>
        </Button>

        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-bold">Interactive WCAG Checklist</h1>
          <p className="text-xl text-muted-foreground">
            All {stats.total} WCAG 2.2 success criteria in one list, grouped by
            principle and guideline, with a checkbox for each and a link to the
            page explaining how to meet it.
          </p>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="how-to-use" className="max-w-3xl space-y-4">
            <h2 id="how-to-use" className="text-2xl font-bold">
              How to Use This Checklist
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Work through it page by page rather than criterion by criterion.
              Pick a representative sample of your site, then for each page test
              every criterion that applies and tick it here only when you have
              verified it, not when you believe it is probably fine. Each
              criterion links to its own page with the requirement, common
              failures, and testing steps. Ticks are saved in this browser and
              shared with the{" "}
              <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                full WCAG 2.2 checklist
              </Link>
              , which adds notes, filtering by level, and Excel and PDF export
              for reporting.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The {stats.byLevel.A} Level A and {stats.byLevel.AA} Level AA
              criteria together make up the target that most laws, procurement
              rules, and the European standard EN 301 549 reference. The{" "}
              {stats.byLevel.AAA} Level AAA criteria are optional extras; check
              them where they are achievable for your content, but do not
              treat them as a bar you must clear. WCAG 2.2 also retired 4.1.1
              Parsing, so it does not appear below.
            </p>
            <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                What this checklist is not
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                It is a self-assessment aid, not a conformance claim and not a
                test. Nothing on this page examines your site; every tick
                records your own judgement. A defensible conformance claim
                needs a defined scope, a page sample, manual testing with a
                keyboard and a screen reader alongside automated scans, and a
                record of what failed. The{" "}
                <Link href="/guides/how-to-audit-website-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  audit guide
                </Link>{" "}
                walks through that process, and the{" "}
                <Link href="/tools/accessibility-statement-generator" className="text-blue-600 dark:text-blue-400 hover:underline">
                  statement generator
                </Link>{" "}
                helps you publish the result with honest partial-conformance
                wording rather than an overclaim.
              </p>
            </div>
          </section>

          <WcagCriteriaChecklist groups={groups} total={stats.total} />
        </div>

        <aside aria-label="Checklist summary" className="lg:sticky lg:top-24 lg:self-start space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Criteria by level</h2>
            <dl className="grid grid-cols-3 gap-3 text-center">
              <div>
                <dt className="text-xs text-slate-600 dark:text-slate-400">Level A</dt>
                <dd className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.byLevel.A}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-600 dark:text-slate-400">Level AA</dt>
                <dd className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.byLevel.AA}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-600 dark:text-slate-400">Level AAA</dt>
                <dd className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.byLevel.AAA}</dd>
              </div>
            </dl>
          </div>

          <nav aria-label="Jump to principle" className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Jump to</h2>
            <ul className="space-y-2 text-sm">
              {groups.map((group) => (
                <li key={group.principle}>
                  <a href={`#principle-${group.principle.charAt(0)}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {group.principle}
                  </a>
                  <span className="text-slate-500 dark:text-slate-400"> ({stats.byPrinciple[group.principle]})</span>
                </li>
              ))}
            </ul>
          </nav>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 text-sm text-muted-foreground space-y-3">
            <p>
              Need the same list as a spreadsheet, or want to add notes per
              criterion? Use the{" "}
              <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                full WCAG 2.2 checklist
              </Link>
              .
            </p>
            <p>
              Auditing against the European standard? See the{" "}
              <Link href="/checklists/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                EN 301 549 checklist
              </Link>
              .
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
