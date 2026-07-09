"use client"

import { useState } from "react"
import { Check, Play, X } from "lucide-react"

interface FocusStep {
  element: string
  order: number
  isLogical: boolean
}

const fields = [
  { key: "first-name", label: "First name" },
  { key: "last-name", label: "Last name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "message", label: "Message" },
  { key: "submit", label: "Submit button" },
]

export default function FocusOrderDemo() {
  const [history, setHistory] = useState<FocusStep[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const track = (element: string, isLogical: boolean) => {
    setHistory((prev) => [
      ...prev,
      { element, order: prev.length + 1, isLogical },
    ])
  }

  const clear = () => setHistory([])

  const simulate = (good: boolean) => {
    setIsRunning(true)
    clear()
    // Good: natural DOM order. Bad: submit jumps first via positive tabindex.
    const sequence = good
      ? [
          { label: "First name", logical: true },
          { label: "Last name", logical: true },
          { label: "Email", logical: true },
          { label: "Phone", logical: true },
          { label: "Message", logical: true },
          { label: "Submit button", logical: true },
        ]
      : [
          { label: "First name", logical: true },
          { label: "Submit button (tabindex=1)", logical: false },
          { label: "Message (tabindex=3)", logical: false },
          { label: "Email (tabindex=4)", logical: false },
          { label: "Last name (tabindex=5)", logical: false },
          { label: "Phone (tabindex=6)", logical: false },
        ]
    sequence.forEach((step, index) => {
      setTimeout(() => {
        track(step.label, step.logical)
        if (index === sequence.length - 1) setIsRunning(false)
      }, (index + 1) * 700)
    })
  }

  const illogicalCount = history.filter((s) => !s.isLogical).length

  return (
    <div className="space-y-6">
      {/* Live forms to tab through */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-5">
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
            <Check className="h-5 w-5" /> Logical order (DOM order)
          </h3>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            {fields.slice(0, 5).map((f) => (
              <div key={f.key}>
                <label
                  htmlFor={`good-${f.key}`}
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  {f.label}
                </label>
                <input
                  id={`good-${f.key}`}
                  type="text"
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </form>
          <p className="mt-3 text-xs text-green-800/90 dark:text-green-300/90">
            Tab through this form: focus follows the visual top-to-bottom order.
          </p>
        </div>

        <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
          <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3 flex items-center gap-2">
            <X className="h-5 w-5" /> Illogical order (positive tabindex)
          </h3>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                htmlFor="bad-first-name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                First name
              </label>
              <input
                id="bad-first-name"
                type="text"
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <button
              type="submit"
              tabIndex={1}
              className="w-full rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              Submit (tabindex=1)
            </button>
            <div>
              <label
                htmlFor="bad-message"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Message (tabindex=3)
              </label>
              <input
                id="bad-message"
                type="text"
                tabIndex={3}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label
                htmlFor="bad-email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Email (tabindex=4)
              </label>
              <input
                id="bad-email"
                type="email"
                tabIndex={4}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label
                htmlFor="bad-last-name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Last name (tabindex=5)
              </label>
              <input
                id="bad-last-name"
                type="text"
                tabIndex={5}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </form>
          <p className="mt-3 text-xs text-rose-800/90 dark:text-rose-300/90">
            Tab through this one: focus jumps to Submit first, then bounces around the
            fields out of order.
          </p>
        </div>
      </div>

      {/* Simulated tab journey */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Watch the focus order
        </h3>
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            type="button"
            onClick={() => simulate(true)}
            disabled={isRunning}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:bg-slate-400"
          >
            <Play className="h-4 w-4" /> Logical order
          </button>
          <button
            type="button"
            onClick={() => simulate(false)}
            disabled={isRunning}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:bg-slate-400"
          >
            <Play className="h-4 w-4" /> Illogical order
          </button>
          {history.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm text-slate-700 dark:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>
        <div
          className="min-h-[9rem] rounded-lg bg-slate-50 dark:bg-slate-900/40 p-4"
          aria-live="polite"
        >
          {history.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Press a button to step through each focus stop in order.
            </p>
          ) : (
            <>
              <ul className="space-y-2">
                {history.map((step) => (
                  <li
                    key={step.order}
                    className={`flex items-center gap-2 rounded p-2 text-sm ${
                      step.isLogical
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                    }`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/70 dark:bg-slate-800 text-xs font-bold">
                      {step.order}
                    </span>
                    <span className="font-medium">{step.element}</span>
                    {step.isLogical ? (
                      <Check className="ml-auto h-4 w-4" />
                    ) : (
                      <X className="ml-auto h-4 w-4" />
                    )}
                  </li>
                ))}
              </ul>
              {!isRunning && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  {illogicalCount === 0
                    ? "Every stop followed the expected order."
                    : `${illogicalCount} stop${illogicalCount === 1 ? "" : "s"} broke the expected reading order.`}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
