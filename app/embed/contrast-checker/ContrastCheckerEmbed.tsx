"use client"

import { useEffect, useId, useState } from "react"
import { ArrowLeftRight, Check, X } from "lucide-react"
import { EmbedFooter, EmbedFrame } from "@/components/embed/embed-frame"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { contrastRatioWCAG } from "@/lib/color/oklch"
import { cn } from "@/lib/utils"

/** Accepts #RGB or #RRGGBB, with or without the hash. Returns #RRGGBB, or null. */
function normalizeHex(value: string): string | null {
  const raw = value.trim().replace(/^#/, "")
  if (/^[0-9a-f]{3}$/i.test(raw)) {
    return `#${raw
      .split("")
      .map((digit) => digit + digit)
      .join("")}`.toUpperCase()
  }
  if (/^[0-9a-f]{6}$/i.test(raw)) return `#${raw}`.toUpperCase()
  return null
}

const REQUIREMENTS = [
  { content: "Normal text", level: "AA", min: 4.5 },
  { content: "Normal text", level: "AAA", min: 7 },
  { content: "Large text", level: "AA", min: 3 },
  { content: "Large text", level: "AAA", min: 4.5 },
  { content: "UI and graphics", level: "AA", min: 3 },
] as const

function summarize(ratio: number): string {
  if (ratio >= 7) return "Passes AA and AAA for all text sizes."
  if (ratio >= 4.5) return "Passes AA for all text, and AAA for large text only."
  if (ratio >= 3) return "Passes AA for large text, UI and graphics only."
  return "Fails every WCAG 2.2 contrast minimum."
}

// The site-wide --input border is about 1.2:1 against the background, too faint
// to show where a field is (WCAG 1.4.11). slate-500 is 4.8:1 on white and 4.2:1
// on the dark background.
const FIELD_BORDER = "border-slate-500"

interface ColorFieldProps {
  label: string
  draft: string
  value: string
  showError: boolean
  onDraftChange: (draft: string) => void
  onPick: (hex: string) => void
  onBlur: () => void
}

function ColorField({ label, draft, value, showError, onDraftChange, onPick, onBlur }: ColorFieldProps) {
  const inputId = useId()
  const errorId = useId()

  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value.toLowerCase()}
          onChange={(event) => onPick(event.target.value.toUpperCase())}
          aria-label={`Pick ${label.toLowerCase()}`}
          className={cn(
            "h-10 w-12 shrink-0 cursor-pointer rounded-md border bg-background p-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            FIELD_BORDER,
          )}
        />
        <Input
          id={inputId}
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onBlur={onBlur}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? errorId : undefined}
          maxLength={7}
          spellCheck={false}
          autoComplete="off"
          className={cn("font-mono uppercase", FIELD_BORDER)}
        />
      </div>
      {showError && (
        <p id={errorId} className="text-xs text-red-700 dark:text-red-400">
          Use a 3 or 6 digit hex code, like #1D4ED8. Results use the last valid color.
        </p>
      )}
    </div>
  )
}

