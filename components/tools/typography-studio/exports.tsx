"use client"

import { useMemo, useState } from "react"
import { Check, Copy, Download } from "lucide-react"
import { exportTypography, type ExportFormat } from "@/lib/typography/export"
import type { TypographyTokens } from "@/lib/typography/tokens"

interface ExportsProps {
  name: string
  tokens: TypographyTokens
}

const FORMATS: { key: ExportFormat; label: string; sub: string }[] = [
  { key: "css", label: "CSS variables", sub: ":root + utility classes" },
  { key: "tailwind-v4", label: "Tailwind v4", sub: "@theme block" },
  { key: "tailwind-v3", label: "Tailwind v3", sub: "config.ts" },
  { key: "dtcg", label: "DTCG JSON", sub: "W3C design tokens" },
  { key: "figma", label: "Figma / Tokens Studio", sub: "typography tokens" },
  { key: "swift", label: "Swift UIFont", sub: "iOS / SwiftUI" },
  { key: "kotlin", label: "Kotlin TextStyle", sub: "Jetpack Compose" },
  { key: "json", label: "JSON", sub: "raw tokens" },
]

const PREFIX_PRESETS: { key: string; label: string; prefix: string | undefined; sub: string }[] = [
  { key: "none", label: "Standard", prefix: undefined, sub: "--font-size-body" },
  { key: "type", label: "Type", prefix: "type", sub: "--type-font-size-body" },
  { key: "ds", label: "Design system", prefix: "ds", sub: "--ds-font-size-body" },
  { key: "brand", label: "Brand", prefix: "brand", sub: "--brand-font-size-body" },
]

export function TypographyExportsPanel({ name, tokens }: ExportsProps) {
  const [active, setActive] = useState<ExportFormat>("css")
  const [prefixKey, setPrefixKey] = useState("none")
  const [copied, setCopied] = useState(false)

  const prefix = PREFIX_PRESETS.find((p) => p.key === prefixKey)?.prefix
  const file = useMemo(
    () => exportTypography(active, { name, tokens, prefix }),
    [active, name, tokens, prefix]
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
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Prefix</span>
        <select
          aria-label="Export token prefix"
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

      <div className="grid gap-4 md:grid-cols-[240px_1fr]">
        <div className="space-y-1">
          {FORMATS.map((f) => {
            const isActive = f.key === active
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setActive(f.key)}
                className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                <p className="text-sm font-semibold">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.sub}</p>
              </button>
            )
          })}
        </div>

        <div className="overflow-hidden rounded-lg border bg-muted/30">
          <div className="flex items-center justify-between border-b bg-background px-3 py-2">
            <p className="font-mono text-xs text-muted-foreground">{file.filename}</p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={copyToClipboard}
                className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${
                  copied ? "text-emerald-600" : ""
                }`}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={downloadFile}
                className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground"
              >
                <Download className="h-3 w-3" />
                Download
              </button>
            </div>
          </div>
          <pre className="max-h-[520px] overflow-auto p-3 font-mono text-[11px] leading-relaxed">
            <code>{file.content}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
