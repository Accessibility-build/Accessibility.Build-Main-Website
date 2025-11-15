import type React from "react"
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalloutProps {
  title?: string
  children: React.ReactNode
  type?: "info" | "warning" | "success" | "error"
  className?: string
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertCircle,
}

const styles = {
  info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-200",
  warning: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-900 dark:text-amber-200",
  success: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/50 dark:border-green-900 dark:text-green-200",
  error: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/50 dark:border-red-900 dark:text-red-200",
}

export function Callout({ title, children, type = "info", className }: CalloutProps) {
  const IconComponent = icons[type]

  return (
    <div className={cn("my-6 flex gap-4 rounded-lg border p-4", styles[type], className)}>
      <div className="mt-1 flex-shrink-0">
        <IconComponent className="h-5 w-5" />
      </div>
      <div>
        {title && <p className="mb-1 font-medium">{title}</p>}
        <div className="callout-content text-sm">{children}</div>
      </div>
    </div>
  )
}
