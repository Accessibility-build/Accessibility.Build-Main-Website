"use client"

import { useState, useCallback } from "react"
import { RotateCcw, Info, Hand, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface InteractiveDemoProps {
  title: string
  description?: string
  children: React.ReactNode
  explanation?: string
  instructions?: string
  className?: string
}

export function InteractiveDemo({
  title,
  description,
  children,
  explanation,
  instructions,
  className,
}: InteractiveDemoProps) {
  const [resetKey, setResetKey] = useState(0)

  const handleReset = useCallback(() => {
    setResetKey((prev) => prev + 1)
  }, [])

  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
            <Hand className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="h-8 px-3 text-xs gap-1.5 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
          aria-label="Reset demo"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </Button>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-700">
        {/* Left panel: Try It */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Hand className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Try It
            </h4>
          </div>

          {/* Instructions banner */}
          {instructions && (
            <div className="flex items-start gap-2.5 mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                {instructions}
              </p>
            </div>
          )}

          {/* Live demo content - key change forces remount */}
          <div
            key={resetKey}
            className="min-h-[120px] p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50"
          >
            {children}
          </div>
        </div>

        {/* Right panel: What Happened */}
        <div className="p-5 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              What Happened
            </h4>
          </div>

          {explanation ? (
            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {explanation}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              Interact with the demo on the left to see what happens.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
