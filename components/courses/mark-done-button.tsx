"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export function MarkDoneButton({ slug, chapterKey, initialDone }: { slug: string; chapterKey: string; initialDone: boolean }) {
  const [done, setDone] = useState(initialDone)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState("")
  const router = useRouter()

  async function toggle() {
    const next = !done
    setBusy(true)
    setMsg("")
    try {
      const res = await fetch(`/api/courses/${slug}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ op: "chapterDone", key: chapterKey, done: next }),
      })
      if (!res.ok) throw new Error()
      setDone(next)
      setMsg(next ? "Lesson marked as complete. Your course progress is updated." : "Lesson marked as not complete.")
      // Re-render the server parts (course outline and progress bar) with the new state.
      router.refresh()
    } catch {
      setMsg("Could not save. Check your connection and try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={done}
        className={cn(
          "inline-flex min-h-[44px] items-center gap-2 rounded-lg border-2 px-4 py-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:opacity-60",
          done
            ? "border-emerald-700 bg-emerald-50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-100"
            : "border-blue-700 text-blue-700 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-slate-900"
        )}
      >
        {done ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : <Circle className="h-5 w-5" aria-hidden="true" />}
        {/* Constant label: the pressed state carries completion (APG toggle button pattern). */}
        Lesson complete
      </button>
      <p role="status" className="text-sm text-slate-600 dark:text-slate-400">{msg}</p>
    </div>
  )
}
