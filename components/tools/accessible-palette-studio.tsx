"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Eye,
  FileCheck,
  Image as ImageIcon,
  Keyboard,
  Layers,
  Moon,
  RefreshCw,
  Redo2,
  Share2,
  Sliders,
  Sparkles,
  Sun,
  Undo2,
  Wand2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { gradeTokens } from "@/lib/color/grade"
import { isValidHex, oklchToHex } from "@/lib/color/oklch"
import { describeHex } from "@/lib/color/names"
import { generatePalette, STOPS, FAMILY_NAMES, type FamilyName } from "@/lib/color/scales"
import { deriveTokens, type SemanticTokens } from "@/lib/color/tokens"
import { CVD_LABELS, type CVDType, cvdCssFilter } from "@/lib/color/cvd"

import { CVDFilterDefs } from "./palette-studio/cvd-defs"
import { ReportCard } from "./palette-studio/report"
import { ExportsPanel } from "./palette-studio/exports"
import { OklchSliders } from "./palette-studio/oklch-sliders"
import { ImageExtract } from "./palette-studio/image-extract"
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
  /** Token-level overrides applied by auto-fix or manual tweaks. */
  overrides: { light: Partial<SemanticTokens>; dark: Partial<SemanticTokens> }
}

const DEFAULT_STATE: StudioState = {
  name: "Aurora",
  primary: "#3b82f6",
  secondary: "#a855f7",
  accent: "#22c55e",
  neutralTilt: "true",
  useDerivedSecondary: true,
  useDerivedAccent: true,
  overrides: { light: {}, dark: {} },
}

const HISTORY_KEY = "accessible-palette-studio:history-v1"
const MAX_HISTORY = 50

