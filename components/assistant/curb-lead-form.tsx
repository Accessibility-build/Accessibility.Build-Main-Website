"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { company } from "@/lib/company"
import { ASSISTANT_LEAD_ENDPOINT, type LeadOffer } from "@/lib/assistant/config"

// The contact form Curb shows under an answer when it judges the visitor wants help from the
// team. Prefilled from the conversation; nothing is sent until the visitor presses Send.

type Field = "name" | "email" | "organisation" | "website" | "message"
type Values = Record<Field, string>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: Values): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  if (!values.name.trim()) errors.name = "Enter your name."
  if (!EMAIL.test(values.email.trim())) errors.email = "Enter a valid email address, like name@example.com."
  if (values.website.trim() && !/^\S+\.\S+$/.test(values.website.trim())) {
    errors.website = "Enter a website address like example.com, or leave it blank."
  }
  if (!values.message.trim()) errors.message = "Tell us briefly what you need."
  return errors
}

const ORDER: Field[] = ["name", "email", "organisation", "website", "message"]

export function CurbLeadForm({
  idPrefix,
  offer,
  source,
  conversationId,
  messageId,
  autoFocus,
  onSent,
  onDismiss,
}: {
  idPrefix: string
  offer: LeadOffer | null
  source: "ai_offer" | "manual"
  conversationId: string
  messageId?: string
  autoFocus?: boolean
  onSent: (details: { name: string; email: string }) => void
  onDismiss: () => void
}) {
  const headingId = useId()
  const [values, setValues] = useState<Values>({
    name: offer?.prefill.name ?? "",
    email: offer?.prefill.email ?? "",
    organisation: offer?.prefill.organisation ?? "",
    website: offer?.prefill.website ?? "",
    message: offer?.prefill.message ?? "",
  })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [formError, setFormError] = useState("")
  const [sending, setSending] = useState(false)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const fieldId = (field: Field) => `${idPrefix}-${field}`

  useEffect(() => {
    if (autoFocus) requestAnimationFrame(() => document.getElementById(fieldId("name"))?.focus())
    // Focus once, when the form first appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (field: Field) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [field]: event.target.value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const focusField = (field: Field) => requestAnimationFrame(() => document.getElementById(fieldId(field))?.focus())

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (sending) return
    const found = validate(values)
    setErrors(found)
    setFormError("")
    const first = ORDER.find((field) => found[field])
    if (first) {
      focusField(first)
      return
    }
    setSending(true)
    try {
      const response = await fetch(ASSISTANT_LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          messageId,
          source,
          ...values,
          pagePath: window.location.pathname,
          confirmWebsite: honeypotRef.current?.value ?? "",
        }),
      })
      const data = (await response.json().catch(() => null)) as { error?: string; message?: string; field?: string } | null
      if (!response.ok) {
        const field = data?.field as Field | undefined
        if (field && ORDER.includes(field)) {
          setErrors({ [field]: data?.error ?? "Please check this field." })
          focusField(field)
        } else {
          setFormError(data?.message || data?.error || `Your request could not be sent. Please email ${company.email} instead.`)
        }
        return
      }
      onSent({ name: values.name.trim(), email: values.email.trim() })
    } catch {
      setFormError(`Your request could not be sent. Please email ${company.email} instead.`)
    } finally {
      setSending(false)
    }
  }

  const input =
    "mt-1 w-full rounded-lg border border-slate-500 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-red-700 dark:aria-[invalid=true]:border-red-400"

  const fields: { field: Field; label: string; required: boolean; type: string; autoComplete: string; multiline?: boolean }[] = [
    { field: "name", label: "Your name", required: true, type: "text", autoComplete: "name" },
    { field: "email", label: "Email", required: true, type: "email", autoComplete: "email" },
    { field: "organisation", label: "Organisation", required: false, type: "text", autoComplete: "organization" },
    { field: "website", label: "Website", required: false, type: "text", autoComplete: "url" },
    { field: "message", label: "What do you need?", required: true, type: "text", autoComplete: "off", multiline: true },
  ]

  return (
    <section aria-labelledby={headingId} className="mt-3 rounded-2xl border border-border bg-muted/40 p-4">
      <h4 id={headingId} className="text-sm font-semibold text-foreground">
        Get help from the team
      </h4>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Leave your details and our team will reply by email within two business days. Nothing is sent until you
        press Send.
      </p>
      <form noValidate onSubmit={submit} className="mt-3 space-y-3">
        {fields.map(({ field, label, required, type, autoComplete, multiline }) => {
          const errorId = `${fieldId(field)}-error`
          const shared = {
            id: fieldId(field),
            name: field,
            value: values[field],
            onChange: set(field),
            autoComplete,
            required,
            "aria-required": required || undefined,
            "aria-invalid": errors[field] ? true : undefined,
            "aria-describedby": errors[field] ? errorId : undefined,
            className: cn(input, multiline && "min-h-24 resize-y"),
          }
          return (
            <div key={field}>
              <label htmlFor={fieldId(field)} className="text-sm font-medium text-foreground">
                {label} <span className="font-normal text-muted-foreground">({required ? "required" : "optional"})</span>
              </label>
              {multiline ? <textarea {...shared} rows={3} maxLength={2000} /> : <input {...shared} type={type} maxLength={field === "website" ? 300 : 254} />}
              {errors[field] && (
                <p id={errorId} className="mt-1 flex items-start gap-1.5 text-sm text-red-700 dark:text-red-400">
                  <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                  {errors[field]}
                </p>
              )}
            </div>
          )
        })}

        {/* Hidden from people and assistive technology; only bots fill it in. */}
        <div aria-hidden="true" className="hidden">
          <label>
            Leave this empty
            <input ref={honeypotRef} name="confirmWebsite" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {formError && (
          <p role="alert" className="flex items-start gap-1.5 text-sm text-red-700 dark:text-red-400">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            {formError}
          </p>
        )}

        <p className="text-xs leading-5 text-muted-foreground">
          We use these details only to reply about your request.{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            Privacy policy
          </Link>
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            aria-disabled={sending || undefined}
            className="inline-flex min-h-10 items-center rounded-full border border-transparent bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:hover:bg-blue-400"
          >
            {sending ? "Sending..." : "Send to the team"}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            No thanks
          </button>
        </div>
      </form>
    </section>
  )
}

/** Shown in place of the form once the request is sent. Takes focus so the result is heard. */
export function CurbLeadSent({ name, email, autoFocus }: { name: string; email: string; autoFocus?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (autoFocus) ref.current?.focus()
    // Focus once, when the confirmation first appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="mt-3 flex items-start gap-2 rounded-2xl border border-border bg-muted/40 p-4 text-sm leading-6 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
      <p>
        <strong className="font-semibold">Thanks, {name}.</strong> Your request is with our team, and we will reply to{" "}
        {email} within two business days.
      </p>
    </div>
  )
}
