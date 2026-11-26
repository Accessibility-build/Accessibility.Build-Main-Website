"use client"
import { useState } from "react"
import { Copy, Download, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950"
const btn = cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800", ring)
const primary = cn(btn, "border-blue-700 bg-blue-700 text-white hover:bg-blue-800 dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-300")

/** Download the PDF, copy the verification link, or add the credential to LinkedIn. */
export function CredentialActions({ code, courseTitle, issuedAt, expiresAt }: { code: string; courseTitle: string; issuedAt: string; expiresAt?: string | null }) {
  const [status, setStatus] = useState("")
  const url = `https://accessibility.build/certificates/${code}`
  const issued = new Date(issuedAt)
  const expiry = expiresAt ? new Date(expiresAt) : null
  const linkedIn = `https://www.linkedin.com/profile/add?${new URLSearchParams({ startTask: "CERTIFICATION_NAME", name: courseTitle, organizationName: "Accessibility.build", issueYear: String(issued.getUTCFullYear()), issueMonth: String(issued.getUTCMonth() + 1), ...(expiry ? { expirationYear: String(expiry.getUTCFullYear()), expirationMonth: String(expiry.getUTCMonth() + 1) } : {}), certUrl: url, certId: code })}`
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <a href={`/certificates/${code}/pdf`} download className={primary} onClick={() => setStatus("Preparing your PDF. The download starts in a few seconds.")}>
          <Download aria-hidden="true" className="h-4 w-4" />Download certificate (PDF)
        </a>
        <button type="button" className={btn} onClick={async () => { try { await navigator.clipboard.writeText(url); setStatus("Verification link copied.") } catch { setStatus(`Copy this link: ${url}`) } }}>
          <Copy aria-hidden="true" className="h-4 w-4" />Copy verification link
        </button>
        <a href={linkedIn} target="_blank" rel="noopener noreferrer" className={btn}>
          <ExternalLink aria-hidden="true" className="h-4 w-4" />Add to LinkedIn<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
      <p role="status" className="mt-3 min-h-5 text-sm font-medium text-slate-700 dark:text-slate-300">{status}</p>
    </div>
  )
}
