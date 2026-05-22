"use client"

import { useMemo, useState } from "react"
import { Check, Copy, Download } from "lucide-react"
import { exportPalette, type ExportFormat } from "@/lib/color/export"
import type { PaletteScales } from "@/lib/color/scales"
import type { SemanticTokens, TokenSet } from "@/lib/color/tokens"

interface ExportsPanelProps {
  name: string
  scales: PaletteScales
  tokens: TokenSet
  tokensActive: SemanticTokens // for theme styling
}

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

export function ExportsPanel({ name, scales, tokens, tokensActive }: ExportsPanelProps) {
  const [active, setActive] = useState<ExportFormat>("css")
  const [copied, setCopied] = useState(false)

  const file = useMemo(
    () => exportPalette(active, { name, scales, tokens }),
    [active, name, scales, tokens]
  )

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(file.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const downloadFile = () => {
    const blob = new Blob([file.content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="grid gap-4 md:grid-cols-[260px_1fr]">
      <div className="space-y-1">
        {FORMATS.map((f) => {
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
              <p className="text-xs" style={{ color: isActive ? tokensActive.primary : tokensActive.muted }}>
                {f.sub}
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
            {file.filename}
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
          <code>{file.content}</code>
        </pre>
      </div>
    </div>
  )
}
