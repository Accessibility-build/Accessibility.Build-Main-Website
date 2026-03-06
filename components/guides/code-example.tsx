"use client"

import { useState, useCallback } from "react"
import { Check, Copy, Code2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface CodeExampleProps {
  code: string
  language?: string
  title?: string
  variant?: "good" | "bad" | "neutral"
  description?: string
  className?: string
}

export function CodeExample({
  code,
  language = "html",
  title,
  variant = "neutral",
  description,
  className,
}: CodeExampleProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = code
      textArea.style.position = "fixed"
      textArea.style.opacity = "0"
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [code])

  const borderColor =
    variant === "good"
      ? "border-t-4 border-t-emerald-500 dark:border-t-emerald-400"
      : variant === "bad"
        ? "border-t-4 border-t-red-500 dark:border-t-red-400"
        : ""

  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 shadow-sm",
        borderColor,
        className
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-3">
          <Code2 className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">
            {title || language}
          </span>

          {variant === "good" && (
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 text-xs px-2 py-0.5">
              <Check className="w-3 h-3 mr-1" />
              Accessible
            </Badge>
          )}
          {variant === "bad" && (
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30 text-xs px-2 py-0.5">
              <span className="mr-1" aria-hidden="true">
                &#10005;
              </span>
              Inaccessible
            </Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className={cn(
            "h-7 px-2.5 text-xs gap-1.5 transition-all duration-200",
            copied
              ? "text-emerald-300 hover:text-emerald-200 hover:bg-emerald-500/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          )}
          aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>

      {/* Code block */}
      <div className="overflow-x-auto bg-slate-50 dark:bg-slate-900/50">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="font-mono text-slate-800 dark:text-slate-200 whitespace-pre">
            {code}
          </code>
        </pre>
      </div>

      {/* Description */}
      {description && (
        <div
          className={cn(
            "px-4 py-3 border-t text-sm leading-relaxed",
            variant === "good"
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200"
              : variant === "bad"
                ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          )}
        >
          {description}
        </div>
      )}
    </div>
  )
}
