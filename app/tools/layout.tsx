import type { ReactNode } from "react"
import { ToolSuiteBar } from "@/components/tools/tool-suite-bar"

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ToolSuiteBar />
      {children}
    </>
  )
}
