"use client"

import type { ReactNode } from "react"
import { AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Summaries, Summary, SummaryRow } from "@/lib/screen-reader/types"
import { cn } from "@/lib/utils"

// The six lists a screen reader user pulls up to get around a page, as tables with the problems
// counted in each tab's name, so the count is read before the tab is opened.

interface Column {
  header: string
  cell: (row: SummaryRow) => ReactNode
}

function nameCell(row: SummaryRow): ReactNode {
  return row.name ? row.name : <span className="italic text-slate-600 dark:text-slate-400">No name</span>
}

const SECTIONS: { key: keyof Summaries; label: string; noun: [string, string]; caption: string; columns: Column[] }[] = [
  {
    key: "headings",
    label: "Headings",
    noun: ["heading", "headings"],
    caption: "Headings in page order, with their level",
    columns: [
      { header: "Level", cell: (row) => row.label },
      { header: "Heading", cell: nameCell },
    ],
  },
  {
    key: "landmarks",
    label: "Landmarks",
    noun: ["landmark", "landmarks"],
    caption: "Landmarks in page order",
    columns: [
      { header: "Landmark", cell: (row) => row.label },
      { header: "Name", cell: (row) => row.name || <span className="text-slate-600 dark:text-slate-400">None</span> },
    ],
  },
  {
    key: "links",
    label: "Links",
    noun: ["link", "links"],
    caption: "Links in page order, with where each one goes",
    columns: [
      { header: "Link text", cell: nameCell },
      { header: "Goes to", cell: (row) => <span className="break-all">{row.detail ?? ""}</span> },
    ],
  },
  {
    key: "fields",
    label: "Form fields",
    noun: ["form field", "form fields"],
    caption: "Form fields in page order, with their type and states",
    columns: [
      { header: "Type", cell: (row) => row.label },
      { header: "Name", cell: nameCell },
      { header: "Value and states", cell: (row) => row.detail ?? "" },
    ],
  },
  {
    key: "images",
    label: "Images",
    noun: ["image", "images"],
    caption: "Images exposed to screen readers, with their text alternatives",
    columns: [
      { header: "Type", cell: (row) => row.label },
      { header: "Text alternative", cell: (row) => row.name || <span className="italic text-slate-600 dark:text-slate-400">None</span> },
      { header: "Details", cell: (row) => <span className="break-all">{row.detail ?? ""}</span> },
    ],
  },
  {
    key: "buttons",
    label: "Buttons",
    noun: ["button", "buttons"],
    caption: "Buttons in page order, with their states",
    columns: [
      { header: "Type", cell: (row) => row.label },
      { header: "Name", cell: nameCell },
      { header: "States", cell: (row) => row.detail ?? "" },
    ],
  },
]

function clipLabel(text: string): string {
  return text.length > 60 ? `${text.slice(0, 59).trimEnd()}…` : text
}

function problemsText(count: number): string {
  return count === 0 ? "no problems" : `${count} ${count === 1 ? "problem" : "problems"}`
}

function SummaryTable({ summary, noun, caption, columns, onShowLine }: { summary: Summary; noun: [string, string]; caption: string; columns: Column[]; onShowLine: (line: number) => void }) {
  const flaggedRows = summary.rows.filter((row) => row.issue).length
  const flaggedTotal = summary.problems - summary.notes.filter((note) => note.problem).length

  return (
    <div className="space-y-4">
      <p className="text-slate-700 dark:text-slate-300">
        {summary.total} {summary.total === 1 ? noun[0] : noun[1]} found, {problemsText(summary.problems)}.
      </p>

      {summary.notes.length > 0 && (
        <ul className="space-y-2">
          {summary.notes.map((note) => (
            <li
              key={note.text}
              className={cn(
                "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
                note.problem
                  ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                  : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
              )}
            >
              {note.problem ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              <span>
                <span className="font-semibold">{note.problem ? "Problem: " : "Note: "}</span>
                {note.text}
              </span>
            </li>
          ))}
        </ul>
      )}

      {summary.rows.length < summary.total && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing {summary.rows.length} of {summary.total}.{" "}
          {flaggedRows === flaggedTotal ? "Every one with a problem is included." : `${flaggedRows} of the ${flaggedTotal} with problems are included.`}
        </p>
      )}

      {summary.rows.length > 0 && (
        // relative: keeps the sr-only text inside the scroll box, so it cannot widen the page.
        <div
          className="relative max-h-[32rem] overflow-auto rounded-lg border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-800"
          role="region"
          aria-label={caption}
          tabIndex={0}
        >
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900">
              <tr>
                {[...columns.map((column) => column.header), "Problem", "Transcript"].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:text-slate-400"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-slate-800 dark:text-slate-200">
              {summary.rows.map((row, index) => (
                <tr key={`${index}-${row.line ?? "x"}`} className="align-top">
                  {columns.map((column, columnIndex) => (
                    <td key={column.header} className={cn("border-b border-slate-100 px-3 py-2 dark:border-slate-800", columnIndex === 0 && "font-medium")}>
                      {column.cell(row)}
                    </td>
                  ))}
                  <td className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                    {row.issue ? (
                      <span className="flex items-start gap-1.5 text-red-700 dark:text-red-300">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        {row.issue}
                      </span>
                    ) : (
                      <span className="text-slate-600 dark:text-slate-400">None</span>
                    )}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                    {row.issue && row.line !== undefined ? (
                      <button
                        type="button"
                        onClick={() => onShowLine(row.line as number)}
                        className="whitespace-nowrap rounded font-medium text-teal-800 underline underline-offset-2 hover:text-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-teal-300 dark:hover:text-teal-200"
                      >
                        Show in transcript<span className="sr-only">: line {row.line + 1}, {clipLabel(row.name || "no name")}</span>
                      </button>
                    ) : row.line !== undefined ? (
                      <span className="text-slate-600 dark:text-slate-400">Line {row.line + 1}</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function SummaryTabs({ summaries, onShowLine }: { summaries: Summaries; onShowLine: (line: number) => void }) {
  return (
    <Tabs defaultValue="headings">
      <TabsList className="flex h-auto flex-wrap justify-start gap-1 bg-slate-100 p-1 dark:bg-slate-800">
        {SECTIONS.map((section) => {
          const problems = summaries[section.key].problems
          return (
            <TabsTrigger
              key={section.key}
              value={section.key}
              className="gap-1.5 text-slate-700 focus-visible:ring-teal-600 data-[state=active]:text-slate-900 dark:text-slate-300 dark:data-[state=active]:bg-slate-950 dark:data-[state=active]:text-white"
            >
              {problems > 0 ? (
                <AlertTriangle className="h-4 w-4 text-red-700 dark:text-red-300" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-teal-700 dark:text-teal-300" aria-hidden="true" />
              )}
              {section.label}
              <span className="font-normal">({problemsText(problems)})</span>
            </TabsTrigger>
          )
        })}
      </TabsList>
      {SECTIONS.map((section) => (
        <TabsContent key={section.key} value={section.key} className="mt-4 focus-visible:ring-teal-600">
          <SummaryTable summary={summaries[section.key]} noun={section.noun} caption={section.caption} columns={section.columns} onShowLine={onShowLine} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
