"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "@formspree/react"
import posthog from "posthog-js"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { company } from "@/lib/company"

/**
 * Five one-click reasons, in plain language, replacing the old seven-option
 * admin taxonomy ("Editorial correction or source update", "Account or
 * billing"). Routing still works, but choosing costs a click rather than
 * reading a dropdown of internal categories. "general" is the default so the
 * field never blocks a submit.
 */
const reasons = [
  ["general", "General question"],
  ["project", "Project or audit enquiry"],
  ["tool-support", "Tool support"],
  ["accessibility-feedback", "Accessibility barrier"],
  ["privacy-billing", "Privacy or billing"],
] as const

const reasonAliases: Record<string, string> = {
  support: "tool-support",
  tool: "tool-support",
  billing: "privacy-billing",
  account: "privacy-billing",
  privacy: "privacy-billing",
  accessibility: "accessibility-feedback",
  correction: "general",
  editorial: "general",
  partnership: "general",
  media: "general",
  speaking: "general",
  general: "general",
  project: "project",
  audit: "project",
}

type FieldName = "name" | "email" | "message"

type QuickContactFormProps = {
  requestedTopic?: string
}

export function QuickContactForm({ requestedTopic }: QuickContactFormProps) {
  const [submission, handleSubmit] = useForm("xpwdbywd")

  const [reason, setReason] = useState(() => {
    if (!requestedTopic) return "general"
    const normalized = requestedTopic.toLowerCase()
    return reasons.some(([value]) => value === normalized)
      ? normalized
      : reasonAliases[normalized] || "general"
  })
  // One object rather than five useStates, so re-validation can be handed the
  // NEW values synchronously. Validating straight after a setState reads the
  // previous render's value, which left an error (and aria-invalid) stuck on
  // whichever field was edited last even after it had been fixed.
  const [values, setValues] = useState({
    name: "",
    email: "",
    message: "",
    organization: "",
    pageUrl: "",
  })
  const { name, email, message, organization, pageUrl } = values

  const [errors, setErrors] = useState<Partial<Record<FieldName | "url", string>>>({})
  // Validation timing, per the site's own accessible-form-validation guide:
  // nothing is flagged until the first submit attempt, after which fields
  // re-check as the user types so errors clear as they are fixed.
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const [pendingSummaryFocus, setPendingSummaryFocus] = useState(false)

  // Focus the error summary once React has actually committed it. Doing this
  // straight after setErrors (even inside requestAnimationFrame) is too early:
  // the summary is not mounted yet, so the ref is still null and focus silently
  // stays where it was, which defeats the whole point of the pattern.
  useEffect(() => {
    if (pendingSummaryFocus && summaryRef.current) {
      summaryRef.current.focus()
      setPendingSummaryFocus(false)
    }
  }, [pendingSummaryFocus])

  const reasonLabel = reasons.find(([value]) => value === reason)?.[1] || "General question"

  const validate = (v: typeof values) => {
    const next: Partial<Record<FieldName | "url", string>> = {}
    if (!v.name.trim()) next.name = "Enter your name so I know who I am replying to."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))
      next.email = "Enter an email address I can reply to."
    if (v.message.trim().length < 10)
      next.message = "Add a sentence or two about what you need."
    if (v.pageUrl.trim()) {
      try {
        const parsed = new URL(v.pageUrl.trim())
        if (!(["http:", "https:"] as string[]).includes(parsed.protocol)) throw new Error("bad protocol")
      } catch {
        next.url = "Enter a full URL starting with https://"
      }
    }
    return next
  }

  const setField = (key: keyof typeof values, value: string) => {
    const next = { ...values, [key]: value }
    setValues(next)
    // Re-check against the new values, not the ones from the last render.
    if (hasSubmitted) setErrors(validate(next))
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setHasSubmitted(true)
    const found = validate(values)
    setErrors(found)

    if (Object.keys(found).length > 0) {
      // Move focus to the summary so the failure is announced and the user
      // lands on the list of problems rather than being left at the button.
      setPendingSummaryFocus(true)
      return
    }

    posthog.capture("contact_form_submitted", {
      form_type: "quick_message",
      topic: reason,
      has_organization: organization.trim().length > 0,
      message_length: message.trim().length,
    })

    const honeypot = new FormData(event.currentTarget).get("_gotcha")
    const form = new FormData()
    form.append("form_type", "Accessibility.build contact message")
    form.append("_subject", `${reasonLabel} from ${name.trim()}`)
    form.append("reason", reasonLabel)
    form.append("name", name.trim())
    form.append("email", email.trim())
    form.append("organization", organization.trim() || "Not supplied")
    form.append("page_or_reference_url", pageUrl.trim() || "Not supplied")
    form.append("message", message.trim())
    form.append("_gotcha", typeof honeypot === "string" ? honeypot : "")
    await handleSubmit(form)
  }

  if (submission.succeeded) {
    return (
      <div className="py-12 text-center" role="status">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
          <CheckCircle2 className="h-8 w-8 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
          Thanks, that reached me.
        </h3>
        <p className="mx-auto mt-3 max-w-sm leading-7 text-muted-foreground">
          You will get a reply from me, {company.legalOperator}, {company.responseTime.toLowerCase()}. If it is urgent, email{" "}
          <a href={`mailto:${company.email}`} className="font-medium text-foreground underline">
            {company.email}
          </a>
          .
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-7"
          onClick={() => window.location.reload()}
        >
          Send another message
        </Button>
      </div>
    )
  }

  const errorList = (["name", "email", "message", "url"] as const)
    .filter((key) => errors[key])
    .map((key) => ({ key, id: key === "url" ? "contact-page-url" : `contact-${key}`, text: errors[key] as string }))

  const describedBy = (field: FieldName | "url", extra?: string) => {
    const ids = [extra, errors[field] ? `${field}-error` : undefined].filter(Boolean)
    return ids.length ? ids.join(" ") : undefined
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {/* Error summary: focusable, announced, and each item jumps to its field. */}
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30"
        >
          <p className="text-sm font-semibold text-red-900 dark:text-red-200">
            {errorList.length === 1
              ? "One thing needs fixing before this can send:"
              : `${errorList.length} things need fixing before this can send:`}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-red-800 dark:text-red-200">
            {errorList.map((item) => (
              <li key={item.key}>
                <a href={`#${item.id}`} className="underline">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset>
        <legend className="text-sm font-medium text-slate-900 dark:text-slate-200">
          What is this about?
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {reasons.map(([value, label]) => {
            const active = reason === value
            return (
              <label
                key={value}
                className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${
                  active
                    // teal-700, not teal-600: white on teal-600 measures
                    // 3.74:1, which fails 1.4.3 for this 14px text.
                    ? "border-teal-800 bg-teal-800 text-white dark:border-teal-700 dark:bg-teal-700"
                    : "border-input bg-background text-slate-700 hover:border-slate-400 dark:text-slate-300 dark:hover:border-slate-500"
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={value}
                  checked={active}
                  onChange={() => setReason(value)}
                  className="sr-only"
                />
                {label}
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">
            Your name <span className="text-red-600 dark:text-red-400">*</span>
          </Label>
          <Input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setField("name", event.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-700 dark:text-red-300">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">
            Email <span className="text-red-600 dark:text-red-400">*</span>
          </Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setField("email", event.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-700 dark:text-red-300">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-message">
            How can I help? <span className="text-red-600 dark:text-red-400">*</span>
          </Label>
          <Textarea
            id="contact-message"
            name="message"
            rows={6}
            maxLength={5000}
            placeholder="A sentence or two is plenty. What are you working on, and what would help?"
            value={message}
            onChange={(event) => setField("message", event.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("message", "message-hint")}
          />
          {errors.message ? (
            <p id="message-error" className="text-sm text-red-700 dark:text-red-300">
              {errors.message}
            </p>
          ) : (
            <p id="message-hint" className="text-sm text-muted-foreground">
              No need to write a brief. I will ask if I need more.
            </p>
          )}
        </div>
      </div>

      {/* Optional extras, collapsed by default so the form reads as three
          fields. Native <details> per the site's own disclosure guidance. */}
      <details className="group rounded-lg border border-input bg-muted/30 px-4 py-3">
        <summary className="cursor-pointer list-none text-sm font-medium text-slate-900 dark:text-slate-200">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="transition-transform group-open:rotate-90">
              &#9656;
            </span>
            Add a few details (optional)
          </span>
        </summary>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact-organization">Organization</Label>
            <Input
              id="contact-organization"
              autoComplete="organization"
              value={organization}
              onChange={(event) => setField("organization", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-page-url">Relevant page URL</Label>
            <Input
              id="contact-page-url"
              type="url"
              inputMode="url"
              placeholder="https://"
              value={pageUrl}
              onChange={(event) => setField("pageUrl", event.target.value)}
              aria-invalid={errors.url ? true : undefined}
              aria-describedby={describedBy("url")}
            />
            {errors.url && (
              <p id="url-error" className="text-sm text-red-700 dark:text-red-300">
                {errors.url}
              </p>
            )}
          </div>
        </div>
      </details>

      {submission.errors && Object.keys(submission.errors).length > 0 && (
        <p
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200"
        >
          That did not send, and the fault is probably mine. Please email{" "}
          <a href={`mailto:${company.email}`} className="font-medium underline">
            {company.email}
          </a>{" "}
          instead and I will pick it up.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button type="submit" size="lg" disabled={submission.submitting} className="gap-2">
          {submission.submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send message
            </>
          )}
        </Button>
        <p className="text-sm text-muted-foreground">
          {company.responseTime}. No newsletter, no sales sequence.
        </p>
      </div>

      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
    </form>
  )
}
