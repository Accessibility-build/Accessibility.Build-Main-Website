"use client"
import type { useStudyProgress } from "@/hooks/use-study-progress"
import { cn } from "@/lib/utils"

export const studyButton = "inline-flex min-h-[44px] items-center justify-center rounded-md border border-slate-400 px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800 disabled:opacity-60"

export function StudySaveStatus({ state }: { state: ReturnType<typeof useStudyProgress> }) {
  function downloadRecovery() {
    const content = state.exportLocal()
    if (!content) return
    const url = URL.createObjectURL(new Blob([content], { type: "application/json" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "course-study-recovery.json"
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <div className="my-3 text-sm">
    <p role="status" className={cn(state.status === "error" || state.status === "conflict" ? "font-medium text-red-800 dark:text-red-200" : "text-slate-600 dark:text-slate-400")}>{state.message}</p>
    {state.recovery ? <div role="status" className="space-y-2 rounded-lg border border-amber-600 p-3">
      <p>There is unsaved work from your last visit on this device. Restore it to continue saving, or use the version in your account.</p>
      <div className="flex flex-wrap gap-2"><button className={studyButton} onClick={() => state.recover(true)}>Restore local work</button><button className={studyButton} onClick={() => state.recover(false)}>Use account version</button></div>
    </div> : null}
    {state.status === "error" ? <button className={cn(studyButton, "mt-2")} onClick={state.retry}>Retry saving</button> : null}
    {state.status === "conflict" ? <div className="mt-2 flex flex-wrap gap-2"><button className={studyButton} onClick={() => state.resolve(false)}>Use saved version</button><button className={studyButton} onClick={() => state.resolve(true)}>Replace with my local edit</button></div> : null}
    {state.recovery || state.status === "error" || state.status === "conflict" ? <button type="button" className={cn(studyButton, "mt-2")} onClick={downloadRecovery}>Download local work</button> : null}
  </div>
}
