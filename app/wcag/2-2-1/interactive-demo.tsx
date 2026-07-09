"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Clock, AlertTriangle, XCircle, CheckCircle2, RefreshCw } from "lucide-react"

type Mode = "good" | "bad"
type Phase = "running" | "warning" | "expired"

const START = 30 // seconds
const WARNING_AT = 10 // show warning when this many seconds remain
const EXTEND_BY = 20 // seconds added per extension
const MAX_EXTENSIONS = 10

export default function TimingDemo() {
  const [mode, setMode] = useState<Mode>("good")
  const [remaining, setRemaining] = useState(START)
  const [phase, setPhase] = useState<Phase>("running")
  const [extensions, setExtensions] = useState(0)
  const [status, setStatus] = useState("Session started with 30 seconds remaining.")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Clear any running interval
  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // (Re)start the countdown whenever the mode changes or on manual reset
  const reset = (nextMode: Mode = mode) => {
    clearTimer()
    setMode(nextMode)
    setRemaining(START)
    setPhase("running")
    setExtensions(0)
    setStatus("Session started with 30 seconds remaining.")
  }

  // Drive the countdown with a single interval; cleaned up on unmount/re-run
  useEffect(() => {
    if (phase === "expired") return
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1
        if (next <= 0) {
          clearTimer()
          setPhase("expired")
          setStatus(
            mode === "good"
              ? "Session expired. Your work was saved — sign back in to continue."
              : "Session expired without warning. Unsaved work was lost."
          )
          return 0
        }
        // In the GOOD version, surface a warning + extend control before expiry.
        if (mode === "good" && next === WARNING_AT) {
          setPhase("warning")
          setStatus(`Warning: your session expires in ${WARNING_AT} seconds. Press Extend to continue.`)
        }
        return next
      })
    }, 1000)
    return clearTimer
    // Re-arm the timer when the mode changes or after a reset back to "running"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, phase === "expired"])

  const extend = () => {
    if (extensions >= MAX_EXTENSIONS) {
      setStatus("Maximum number of extensions reached.")
      return
    }
    const count = extensions + 1
    setExtensions(count)
    setRemaining((prev) => prev + EXTEND_BY)
    setPhase("running")
    setStatus(
      `Session extended by ${EXTEND_BY} seconds (extension ${count} of ${MAX_EXTENSIONS}). You can extend again.`
    )
  }

  const pct = Math.max(0, Math.min(100, (remaining / START) * 100))
  const barColor =
    phase === "expired"
      ? "bg-rose-500"
      : phase === "warning"
        ? "bg-amber-500"
        : "bg-green-500"

  return (
    <div className="space-y-6">
      {/* Mode toggle: good (adjustable) vs bad (silent) */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Compare implementations:
        </span>
        <div className="flex gap-2">
          <Button
            onClick={() => reset("good")}
            variant={mode === "good" ? "default" : "outline"}
            size="sm"
          >
            Adjustable (passes)
          </Button>
          <Button
            onClick={() => reset("bad")}
            variant={mode === "bad" ? "default" : "outline"}
            size="sm"
          >
            Silent timeout (fails)
          </Button>
        </div>
      </div>

      {/* Timer panel */}
      <div
        className={`rounded-xl border p-6 ${
          phase === "expired"
            ? "border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20"
            : "border-slate-200 dark:border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <Clock className="h-5 w-5 text-blue-500" aria-hidden="true" />
            {mode === "good" ? "Adjustable session" : "Fixed session"}
          </h3>
          <span
            className="font-mono text-2xl font-bold text-slate-900 dark:text-white"
            aria-hidden="true"
          >
            0:{remaining.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Countdown bar */}
        <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-4">
          <div
            className={`h-full ${barColor} transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Warning + extend control (good mode only) */}
        {mode === "good" && phase === "warning" && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm text-amber-800 dark:text-amber-200 flex-1 min-w-[12rem]">
              Your session expires in <strong>{remaining}s</strong>. Extend to keep working.
            </p>
            <Button onClick={extend} size="sm" className="bg-green-600 hover:bg-green-700">
              <RefreshCw className="h-4 w-4 mr-1" aria-hidden="true" />
              Extend session
            </Button>
          </div>
        )}

        {/* Expired state */}
        {phase === "expired" && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 p-4">
            <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="text-sm text-slate-700 dark:text-slate-300">
              <p className="font-semibold text-rose-700 dark:text-rose-300 mb-1">
                Session expired
              </p>
              <p>
                {mode === "good"
                  ? "The adjustable version warned you first and preserved your work — you never lose data unexpectedly."
                  : "The silent version gave no warning and no way to extend. This is the failure WCAG 2.2.1 prevents."}
              </p>
            </div>
          </div>
        )}

        {/* Live status for screen reader users */}
        <p
          role="status"
          aria-live="polite"
          className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
        >
          {mode === "good" && phase !== "expired" && (
            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <span>{status}</span>
        </p>

        {/* Reset control */}
        <div className="mt-4">
          <Button onClick={() => reset()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" aria-hidden="true" />
            Reset demo
          </Button>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        The adjustable version warns you {WARNING_AT} seconds before expiry and lets you
        extend by {EXTEND_BY} seconds with one click, up to {MAX_EXTENSIONS} times — meeting
        the &ldquo;warn and extend&rdquo; remedy. The silent version simply logs you out.
      </p>
    </div>
  )
}
