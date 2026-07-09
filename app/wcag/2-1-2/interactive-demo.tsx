"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Lock, Unlock, RotateCcw, X, AlertTriangle } from "lucide-react"

type ActiveDemo = "none" | "trap" | "accessible"

export default function KeyboardTrapDemo() {
  const [active, setActive] = useState<ActiveDemo>("none")
  const [status, setStatus] = useState(
    "No widget open. Open one and try to Tab or press Esc to leave it."
  )

  const trapRef = useRef<HTMLDivElement>(null)
  const accessibleRef = useRef<HTMLDivElement>(null)
  const trapTriggerRef = useRef<HTMLButtonElement>(null)
  const accessibleTriggerRef = useRef<HTMLButtonElement>(null)

  const focusablesIn = (container: HTMLElement | null) => {
    if (!container) return [] as HTMLElement[]
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    )
  }

  const focusFirst = (container: HTMLElement | null) => {
    window.setTimeout(() => focusablesIn(container)[0]?.focus(), 20)
  }

  const openTrap = () => {
    setActive("trap")
    setStatus("Trapped widget open. Tab and Esc are blocked — focus cannot leave.")
    focusFirst(trapRef.current)
  }

  const openAccessible = () => {
    setActive("accessible")
    setStatus("Accessible modal open. Focus is contained, but Esc or Close will let you out.")
    focusFirst(accessibleRef.current)
  }

  const release = useCallback(() => {
    const wasTrap = active === "trap"
    setActive("none")
    setStatus(
      wasTrap
        ? "Released. In a real trap with no such control, the only escape would be to reload the page."
        : "Closed. Focus returned to the page — exactly what 2.1.2 requires."
    )
    window.setTimeout(() => {
      if (wasTrap) trapTriggerRef.current?.focus()
      else accessibleTriggerRef.current?.focus()
    }, 20)
  }, [active])

  const reset = () => {
    setActive("none")
    setStatus("Reset. No widget open. Open one and try to Tab or press Esc to leave it.")
  }

  // BAD widget: swallows Tab (looping focus inside) and Esc — a real keyboard trap.
  const onTrapKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const items = focusablesIn(trapRef.current)
      if (items.length === 0) return
      const idx = items.indexOf(document.activeElement as HTMLElement)
      const nextIdx = e.shiftKey
        ? (idx - 1 + items.length) % items.length
        : (idx + 1) % items.length
      items[nextIdx]?.focus()
      setStatus("Tab blocked — focus looped back inside the trap. There is no keyboard way out.")
    }
    if (e.key === "Escape") {
      e.preventDefault()
      setStatus("Esc blocked — this widget ignores the standard exit key. You are stuck.")
    }
  }

  // GOOD widget: contains focus for usability but Esc and Close both leave; Tab only wraps at edges.
  const onAccessibleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      release()
      return
    }
    if (e.key === "Tab") {
      const items = focusablesIn(accessibleRef.current)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Live status + always-available release/reset (outside every trap) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Live status
          </h3>
          <div className="flex gap-2">
            {active === "trap" && (
              <Button
                onClick={release}
                variant="outline"
                size="sm"
                className="border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300"
              >
                <Unlock className="mr-1.5 h-4 w-4" />
                Release trap
              </Button>
            )}
            <Button onClick={reset} variant="outline" size="sm">
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
        <p
          role="status"
          aria-live="polite"
          className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
        >
          {status}
        </p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          The &ldquo;Release trap&rdquo; and &ldquo;Reset&rdquo; controls live outside
          the widgets, so the demo can never truly lock your keyboard.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* BAD: keyboard trap */}
        <div className="rounded-xl border-2 border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 p-5">
          <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2 flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Keyboard trap (fails 2.1.2)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            This widget preventDefaults Tab and Escape, looping focus inside forever.
            There is no advertised way out.
          </p>
          {active !== "trap" ? (
            <Button
              ref={trapTriggerRef}
              onClick={openTrap}
              variant="destructive"
            >
              Open trapped widget
            </Button>
          ) : (
            <div
              ref={trapRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="trap-title"
              onKeyDown={onTrapKeyDown}
              className="rounded-lg border-2 border-rose-400 dark:border-rose-700 bg-white dark:bg-slate-900 p-4 space-y-3"
            >
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                <AlertTriangle className="h-4 w-4" />
                <span id="trap-title" className="font-semibold text-sm">
                  You&apos;re stuck here
                </span>
              </div>
              <input
                type="text"
                placeholder="Try to Tab out…"
                className="w-full rounded-md border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
              <button className="w-full rounded-md bg-rose-500 px-3 py-2 text-sm font-medium text-white">
                Tab just loops back to the input
              </button>
              <p className="text-xs text-rose-600 dark:text-rose-400">
                Esc is ignored. Use the Release control above to escape.
              </p>
            </div>
          )}
        </div>

        {/* GOOD: accessible modal */}
        <div className="rounded-xl border-2 border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/20 p-5">
          <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
            <Unlock className="h-4 w-4" />
            Accessible modal (passes 2.1.2)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Focus is contained for usability, but Escape or the Close button always
            returns you to the page.
          </p>
          {active !== "accessible" ? (
            <Button
              ref={accessibleTriggerRef}
              onClick={openAccessible}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Open accessible modal
            </Button>
          ) : (
            <div
              ref={accessibleRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ok-title"
              onKeyDown={onAccessibleKeyDown}
              className="rounded-lg border-2 border-green-400 dark:border-green-700 bg-white dark:bg-slate-900 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span id="ok-title" className="font-semibold text-sm text-slate-900 dark:text-white">
                  Settings
                </span>
                <button
                  onClick={release}
                  aria-label="Close dialog"
                  className="text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Username"
                className="w-full rounded-md border border-green-300 dark:border-green-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
              <div className="flex justify-end gap-2">
                <Button onClick={release} variant="outline" size="sm">
                  Cancel
                </Button>
                <Button
                  onClick={release}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Save
                </Button>
              </div>
              <p className="text-xs text-green-700 dark:text-green-400 flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/40 font-mono">
                  Esc
                </kbd>
                Press Esc to exit — or Tab to the Close button.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
