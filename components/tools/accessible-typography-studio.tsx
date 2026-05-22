"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Check,
  Download,
  FileCheck,
  Link2,
  RefreshCw,
  Settings2,
  Share2,
  Sparkles,
  Type as TypeIcon,
  Wand2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { gradeTypography } from "@/lib/typography/grade"
import {
  ACCESSIBILITY_PRESETS,
  FONT_STACKS,
  fontByKey,
  presetByKey,
} from "@/lib/typography/presets"
import { buildTypographyTokens, type TypographyTokens } from "@/lib/typography/tokens"
import { RATIO_OPTIONS } from "@/lib/typography/scale"
import { isValidHex } from "@/lib/color/oklch"
import { generatePalette } from "@/lib/color/scales"
import { deriveTokens, type SemanticTokens } from "@/lib/color/tokens"

import { TypographyPreview, SPECIMENS, type SpecimenKey } from "./typography-studio/preview"
import { TypographyReportCard } from "./typography-studio/report"
import { ReadabilityAnalyzer } from "./typography-studio/readability"
import { TypographyExportsPanel } from "./typography-studio/exports"

interface StudioState {
  name: string
  basePx: number
  ratio: number
  fluid: boolean
  presetKey: string
  sansKey: string
  serifKey: string
  monoKey: string
  displayKey: string
  lineHeightBoost: number
  letterSpacingBoost: number
  paragraphSpacingMultiplier: number
  maxLineLengthCh: number
  /** Hex of a paired palette's primary, used to derive preview backgrounds (and grading). */
  paletteHex?: string
  mode: "light" | "dark"
}

const DEFAULT_STATE: StudioState = {
  name: "Beacon",
  basePx: 16,
  ratio: 1.25,
  fluid: true,
  presetKey: "default",
  sansKey: "inter",
  serifKey: "source-serif",
  monoKey: "jetbrains-mono",
  displayKey: "inter",
  lineHeightBoost: 0,
  letterSpacingBoost: 0,
  paragraphSpacingMultiplier: 1,
  maxLineLengthCh: 65,
  paletteHex: "#3b82f6",
  mode: "light",
}

function encodeHash(s: StudioState): string {
  const p = new URLSearchParams()
  p.set("n", s.name)
  p.set("b", String(s.basePx))
  p.set("r", String(s.ratio))
  p.set("f", s.fluid ? "1" : "0")
  p.set("pre", s.presetKey)
  p.set("sa", s.sansKey)
  p.set("se", s.serifKey)
  p.set("mo", s.monoKey)
  p.set("di", s.displayKey)
  p.set("lh", String(s.lineHeightBoost))
  p.set("ls", String(s.letterSpacingBoost))
  p.set("ps", String(s.paragraphSpacingMultiplier))
  p.set("mw", String(s.maxLineLengthCh))
  if (s.paletteHex) p.set("ph", s.paletteHex.replace("#", ""))
  if (s.mode !== "light") p.set("m", s.mode)
  return p.toString()
}

