"use client"

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react"
import {
  Check,
  Copy,
  Download,
  Eye,
  FileCheck,
  Layers,
  Moon,
  RefreshCw,
  Share2,
  Sparkles,
  Sun,
  Wand2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { gradeTokens } from "@/lib/color/grade"
import { isValidHex, oklchToHex } from "@/lib/color/oklch"
import { generatePalette, STOPS, FAMILY_NAMES, type FamilyName } from "@/lib/color/scales"
import { deriveTokens } from "@/lib/color/tokens"
import { CVD_LABELS, type CVDType, cvdCssFilter } from "@/lib/color/cvd"

import { CVDFilterDefs } from "./palette-studio/cvd-defs"
import { ReportCard } from "./palette-studio/report"
import { ExportsPanel } from "./palette-studio/exports"
import { PREVIEW_TABS, renderPreview, type PreviewTabKey } from "./palette-studio/preview"

type ContrastModel = "wcag" | "apca" | "both"
type ViewMode = "light" | "dark"
type NeutralTilt = "warm" | "true" | "cool"

interface StudioState {
  name: string
  primary: string
  secondary: string
  accent: string
  neutralTilt: NeutralTilt
  useDerivedSecondary: boolean
  useDerivedAccent: boolean
}

const DEFAULT_STATE: StudioState = {
  name: "Aurora",
  primary: "#3b82f6",
  secondary: "#a855f7",
  accent: "#22c55e",
  neutralTilt: "true",
  useDerivedSecondary: true,
  useDerivedAccent: true,
}

function encodeHash(state: StudioState): string {
  const params = new URLSearchParams()
  params.set("n", state.name)
  params.set("p", state.primary.replace("#", ""))
  if (!state.useDerivedSecondary) params.set("s", state.secondary.replace("#", ""))
  if (!state.useDerivedAccent) params.set("a", state.accent.replace("#", ""))
  if (state.neutralTilt !== "true") params.set("t", state.neutralTilt)
  return params.toString()
}

function decodeHash(hash: string): Partial<StudioState> | null {
  const h = hash.replace(/^#/, "")
  if (!h) return null
  try {
    const params = new URLSearchParams(h)
    const out: Partial<StudioState> = {}
    if (params.has("n")) out.name = params.get("n") ?? undefined
    if (params.has("p")) {
      const v = `#${params.get("p")}`
      if (isValidHex(v)) out.primary = v
    }
    if (params.has("s")) {
      const v = `#${params.get("s")}`
      if (isValidHex(v)) {
        out.secondary = v
        out.useDerivedSecondary = false
      }
    }
    if (params.has("a")) {
      const v = `#${params.get("a")}`
      if (isValidHex(v)) {
        out.accent = v
        out.useDerivedAccent = false
      }
    }
    if (params.has("t")) {
      const v = params.get("t")
      if (v === "warm" || v === "cool" || v === "true") out.neutralTilt = v
    }
    return out
  } catch {
    return null
  }
}

function randomHex(): string {
  const hue = Math.floor(Math.random() * 360)
  return oklchToHex({ l: 0.65, c: 0.18, h: hue })
}

export default function AccessiblePaletteStudio() {
  const [state, setState] = useState<StudioState>(DEFAULT_STATE)
  const [mode, setMode] = useState<ViewMode>("light")
  const [cvd, setCvd] = useState<CVDType>("normal")
  const [contrastModel, setContrastModel] = useState<ContrastModel>("both")
  const [view, setView] = useState<"preview" | "report" | "export">("preview")
  const [previewTab, setPreviewTab] = useState<PreviewTabKey>("dashboard")
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const [shareCopied, setShareCopied] = useState(false)

  // ── URL hash sync (read once on mount, write on state changes) ──────────────
  // The hash isn't available during SSR, so we have to hydrate client-only.
  useEffect(() => {
    if (typeof window === "undefined") return
    const decoded = decodeHash(window.location.hash)
    if (decoded) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState((prev) => ({ ...prev, ...decoded }))
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const hash = encodeHash(state)
    if (window.location.hash.replace(/^#/, "") !== hash) {
      window.history.replaceState(null, "", `#${hash}`)
    }
  }, [state])

  // ── Derived palette ─────────────────────────────────────────────────────────
  const scales = useMemo(
    () =>
      generatePalette({
        primary: state.primary,
        secondary: state.useDerivedSecondary ? undefined : state.secondary,
        accent: state.useDerivedAccent ? undefined : state.accent,
        neutralTilt: state.neutralTilt,
      }),
    [state.primary, state.secondary, state.accent, state.neutralTilt, state.useDerivedSecondary, state.useDerivedAccent]
  )

  const tokenSet = useMemo(() => deriveTokens(scales), [scales])
  const activeTokens = mode === "light" ? tokenSet.light : tokenSet.dark
  const report = useMemo(() => gradeTokens(activeTokens), [activeTokens])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handlePrimaryChange = (v: string) => {
    if (isValidHex(v)) setState((s) => ({ ...s, primary: v }))
    else setState((s) => ({ ...s, primary: v })) // allow typing in-progress; downstream guards bad input
  }

  const copyHex = useCallback((hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    setTimeout(() => setCopiedHex(null), 1200)
  }, [])

  const copyShareUrl = useCallback(async () => {
    if (typeof window === "undefined") return
    const url = `${window.location.origin}${window.location.pathname}#${encodeHash(state)}`
    await navigator.clipboard.writeText(url)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 1500)
  }, [state])

  const randomize = () => {
    setState((s) => ({
      ...s,
      primary: randomHex(),
      secondary: randomHex(),
      accent: randomHex(),
    }))
  }

  // ── CVD wrapper ─────────────────────────────────────────────────────────────
  const cvdStyle: CSSProperties = useMemo(() => {
    const filter = cvdCssFilter(cvd)
    return filter ? { filter } : {}
  }, [cvd])

  return (
    <div className="space-y-6">
      <CVDFilterDefs />

      {/* === Header / Controls ================================================ */}
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="palette-name" className="text-xs">Palette name</Label>
            <Input
              id="palette-name"
              value={state.name}
              onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
              className="h-9 w-48"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={randomize}>
              <Wand2 className="mr-1.5 h-3.5 w-3.5" />
              Randomize
            </Button>
            <Button variant="outline" size="sm" onClick={() => setState(DEFAULT_STATE)}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </Button>
            <Button variant="default" size="sm" onClick={copyShareUrl}>
              {shareCopied ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="mr-1.5 h-3.5 w-3.5" />
                  Share URL
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <ColorPickerControl
            label="Primary"
            value={state.primary}
            onChange={(v) => handlePrimaryChange(v)}
            description="Drives the entire palette."
            required
          />
          <ColorPickerControl
            label="Secondary"
            value={state.secondary}
            onChange={(v) => setState((s) => ({ ...s, secondary: v, useDerivedSecondary: false }))}
            description={state.useDerivedSecondary ? "Auto-derived (+210° hue)" : "Custom"}
            toggleDerived={() =>
              setState((s) => ({ ...s, useDerivedSecondary: !s.useDerivedSecondary }))
            }
            derived={state.useDerivedSecondary}
          />
          <ColorPickerControl
            label="Accent"
            value={state.accent}
            onChange={(v) => setState((s) => ({ ...s, accent: v, useDerivedAccent: false }))}
            description={state.useDerivedAccent ? "Auto-derived (+120° hue)" : "Custom"}
            toggleDerived={() =>
              setState((s) => ({ ...s, useDerivedAccent: !s.useDerivedAccent }))
            }
            derived={state.useDerivedAccent}
          />
          <div>
            <Label className="text-xs">Neutral tilt</Label>
            <div className="mt-1 grid grid-cols-3 gap-1 rounded-md border p-0.5">
              {(["warm", "true", "cool"] as NeutralTilt[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, neutralTilt: t }))}
                  className={`rounded px-2 py-1.5 text-xs font-medium capitalize transition-colors ${
                    state.neutralTilt === t
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Hue bias for grays
            </p>
          </div>
        </div>
      </div>

      {/* === Scale strips ===================================================== */}
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">11-stop OKLCH scales</h3>
            <Badge variant="secondary" className="text-[10px]">
              Gamut-mapped to sRGB
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">Click any swatch to copy hex</span>
        </div>

        <div className="space-y-2 overflow-x-auto">
          {FAMILY_NAMES.map((family) => (
            <ScaleStripRow
              key={family}
              family={family}
              colors={STOPS.map((stop) => scales[family][stop])}
              onCopy={copyHex}
              copiedHex={copiedHex}
            />
          ))}
        </div>
      </div>

      {/* === View toggles ==================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-3 shadow-sm">
        <SegmentedToggle
          label="Mode"
          icon={mode === "light" ? Sun : Moon}
          value={mode}
          onChange={(v) => setMode(v as ViewMode)}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
        <SegmentedToggle
          label="Vision sim"
          icon={Eye}
          value={cvd}
          onChange={(v) => setCvd(v as CVDType)}
          options={[
            { value: "normal", label: "Normal" },
            { value: "protanopia", label: "Protan" },
            { value: "deuteranopia", label: "Deutan" },
            { value: "tritanopia", label: "Tritan" },
            { value: "achromatopsia", label: "Mono" },
          ]}
        />
        <SegmentedToggle
          label="Contrast"
          icon={FileCheck}
          value={contrastModel}
          onChange={(v) => setContrastModel(v as ContrastModel)}
          options={[
            { value: "wcag", label: "WCAG 2.2" },
            { value: "apca", label: "APCA" },
            { value: "both", label: "Both" },
          ]}
        />
      </div>

      {/* === Tabs: Preview / Report / Export ================================== */}
      <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
          <TabsTrigger value="preview">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Live UI
          </TabsTrigger>
          <TabsTrigger value="report">
            <FileCheck className="mr-1.5 h-3.5 w-3.5" />
            Report ({report.summary.fail + report.summary.caution > 0
              ? `${report.summary.fail + report.summary.caution} issues`
              : "all pass"})
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-3">
          <div className="rounded-2xl border bg-card p-3 shadow-sm">
            <div className="mb-3 flex flex-wrap gap-1 overflow-x-auto">
              {PREVIEW_TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setPreviewTab(t.key)}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    previewTab === t.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {cvd !== "normal" && (
              <p className="mb-2 text-xs text-muted-foreground">
                Showing through {CVD_LABELS[cvd]} simulation. Contrast scores are still computed on
                the actual palette values.
              </p>
            )}

            <div style={cvdStyle}>
              {renderPreview(previewTab, { tokens: activeTokens, contrastModel })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="report" className="mt-3">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <ReportCard report={report} tokens={activeTokens} contrastModel={contrastModel} />
          </div>
        </TabsContent>

        <TabsContent value="export" className="mt-3">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <ExportsPanel
              name={state.name}
              scales={scales}
              tokens={tokenSet}
              tokensActive={activeTokens}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── ColorPickerControl */
function ColorPickerControl({
  label,
  value,
  onChange,
  description,
  toggleDerived,
  derived,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  description?: string
  toggleDerived?: () => void
  derived?: boolean
  required?: boolean
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        {toggleDerived && (
          <button
            type="button"
            onClick={toggleDerived}
            className="text-[10px] uppercase tracking-wide text-muted-foreground hover:text-foreground"
          >
            {derived ? "Customize" : "Auto-derive"}
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <label
          className="relative inline-flex h-9 w-9 cursor-pointer overflow-hidden rounded-md border"
          style={{ backgroundColor: isValidHex(value) ? value : undefined }}
        >
          <input
            type="color"
            value={isValidHex(value) ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={`${label} color picker`}
          />
        </label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 font-mono text-xs uppercase"
          placeholder="#000000"
          required={required}
        />
      </div>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────── ScaleStripRow */
function ScaleStripRow({
  family,
  colors,
  onCopy,
  copiedHex,
}: {
  family: FamilyName
  colors: string[]
  onCopy: (hex: string) => void
  copiedHex: string | null
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 shrink-0 text-xs font-medium capitalize text-muted-foreground">
        {family}
      </div>
      <div className="grid flex-1 grid-cols-11 gap-1">
        {colors.map((hex, i) => {
          const stop = STOPS[i]
          const isCopied = copiedHex === hex
          // Pick contrasting label color based on stop position (light stops use dark text).
          const textColor = i < 5 ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)"
          return (
            <button
              key={stop}
              type="button"
              onClick={() => onCopy(hex)}
              className="group relative h-12 rounded-md border text-left text-[10px] font-mono transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: hex, color: textColor, borderColor: "rgba(0,0,0,0.08)" }}
              title={`${family}-${stop} · ${hex}`}
            >
              <span className="absolute left-1 top-1 opacity-70">{stop}</span>
              <span className="absolute bottom-1 right-1 opacity-0 transition-opacity group-hover:opacity-90">
                {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────────────────────── SegmentedToggle */
function SegmentedToggle({
  label,
  icon: Icon,
  value,
  onChange,
  options,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <div className="flex rounded-md border p-0.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              value === opt.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
