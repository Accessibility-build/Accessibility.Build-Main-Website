"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react"

// --- WCAG contrast math (relative luminance, per WCAG 2.x) ---------------

function normalizeHex(hex: string): string | null {
  let h = hex.trim().replace(/^#/, "")
  if (/^[0-9a-fA-F]{3}$/.test(h)) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("")
  }
  if (/^[0-9a-fA-F]{6}$/.test(h)) return "#" + h.toLowerCase()
  return null
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "")
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ]
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(hexToRgb(fg))
  const l2 = relativeLuminance(hexToRgb(bg))
  const lightest = Math.max(l1, l2)
  const darkest = Math.min(l1, l2)
  return (lightest + 0.05) / (darkest + 0.05)
}

const PRESETS: { name: string; fg: string; bg: string }[] = [
  { name: "Black on white", fg: "#000000", bg: "#ffffff" },
  { name: "White on navy", fg: "#ffffff", bg: "#003366" },
  { name: "Blue link on white", fg: "#0066cc", bg: "#ffffff" },
  { name: "Gray on white (fail)", fg: "#999999", bg: "#ffffff" },
  { name: "Red on pink (fail)", fg: "#ff0000", bg: "#ffcccc" },
  { name: "Light gray on white (fail)", fg: "#cccccc", bg: "#ffffff" },
]

function PassBadge({ passes, label }: { passes: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border p-3 ${
        passes
          ? "border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20"
          : "border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20"
      }`}
    >
      {passes ? (
        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
      ) : (
        <XCircle className="h-5 w-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
      )}
      <span
        className={`text-sm font-medium ${
          passes
            ? "text-green-800 dark:text-green-300"
            : "text-rose-800 dark:text-rose-300"
        }`}
      >
        {label} — {passes ? "Pass" : "Fail"}
      </span>
    </div>
  )
}

export default function ContrastChecker() {
  const [foreground, setForeground] = useState("#767676")
  const [background, setBackground] = useState("#ffffff")
  const [isBold, setIsBold] = useState(false)
  const [isLarge, setIsLarge] = useState(false)

  const fgHex = normalizeHex(foreground)
  const bgHex = normalizeHex(background)
  const valid = fgHex !== null && bgHex !== null

  const ratio = useMemo(() => {
    if (!fgHex || !bgHex) return null
    return contrastRatio(fgHex, bgHex)
  }, [fgHex, bgHex])

  // "Large text" per 1.4.3: >= 24px regular OR >= 18.66px (14pt) bold.
  // The toggle lets the user model large-scale text; bold lowers the size bar.
  const largeText = isLarge
  const previewPx = largeText ? 28 : 16

  const passAANormal = ratio !== null && ratio >= 4.5
  const passAALarge = ratio !== null && ratio >= 3
  const passAAA = ratio !== null && ratio >= (largeText ? 4.5 : 7)
  const requiredAA = largeText ? 3 : 4.5
  const meetsAA = ratio !== null && ratio >= requiredAA

  const randomize = () => {
    const rand = () =>
      "#" +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")
    setForeground(rand())
    setBackground(rand())
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Live contrast checker
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Pick a text and background color to compute the WCAG contrast ratio and see
          whether it passes 1.4.3 (AA) and 1.4.6 (AAA).
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 p-6">
        {/* Controls */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fg-color" className="text-slate-900 dark:text-white">
                Text color
              </Label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  aria-label="Text color picker"
                  type="color"
                  value={fgHex ?? "#000000"}
                  onChange={(e) => setForeground(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded border border-slate-300 dark:border-slate-700 bg-transparent"
                />
                <Input
                  id="fg-color"
                  value={foreground}
                  onChange={(e) => setForeground(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 font-mono"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bg-color" className="text-slate-900 dark:text-white">
                Background color
              </Label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  aria-label="Background color picker"
                  type="color"
                  value={bgHex ?? "#ffffff"}
                  onChange={(e) => setBackground(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded border border-slate-300 dark:border-slate-700 bg-transparent"
                />
                <Input
                  id="bg-color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1 font-mono"
                />
              </div>
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-slate-900 dark:text-white mb-1">
              Text size
            </legend>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isLarge}
                onChange={(e) => setIsLarge(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
              />
              Large-scale text (≥ 24px, or ≥ 18.66px / 14pt bold) — needs only 3:1
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isBold}
                onChange={(e) => setIsBold(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
              />
              Bold weight (lowers the large-text size threshold to 14pt)
            </label>
          </fieldset>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={randomize} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Random colors
            </Button>
            <span className="sr-only" aria-live="polite">
              {valid && ratio !== null
                ? `Contrast ratio ${ratio.toFixed(2)} to 1`
                : "Enter valid hex colors"}
            </span>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
              Quick presets
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <Button
                  key={p.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setForeground(p.fg)
                    setBackground(p.bg)
                  }}
                  className="justify-start text-xs"
                >
                  {p.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview + results */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
              Live preview
            </p>
            <div
              className="flex min-h-[140px] items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center"
              style={{
                backgroundColor: bgHex ?? "#ffffff",
                color: fgHex ?? "#000000",
                fontSize: `${previewPx}px`,
                fontWeight: isBold ? 700 : 400,
              }}
            >
              The quick brown fox jumps over the lazy dog
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Contrast ratio
              </span>
              <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                {valid && ratio !== null ? `${ratio.toFixed(2)}:1` : "—"}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {valid
                ? largeText
                  ? "Large text — 3:1 required for AA, 4.5:1 for AAA."
                  : "Normal text — 4.5:1 required for AA, 7:1 for AAA."
                : "Enter valid 3- or 6-digit hex colors (e.g. #1a1a1a)."}
            </p>
          </div>

          <div className="space-y-2">
            <PassBadge passes={largeText ? passAALarge : passAANormal} label={`AA ${largeText ? "large" : "normal"} (${requiredAA}:1)`} />
            <PassBadge passes={passAAA} label={`AAA (${largeText ? "4.5" : "7"}:1)`} />
          </div>

          <div
            className={`rounded-lg p-3 text-sm font-medium ${
              meetsAA
                ? "bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300"
                : "bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300"
            }`}
          >
            {valid
              ? meetsAA
                ? "This combination meets WCAG 1.4.3 Level AA."
                : "This combination fails WCAG 1.4.3 Level AA — increase the contrast."
              : "Awaiting valid colors."}
          </div>
        </div>
      </div>
    </div>
  )
}
