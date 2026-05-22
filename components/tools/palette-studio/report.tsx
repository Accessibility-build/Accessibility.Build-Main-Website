"use client"

import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react"
import type { GradedPairing, PaletteReport } from "@/lib/color/grade"
import type { SemanticTokens } from "@/lib/color/tokens"

type ContrastModel = "wcag" | "apca" | "both"

interface ReportCardProps {
  report: PaletteReport
  tokens: SemanticTokens
  contrastModel: ContrastModel
}

function rowVerdict(p: GradedPairing, contrastModel: ContrastModel): "pass" | "caution" | "fail" {
  const wcagOk = p.wcag.pass
  const apcaOk = p.apca.level === "Pass"
  if (contrastModel === "wcag") return wcagOk ? "pass" : p.wcag.ratio >= 3 ? "caution" : "fail"
  if (contrastModel === "apca") return apcaOk ? "pass" : p.apca.level === "Use Caution" ? "caution" : "fail"
  if (wcagOk && apcaOk) return "pass"
  if (wcagOk || apcaOk) return "caution"
  return "fail"
}

const VERDICT_COLORS = (
  v: "pass" | "caution" | "fail",
  t: SemanticTokens
): { fg: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> } => {
  if (v === "pass") return { fg: t.success, bg: t.successSurface, border: t.success, icon: CheckCircle2 }
  if (v === "caution") return { fg: t.warning, bg: t.warningSurface, border: t.warning, icon: AlertTriangle }
  return { fg: t.danger, bg: t.dangerSurface, border: t.danger, icon: AlertCircle }
}

const GROUP_ORDER: GradedPairing["group"][] = ["text", "button", "link", "focus", "border", "alert"]
const GROUP_LABELS: Record<GradedPairing["group"], string> = {
  text: "Text",
  button: "Buttons",
  link: "Links",
  focus: "Focus indicators",
  border: "Borders",
  alert: "Alerts & status",
}

function SummaryCard({
  label,
  value,
  color,
  surface,
}: {
  label: string
  value: number
  color: string
  surface: string
}) {
  return (
    <div className="rounded-lg border p-3" style={{ borderColor: color, backgroundColor: surface }}>
      <p className="text-xs uppercase tracking-wide" style={{ color }}>{label}</p>
      <p className="mt-0.5 text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  )
}

export function ReportCard({ report, tokens, contrastModel }: ReportCardProps) {
  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: report.pairings.filter((p) => p.group === group),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Pass" value={report.summary.pass} color={tokens.success} surface={tokens.successSurface} />
        <SummaryCard label="Caution" value={report.summary.caution} color={tokens.warning} surface={tokens.warningSurface} />
        <SummaryCard label="Fail" value={report.summary.fail} color={tokens.danger} surface={tokens.dangerSurface} />
      </div>

      {/* Grouped table */}
      <div className="space-y-4">
        {grouped.map(({ group, items }) => (
          <div key={group}>
            <h4 className="mb-2 text-sm font-semibold">{GROUP_LABELS[group]}</h4>
            <div className="overflow-hidden rounded-lg border" style={{ borderColor: tokens.border }}>
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: tokens.surface }}>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase" style={{ color: tokens.muted }}>Pairing</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase" style={{ color: tokens.muted }}>State</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold uppercase" style={{ color: tokens.muted }}>WCAG</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold uppercase" style={{ color: tokens.muted }}>APCA Lc</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold uppercase" style={{ color: tokens.muted }}>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p, i) => {
                    const v = rowVerdict(p, contrastModel)
                    const { fg, bg, icon: Icon } = VERDICT_COLORS(v, tokens)
                    return (
                      <tr
                        key={p.id}
                        style={{
                          backgroundColor: i % 2 === 0 ? tokens.background : tokens.surface,
                          borderTop: `1px solid ${tokens.border}`,
                        }}
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <span
                                className="inline-block h-4 w-4 rounded border"
                                style={{ backgroundColor: p.bg, borderColor: tokens.border }}
                                aria-hidden="true"
                              />
                              <span
                                className="inline-block h-4 w-4 rounded border"
                                style={{ backgroundColor: p.fg, borderColor: tokens.border }}
                                aria-hidden="true"
                              />
                            </span>
                            <span>{p.label}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 capitalize" style={{ color: tokens.muted }}>{p.state}</td>
                        <td className="px-3 py-2 text-right font-mono">
                          <span style={{ color: p.wcag.pass ? tokens.success : tokens.danger }}>
                            {p.wcag.ratio.toFixed(2)}:1
                          </span>
                          <span className="ml-1 text-xs" style={{ color: tokens.muted }}>{p.wcag.level}</span>
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          <span
                            style={{
                              color:
                                p.apca.level === "Pass"
                                  ? tokens.success
                                  : p.apca.level === "Use Caution"
                                  ? tokens.warning
                                  : tokens.danger,
                            }}
                          >
                            {Math.round(Math.abs(p.apca.lc))}
                          </span>
                          <span className="ml-1 text-xs" style={{ color: tokens.muted }}>{p.apca.level}</span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <span
                            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium"
                            style={{ borderColor: fg, backgroundColor: bg, color: fg }}
                          >
                            <Icon className="h-3 w-3" />
                            {v}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
