"use client"

import { useRef, useState } from "react"

interface Control {
  id: string
  label: string
  /** Whether this control is reachable and operable by keyboard. */
  keyboardOK: boolean
  note: string
}

const controls: Control[] = [
  {
    id: "link",
    label: "Home (link)",
    keyboardOK: true,
    note: "A real <a href> — in the tab order, activates with Enter.",
  },
  {
    id: "button",
    label: "Save (button)",
    keyboardOK: true,
    note: "A native <button> — focusable, fires on Enter and Space.",
  },
  {
    id: "input",
    label: "Search field (input)",
    keyboardOK: true,
    note: "A native <input> — focusable and editable from the keyboard.",
  },
  {
    id: "custom",
    label: "Menu (role=button, tabindex=0)",
    keyboardOK: true,
    note: "A <div> made accessible with tabindex=0 and a keydown handler.",
  },
  {
    id: "bad",
    label: "Delete (div onClick only)",
    keyboardOK: false,
    note: "A <div onClick> with no tabindex and no key handler — Tab skips it entirely, so keyboard users can never reach it.",
  },
]

export default function KeyboardDemo() {
  const [focused, setFocused] = useState<string>("")
  const [activated, setActivated] = useState<string>("")
  const firstRef = useRef<HTMLAnchorElement>(null)

  const reset = () => {
    setFocused("")
    setActivated("")
    firstRef.current?.focus()
  }

  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"

  const activeClasses = (id: string) =>
    focused === id
      ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900"
      : ""

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        Tab-order playground
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        Click &ldquo;Start&rdquo;, then press{" "}
        <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">
          Tab
        </kbd>{" "}
        repeatedly to move through the controls. Watch the status line: four
        controls receive focus in turn, but the mouse-only{" "}
        <strong>&ldquo;Delete&rdquo;</strong> div is silently skipped — a keyboard
        user can never reach it.
      </p>

      {/* Status line */}
      <div
        className="mb-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4"
        aria-live="polite"
      >
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">
            Focused:
          </span>{" "}
          <span className="font-mono">
            {focused
              ? controls.find((c) => c.id === focused)?.label
              : "nothing yet"}
          </span>
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
          <span className="font-semibold text-slate-900 dark:text-white">
            Last activated:
          </span>{" "}
          <span className="font-mono">{activated || "nothing yet"}</span>
        </p>
      </div>

      {/* The controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <a
          ref={firstRef}
          href="#demo"
          onFocus={() => setFocused("link")}
          onClick={(e) => {
            e.preventDefault()
            setActivated("Home (link)")
          }}
          className={`inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 ${focusRing} ${activeClasses(
            "link"
          )}`}
        >
          Home
        </a>

        <button
          type="button"
          onFocus={() => setFocused("button")}
          onClick={() => setActivated("Save (button)")}
          className={`inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 ${focusRing} ${activeClasses(
            "button"
          )}`}
        >
          Save
        </button>

        <input
          type="text"
          placeholder="Search…"
          onFocus={() => setFocused("input")}
          className={`px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 ${focusRing} ${activeClasses(
            "input"
          )}`}
        />

        {/* Correctly-built custom control */}
        <div
          role="button"
          tabIndex={0}
          onFocus={() => setFocused("custom")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              setActivated("Menu (custom control)")
            }
          }}
          onClick={() => setActivated("Menu (custom control)")}
          className={`inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white font-medium cursor-pointer hover:bg-purple-700 ${focusRing} ${activeClasses(
            "custom"
          )}`}
        >
          Menu
        </div>

        {/* BAD: mouse-only div — not focusable, no key handler */}
        <div
          onClick={() => setActivated("Delete (mouse only)")}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-rose-600 text-white font-medium cursor-pointer hover:bg-rose-700 opacity-90"
        >
          Delete
          <span className="ml-2 text-[10px] uppercase tracking-wide bg-white/20 px-1.5 py-0.5 rounded">
            mouse only
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={reset}
        className={`mb-6 inline-flex items-center px-3 py-1.5 rounded-lg text-sm border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 ${focusRing}`}
      >
        Start / Reset (focus the first control)
      </button>

      {/* Legend */}
      <ul className="space-y-2">
        {controls.map((c) => (
          <li
            key={c.id}
            className={`flex gap-3 rounded-lg border p-3 text-sm leading-relaxed ${
              c.keyboardOK
                ? "border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20"
                : "border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20"
            }`}
          >
            <span
              aria-hidden="true"
              className={
                c.keyboardOK
                  ? "text-green-600 font-bold"
                  : "text-rose-500 font-bold"
              }
            >
              {c.keyboardOK ? "✓" : "✗"}
            </span>
            <span className="text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">
                {c.label}.
              </strong>{" "}
              {c.note}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
