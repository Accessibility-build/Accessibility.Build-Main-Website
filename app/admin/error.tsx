"use client"

import Link from "next/link"
import { House, RotateCcw, TriangleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 dark:bg-slate-950">
      <main className="w-full max-w-xl rounded-md border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <TriangleAlert className="h-8 w-8 text-red-700 dark:text-red-300" aria-hidden="true" />
        <p className="mt-5 text-xs font-semibold uppercase text-red-700 dark:text-red-300">Admin route error</p>
        <h1 className="mt-2 text-2xl font-semibold">This administration view could not be loaded</h1>
        <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">Retry the server request. If it fails again, check database connectivity and application logs before attempting a state-changing operation.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Retry</Button>
          <Button asChild variant="outline"><Link href="/"><House className="mr-2 h-4 w-4" aria-hidden="true" />Return to website</Link></Button>
        </div>
      </main>
    </div>
  )
}
