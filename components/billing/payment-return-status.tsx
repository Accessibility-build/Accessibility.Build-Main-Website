"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

type State = { phase: "waiting" | "paid" | "failed" | "refunded" | "slow" | "error" | "unavailable"; successPath?: string; name?: string; kind?: string; requiresSignIn?: boolean }

export function PaymentReturnStatus({ orderId }: { orderId: string }) {
  const [s, setS] = useState<State>({ phase: "waiting" })
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    let tries = 0
    let stop = false
    let timer: ReturnType<typeof setTimeout> | undefined
    async function poll() {
      tries++
      try {
        const r = await fetch(`/api/billing/orders/${orderId}`, { cache: "no-store" })
        const d = await r.json()
        if (stop) return
        if (r.status === 401 || r.status === 404) return setS({ phase: "unavailable" })
        if (!r.ok) return setS({ phase: "error" })
        if (d.status === "paid") {
          setS({ phase: "paid", successPath: d.successPath, name: d.name, kind: d.kind, requiresSignIn: d.requiresSignIn })
          if (!d.requiresSignIn) timer = setTimeout(() => {
            if (!stop && d.successPath) window.location.href = d.successPath
          }, 2500)
          return
        }
        if (d.status === "failed") return setS({ phase: "failed", successPath: d.successPath, name: d.name, kind: d.kind })
        if (d.status === "refunded" || d.status === "partially_refunded") return setS({ phase: "refunded" })
      } catch {
        // keep polling
      }
      if (stop) return
      if (tries >= 40) return setS((p) => ({ ...p, phase: "slow" }))
      timer = setTimeout(poll, tries < 10 ? 1500 : 3000)
    }
    poll()
    return () => {
      stop = true
      clearTimeout(timer)
    }
  }, [orderId])

  useEffect(() => {
    if (s.phase !== "waiting") headingRef.current?.focus()
  }, [s.phase])

  const where = s.kind === "course" ? "your course" : s.kind === "template" ? "your downloads" : "your account"
  return (
    <div className="max-w-xl">
      {s.phase === "waiting" ? (
        <>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Confirming your payment</h1>
          <p role="status" className="mt-4 text-slate-700 dark:text-slate-300">This usually takes a few seconds. Please keep this page open.</p>
        </>
      ) : null}
      {s.phase === "paid" ? (
        <>
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold text-slate-900 dark:text-white focus:outline-none">Payment confirmed</h1>
          <p role="status" className="mt-4 text-slate-700 dark:text-slate-300">Thank you. {s.name ? `${s.name} is ready.` : ""} {s.requiresSignIn ? "Sign in or create a free account with the email address you used at checkout to access your purchase. We will email your access link to that address too." : `Taking you to ${where} now.`}</p>
          {s.successPath ? <Link href={s.requiresSignIn ? `/sign-in?redirect_url=${encodeURIComponent(s.successPath)}` : s.successPath} className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800">{s.requiresSignIn ? `Sign in to access ${where}` : `Go to ${where}`}</Link> : null}
        </>
      ) : null}
      {s.phase === "failed" ? (
        <>
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold text-slate-900 dark:text-white focus:outline-none">Payment not completed</h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300">Your payment did not go through and you have not been charged for this order. You can try again or use a different payment method.</p>
          <Link href={s.successPath && s.kind === "course" ? s.successPath.replace(/\/learn$/, "") : s.kind === "template" ? "/templates" : "/pricing"} className="mt-6 inline-flex min-h-[44px] items-center rounded-lg border-2 border-blue-700 px-5 py-2 font-semibold text-blue-700 dark:border-blue-400 dark:text-blue-300">Try again</Link>
        </>
      ) : null}
      {s.phase === "slow" || s.phase === "error" ? (
        <>
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold text-slate-900 dark:text-white focus:outline-none">Still confirming your payment</h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300">
            We have not received confirmation yet. If you completed the payment, your access will appear within a few minutes and we will email you. If it does not, <Link href="/contact" className="underline underline-offset-2">contact us</Link> with order reference {orderId}.
          </p>
        </>
      ) : null}
      {s.phase === "unavailable" ? (
        <>
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold text-slate-900 dark:text-white focus:outline-none">Open your purchase</h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300">Please use the browser where you started checkout, or sign in with your checkout email to view this purchase. If you paid, your course or downloads will be linked to that email.</p>
          <Link href={`/sign-in?redirect_url=${encodeURIComponent(`/billing/return?order=${orderId}`)}`} className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800">Sign in to view purchase</Link>
        </>
      ) : null}
      {s.phase === "refunded" ? (
        <>
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold text-slate-900 dark:text-white focus:outline-none">Payment refunded</h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300">This purchase has been refunded and its access has been removed. <Link href="/contact" className="underline underline-offset-2">Contact us</Link> if you need help with order reference {orderId}.</p>
        </>
      ) : null}
    </div>
  )
}
