"use client"

import { useState, useEffect, useRef } from "react"

type Mode = "global" | "focus"

interface LogEntry {
  id: number
  text: string
  kind: "fired" | "blocked"
}

export default function ShortcutDemo() {
  const [enabled, setEnabled] = useState(true)
  const [mode, setMode] = useState<Mode>("global")
  const [stars, setStars] = useState(0)
  const [log, setLog] = useState<LogEntry[]>([])
  const [panelFocused, setPanelFocused] = useState(false)

  // Keep the latest state available to the listener without re-binding constantly
  const logId = useRef(0)

  const addLog = (text: string, kind: LogEntry["kind"]) => {
    logId.current += 1
    const entry = { id: logId.current, text, kind }
    setLog((prev) => [entry, ...prev].slice(0, 8))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // The shortcut is a single "s" with no modifier
      if (e.key.toLowerCase() !== "s") return
      if (e.ctrlKey || e.altKey || e.metaKey) return

      const target = e.target as HTMLElement
      const isTextField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable

      // Remedy 1: turned off entirely
      if (!enabled) {
        if (!isTextField) {
          addLog('"s" pressed — shortcut is turned off, nothing happened', "blocked")
        }
        return
      }

      // Real apps must never hijack typing in a field
      if (isTextField) {
        addLog('"s" typed into the text field — not treated as a shortcut', "blocked")
        return
      }

      // Remedy 3: focus-only mode fires only when the demo panel has focus
      if (mode === "focus" && !panelFocused) {
        addLog('"s" pressed outside the panel — focus-scoped, so it did not fire', "blocked")
        return
      }

      e.preventDefault()
      setStars((n) => n + 1)
      addLog('"s" fired the Star shortcut ⭐', "fired")
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [enabled, mode, panelFocused])

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
      {/* Controls */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                Turn shortcut off
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Remedy 1: disable the single-key shortcut entirely.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              aria-label="Toggle keyboard shortcut on or off"
              onClick={() => setEnabled((v) => !v)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                enabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            Shortcut is {enabled ? "ON" : "OFF"}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">
            Activation scope
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Remedy 3: fire only when the panel below has focus.
          </p>
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-1">
            <button
              type="button"
              onClick={() => setMode("global")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                mode === "global"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Global
            </button>
            <button
              type="button"
              onClick={() => setMode("focus")}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                mode === "focus"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            >
              Focus only
            </button>
          </div>
        </div>
      </div>

      {/* Star counter + focusable panel */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-5 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            Times the Star shortcut fired
          </p>
          <p className="text-4xl font-bold text-amber-500">⭐ {stars}</p>
        </div>

        <div
          tabIndex={0}
          onFocus={() => setPanelFocused(true)}
          onBlur={() => setPanelFocused(false)}
          className={`rounded-lg border-2 p-5 text-center outline-none transition-colors ${
            panelFocused
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
              : "border-dashed border-slate-300 dark:border-slate-700"
          }`}
        >
          <p className="font-medium text-slate-900 dark:text-white">
            Focusable player panel
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {panelFocused ? "Focused" : "Click or Tab here to focus"}
            {mode === "focus" &&
              (panelFocused
                ? ' — "s" will fire while focused here'
                : ' — "s" is inactive until focused')}
          </p>
        </div>
      </div>

      {/* Text field to demonstrate typing is never hijacked */}
      <div>
        <label
          htmlFor="demo-typing"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Type here (simulate dictation) — the shortcut must not fire
        </label>
        <input
          id="demo-typing"
          type="text"
          placeholder="Try typing a sentence with the letter s…"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Live log */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Live event log
          </h3>
          <button
            type="button"
            onClick={() => setLog([])}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear
          </button>
        </div>
        <div
          aria-live="polite"
          className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3 min-h-[7rem] space-y-1"
        >
          {log.length === 0 ? (
            <p className="text-sm text-slate-400">
              Press &ldquo;s&rdquo; anywhere to see what happens…
            </p>
          ) : (
            log.map((entry) => (
              <p
                key={entry.id}
                className={`text-sm font-mono ${
                  entry.kind === "fired"
                    ? "text-green-600 dark:text-green-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {entry.kind === "fired" ? "▶ " : "· "}
                {entry.text}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
