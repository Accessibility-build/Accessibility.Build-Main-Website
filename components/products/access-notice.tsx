"use client"

import { useEffect, useState } from "react"

/** Shown on a sales page when a signed-in visitor without a licence was sent here from the course. */
export function AccessNotice() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    setShow(new URLSearchParams(window.location.search).get("access") === "none")
  }, [])
  if (!show) return null
  return (
    <div role="status" className="rounded-xl border-2 border-blue-700 bg-blue-50 p-5 text-slate-900 dark:border-blue-400 dark:bg-slate-900 dark:text-white">
      <p className="font-semibold">Your account does not have access to this course yet.</p>
      <p className="mt-1 text-slate-700 dark:text-slate-300">
        Buy a licence below. If someone added you to their Team licence, sign in with the email address they used. If you have just paid, wait a minute and refresh.
      </p>
    </div>
  )
}
