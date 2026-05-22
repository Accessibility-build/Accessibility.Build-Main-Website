"use client"

import { useMemo, useState } from "react"
import { Check, Copy, Download } from "lucide-react"
import { exportPalette, type ExportFormat } from "@/lib/color/export"
import { allSamples } from "@/lib/color/code-samples"
import type { PaletteScales } from "@/lib/color/scales"
import type { SemanticTokens, TokenSet } from "@/lib/color/tokens"

interface ExportsPanelProps {
  name: string
  scales: PaletteScales
  tokens: TokenSet
  tokensActive: SemanticTokens
}

type Tab = "tokens" | "code"

const FORMATS: { key: ExportFormat; label: string; sub: string }[] = [
  { key: "css", label: "CSS variables", sub: ":root + dark mode" },
  { key: "tailwind-v4", label: "Tailwind v4", sub: "@theme block" },
  { key: "tailwind-v3", label: "Tailwind v3", sub: "config.ts" },
  { key: "dtcg", label: "DTCG JSON", sub: "W3C design tokens" },
  { key: "figma", label: "Figma / Tokens Studio", sub: "import JSON" },
  { key: "swift", label: "Swift UIColor", sub: "iOS / SwiftUI" },
  { key: "kotlin", label: "Kotlin Color", sub: "Jetpack Compose" },
  { key: "json", label: "JSON", sub: "raw palette + tokens" },
]

const PREFIX_PRESETS: { key: string; label: string; prefix: string | undefined; sub: string }[] = [
  { key: "none", label: "Standard", prefix: undefined, sub: "--color-primary-500" },
  { key: "brand", label: "Brand", prefix: "brand", sub: "--brand-color-primary-500" },
  { key: "ds", label: "Design system", prefix: "ds", sub: "--ds-color-primary-500" },
  { key: "ui", label: "UI", prefix: "ui", sub: "--ui-color-primary-500" },
]

export function ExportsPanel({ name, scales, tokens, tokensActive }: ExportsPanelProps) {
  const [tab, setTab] = useState<Tab>("tokens")
  const [active, setActive] = useState<ExportFormat>("css")
  const [prefixKey, setPrefixKey] = useState<string>("none")
  const [activeSample, setActiveSample] = useState(0)
  const [copied, setCopied] = useState(false)

  const prefix = PREFIX_PRESETS.find((p) => p.key === prefixKey)?.prefix

  const file = useMemo(
    () => exportPalette(active, { name, scales, tokens, prefix }),
    [active, name, scales, tokens, prefix]
  )

  const samples = useMemo(() => allSamples({ name, scales, tokens }), [name, scales, tokens])
  const sample = samples[activeSample]

  const current = tab === "tokens" ? file : sample

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(current.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const downloadFile = () => {
    const blob = new Blob([current.content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = current.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      {/* Top tab selector */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex rounded-md border p-0.5">
          <button
            type="button"
            onClick={() => setTab("tokens")}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === "tokens" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Design tokens
          </button>
          <button
            type="button"
            onClick={() => setTab("code")}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === "code" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Code samples
          </button>
        </div>

        {tab === "tokens" && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Prefix</span>
            <select
              value={prefixKey}
              onChange={(e) => setPrefixKey(e.target.value)}
              className="rounded-md border bg-background px-2 py-1 text-xs"
            >
              {PREFIX_PRESETS.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label} — {p.sub}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <div className="space-y-1">
          {tab === "tokens"
            ? FORMATS.map((f) => {
                const isActive = f.key === active
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setActive(f.key)}
                    className="w-full rounded-lg border px-3 py-2 text-left transition-colors"
                    style={{
                      borderColor: isActive ? tokensActive.primary : tokensActive.border,
                      backgroundColor: isActive ? tokensActive.primarySurface : tokensActive.surface,
                      color: isActive ? tokensActive.primary : tokensActive.foreground,
                    }}
                  >
                    <p className="text-sm font-semibold">{f.label}</p>
                    <p
                      className="text-xs"
                      style={{ color: isActive ? tokensActive.primary : tokensActive.muted }}
                    >
                      {f.sub}
                    </p>
                  </button>
                )
              })
            : samples.map((s, i) => {
                const isActive = i === activeSample
                return (
                  <button
                    key={s.filename}
                    type="button"
                    onClick={() => setActiveSample(i)}
                    className="w-full rounded-lg border px-3 py-2 text-left transition-colors"
                    style={{
                      borderColor: isActive ? tokensActive.primary : tokensActive.border,
                      backgroundColor: isActive ? tokensActive.primarySurface : tokensActive.surface,
                      color: isActive ? tokensActive.primary : tokensActive.foreground,
                    }}
                  >
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p
                      className="font-mono text-xs"
                      style={{ color: isActive ? tokensActive.primary : tokensActive.muted }}
                    >
                      {s.filename}
                    </p>
                  </button>
                )
              })}
        </div>

        <div
          className="overflow-hidden rounded-lg border"
          style={{ borderColor: tokensActive.border, backgroundColor: tokensActive.surface }}
        >
          <div
            className="flex items-center justify-between border-b px-3 py-2"
            style={{ borderColor: tokensActive.border, backgroundColor: tokensActive.raised }}
          >
            <p className="font-mono text-xs" style={{ color: tokensActive.muted }}>
              {current.filename}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
                style={{
                  borderColor: tokensActive.border,
                  color: copied ? tokensActive.success : tokensActive.foreground,
                }}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={downloadFile}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold"
                style={{ backgroundColor: tokensActive.primary, color: tokensActive.primaryForeground }}
              >
                <Download className="h-3 w-3" />
                Download
              </button>
            </div>
          </div>
          <pre
            className="max-h-[480px] overflow-auto p-3 font-mono text-[11px] leading-relaxed"
            style={{ color: tokensActive.foreground }}
          >
            <code>{current.content}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
