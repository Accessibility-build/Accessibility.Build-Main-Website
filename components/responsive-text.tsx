"use client"

import { useState, useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useTextOverflow } from "@/hooks/use-text-overflow"

interface ResponsiveTextProps {
  children: ReactNode
  className?: string
  maxLines?: number
  component?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div"
  expandable?: boolean
  id?: string
}

/**
 * ResponsiveText component that prevents text overflow
 * and optionally allows expanding to show full text
 */
export function ResponsiveText({
  children,
  className,
  maxLines = 2,
  component: Component = "p",
  expandable = false,
  id,
}: ResponsiveTextProps) {
  const [expanded, setExpanded] = useState(false)
  const { ref, isOverflowing } = useTextOverflow<HTMLDivElement>({
    componentName: "ResponsiveText",
    elementDescription: `${Component} element with id ${id || "unknown"}`,
    logOverflow: true,
  })

  // Reset expanded state when children change
  useEffect(() => {
    setExpanded(false)
  }, [children])

  return (
    <div className="relative">
      <Component
        ref={ref}
        id={id}
        className={cn(
          !expanded &&
            maxLines > 0 && {
              display: "-webkit-box",
              WebkitLineClamp: maxLines,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          className,
        )}
      >
        {children}
      </Component>

      {expandable && isOverflowing && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="text-primary text-sm font-medium mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-expanded={expanded}
        >
          Show more
        </button>
      )}

      {expandable && expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="text-primary text-sm font-medium mt-1 hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-expanded={expanded}
        >
          Show less
        </button>
      )}
    </div>
  )
}
