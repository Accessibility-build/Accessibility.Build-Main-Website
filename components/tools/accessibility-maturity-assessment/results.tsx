"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { FileSpreadsheet, FileText, Pencil, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DIMENSION_ROW_HEADER,
  dimensionRows,
  levelPosition,
  summaryLabel,
  type AssessmentState,
  type AssessmentSummary,
} from "@/lib/maturity/assessment"
import { DIMENSIONS, LEVELS, LEVEL_NAME, MATURITY_MODEL_SOURCE } from "@/lib/maturity/model"
import { cn } from "@/lib/utils"
import { SUMMARY_RULE, downloadExcel, downloadPdf } from "./exports"

interface ResultsProps {
  state: AssessmentState
  summary: AssessmentSummary
  headingRef: React.RefObject<HTMLHeadingElement | null>
  onEdit: (dimensionIndex: number) => void
  onStartOver: () => void
}

const LINK = "font-medium text-teal-800 underline underline-offset-2 hover:decoration-2 dark:text-teal-300"

export function MaturityResults({ state, summary, headingRef, onEdit, onStartOver }: ResultsProps) {
  const id = useId()
  const [exportStatus, setExportStatus] = useState("")
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null)
  const nothingRated = summary.dimensions.every((entry) => entry.level === null)
  const unsure = summary.dimensions.reduce((sum, entry) => sum + entry.unsure, 0)

  const runExport = async (kind: "excel" | "pdf") => {
    if (exporting) return
    setExporting(kind)
    setExportStatus(kind === "excel" ? "Preparing the Excel file." : "Preparing the PDF.")
    try {
      await (kind === "excel" ? downloadExcel(state, summary) : downloadPdf(state, summary))
      setExportStatus(kind === "excel" ? "Excel file downloaded." : "PDF downloaded.")
    } catch (error) {
      console.error("Maturity assessment export failed:", error)
      setExportStatus("The download failed. Please try again.")
    } finally {
      setExporting(null)
    }
  }

  return (
    <section aria-labelledby={`${id}-heading`}>
      <h2
        id={`${id}-heading`}
        ref={headingRef}
        tabIndex={-1}
        className="scroll-mt-28 rounded-sm font-serif text-2xl font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white"
      >
        Your results
      </h2>
      <p className="mt-2 max-w-[68ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
        {summary.answered} of {summary.total} proof points answered
        {state.organisation ? ` for ${state.organisation}` : ""}. {SUMMARY_RULE} &ldquo;Provisional&rdquo; means
        fewer than half of a dimension&apos;s proof points have a level.
      </p>

      {nothingRated ? (
        <p className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Rate at least one proof point on one of the four levels to see a summary. &ldquo;Not sure&rdquo; and
          &ldquo;Does not apply&rdquo; answers are not counted.
        </p>
      ) : (
        <>
          <figure aria-labelledby={`${id}-chart`} className="mt-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <figcaption id={`${id}-chart`} className="font-semibold text-slate-900 dark:text-white">
              Level by dimension, our summary
            </figcaption>
            <div aria-hidden="true" className="mt-4 hidden grid-cols-[13rem_minmax(0,1fr)_11rem] gap-3 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 md:grid">
              <span />
              <span className="grid grid-cols-4 gap-1">
                {LEVELS.map((level) => (
                  <span key={level.id}>{level.name}</span>
                ))}
              </span>
              <span />
            </div>
            <ul className="mt-3 space-y-4 md:space-y-2">
              {summary.dimensions.map((entry) => {
                const position = levelPosition(entry.level)
                return (
                  <li key={entry.dimension.id} className="grid items-center gap-1 md:grid-cols-[13rem_minmax(0,1fr)_11rem] md:gap-3">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{entry.dimension.name}</span>
                    <span aria-hidden="true" className="grid grid-cols-4 gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <span
                          key={step}
                          className={cn(
                            "h-4 rounded-sm border",
                            step <= position
                              ? "border-teal-700 bg-teal-700 dark:border-teal-400 dark:bg-teal-400"
                              : "border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-950",
                          )}
                        />
                      ))}
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{summaryLabel(entry)}</span>
                  </li>
                )
              })}
            </ul>
            <p className="mt-4 text-xs leading-5 text-slate-600 dark:text-slate-400">
              Each bar fills one block per level: Inactive, Launch, Integrate, Optimize. The table below has the
              same results with the number of answers at each level.
            </p>
          </figure>

          <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">Our summary level for each dimension and how many proof points you rated at each level</caption>
              <thead>
                <tr>
                  {DIMENSION_ROW_HEADER.map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="whitespace-nowrap border-b border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-700 dark:text-slate-300">
                {dimensionRows(summary).map(([name, ...cells]) => (
                  <tr key={name}>
                    <th scope="row" className="border-b border-slate-200 px-3 py-2 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">
                      {name}
                    </th>
                    {cells.map((cell, index) => (
                      <td key={index} className="whitespace-nowrap border-b border-slate-200 px-3 py-2 dark:border-slate-800">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-10 font-serif text-xl font-semibold text-slate-900 dark:text-white">Where to start</h3>
          {summary.weakest.length === 0 ? (
            <p className="mt-3 max-w-[68ch] leading-7 text-slate-700 dark:text-slate-300">
              Every dimension you rated summarises at Optimize. At this level the model asks you to keep evaluating
              and to act on what each assessment finds, so plan your next review.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {summary.weakest.map((entry) => {
                const index = DIMENSIONS.indexOf(entry.dimension)
                return (
                  <article key={entry.dimension.id} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {entry.dimension.name}: {summaryLabel(entry)}
                    </h4>
                    {entry.nextLevel && (
                      <p className="mt-2 leading-7 text-slate-700 dark:text-slate-300">
                        <span className="font-medium text-slate-900 dark:text-white">To reach {LEVEL_NAME[entry.nextLevel]}:</span>{" "}
                        {entry.dimension.levels[entry.nextLevel]}
                      </p>
                    )}
                    {entry.lowest.length > 0 && entry.level && (
                      <>
                        <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">
                          Start with the proof points you rated lowest:
                        </p>
                        <ul className="mt-1 list-disc space-y-1 pl-6 text-sm leading-6 text-slate-700 dark:text-slate-300">
                          {entry.lowest.map((point) => (
                            <li key={point.id}>{point.text}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => onEdit(index)}>
                      <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                      Review {entry.dimension.name} answers
                    </Button>
                  </article>
                )
              })}
            </div>
          )}
          {unsure > 0 && (
            <p className="mt-4 max-w-[68ch] text-sm leading-6 text-slate-700 dark:text-slate-300">
              You answered &ldquo;Not sure&rdquo; for {unsure} proof point{unsure === 1 ? "" : "s"}. Finding out who
              owns each one is a useful first step.
            </p>
          )}

          {summary.earlyStage && (
            <div className="mt-8 rounded-xl border-2 border-teal-700/30 bg-teal-50 p-5 dark:border-teal-400/30 dark:bg-teal-950/40">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Help for the early stages
              </h3>
              <p className="mt-2 max-w-[68ch] leading-7 text-slate-700 dark:text-slate-300">
                At least one dimension sits at Inactive or Launch. Two common first steps are finding out where your
                products stand today, and giving people the accessibility skills their role needs.
              </p>
              <ul className="mt-3 space-y-2 leading-7 text-slate-700 dark:text-slate-300">
                <li>
                  <Link href="/services/accessibility-audits" className={LINK}>
                    Accessibility audits
                  </Link>{" "}
                  against WCAG 2.2 AA, with a prioritised list of fixes.
                </li>
                <li>
                  <Link href="/services/accessibility-training" className={LINK}>
                    Accessibility training
                  </Link>{" "}
                  for designers, developers, content authors and testers.
                </li>
                <li>
                  <Link href="/contact" className={LINK}>
                    Talk to our team
                  </Link>{" "}
                  about where to begin.
                </li>
              </ul>
            </div>
          )}
        </>
      )}

      <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-semibold text-slate-900 dark:text-white">Download or start over</h3>
        <p className="mt-1 max-w-[68ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
          The Excel file has every proof point, your rating and your notes, and works with screen readers. The PDF
          is for printing and sharing; it is not a tagged PDF.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" onClick={() => runExport("excel")} aria-disabled={exporting !== null || undefined}>
            <FileSpreadsheet className="mr-2 h-4 w-4" aria-hidden="true" />
            Download Excel
          </Button>
          <Button type="button" variant="outline" onClick={() => runExport("pdf")} aria-disabled={exporting !== null || undefined}>
            <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
            Download PDF
          </Button>
          <Button type="button" variant="outline" onClick={onStartOver}>
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            Start over
          </Button>
        </div>
        <p role="status" aria-live="polite" className="mt-3 min-h-[1.25rem] text-sm text-slate-700 dark:text-slate-300">
          {exportStatus}
        </p>
        <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
          Based on the{" "}
          <a href={MATURITY_MODEL_SOURCE.versionUrl} className={LINK}>
            W3C {MATURITY_MODEL_SOURCE.title}
          </a>
          , {MATURITY_MODEL_SOURCE.status}, {MATURITY_MODEL_SOURCE.publishedLabel}.
        </p>
      </div>
    </section>
  )
}
