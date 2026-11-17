"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { isFocusedWorkspacePath } from "@/lib/site-layout"

/** Unmount site overlays so their focus handlers and reserved space leave with them. */
export function SiteOnly({ children }: { children: ReactNode }) {
  return isFocusedWorkspacePath(usePathname()) ? null : children
}