export default function ContrastCheckerEmbed() {
  // Drafts hold what is typed; fg and bg hold the last valid colour, so a
  // half-typed hex code never blanks the result. Errors show on blur rather
  // than on every keystroke, and clear as soon as the code is valid again.
  const [fgDraft, setFgDraft] = useState("#1D4ED8")
  const [bgDraft, setBgDraft] = useState("#FFFFFF")
  const [fg, setFg] = useState("#1D4ED8")
  const [bg, setBg] = useState("#FFFFFF")
  const [fgError, setFgError] = useState(false)
  const [bgError, setBgError] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const [announcement, setAnnouncement] = useState("")

  const ratio = contrastRatioWCAG(fg, bg)
  // Truncate rather than round, so a 4.497 pair never reads "4.5:1" beside a
  // Fail. The epsilon keeps 21:1 from flooring to 20.99 on float noise.
  const shownRatio = Math.floor(ratio * 100 + 1e-9) / 100
  const summary = summarize(ratio)
  const errorText = [
    fgError && "Text color is not a valid hex code.",
    bgError && "Background color is not a valid hex code.",
  ]
    .filter(Boolean)
    .join(" ")

  // Debounced so dragging the native colour picker does not flood a screen
  // reader with one announcement per frame. Nothing is announced on load.
  useEffect(() => {
    if (!interacted) return
    const timer = window.setTimeout(() => {
      setAnnouncement(`${errorText} Contrast ratio ${shownRatio} to 1. ${summary}`.trim())
    }, 600)
    return () => window.clearTimeout(timer)
  }, [interacted, errorText, shownRatio, summary])

  const typeForeground = (draft: string) => {
    setInteracted(true)
    setFgDraft(draft)
    const hex = normalizeHex(draft)
    if (hex) {
      setFg(hex)
      setFgError(false)
    }
  }

  const typeBackground = (draft: string) => {
    setInteracted(true)
    setBgDraft(draft)
    const hex = normalizeHex(draft)
    if (hex) {
      setBg(hex)
      setBgError(false)
    }
  }

  const pickForeground = (hex: string) => {
    setInteracted(true)
    setFg(hex)
    setFgDraft(hex)
    setFgError(false)
  }

  const pickBackground = (hex: string) => {
    setInteracted(true)
    setBg(hex)
    setBgDraft(hex)
    setBgError(false)
  }

  const swap = () => {
    setInteracted(true)
    setFg(bg)
    setBg(fg)
    setFgDraft(bg)
    setBgDraft(fg)
    setFgError(false)
    setBgError(false)
  }

  return (
    <EmbedFrame>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-base font-semibold">Color contrast checker</h1>
        <Button type="button" variant="outline" size="sm" onClick={swap} className={FIELD_BORDER}>
          <ArrowLeftRight className="mr-2 h-4 w-4" aria-hidden="true" />
          Swap colors
        </Button>
      </div>

      <div className="grid gap-3 min-[420px]:grid-cols-2">
        <ColorField
          label="Text color"
          draft={fgDraft}
          value={fg}
          showError={fgError}
          onDraftChange={typeForeground}
          onPick={pickForeground}
          onBlur={() => setFgError(normalizeHex(fgDraft) === null)}
        />
        <ColorField
          label="Background color"
          draft={bgDraft}
          value={bg}
          showError={bgError}
          onDraftChange={typeBackground}
          onPick={pickBackground}
          onBlur={() => setBgError(normalizeHex(bgDraft) === null)}
        />
      </div>

      {/* A sample of the pair under test, so it fails contrast whenever the pair
          does. That presentation is the information being shown, which is the
          essential exception for images of text (WCAG 1.4.5), and the ratio and
          results beside it say the same thing in real text. Drawing it as an
          SVG image with a text alternative, rather than as page text, keeps a
          failing pair from reading as a contrast failure of the widget itself,
          including in audits of the sites that embed it. No viewBox, so the
          font sizes stay true pixels. */}
      <svg
        role="img"
        aria-label={`Preview of ${fg} text on a ${bg} background`}
        width="100%"
        height="88"
        className="block rounded-lg border border-slate-200 dark:border-slate-700"
        style={{ backgroundColor: bg }}
      >
        <text x="16" y="38" fill={fg} fontSize="24" fontWeight="600">
          Large text at 24px
        </text>
        <text x="16" y="70" fill={fg} fontSize="16">
          Normal text at 16px
        </text>
      </svg>

      <div className="grid gap-4 min-[520px]:grid-cols-[minmax(0,11rem)_1fr]">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Contrast ratio</p>
          <p className="text-4xl font-bold tabular-nums">
            {shownRatio}
            <span aria-hidden="true">:1</span>
            <span className="sr-only"> to 1</span>
          </p>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{summary}</p>
        </div>

        <table className="w-full text-sm">
          <caption className="sr-only">WCAG 2.2 contrast results</caption>
          <thead>
            <tr className="text-left text-xs text-slate-600 dark:text-slate-400">
              <th scope="col" className="pb-1 pr-2 font-medium">Content</th>
              <th scope="col" className="pb-1 pr-2 font-medium">Level</th>
              <th scope="col" className="pb-1 pr-2 font-medium">Minimum</th>
              <th scope="col" className="pb-1 font-medium">Result</th>
            </tr>
          </thead>
          <tbody>
            {REQUIREMENTS.map(({ content, level, min }) => {
              const pass = ratio >= min
              return (
                <tr key={`${content}-${level}`} className="border-t border-slate-200 dark:border-slate-800">
                  <th scope="row" className="py-1 pr-2 text-left font-normal">{content}</th>
                  <td className="py-1 pr-2">{level}</td>
                  <td className="py-1 pr-2 tabular-nums">{min}:1</td>
                  <td className="py-1">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 font-medium",
                        pass ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400",
                      )}
                    >
                      {pass ? (
                        <Check className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <X className="h-4 w-4" aria-hidden="true" />
                      )}
                      {pass ? "Pass" : "Fail"}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p role="status" className="sr-only">
        {announcement}
      </p>

      <EmbedFooter
        note="Large text is 24px, or 18.66px bold."
        href="/tools/contrast-checker"
        linkText="Fix suggestions on Accessibility.build"
      />
    </EmbedFrame>
  )
}
