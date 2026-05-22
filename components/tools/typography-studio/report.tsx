"use client"

import { AlertCircle, AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react"
import type { TypographyReport, Verdict } from "@/lib/typography/grade"

const VERDICT_TONE: Record<Verdict, { bg: string; fg: string; icon: React.ComponentType<{ className?: string }> }> = {
  pass: { bg: "bg-emerald-100 dark:bg-emerald-950", fg: "text-emerald-700 dark:text-emerald-300", icon: CheckCircle2 },
  caution: { bg: "bg-amber-100 dark:bg-amber-950", fg: "text-amber-700 dark:text-amber-300", icon: AlertTriangle },
  fail: { bg: "bg-rose-100 dark:bg-rose-950", fg: "text-rose-700 dark:text-rose-300", icon: AlertCircle },
}

export function TypographyReportCard({ report }: { report: TypographyReport }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Pill label="Pass" value={report.summary.pass} verdict="pass" />
        <Pill label="Caution" value={report.summary.caution} verdict="caution" />
        <Pill label="Fail" value={report.summary.fail} verdict="fail" />
      </div>

      <ul className="space-y-2">
        {report.checks.map((c) => {
          const tone = VERDICT_TONE[c.verdict]
          const Icon = tone.icon
          return (
            <li
              key={c.id}
              className={`flex items-start gap-3 rounded-lg border p-3 ${tone.bg}`}
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone.fg}`} />
              <div className="flex-1">
                <p className="text-sm font-semibold">{c.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.detail}</p>
              </div>
              {c.scId && c.scUrl && (
                <a
                  href={c.scUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-[10px] font-medium hover:bg-muted"
                  title={`WCAG ${c.scId}`}
                >
                  {c.scId}
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </li>
          )
        })}
      </ul>

      {report.contrasts.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold">Per-role contrast against page background</h4>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Role</th>
                  <th className="px-3 py-2 text-right">WCAG</th>
                  <th className="px-3 py-2 text-right">APCA Lc</th>
                  <th className="px-3 py-2 text-right">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {report.contrasts.map((c, i) => {
                  const verdict: Verdict =
                    c.wcag.pass && c.apca.pass ? "pass" : c.wcag.pass || c.apca.pass ? "caution" : "fail"
                  const tone = VERDICT_TONE[verdict]
                  const Icon = tone.icon
                  return (
                    <tr key={c.role} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                      <td className="px-3 py-2 capitalize">{c.role}</td>
                      <td className="px-3 py-2 text-right font-mono">{c.wcag.ratio.toFixed(2)}:1</td>
                      <td className="px-3 py-2 text-right font-mono">{Math.round(Math.abs(c.apca.lc))}</td>
                      <td className="px-3 py-2 text-right">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${tone.bg} ${tone.fg}`}
                        >
                          <Icon className="h-3 w-3" />
                          {verdict}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function Pill({ label, value, verdict }: { label: string; value: number; verdict: Verdict }) {
  const tone = VERDICT_TONE[verdict]
  return (
    <div className={`rounded-lg border p-3 ${tone.bg}`}>
      <p className={`text-xs uppercase tracking-wide ${tone.fg}`}>{label}</p>
      <p className={`mt-0.5 text-2xl font-bold ${tone.fg}`}>{value}</p>
    </div>
  )
}
