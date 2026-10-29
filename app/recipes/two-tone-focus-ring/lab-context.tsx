"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { BLUE } from "./ring-math"

interface LabState {
  /** The background in the "Try to break it" lab, as #rrggbb. The swatch wall can load one in. */
  background: string
  setBackground: (hex: string) => void
}

const LabContext = createContext<LabState | null>(null)

// Starts on the site's own focus blue: the single blue ring vanishes there, the two-tone ring does not.
export function LabProvider({ children }: { children: ReactNode }) {
  const [background, setBackground] = useState(BLUE)
  return <LabContext.Provider value={{ background, setBackground }}>{children}</LabContext.Provider>
}

export function useLab(): LabState {
  const lab = useContext(LabContext)
  if (!lab) throw new Error("useLab must be used inside LabProvider")
  return lab
}
