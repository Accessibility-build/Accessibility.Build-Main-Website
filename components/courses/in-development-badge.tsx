import { cn } from "@/lib/utils"

/** Tag for courses that are not yet released. Text, not colour alone, carries the meaning. */
export function InDevelopmentBadge({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
        onDark
          ? "border-amber-300 bg-amber-100 text-amber-900"
          : "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100",
        className
      )}
    >
      In development
    </span>
  )
}