function decodeHash(hash: string): Partial<StudioState> | null {
  const h = hash.replace(/^#/, "")
  if (!h) return null
  try {
    const p = new URLSearchParams(h)
    const out: Partial<StudioState> = {}
    if (p.has("n")) out.name = p.get("n") ?? undefined
    if (p.has("b")) out.basePx = Math.max(10, Math.min(28, parseInt(p.get("b") ?? "16", 10)))
    if (p.has("r")) out.ratio = parseFloat(p.get("r") ?? "1.25")
    if (p.has("f")) out.fluid = p.get("f") === "1"
    if (p.has("pre")) out.presetKey = p.get("pre") ?? "default"
    if (p.has("sa")) out.sansKey = p.get("sa") ?? "inter"
    if (p.has("se")) out.serifKey = p.get("se") ?? "source-serif"
    if (p.has("mo")) out.monoKey = p.get("mo") ?? "jetbrains-mono"
    if (p.has("di")) out.displayKey = p.get("di") ?? "inter"
    if (p.has("lh")) out.lineHeightBoost = parseFloat(p.get("lh") ?? "0")
    if (p.has("ls")) out.letterSpacingBoost = parseFloat(p.get("ls") ?? "0")
    if (p.has("ps")) out.paragraphSpacingMultiplier = parseFloat(p.get("ps") ?? "1")
    if (p.has("mw")) out.maxLineLengthCh = parseInt(p.get("mw") ?? "65", 10)
    if (p.has("ph")) {
      const v = `#${p.get("ph")}`
      if (isValidHex(v)) out.paletteHex = v
    }
    if (p.get("m") === "dark") out.mode = "dark"
    return out
  } catch {
    return null
  }
}

const SANS_OPTIONS = FONT_STACKS.filter((f) => f.category === "sans" || f.category === "accessibility")
const SERIF_OPTIONS = FONT_STACKS.filter((f) => f.category === "serif")
const MONO_OPTIONS = FONT_STACKS.filter((f) => f.category === "mono")
const DISPLAY_OPTIONS = FONT_STACKS.filter(
  (f) => f.category === "sans" || f.category === "accessibility" || f.category === "serif" || f.category === "display"
)

export default function AccessibleTypographyStudio() {
  const [state, setState] = useState<StudioState>(DEFAULT_STATE)
  const [view, setView] = useState<"preview" | "report" | "readability" | "export">("preview")
  const [specimen, setSpecimen] = useState<SpecimenKey>("marketing")
  const [applyOverride, setApplyOverride] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // URL hash sync
  useEffect(() => {
    if (typeof window === "undefined") return
    const decoded = decodeHash(window.location.hash)
    if (decoded) {
      // Client-only hydrate from URL hash.
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

  // Derived palette (used for preview backgrounds + grading)
  const paletteTokens: SemanticTokens = useMemo(() => {
    const hex = state.paletteHex && isValidHex(state.paletteHex) ? state.paletteHex : "#3b82f6"
    const scales = generatePalette({ primary: hex })
    return state.mode === "light" ? deriveTokens(scales).light : deriveTokens(scales).dark
  }, [state.paletteHex, state.mode])

  // Tokens
  const tokens: TypographyTokens = useMemo(
    () =>
      buildTypographyTokens({
        basePx: state.basePx,
        ratio: state.ratio,
        fluid: state.fluid,
        lineHeightBoost: state.lineHeightBoost,
        letterSpacingBoost: state.letterSpacingBoost,
        paragraphSpacingMultiplier: state.paragraphSpacingMultiplier,
        maxLineLengthCh: state.maxLineLengthCh,
        fonts: {
          sansKey: state.sansKey,
          serifKey: state.serifKey,
          monoKey: state.monoKey,
          displayKey: state.displayKey,
        },
      }),
    [state]
  )

  const report = useMemo(() => gradeTypography(tokens, paletteTokens), [tokens, paletteTokens])

  const applyPreset = useCallback((key: string) => {
    const preset = presetByKey(key)
    if (!preset) return
    setState((s) => ({
      ...s,
      presetKey: key,
      basePx: preset.basePx,
      ratio: preset.ratio,
      lineHeightBoost: preset.lineHeightBoost,
      letterSpacingBoost: preset.letterSpacingBoost,
      paragraphSpacingMultiplier: preset.paragraphSpacingMultiplier,
      maxLineLengthCh: preset.maxLineLengthCh,
      sansKey: preset.fontKey ?? s.sansKey,
      displayKey: preset.fontKey ?? s.displayKey,
    }))
  }, [])

  const copyShareUrl = useCallback(async () => {
    if (typeof window === "undefined") return
    const url = `${window.location.origin}${window.location.pathname}#${encodeHash(state)}`
    await navigator.clipboard.writeText(url)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 1500)
  }, [state])

  // Live font @import for the active stacks
  const importHrefs = useMemo(
    () =>
      Array.from(
        new Set(
          [
            fontByKey(state.sansKey)?.googleFontUrl,
            fontByKey(state.serifKey)?.googleFontUrl,
            fontByKey(state.monoKey)?.googleFontUrl,
            fontByKey(state.displayKey)?.googleFontUrl,
          ].filter(Boolean) as string[]
        )
      ),
    [state.sansKey, state.serifKey, state.monoKey, state.displayKey]
  )

  return (
    <div className="space-y-6">
      {/* Inject the active webfonts at runtime so the preview reflects real choices. */}
      {importHrefs.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}

      {/* === Controls ====================================================== */}
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="ts-name" className="text-xs">Typography system name</Label>
            <Input
              id="ts-name"
              value={state.name}
              onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
              className="h-9 w-56"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
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
                  Share
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Accessibility presets */}
        <div className="mb-4">
          <Label className="text-xs">Accessibility preset</Label>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {ACCESSIBILITY_PRESETS.map((preset) => {
              const active = state.presetKey === preset.key
              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => applyPreset(preset.key)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-muted"
                  }`}
                  title={preset.description}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {presetByKey(state.presetKey)?.description}
          </p>
        </div>

        {/* Core controls */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label className="text-xs">
              Base size · <span className="font-mono">{state.basePx}px</span>
            </Label>
            <Slider
              className="mt-2"
              value={[state.basePx]}
              min={12}
              max={22}
              step={1}
              onValueChange={(v) => setState((s) => ({ ...s, basePx: v[0] }))}
            />
          </div>
          <div>
            <Label className="text-xs">Type scale ratio</Label>
            <select
              value={state.ratio}
              onChange={(e) => setState((s) => ({ ...s, ratio: parseFloat(e.target.value) }))}
              className="mt-2 h-9 w-full rounded-md border bg-background px-2 text-sm"
            >
              {RATIO_OPTIONS.map((r) => (
                <option key={r.key} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs">
              Line height boost · <span className="font-mono">{state.lineHeightBoost.toFixed(2)}</span>
            </Label>
            <Slider
              className="mt-2"
              value={[state.lineHeightBoost]}
              min={-0.1}
              max={0.4}
              step={0.05}
              onValueChange={(v) => setState((s) => ({ ...s, lineHeightBoost: v[0] }))}
            />
          </div>
          <div>
            <Label className="text-xs">
              Max line length · <span className="font-mono">{state.maxLineLengthCh}ch</span>
            </Label>
            <Slider
              className="mt-2"
              value={[state.maxLineLengthCh]}
              min={40}
              max={90}
              step={1}
              onValueChange={(v) => setState((s) => ({ ...s, maxLineLengthCh: v[0] }))}
            />
          </div>
        </div>

        {/* Font picks */}
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <FontPicker
            label="Body / Sans"
            options={SANS_OPTIONS}
            value={state.sansKey}
            onChange={(v) => setState((s) => ({ ...s, sansKey: v }))}
          />
          <FontPicker
            label="Display"
            options={DISPLAY_OPTIONS}
            value={state.displayKey}
            onChange={(v) => setState((s) => ({ ...s, displayKey: v }))}
          />
          <FontPicker
            label="Serif"
            options={SERIF_OPTIONS}
            value={state.serifKey}
            onChange={(v) => setState((s) => ({ ...s, serifKey: v }))}
          />
          <FontPicker
            label="Mono"
            options={MONO_OPTIONS}
            value={state.monoKey}
            onChange={(v) => setState((s) => ({ ...s, monoKey: v }))}
          />
        </div>

        {/* Advanced row */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <Settings2 className="h-3.5 w-3.5" />
            {showAdvanced ? "Hide" : "Show"} advanced controls
          </button>
          {showAdvanced && (
            <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Fluid sizing (clamp)</Label>
                  <Switch
                    checked={state.fluid}
                    onCheckedChange={(v) => setState((s) => ({ ...s, fluid: v }))}
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Sizes interpolate between 360px → 1280px viewports.
                </p>
              </div>
              <div>
                <Label className="text-xs">
                  Letter spacing boost · <span className="font-mono">{state.letterSpacingBoost.toFixed(2)}em</span>
                </Label>
                <Slider
                  className="mt-2"
                  value={[state.letterSpacingBoost]}
                  min={0}
                  max={0.06}
                  step={0.005}
                  onValueChange={(v) => setState((s) => ({ ...s, letterSpacingBoost: v[0] }))}
                />
              </div>
              <div>
                <Label className="text-xs">
                  Paragraph spacing × <span className="font-mono">{state.paragraphSpacingMultiplier.toFixed(2)}</span>
                </Label>
                <Slider
                  className="mt-2"
                  value={[state.paragraphSpacingMultiplier]}
                  min={1}
                  max={2.5}
                  step={0.1}
                  onValueChange={(v) => setState((s) => ({ ...s, paragraphSpacingMultiplier: v[0] }))}
                />
              </div>
              <div>
                <Label className="text-xs flex items-center gap-1">
                  <Link2 className="h-3 w-3" />
                  Paired palette primary
                </Label>
                <Input
                  value={state.paletteHex ?? ""}
                  onChange={(e) => setState((s) => ({ ...s, paletteHex: e.target.value }))}
                  className="mt-2 h-9 font-mono text-xs uppercase"
                  placeholder="#3b82f6"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Drives preview background + contrast grading.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === View toggles =================================================== */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-3 shadow-sm">
        <span className="text-xs font-medium text-muted-foreground">Specimen</span>
        <div className="flex flex-wrap gap-1 rounded-md border p-0.5">
          {SPECIMENS.map((sp) => (
            <button
              key={sp.key}
              type="button"
              onClick={() => setSpecimen(sp.key)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                specimen === sp.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {sp.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="font-medium text-muted-foreground">Mode</span>
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, mode: s.mode === "light" ? "dark" : "light" }))}
              className="rounded-md border px-2 py-1 text-xs capitalize"
            >
              {state.mode}
            </button>
          </label>
          <label className="flex items-center gap-2 text-xs">
            <span className="font-medium text-muted-foreground">WCAG 1.4.12 override</span>
            <Switch checked={applyOverride} onCheckedChange={setApplyOverride} />
          </label>
        </div>
      </div>

      {/* === Tabs =========================================================== */}
      <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
          <TabsTrigger value="preview">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Specimen
          </TabsTrigger>
          <TabsTrigger value="report">
            <FileCheck className="mr-1.5 h-3.5 w-3.5" />
            Report ({report.summary.fail + report.summary.caution > 0
              ? `${report.summary.fail + report.summary.caution} issues`
              : "all pass"})
          </TabsTrigger>
          <TabsTrigger value="readability">
            <Wand2 className="mr-1.5 h-3.5 w-3.5" />
            Readability
          </TabsTrigger>
          <TabsTrigger value="export">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-3">
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <TypeIcon className="h-3.5 w-3.5" />
              <span>Live specimen — renders the active stack and tokens</span>
              {applyOverride && (
                <Badge variant="outline" className="ml-auto text-[10px]">
                  WCAG 1.4.12 override active
                </Badge>
              )}
            </div>
            <TypographyPreview
              tokens={tokens}
              specimen={specimen}
              background={paletteTokens.background}
              foreground={paletteTokens.foreground}
              muted={paletteTokens.muted}
              accent={paletteTokens.primary}
              applyTextSpacingOverride={applyOverride}
            />
          </div>
        </TabsContent>

        <TabsContent value="report" className="mt-3">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <TypographyReportCard report={report} />
          </div>
        </TabsContent>

        <TabsContent value="readability" className="mt-3">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <ReadabilityAnalyzer />
          </div>
        </TabsContent>

        <TabsContent value="export" className="mt-3">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <TypographyExportsPanel name={state.name} tokens={tokens} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FontPicker({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: typeof FONT_STACKS
  value: string
  onChange: (key: string) => void
}) {
  const active = fontByKey(value)
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-9 w-full rounded-md border bg-background px-2 text-sm"
      >
        {options.map((f) => (
          <option key={f.key} value={f.key}>
            {f.label}
          </option>
        ))}
      </select>
      {active && (
        <p
          className="mt-1.5 line-clamp-2 text-[11px] text-muted-foreground"
          title={active.notes}
          style={{ fontFamily: active.family }}
        >
          {active.notes}
        </p>
      )}
    </div>
  )
}
