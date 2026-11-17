"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { isCourseLearningPath } from "@/lib/courses/routes"

/** Unmount site overlays so their focus handlers and reserved space leave with them. */
export function SiteOnly({ children }: { children: ReactNode }) {
  return isCourseLearningPath(usePathname()) ? null : children
}