function encodeHash(state: StudioState): string {
  const params = new URLSearchParams()
  params.set("n", state.name)
  params.set("p", state.primary.replace("#", ""))
  if (!state.useDerivedSecondary) params.set("s", state.secondary.replace("#", ""))
  if (!state.useDerivedAccent) params.set("a", state.accent.replace("#", ""))
  if (state.neutralTilt !== "true") params.set("t", state.neutralTilt)
  // Overrides encoded as light:key:hex,dark:key:hex pairs
  const encodeOverrides = (set: Partial<SemanticTokens>, prefix: string) =>
    Object.entries(set)
      .filter(([, v]) => typeof v === "string")
      .map(([k, v]) => `${prefix}:${k}:${String(v).replace("#", "")}`)
      .join(",")
  const lo = encodeOverrides(state.overrides.light, "l")
  const dko = encodeOverrides(state.overrides.dark, "d")
  const combined = [lo, dko].filter(Boolean).join(",")
  if (combined) params.set("o", combined)
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
    if (params.has("o")) {
      const raw = params.get("o") ?? ""
      const light: Partial<SemanticTokens> = {}
      const dark: Partial<SemanticTokens> = {}
      for (const entry of raw.split(",")) {
        const [mode, key, hex] = entry.split(":")
        const value = `#${hex}`
        if (!isValidHex(value)) continue
        if (mode === "l") (light as Record<string, string>)[key] = value
        else if (mode === "d") (dark as Record<string, string>)[key] = value
      }
      out.overrides = { light, dark }
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

function applyOverrides(base: SemanticTokens, ov: Partial<SemanticTokens>): SemanticTokens {
  if (!ov || Object.keys(ov).length === 0) return base
  return { ...base, ...(ov as object) } as SemanticTokens
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
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [editingFamily, setEditingFamily] = useState<"primary" | "secondary" | "accent">("primary")

  // History (undo/redo)
  const [history, setHistory] = useState<StudioState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const skipHistoryRef = useRef(false)

  // ── URL hash sync ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return
    const decoded = decodeHash(window.location.hash)
    if (decoded) {
      skipHistoryRef.current = true
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

  // ── History tracking ───────────────────────────────────────────────────────
  useEffect(() => {
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false
      return
    }
    setHistory((h) => {
      const next = [...h.slice(0, historyIndex + 1), state].slice(-MAX_HISTORY)
      return next
    })
    setHistoryIndex((i) => Math.min(i + 1, MAX_HISTORY - 1))
    // We DO NOT want history to depend on historyIndex (would recurse) — disable the warning.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  // Persist last palette to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(state))
    } catch {
      // quota / private mode — ignore
    }
  }, [state])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const undo = useCallback(() => {
    if (!canUndo) return
    skipHistoryRef.current = true
    const prev = history[historyIndex - 1]
    setHistoryIndex((i) => i - 1)
    setState(prev)
  }, [canUndo, history, historyIndex])

  const redo = useCallback(() => {
    if (!canRedo) return
    skipHistoryRef.current = true
    const next = history[historyIndex + 1]
    setHistoryIndex((i) => i + 1)
    setState(next)
  }, [canRedo, history, historyIndex])

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

  const tokenSet = useMemo(() => {
    const base = deriveTokens(scales)
    return {
      light: applyOverrides(base.light, state.overrides.light),
      dark: applyOverrides(base.dark, state.overrides.dark),
    }
  }, [scales, state.overrides])

  const activeTokens = mode === "light" ? tokenSet.light : tokenSet.dark
  const report = useMemo(() => gradeTokens(activeTokens), [activeTokens])

  // ── Handlers ────────────────────────────────────────────────────────────────
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
      overrides: { light: {}, dark: {} },
    }))
  }

  // Find the pairing's fgKey and override that token in the current mode
  const handleAutoFix = useCallback(
    (pairingId: string, fixedFg: string) => {
      const pair = report.pairings.find((p) => p.id === pairingId)
      if (!pair) return
      const key = pair.fgKey as keyof SemanticTokens
      setState((s) => ({
        ...s,
        overrides: {
          ...s.overrides,
          [mode]: { ...s.overrides[mode], [key]: fixedFg },
        },
      }))
    },
    [report, mode]
  )

  const clearOverrides = () =>
    setState((s) => ({ ...s, overrides: { light: {}, dark: {} } }))

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const inEditable =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      if (inEditable && e.key !== "Escape") return

      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((mod && e.shiftKey && e.key.toLowerCase() === "z") || (mod && e.key.toLowerCase() === "y")) {
        e.preventDefault()
        redo()
      } else if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault()
        copyShareUrl()
      } else if (!mod && (e.key === "m" || e.key === "M")) {
        e.preventDefault()
        setMode((m) => (m === "light" ? "dark" : "light"))
      } else if (!mod && (e.key === "r" || e.key === "R")) {
        e.preventDefault()
        randomize()
      } else if (!mod && (e.key === "?" || e.key === "/")) {
        e.preventDefault()
        setShowShortcuts((v) => !v)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [undo, redo, copyShareUrl])

  // ── CVD wrapper ─────────────────────────────────────────────────────────────
  const cvdStyle: CSSProperties = useMemo(() => {
    const filter = cvdCssFilter(cvd)
    return filter ? { filter } : {}
  }, [cvd])

  const editingHex =
    editingFamily === "primary"
      ? state.primary
      : editingFamily === "secondary"
      ? state.secondary
      : state.accent

  const onOklchSliderChange = (hex: string) => {
    if (editingFamily === "primary") setState((s) => ({ ...s, primary: hex }))
    else if (editingFamily === "secondary")
      setState((s) => ({ ...s, secondary: hex, useDerivedSecondary: false }))
    else setState((s) => ({ ...s, accent: hex, useDerivedAccent: false }))
  }

  const hasOverrides =
    Object.keys(state.overrides.light).length + Object.keys(state.overrides.dark).length > 0

  return (
    <div className="space-y-6">
      <CVDFilterDefs />

      {/* === Header / Controls ================================================ */}
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="palette-name" className="text-xs">Palette name</Label>
              <Input
                id="palette-name"
                value={state.name}
                onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                className="h-9 w-48"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (⌘Z)"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (⌘⇧Z)"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="sm" onClick={randomize} title="Randomize (R)">
              <Wand2 className="mr-1.5 h-3.5 w-3.5" />
              Randomize
            </Button>
            <Button variant="outline" size="sm" onClick={() => setState(DEFAULT_STATE)}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </Button>
            <Button variant="default" size="sm" onClick={copyShareUrl} title="Copy share URL (⌘S)">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShortcuts((v) => !v)}
              title="Keyboard shortcuts (?)"
            >
              <Keyboard className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <ColorPickerControl
            label="Primary"
            value={state.primary}
            onChange={(v) => setState((s) => ({ ...s, primary: v }))}
            onEdit={() => {
              setEditingFamily("primary")
              setShowAdvanced(true)
            }}
            description={describeHex(state.primary)}
            required
          />
          <ColorPickerControl
            label="Secondary"
            value={state.secondary}
            onChange={(v) =>
              setState((s) => ({ ...s, secondary: v, useDerivedSecondary: false }))
            }
            onEdit={() => {
              setEditingFamily("secondary")
              setShowAdvanced(true)
            }}
            description={state.useDerivedSecondary ? "Auto-derived (+210° hue)" : describeHex(state.secondary)}
            toggleDerived={() =>
              setState((s) => ({ ...s, useDerivedSecondary: !s.useDerivedSecondary }))
            }
            derived={state.useDerivedSecondary}
          />
          <ColorPickerControl
            label="Accent"
            value={state.accent}
            onChange={(v) => setState((s) => ({ ...s, accent: v, useDerivedAccent: false }))}
            onEdit={() => {
              setEditingFamily("accent")
              setShowAdvanced(true)
            }}
            description={state.useDerivedAccent ? "Auto-derived (+120° hue)" : describeHex(state.accent)}
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

        {/* Advanced panel: OKLCH sliders + image extract */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {showAdvanced ? "Hide" : "Show"} OKLCH controls & image extraction
          </button>

          {showAdvanced && (
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Sliders className="h-3.5 w-3.5" />
                    OKLCH controls
                  </p>
                  <div className="flex rounded-md border bg-background p-0.5">
                    {(["primary", "secondary", "accent"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setEditingFamily(f)}
                        className={`rounded px-2 py-0.5 text-[10px] font-medium capitalize ${
                          editingFamily === f
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <OklchSliders hex={editingHex} onChange={onOklchSliderChange} />
              </div>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Extract from image
                </p>
                <ImageExtract
                  onPrimary={(hex) => setState((s) => ({ ...s, primary: hex }))}
                />
              </div>
            </div>
          )}
        </div>

        {hasOverrides && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs">
            <Wand2 className="h-3 w-3 text-primary" />
            <span>Auto-fix overrides applied</span>
            <button
              type="button"
              onClick={clearOverrides}
              className="font-semibold text-primary hover:underline"
            >
              Clear
            </button>
          </div>
        )}
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
            <ReportCard
              report={report}
              tokens={activeTokens}
              contrastModel={contrastModel}
              onAutoFix={handleAutoFix}
            />
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

      {/* Keyboard shortcut overlay */}
      {showShortcuts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border bg-card p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Keyboard className="h-4 w-4" />
              Keyboard shortcuts
            </h3>
            <ul className="space-y-1.5 text-sm">
              {[
                ["⌘ Z", "Undo"],
                ["⌘ ⇧ Z", "Redo"],
                ["⌘ S", "Copy share URL"],
                ["M", "Toggle light / dark"],
                ["R", "Randomize"],
                ["?", "This help"],
              ].map(([key, action]) => (
                <li key={key} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{action}</span>
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {key}
                  </kbd>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────── ColorPickerControl */
function ColorPickerControl({
  label,
  value,
  onChange,
  onEdit,
  description,
  toggleDerived,
  derived,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onEdit?: () => void
  description?: string
  toggleDerived?: () => void
  derived?: boolean
  required?: boolean
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-[10px] uppercase tracking-wide text-muted-foreground hover:text-foreground"
              title="OKLCH controls"
            >
              <Sliders className="h-3 w-3" />
            </button>
          )}
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
          const textColor = i < 5 ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.85)"
          return (
            <button
              key={stop}
              type="button"
              onClick={() => onCopy(hex)}
              className="group relative h-12 rounded-md border text-left text-[10px] font-mono transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: hex, color: textColor, borderColor: "rgba(0,0,0,0.08)" }}
              title={`${family}-${stop} · ${hex} · ${describeHex(hex)}`}
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
