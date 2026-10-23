"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

/** Must match the listener in the embed code from components/research/embeddable-widget.tsx. */
export const EMBED_HEIGHT_MESSAGE = "accessibility-build:height"

/**
 * Outer wrapper for every /embed/ widget. It tells the host page how tall the
 * widget is, so the iframe can grow instead of scrolling inside a scroll
 * (narrow columns, 200% zoom). Hosts that strip the listener script keep the
 * fixed height from the embed code.
 */
export function EmbedFrame({ children, className }: { children: ReactNode; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || window.parent === window) return
    const report = () => {
      window.parent.postMessage(
        { type: EMBED_HEIGHT_MESSAGE, height: Math.ceil(root.offsetTop + root.offsetHeight) },
        "*",
      )
    }
    // ResizeObserver only fires on a rendering frame, which a page loaded in a
    // background tab may not get for a while, so report once straight away too.
    report()
    const observer = new ResizeObserver(report)
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={rootRef} className={cn("mx-auto max-w-2xl space-y-4 p-4 text-slate-900 dark:text-slate-100", className)}>
      {children}
    </div>
  )
}

/** Footer line shared by the widgets: a note on the left, a link to the full page on the right. */
export function EmbedFooter({ note, href, linkText }: { note: ReactNode; href: string; linkText: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
      <span>{note}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className="inline-flex min-h-6 items-center gap-1 font-medium text-blue-700 underline underline-offset-2 hover:no-underline dark:text-blue-400"
      >
        {linkText}
        <span className="sr-only"> (opens in a new tab)</span>
        <ExternalLink className="h-3 w-3" aria-hidden="true" />
      </a>
    </div>
  )
}
