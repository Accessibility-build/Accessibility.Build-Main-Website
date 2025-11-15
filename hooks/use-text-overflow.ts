"use client"

import { useEffect, useRef, useState } from "react"
import { errorLogger } from "@/lib/error-logger"

interface UseTextOverflowOptions {
  componentName?: string
  elementDescription?: string
  logOverflow?: boolean
}

/**
 * Hook to detect and handle text overflow in elements
 *
 * @param options Configuration options
 * @returns Object with ref and overflow status
 */
export function useTextOverflow<T extends HTMLElement>(options?: UseTextOverflowOptions) {
  const elementRef = useRef<T>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  const checkOverflow = () => {
    const element = elementRef.current
    if (!element) return

    const hasOverflow = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth

    setIsOverflowing(hasOverflow)

    if (hasOverflow && options?.logOverflow) {
      errorLogger.logMinorError("Text overflow detected", {
        component: options.componentName || "Unknown",
        context: {
          elementDescription: options.elementDescription || "Text element",
          elementContent:
            element.textContent?.substring(0, 100) +
            (element.textContent && element.textContent.length > 100 ? "..." : ""),
          elementDimensions: {
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
            scrollWidth: element.scrollWidth,
            clientWidth: element.clientWidth,
          },
        },
      })
    }
  }

  useEffect(() => {
    checkOverflow()

    // Check on window resize
    const handleResize = () => {
      checkOverflow()
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return { ref: elementRef, isOverflowing, checkOverflow }
}
