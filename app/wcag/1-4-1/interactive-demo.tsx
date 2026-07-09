"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Check, X } from "lucide-react"

export default function UseOfColorDemo() {
  const [grayscale, setGrayscale] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <Button
          onClick={() => setGrayscale(!grayscale)}
          variant={grayscale ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          {grayscale ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {grayscale ? "Restore color" : "Simulate color blindness"}
        </Button>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {grayscale
            ? "Grayscale approximates how color-only cues collapse for users who cannot perceive hue. The right-hand examples still work."
            : "Toggle a grayscale filter to strip away color and see which examples survive without it."}
        </p>
      </div>

      <div
        className={
          grayscale ? "grid gap-8 [filter:grayscale(1)]" : "grid gap-8"
        }
      >
        {/* Links */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Links in body text
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4">
              <p className="text-xs font-semibold text-rose-800 dark:text-rose-300 mb-2 flex items-center gap-1.5">
                <X className="h-4 w-4" /> Color only
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Review our{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  refund policy
                </span>{" "}
                before you buy.
              </p>
            </div>
            <div className="rounded-lg border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-4">
              <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Color + underline
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Review our{" "}
                <span className="text-blue-600 dark:text-blue-400 underline">
                  refund policy
                </span>{" "}
                before you buy.
              </p>
            </div>
          </div>
        </div>

        {/* Form validation */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Form validation
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4 space-y-3">
              <p className="text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                <X className="h-4 w-4" /> Color only
              </p>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  readOnly
                  value="invalid-email"
                  className="w-full p-2 rounded border-2 border-red-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                />
                <p className="text-sm mt-1 text-red-600">
                  Please enter a valid email address
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-4 space-y-3">
              <p className="text-xs font-semibold text-green-800 dark:text-green-300 flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Color + icon + text
              </p>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <input
                  readOnly
                  value="invalid-email"
                  aria-invalid="true"
                  className="w-full p-2 rounded border-2 border-red-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                />
                <p className="text-sm mt-1 flex items-center gap-1.5 text-red-600">
                  <X className="h-4 w-4 flex-shrink-0" />
                  Error: Please enter a valid email address
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Required fields */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Required fields
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4">
              <p className="text-xs font-semibold text-rose-800 dark:text-rose-300 mb-2 flex items-center gap-1.5">
                <X className="h-4 w-4" /> Color only
              </p>
              <label className="block text-sm font-medium text-red-600">
                Full name
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Required fields are shown in red.
              </p>
            </div>
            <div className="rounded-lg border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-4">
              <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Color + asterisk + text
              </p>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Full name{" "}
                <span className="text-red-600" aria-hidden="true">
                  *
                </span>{" "}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  (required)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Chart / status */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Chart legend and status
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4">
              <p className="text-xs font-semibold text-rose-800 dark:text-rose-300 mb-3 flex items-center gap-1.5">
                <X className="h-4 w-4" /> Color only
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-red-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Product A: 45%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Product B: 35%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-blue-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Product C: 20%
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-4">
              <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Color + patterns + labels
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded bg-red-600"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(45deg, transparent, transparent 2px, white 2px, white 4px)",
                    }}
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Product A (striped): 45%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-green-600" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Product B (solid): 35%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded bg-blue-600"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "4px 4px",
                    }}
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Product C (dotted): 20%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
