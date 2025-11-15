"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  children: string
  language?: string
  className?: string
}

export function CodeBlock({ children, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative my-6 overflow-hidden rounded-lg border", className)}>
      <div className="flex items-center justify-between bg-muted px-4 py-2">
        <div className="text-xs font-medium">{language || "code"}</div>
        <button
          onClick={copyToClipboard}
          className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-muted-foreground/10"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code>{children}</code>
      </pre>
    </div>
  )
}
