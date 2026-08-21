"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Shared presentation for the prospects admin screens.
 *
 * Two rules run through this file:
 *  - Tier and status are always spelled out in text. Colour only repeats what
 *    the words already say, so nothing depends on distinguishing hues.
 *  - Copy confirmations are announced through a live region that the page
 *    renders once and keeps in the DOM, not one injected alongside its message.
 */

export type ProspectRecord = {
  id: string
  company: string
  website: string | null
  country: string | null
  sector: string | null
  tier: string | null
  sendability: string | null
  emailAddress: string | null
  addressSource: string | null
  contactRole: string | null
  overlay: string | null
  hasStatement: boolean
  statementNote: string | null
  findings: Array<{ n: number; text: string }> | null
  evidence: string | null
  subject: string | null
  emailBody: string | null
  caution: string | null
  score: number
  status: string
  notes: string | null
  scannedAt: string | null
  createdAt: string | null
  updatedAt: string | null
}

export const TIER_LABELS: Record<string, string> = {
  "send-now": "Send now",
  "send-careful": "Send carefully",
  "linkedin-only": "LinkedIn only",
  hold: "Hold",
}

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  sent: "Sent",
  replied: "Replied",
  won: "Won",
  dead: "Dead",
}

const TIER_CLASSES: Record<string, string> = {
  "send-now": "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100",
  "send-careful": "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100",
  "linkedin-only": "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100",
  hold: "border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100",
}

const STATUS_CLASSES: Record<string, string> = {
  new: "border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
  sent: "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100",
  replied: "border-violet-300 bg-violet-50 text-violet-900 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-100",
  won: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100",
  dead: "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
}

const PILL = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"

/**
 * Freshness. The daily routine adds a small number of prospects each day, and
 * those are the ones worth acting on first, so they need to be findable without
 * reading the whole table.
 *
 * Comparison is done on the viewer's local calendar day rather than on elapsed
 * hours, because "today" is what the person actually means.
 */
function localDayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`
}

export function addedOnDay(prospect: { createdAt: string | null }, offsetDays = 0) {
  if (!prospect.createdAt) return false
  const created = new Date(prospect.createdAt)
  if (Number.isNaN(created.getTime())) return false
  const target = new Date()
  target.setDate(target.getDate() - offsetDays)
  return localDayKey(created) === localDayKey(target)
}

export const isAddedToday = (prospect: { createdAt: string | null }) => addedOnDay(prospect, 0)

export function isAddedWithinDays(prospect: { createdAt: string | null }, days: number) {
  if (!prospect.createdAt) return false
  const created = new Date(prospect.createdAt)
  if (Number.isNaN(created.getTime())) return false
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  cutoff.setHours(0, 0, 0, 0)
  return created.getTime() >= cutoff.getTime()
}

/** Carries its own text, so it never depends on colour to read as "new". */
export function NewTodayBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        PILL,
        "border-teal-400 bg-teal-100 text-teal-950 dark:border-teal-500 dark:bg-teal-900 dark:text-teal-50",
        className
      )}
    >
      New today
    </span>
  )
}

export function tierLabel(tier: string | null) {
  if (!tier) return "Untiered"
  return TIER_LABELS[tier] ?? tier
}

export function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status
}

export function TierBadge({ tier }: { tier: string | null }) {
  const key = tier ?? ""
  return (
    <span className={cn(PILL, TIER_CLASSES[key] ?? TIER_CLASSES.hold)}>{tierLabel(tier)}</span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(PILL, STATUS_CLASSES[status] ?? STATUS_CLASSES.new)}>{statusLabel(status)}</span>
  )
}

/**
 * A persistent polite live region. Render it once per page and feed it through
 * `useAnnouncer`; the element exists from first paint so assistive technology
 * is already watching when a message arrives.
 */
export function useAnnouncer() {
  const [message, setMessage] = useState("")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const announce = useCallback((text: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    // Clear first so repeating the same message still registers as a change.
    setMessage("")
    timerRef.current = setTimeout(() => setMessage(text), 60)
  }, [])

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  return { message, announce }
}

export function LiveRegion({ message }: { message: string }) {
  return (
    <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </p>
  )
}

type CopyButtonProps = {
  /** The text placed on the clipboard. */
  value: string | null | undefined
  /** Visible button text, e.g. "Copy email". */
  label: string
  /** What the live region says on success, e.g. "Email body copied". */
  announcement: string
  onAnnounce: (message: string) => void
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function CopyButton({
  value,
  label,
  announcement,
  onAnnounce,
  variant = "outline",
  size = "sm",
  className,
}: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const handleCopy = async () => {
    if (!value) return

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable")
      }
      await navigator.clipboard.writeText(value)
      setState("copied")
      onAnnounce(`${announcement}.`)
    } catch {
      setState("error")
      onAnnounce(`${label} failed. Select the text and copy it manually.`)
    }

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setState("idle"), 2500)
  }

  return (
    <Button
      type="button"
      variant={state === "copied" ? "default" : variant}
      size={size}
      onClick={handleCopy}
      disabled={!value}
      className={className}
    >
      {state === "copied" ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      {state === "copied" ? "Copied" : state === "error" ? `${label} — failed` : label}
    </Button>
  )
}
