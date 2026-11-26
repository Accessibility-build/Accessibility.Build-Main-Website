"use client"
import { useEffect, useState } from "react"

/** Debounced text for a polite live region, so dragging a slider does not flood screen readers. */
export function useAnnouncer(message: string, delay = 700) {
  const [spoken, setSpoken] = useState("")
  useEffect(() => {
    const t = setTimeout(() => setSpoken(message), delay)
    return () => clearTimeout(t)
  }, [message, delay])
  return spoken
}
