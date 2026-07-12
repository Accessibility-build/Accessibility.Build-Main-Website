import { Loader2 } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 dark:bg-slate-950" role="status" aria-live="polite">
      <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Loading administration data
      </div>
    </div>
  )
}
