import { Download, FileJson, Table2 } from "lucide-react"
import { DatasetStructuredData } from "@/components/seo/structured-data"

// The "get the data" block for a research page: CSV and JSON links to the
// /api/research endpoint, the licence, and a Dataset schema for the same
// URLs. Kept as one component so every dataset page exposes its numbers the
// same way and none of them forgets the schema.

export interface DatasetTable {
  key: string
  label: string
}

export function DatasetDownloads({
  dataset,
  name,
  description,
  pageUrl,
  datePublished,
  dateModified,
  temporalCoverage,
  keywords,
  tables,
  attribution,
  withSchema = true,
}: {
  /** The /api/research/<dataset> id. */
  dataset: string
  name: string
  description: string
  pageUrl: string
  datePublished: string
  dateModified: string
  temporalCoverage?: string
  keywords?: string[]
  tables: DatasetTable[]
  /** Who the underlying numbers come from, e.g. "Seyfarth Shaw; UsableNet". */
  attribution: string
  /** Pages that already emit a Dataset schema pass false to avoid a duplicate entity. */
  withSchema?: boolean
}) {
  const base = `/api/research/${dataset}`
  return (
    <section
      aria-labelledby={`dataset-${dataset}-heading`}
      className="not-prose my-10 rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50 sm:p-6"
    >
      {withSchema ? (
      <DatasetStructuredData
        name={name}
        description={description}
        url={pageUrl}
        datePublished={datePublished}
        dateModified={dateModified}
        temporalCoverage={temporalCoverage}
        keywords={keywords}
        creator={{ name: "Accessibility.build", url: "https://accessibility.build" }}
      />
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[60ch]">
          <h2
            id={`dataset-${dataset}-heading`}
            className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Get the data
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Every number on this page is available as CSV and JSON under a CC BY 4.0 licence. Cite
            Accessibility.build and the underlying sources ({attribution}). Last updated{" "}
            <time dateTime={dateModified}>{formatDate(dateModified)}</time>.
          </p>
        </div>
        <a
          href={base}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
        >
          <FileJson className="h-4 w-4" aria-hidden="true" />
          Whole dataset (JSON)
        </a>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {tables.map((t) => (
          <li
            key={t.key}
            className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Table2 className="h-4 w-4 text-slate-500" aria-hidden="true" />
              {t.label}
            </span>
            <span className="flex gap-3">
              <a
                href={`${base}?table=${t.key}&format=csv`}
                className="font-medium text-teal-700 underline decoration-teal-700/40 underline-offset-2 hover:decoration-teal-700 dark:text-teal-300"
              >
                CSV<span className="sr-only">, {t.label}</span>
              </a>
              <a
                href={`${base}?table=${t.key}`}
                className="font-medium text-teal-700 underline decoration-teal-700/40 underline-offset-2 hover:decoration-teal-700 dark:text-teal-300"
              >
                JSON<span className="sr-only">, {t.label}</span>
              </a>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}
