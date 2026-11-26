import Link from "next/link"
import { Download } from "lucide-react"
import { formatCertificateDate } from "@/lib/courses/certificate-rules"
import type { TeamReportRow } from "@/lib/courses/team-report-model"

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950"
const link = `rounded font-semibold text-blue-700 underline underline-offset-2 hover:decoration-2 dark:text-blue-300 ${ring}`

function examText(row: TeamReportRow) {
  if (!row.joined) return "Not started"
  return row.examPassedAt ? `Passed on ${formatCertificateDate(row.examPassedAt)}` : "Not passed yet"
}

function Certificate({ row }: { row: TeamReportRow }) {
  const cert = row.certificate
  if (!cert) return <>None yet</>
  const state = cert.state === "valid" ? (cert.expiresAt ? `valid until ${formatCertificateDate(cert.expiresAt)}` : "valid") : cert.state
  return <><Link href={`/certificates/${cert.code}`} className={link}>{cert.code}</Link>, {state}</>
}

/** What a Team licence owner sees about each seat: completion only, never notes, answers or scores. */
export function TeamProgress({ slug, licenceId, rows, withExam }: { slug: string; licenceId: string; rows: TeamReportRow[]; withExam: boolean }) {
  const id = `team-progress-${licenceId.slice(0, 8)}`
  const count = (done: number, total: number, joined: boolean) => (joined ? `${done} of ${total}` : "Not started")
  return (
    <section aria-labelledby={id} className="mt-10 min-w-0">
      <h2 id={id} className="text-xl font-semibold text-slate-900 dark:text-white">Team progress</h2>
      <p className="mt-2 max-w-3xl text-slate-700 dark:text-slate-300">
        A training record for your team: which lessons and activities each person has completed{withExam ? ", whether they have passed the final exam, and their certificate" : ""}. Notes, answers and exam scores stay private to each person.
      </p>

      {/* Small screens: one card per person, so nothing scrolls sideways. */}
      <ul role="list" className="mt-4 space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={row.email} className="rounded-lg border border-slate-300 p-4 dark:border-slate-700">
            <p className="break-all font-semibold text-slate-900 dark:text-white">{row.email}</p>
            <dl className="mt-2 space-y-2 text-base">
              <div><dt className="text-sm font-semibold text-slate-600 dark:text-slate-400">Lessons</dt><dd>{count(row.lessonsDone, row.lessonsTotal, row.joined)}</dd></div>
              <div><dt className="text-sm font-semibold text-slate-600 dark:text-slate-400">Activities</dt><dd>{count(row.activitiesDone, row.activitiesTotal, row.joined)}</dd></div>
              {withExam ? <div><dt className="text-sm font-semibold text-slate-600 dark:text-slate-400">Final exam</dt><dd>{examText(row)}</dd></div> : null}
              {withExam ? <div><dt className="text-sm font-semibold text-slate-600 dark:text-slate-400">Certificate</dt><dd><Certificate row={row} /></dd></div> : null}
            </dl>
          </li>
        ))}
      </ul>

      <div role="region" aria-labelledby={`${id}-cap`} tabIndex={0} className={`relative mt-4 hidden overflow-x-auto rounded-lg border border-slate-300 dark:border-slate-700 md:block ${ring}`}>
        <table className="w-full text-left text-sm">
          <caption id={`${id}-cap`} className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-white">Completion by team member</caption>
          <thead className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white">
            <tr>
              <th scope="col" className="border-t border-slate-300 p-3 dark:border-slate-700">Team member</th>
              <th scope="col" className="border-t border-slate-300 p-3 dark:border-slate-700">Lessons</th>
              <th scope="col" className="border-t border-slate-300 p-3 dark:border-slate-700">Activities</th>
              {withExam ? <th scope="col" className="border-t border-slate-300 p-3 dark:border-slate-700">Final exam</th> : null}
              {withExam ? <th scope="col" className="border-t border-slate-300 p-3 dark:border-slate-700">Certificate</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.email} className="border-t border-slate-200 align-top dark:border-slate-800">
                <th scope="row" className="break-all p-3 font-semibold text-slate-900 dark:text-white">{row.email}</th>
                <td className="p-3">{count(row.lessonsDone, row.lessonsTotal, row.joined)}</td>
                <td className="p-3">{count(row.activitiesDone, row.activitiesTotal, row.joined)}</td>
                {withExam ? <td className="p-3">{examText(row)}</td> : null}
                {withExam ? <td className="p-3"><Certificate row={row} /></td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <a href={`/api/courses/${slug}/team-report?licence=${encodeURIComponent(licenceId)}`} download className={`mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 ${ring}`}>
        <Download aria-hidden="true" focusable="false" className="h-4 w-4" />Download team progress (CSV)
      </a>
    </section>
  )
}
