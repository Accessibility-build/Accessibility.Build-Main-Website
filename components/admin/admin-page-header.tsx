import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AdminPageHeaderProps = {
  title: string
  description: string
  eyebrow?: string
  actions?: ReactNode
  className?: string
}

export function AdminPageHeader({
  title,
  description,
  eyebrow = "Administration",
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-slate-800 lg:flex-row lg:items-end lg:justify-between", className)}>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-teal-700 dark:text-teal-300">{eyebrow}</p>
        <h1 className="mt-2 break-words text-3xl font-semibold text-slate-950 [overflow-wrap:anywhere] dark:text-white">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
      </div>
      {actions ? <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">{actions}</div> : null}
    </header>
  )
}
