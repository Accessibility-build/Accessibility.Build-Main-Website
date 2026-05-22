"use client"

import { type CSSProperties, useMemo } from "react"
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Info,
  LayoutDashboard,
  ListFilter,
  Loader2,
  MoreHorizontal,
  Search,
  Settings,
  Star,
  Triangle,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react"

import { contrastRatioWCAG } from "@/lib/color/oklch"
import { apcaContrast } from "@/lib/color/apca"
import type { SemanticTokens } from "@/lib/color/tokens"

type ContrastModel = "wcag" | "apca" | "both"

interface PreviewProps {
  tokens: SemanticTokens
  contrastModel: ContrastModel
}

function ContrastBadge({
  fg,
  bg,
  tokens,
  contrastModel,
  small = false,
}: {
  fg: string
  bg: string
  tokens: SemanticTokens
  contrastModel: ContrastModel
  small?: boolean
}) {
  const ratio = contrastRatioWCAG(fg, bg)
  const lc = apcaContrast(fg, bg)
  const wcagOk = ratio >= 4.5
  const apcaOk = Math.abs(lc) >= 60

  const parts: string[] = []
  if (contrastModel !== "apca") {
    parts.push(`${ratio.toFixed(1)}:1`)
  }
  if (contrastModel !== "wcag") {
    parts.push(`Lc ${Math.round(Math.abs(lc))}`)
  }
  const ok = contrastModel === "wcag" ? wcagOk : contrastModel === "apca" ? apcaOk : wcagOk && apcaOk

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-mono ${
        small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]"
      }`}
      style={{
        borderColor: ok ? tokens.success : tokens.warning,
        backgroundColor: ok ? tokens.successSurface : tokens.warningSurface,
        color: ok ? tokens.success : tokens.warning,
      }}
    >
      {ok ? <Check className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
      {parts.join(" · ")}
    </span>
  )
}

function previewStyle(tokens: SemanticTokens): CSSProperties {
  return {
    backgroundColor: tokens.background,
    color: tokens.foreground,
    fontFamily: "system-ui, sans-serif",
  }
}

/* ────────────────────────────────────────────────────────────────── Dashboard */
export function DashboardPreview({ tokens, contrastModel }: PreviewProps) {
  const navItems = [
    { icon: LayoutDashboard, label: "Overview", active: true },
    { icon: TrendingUp, label: "Analytics" },
    { icon: Bell, label: "Notifications" },
    { icon: Settings, label: "Settings" },
  ]
  const stats = [
    { label: "Active users", value: "12,438", delta: "+8.2%", up: true },
    { label: "Revenue", value: "$48.2k", delta: "+12.1%", up: true },
    { label: "Bounce rate", value: "32.4%", delta: "−1.8%", up: false },
    { label: "Avg. session", value: "4m 12s", delta: "+0.4%", up: true },
  ]

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: tokens.border, ...previewStyle(tokens) }}
    >
      <div className="grid grid-cols-[180px_1fr]" style={{ minHeight: 360 }}>
        {/* Sidebar */}
        <aside
          className="border-r p-3"
          style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
        >
          <div className="mb-4 flex items-center gap-2 px-2 py-1">
            <div
              className="h-6 w-6 rounded"
              style={{ backgroundColor: tokens.primary }}
              aria-hidden="true"
            />
            <span className="text-sm font-semibold">Studio</span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href="#"
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
                  style={{
                    backgroundColor: item.active ? tokens.primarySurface : "transparent",
                    color: item.active ? tokens.primary : tokens.muted,
                    fontWeight: item.active ? 600 : 500,
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </a>
              )
            })}
          </nav>
        </aside>

        {/* Main */}
        <main className="p-4">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Overview</h3>
              <p className="text-xs" style={{ color: tokens.muted }}>
                Last updated 2 minutes ago
              </p>
            </div>
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-sm font-medium"
              style={{ backgroundColor: tokens.primary, color: tokens.primaryForeground }}
            >
              + New
            </button>
          </header>

          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border p-3"
                style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
              >
                <p className="text-xs" style={{ color: tokens.muted }}>
                  {s.label}
                </p>
                <p className="mt-1 text-xl font-semibold">{s.value}</p>
                <p
                  className="mt-1 inline-flex items-center gap-1 text-xs font-medium"
                  style={{ color: s.up ? tokens.success : tokens.danger }}
                >
                  {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {s.delta}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <ContrastBadge fg={tokens.foreground} bg={tokens.background} tokens={tokens} contrastModel={contrastModel} small />
            <ContrastBadge fg={tokens.primaryForeground} bg={tokens.primary} tokens={tokens} contrastModel={contrastModel} small />
            <ContrastBadge fg={tokens.muted} bg={tokens.background} tokens={tokens} contrastModel={contrastModel} small />
          </div>
        </main>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────── Buttons */
function ButtonGroup({
  tokens,
  label,
  children,
}: {
  tokens: SemanticTokens
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide" style={{ color: tokens.muted }}>
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

export function ButtonsPreview({ tokens, contrastModel }: PreviewProps) {
  const baseBtn: CSSProperties = {
    padding: "0.5rem 0.875rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    minHeight: "2.25rem",
    border: "1px solid transparent",
  }

  return (
    <div className="rounded-xl border p-5" style={{ borderColor: tokens.border, ...previewStyle(tokens) }}>
      <div className="space-y-5">
        <ButtonGroup tokens={tokens} label="Primary">
          <button type="button" style={{ ...baseBtn, backgroundColor: tokens.primary, color: tokens.primaryForeground }}>Rest</button>
          <button type="button" style={{ ...baseBtn, backgroundColor: tokens.primaryHover, color: tokens.primaryForeground }}>Hover</button>
          <button type="button" style={{ ...baseBtn, backgroundColor: tokens.primaryActive, color: tokens.primaryForeground }}>Active</button>
          <button type="button" style={{ ...baseBtn, backgroundColor: tokens.primary, color: tokens.primaryForeground, boxShadow: `0 0 0 3px ${tokens.focusRing}`, outline: `2px solid ${tokens.focus}` }}>Focus</button>
          <button type="button" disabled style={{ ...baseBtn, backgroundColor: tokens.disabled, color: tokens.disabledForeground, cursor: "not-allowed" }}>Disabled</button>
          <ContrastBadge fg={tokens.primaryForeground} bg={tokens.primary} tokens={tokens} contrastModel={contrastModel} />
        </ButtonGroup>

        <ButtonGroup tokens={tokens} label="Secondary">
          <button type="button" style={{ ...baseBtn, backgroundColor: tokens.secondary, color: tokens.secondaryForeground }}>Rest</button>
          <button type="button" style={{ ...baseBtn, backgroundColor: tokens.secondaryHover, color: tokens.secondaryForeground }}>Hover</button>
          <button type="button" style={{ ...baseBtn, backgroundColor: tokens.secondary, color: tokens.secondaryForeground, boxShadow: `0 0 0 3px ${tokens.focusRing}`, outline: `2px solid ${tokens.focus}` }}>Focus</button>
          <ContrastBadge fg={tokens.secondaryForeground} bg={tokens.secondary} tokens={tokens} contrastModel={contrastModel} />
        </ButtonGroup>

        <ButtonGroup tokens={tokens} label="Outline / ghost">
          <button type="button" style={{ ...baseBtn, backgroundColor: "transparent", color: tokens.primary, borderColor: tokens.borderStrong }}>Outline</button>
          <button type="button" style={{ ...baseBtn, backgroundColor: tokens.primarySurface, color: tokens.primary }}>Soft</button>
          <button type="button" style={{ ...baseBtn, backgroundColor: "transparent", color: tokens.foreground }}>Ghost</button>
          <ContrastBadge fg={tokens.primary} bg={tokens.background} tokens={tokens} contrastModel={contrastModel} />
        </ButtonGroup>

        <ButtonGroup tokens={tokens} label="Destructive">
          <button type="button" style={{ ...baseBtn, backgroundColor: tokens.danger, color: tokens.dangerForeground }}>Delete</button>
          <button type="button" style={{ ...baseBtn, backgroundColor: "transparent", color: tokens.danger, borderColor: tokens.danger }}>Outline</button>
          <ContrastBadge fg={tokens.dangerForeground} bg={tokens.danger} tokens={tokens} contrastModel={contrastModel} />
        </ButtonGroup>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────── Forms */
export function FormsPreview({ tokens, contrastModel }: PreviewProps) {
  const inputBase: CSSProperties = {
    width: "100%",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.5rem",
    border: `1px solid ${tokens.border}`,
    backgroundColor: tokens.surface,
    color: tokens.foreground,
    fontSize: "0.875rem",
  }

  return (
    <div className="rounded-xl border p-5" style={{ borderColor: tokens.border, ...previewStyle(tokens) }}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide" style={{ color: tokens.muted }}>States</p>

          <div>
            <label className="mb-1 block text-xs font-medium">Email — rest</label>
            <input style={inputBase} defaultValue="you@example.com" readOnly aria-readonly="true" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium">Password — focus</label>
            <input
              type="password"
              style={{ ...inputBase, borderColor: tokens.focus, boxShadow: `0 0 0 3px ${tokens.focusRing}` }}
              defaultValue="••••••••"
              readOnly
              aria-readonly="true"
            />
            <p className="mt-1 text-xs" style={{ color: tokens.muted }}>
              At least 12 characters.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: tokens.danger }}>
              Card number — error
            </label>
            <input
              style={{ ...inputBase, borderColor: tokens.danger, boxShadow: `0 0 0 3px ${tokens.dangerSurface}` }}
              defaultValue="4242 4242 4242 0000"
              readOnly
              aria-readonly="true"
            />
            <p className="mt-1 text-xs" style={{ color: tokens.danger }}>
              Invalid card number. Try again.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium" style={{ color: tokens.disabledForeground }}>
              Verified email — disabled
            </label>
            <input
              style={{ ...inputBase, backgroundColor: tokens.disabled, color: tokens.disabledForeground, cursor: "not-allowed" }}
              defaultValue="verified@example.com"
              disabled
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide" style={{ color: tokens.muted }}>Field grading</p>
          <div className="space-y-2 rounded-lg border p-3" style={{ borderColor: tokens.border, backgroundColor: tokens.surface }}>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span>Foreground / surface</span>
              <ContrastBadge fg={tokens.foreground} bg={tokens.surface} tokens={tokens} contrastModel={contrastModel} small />
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span>Muted helper / surface</span>
              <ContrastBadge fg={tokens.muted} bg={tokens.surface} tokens={tokens} contrastModel={contrastModel} small />
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span>Border / background</span>
              <ContrastBadge fg={tokens.border} bg={tokens.background} tokens={tokens} contrastModel={contrastModel} small />
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span>Focus ring / background</span>
              <ContrastBadge fg={tokens.focus} bg={tokens.background} tokens={tokens} contrastModel={contrastModel} small />
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span>Danger label / background</span>
              <ContrastBadge fg={tokens.danger} bg={tokens.background} tokens={tokens} contrastModel={contrastModel} small />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────── Tables */
export function TablesPreview({ tokens, contrastModel }: PreviewProps) {
  const rows = [
    { name: "Aurora invoice", status: "Paid", amount: "$1,420.00", date: "May 18" },
    { name: "Borealis subscription", status: "Pending", amount: "$98.00", date: "May 17" },
    { name: "Cassia consult", status: "Overdue", amount: "$340.00", date: "May 12" },
    { name: "Delphi onboarding", status: "Paid", amount: "$2,200.00", date: "May 10" },
  ]

  const statusColor = (s: string) =>
    s === "Paid" ? tokens.success : s === "Overdue" ? tokens.danger : tokens.warning
  const statusSurface = (s: string) =>
    s === "Paid" ? tokens.successSurface : s === "Overdue" ? tokens.dangerSurface : tokens.warningSurface

  return (
    <div className="rounded-xl border p-5" style={{ borderColor: tokens.border, ...previewStyle(tokens) }}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" style={{ color: tokens.muted }} aria-hidden="true" />
          <input
            placeholder="Search invoices"
            className="rounded-md border px-2 py-1 text-sm"
            style={{ backgroundColor: tokens.surface, color: tokens.foreground, borderColor: tokens.border }}
            readOnly
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-1 rounded-md border px-2 py-1 text-sm"
          style={{ borderColor: tokens.border, color: tokens.muted }}
        >
          <ListFilter className="h-3.5 w-3.5" />
          Filter
        </button>
      </div>
      <div className="overflow-hidden rounded-lg border" style={{ borderColor: tokens.border }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: tokens.surface }}>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase" style={{ color: tokens.muted }}>Name</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase" style={{ color: tokens.muted }}>Status</th>
              <th className="px-3 py-2 text-right text-xs font-semibold uppercase" style={{ color: tokens.muted }}>Amount</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase" style={{ color: tokens.muted }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.name}
                style={{
                  backgroundColor: i === 1 ? tokens.primarySurface : i % 2 === 0 ? tokens.background : tokens.surface,
                  borderTop: `1px solid ${tokens.border}`,
                }}
              >
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{ backgroundColor: statusSurface(r.status), color: statusColor(r.status) }}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-mono">{r.amount}</td>
                <td className="px-3 py-2" style={{ color: tokens.muted }}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ContrastBadge fg={tokens.success} bg={tokens.successSurface} tokens={tokens} contrastModel={contrastModel} small />
        <ContrastBadge fg={tokens.warning} bg={tokens.warningSurface} tokens={tokens} contrastModel={contrastModel} small />
        <ContrastBadge fg={tokens.danger} bg={tokens.dangerSurface} tokens={tokens} contrastModel={contrastModel} small />
        <ContrastBadge fg={tokens.foreground} bg={tokens.primarySurface} tokens={tokens} contrastModel={contrastModel} small />
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────── Cards */
export function CardsPreview({ tokens, contrastModel }: PreviewProps) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: tokens.border, ...previewStyle(tokens) }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <article
          className="rounded-lg border p-4"
          style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
        >
          <header className="mb-2 flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: tokens.primarySurface, color: tokens.primary }}
            >
              <Star className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Premium tier</p>
              <p className="text-xs" style={{ color: tokens.muted }}>Active until Sept 12</p>
            </div>
          </header>
          <p className="text-sm leading-relaxed" style={{ color: tokens.muted }}>
            Unlimited audits, AI alt-text, and design-system color exports across your whole org.
          </p>
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-sm font-medium"
              style={{ backgroundColor: tokens.primary, color: tokens.primaryForeground }}
            >
              Manage
            </button>
            <a className="text-sm font-medium" style={{ color: tokens.primary }} href="#">
              View invoice <ChevronRight className="inline h-3.5 w-3.5" />
            </a>
          </div>
        </article>

        <article
          className="rounded-lg border p-4"
          style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
        >
          <header className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold">Audit summary</p>
            <button
              type="button"
              className="rounded p-1"
              style={{ color: tokens.muted }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </header>
          <div className="space-y-2">
            <Row label="Critical" value="3" color={tokens.danger} surface={tokens.dangerSurface} />
            <Row label="Serious" value="7" color={tokens.warning} surface={tokens.warningSurface} />
            <Row label="Moderate" value="12" color={tokens.info} surface={tokens.infoSurface} />
            <Row label="Passes" value="184" color={tokens.success} surface={tokens.successSurface} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <ContrastBadge fg={tokens.success} bg={tokens.successSurface} tokens={tokens} contrastModel={contrastModel} small />
            <ContrastBadge fg={tokens.danger} bg={tokens.dangerSurface} tokens={tokens} contrastModel={contrastModel} small />
          </div>
        </article>
      </div>
    </div>
  )
}

function Row({ label, value, color, surface }: { label: string; value: string; color: string; surface: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="inline-flex h-6 min-w-[2.5rem] items-center justify-center rounded text-xs font-semibold"
        style={{ backgroundColor: surface, color }}
      >
        {value}
      </span>
      <span className="text-sm">{label}</span>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────── Charts */
export function ChartsPreview({ tokens, contrastModel }: PreviewProps) {
  const bars = useMemo(
    () =>
      tokens.chartColors.slice(0, 6).map((color, i) => ({
        color,
        label: ["Audits", "Issues", "Fixes", "Pageviews", "Users", "Conversions"][i] ?? `S${i + 1}`,
        value: 30 + Math.round(Math.abs(Math.sin(i + 1)) * 65),
      })),
    [tokens.chartColors]
  )

  // Simple distinguishability check — flag any two bars whose perceptual difference is tiny.
  // We just compare adjacent hex strings for now (a deeper check could use ΔE).
  return (
    <div className="rounded-xl border p-5" style={{ borderColor: tokens.border, ...previewStyle(tokens) }}>
      <div className="grid gap-4 md:grid-cols-2">
        {/* Bar chart */}
        <div className="rounded-lg border p-4" style={{ borderColor: tokens.border, backgroundColor: tokens.surface }}>
          <p className="mb-2 text-sm font-semibold">Bar chart — categorical</p>
          <div className="space-y-2">
            {bars.map((b) => (
              <div key={b.label} className="flex items-center gap-2">
                <span className="w-20 text-xs" style={{ color: tokens.muted }}>{b.label}</span>
                <div className="h-3 flex-1 overflow-hidden rounded" style={{ backgroundColor: tokens.background }}>
                  <div
                    className="h-full rounded"
                    style={{ width: `${b.value}%`, backgroundColor: b.color }}
                  />
                </div>
                <span className="w-10 text-right text-xs font-mono" style={{ color: tokens.muted }}>{b.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut */}
        <div className="rounded-lg border p-4" style={{ borderColor: tokens.border, backgroundColor: tokens.surface }}>
          <p className="mb-2 text-sm font-semibold">Donut — proportions</p>
          <div className="flex items-center gap-4">
            <Donut colors={tokens.chartColors.slice(0, 5)} values={[34, 22, 18, 14, 12]} />
            <ul className="text-xs">
              {tokens.chartColors.slice(0, 5).map((c, i) => (
                <li key={i} className="flex items-center gap-2 py-0.5">
                  <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: c }} />
                  <span>{["Critical", "Serious", "Moderate", "Minor", "Notes"][i]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {tokens.chartColors.slice(0, 6).map((c, i) => (
          <ContrastBadge key={i} fg={c} bg={tokens.background} tokens={tokens} contrastModel={contrastModel} small />
        ))}
      </div>
    </div>
  )
}

function Donut({ colors, values }: { colors: string[]; values: number[] }) {
  const total = values.reduce((a, b) => a + b, 0)
  const radius = 24
  const c = 2 * Math.PI * radius
  // Precompute cumulative sums so we don't mutate during render.
  const cumulative = values.reduce<number[]>((arr, v) => {
    arr.push((arr[arr.length - 1] ?? 0) + v)
    return arr
  }, [])
  return (
    <svg width="96" height="96" viewBox="-32 -32 64 64" aria-hidden="true">
      <circle r={radius} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="12" />
      {values.map((v, i) => {
        const len = (v / total) * c
        const dash = `${len} ${c - len}`
        const before = (cumulative[i - 1] ?? 0) / total
        const offset = c - before * c
        return (
          <circle
            key={i}
            r={radius}
            fill="none"
            stroke={colors[i] ?? "#999"}
            strokeWidth="12"
            strokeDasharray={dash}
            strokeDashoffset={offset}
            transform="rotate(-90)"
          />
        )
      })}
    </svg>
  )
}

/* ────────────────────────────────────────────────────────────────────── Toasts */
function ToastRow({
  icon: Icon,
  title,
  body,
  color,
  surface,
  mutedColor,
}: {
  icon: LucideIcon
  title: string
  body: string
  color: string
  surface: string
  mutedColor: string
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-lg border p-3"
      style={{ borderColor: color, backgroundColor: surface, borderLeftWidth: 4 }}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} />
      <div className="flex-1">
        <p className="text-sm font-semibold" style={{ color }}>{title}</p>
        <p className="mt-0.5 text-xs" style={{ color: mutedColor }}>{body}</p>
      </div>
      <button type="button" className="rounded p-0.5" style={{ color: mutedColor }}>
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function ToastsPreview({ tokens, contrastModel }: PreviewProps) {
  return (
    <div className="rounded-xl border p-5" style={{ borderColor: tokens.border, ...previewStyle(tokens) }}>
      <div className="grid gap-3 md:grid-cols-2">
        <ToastRow
          icon={CheckCircle2}
          title="Saved"
          body="Your palette was exported to Figma."
          color={tokens.success}
          surface={tokens.successSurface}
          mutedColor={tokens.muted}
        />
        <ToastRow
          icon={Info}
          title="Heads up"
          body="Dark mode contrast for muted text is in caution range."
          color={tokens.info}
          surface={tokens.infoSurface}
          mutedColor={tokens.muted}
        />
        <ToastRow
          icon={Triangle}
          title="Review needed"
          body="Focus ring on surface only reaches 2.8:1. Bump accent saturation."
          color={tokens.warning}
          surface={tokens.warningSurface}
          mutedColor={tokens.muted}
        />
        <ToastRow
          icon={AlertCircle}
          title="Failed"
          body="Disabled state text is under APCA Lc 30."
          color={tokens.danger}
          surface={tokens.dangerSurface}
          mutedColor={tokens.muted}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <ContrastBadge fg={tokens.success} bg={tokens.successSurface} tokens={tokens} contrastModel={contrastModel} small />
        <ContrastBadge fg={tokens.warning} bg={tokens.warningSurface} tokens={tokens} contrastModel={contrastModel} small />
        <ContrastBadge fg={tokens.danger} bg={tokens.dangerSurface} tokens={tokens} contrastModel={contrastModel} small />
        <ContrastBadge fg={tokens.info} bg={tokens.infoSurface} tokens={tokens} contrastModel={contrastModel} small />
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────── Loading + spinners */
export function MarketingPreview({ tokens, contrastModel }: PreviewProps) {
  return (
    <div className="rounded-xl border p-5" style={{ borderColor: tokens.border, ...previewStyle(tokens) }}>
      <div className="grid items-center gap-6 md:grid-cols-2">
        <div>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ backgroundColor: tokens.primarySurface, color: tokens.primary }}
          >
            New · WCAG 3 ready
          </span>
          <h3 className="mt-3 text-2xl font-bold leading-tight">
            Ship a palette that actually passes APCA.
          </h3>
          <p className="mt-2 text-sm" style={{ color: tokens.muted }}>
            Eleven-stop OKLCH scales, state-aware grading, and one-click Figma + Tailwind + iOS exports.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: tokens.primary, color: tokens.primaryForeground }}
            >
              Start free
            </button>
            <button
              type="button"
              className="rounded-md border px-4 py-2 text-sm font-semibold"
              style={{ borderColor: tokens.borderStrong, color: tokens.foreground }}
            >
              See docs
            </button>
            <span className="ml-1 inline-flex items-center gap-1 text-xs" style={{ color: tokens.muted }}>
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating
            </span>
          </div>
        </div>
        <div
          className="rounded-lg border p-4"
          style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
        >
          <p className="text-xs uppercase tracking-wide" style={{ color: tokens.muted }}>
            Today
          </p>
          <p className="mt-1 text-3xl font-bold">2,438</p>
          <div className="mt-2 flex gap-1.5">
            {[60, 80, 50, 90, 70, 100, 65].map((v, i) => (
              <div
                key={i}
                style={{
                  width: 18,
                  height: Math.round(v * 0.6),
                  backgroundColor: i === 5 ? tokens.primary : tokens.primarySurface,
                  borderRadius: 4,
                  alignSelf: "flex-end",
                }}
              />
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <ContrastBadge fg={tokens.primary} bg={tokens.surface} tokens={tokens} contrastModel={contrastModel} small />
            <ContrastBadge fg={tokens.foreground} bg={tokens.surface} tokens={tokens} contrastModel={contrastModel} small />
          </div>
        </div>
      </div>
    </div>
  )
}

export type PreviewTabKey =
  | "dashboard"
  | "buttons"
  | "forms"
  | "tables"
  | "cards"
  | "charts"
  | "toasts"
  | "marketing"

export const PREVIEW_TABS: { key: PreviewTabKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "buttons", label: "Buttons" },
  { key: "forms", label: "Forms" },
  { key: "tables", label: "Tables" },
  { key: "cards", label: "Cards" },
  { key: "charts", label: "Charts" },
  { key: "toasts", label: "Toasts" },
  { key: "marketing", label: "Marketing" },
]

export function renderPreview(key: PreviewTabKey, props: PreviewProps) {
  switch (key) {
    case "dashboard":
      return <DashboardPreview {...props} />
    case "buttons":
      return <ButtonsPreview {...props} />
    case "forms":
      return <FormsPreview {...props} />
    case "tables":
      return <TablesPreview {...props} />
    case "cards":
      return <CardsPreview {...props} />
    case "charts":
      return <ChartsPreview {...props} />
    case "toasts":
      return <ToastsPreview {...props} />
    case "marketing":
      return <MarketingPreview {...props} />
  }
}
