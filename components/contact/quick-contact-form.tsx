"use client"

import { useState } from "react"
import { useForm, ValidationError } from "@formspree/react"
import { CheckCircle2, Loader2, Mail, MessageSquareText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const topics = [
  ["tool-support", "Tool support"],
  ["account-billing", "Account or billing"],
  ["privacy", "Privacy or data request"],
  ["accessibility-feedback", "Website accessibility feedback"],
  ["editorial", "Editorial correction or source update"],
  ["partnership", "Partnership, media, or speaking"],
  ["general", "General message"],
] as const

const topicAliases: Record<string, string> = {
  support: "tool-support",
  tool: "tool-support",
  billing: "account-billing",
  account: "account-billing",
  privacy: "privacy",
  accessibility: "accessibility-feedback",
  correction: "editorial",
  editorial: "editorial",
  partnership: "partnership",
  media: "partnership",
  speaking: "partnership",
  general: "general",
}

const topicGuidance: Record<string, string> = {
  "tool-support": "Include the tool name, affected URL, approximate time, browser, and any non-sensitive error message.",
  "account-billing": "Include the account email and relevant receipt or order reference. Never send passwords or complete payment-card details.",
  privacy: "Describe the information or account involved and the action you are requesting. Identity verification may be required before a data request is completed.",
  "accessibility-feedback": "Share the page, task, assistive technology or browser, and the barrier you encountered.",
  editorial: "Include the page or article URL, the statement to review, and a reliable supporting source when available.",
  partnership: "Describe the organization, proposed activity, audience, date, and the specific response you need.",
  general: "Provide enough context to route and answer the message without including confidential information.",
}

const inputClass = "h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

type QuickContactFormProps = {
  requestedTopic?: string
}

export function QuickContactForm({ requestedTopic }: QuickContactFormProps) {
  const [submission, handleSubmit] = useForm("xpwdbywd")
  const [topic, setTopic] = useState(() => {
    if (!requestedTopic) return "general"
    const normalized = requestedTopic.toLowerCase()
    return topics.some(([value]) => value === normalized) ? normalized : topicAliases[normalized] || "general"
  })
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [organization, setOrganization] = useState("")
  const [subject, setSubject] = useState("")
  const [pageUrl, setPageUrl] = useState("")
  const [message, setMessage] = useState("")
  const [deadline, setDeadline] = useState("")
  const [error, setError] = useState("")

  const topicLabel = topics.find(([value]) => value === topic)?.[1] || "General message"

  const submitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) return setError("Enter your name.")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Enter a valid email address.")
    if (subject.trim().length < 4) return setError("Enter a clear subject.")
    if (message.trim().length < 20) return setError("Add a little more detail so the message can be answered properly.")
    if (pageUrl.trim()) {
      try {
        const parsedUrl = new URL(pageUrl.trim())
        if (!(["http:", "https:"] as string[]).includes(parsedUrl.protocol)) throw new Error("Invalid protocol")
      } catch {
        return setError("Enter a complete page URL beginning with http:// or https://.")
      }
    }

    setError("")
    const honeypot = new FormData(event.currentTarget).get("_gotcha")
    const form = new FormData()
    form.append("form_type", "Accessibility.build contact message")
    form.append("topic", topicLabel)
    form.append("name", name.trim())
    form.append("email", email.trim())
    form.append("organization", organization.trim() || "Not supplied")
    form.append("subject", subject.trim())
    form.append("page_or_reference_url", pageUrl.trim() || "Not supplied")
    form.append("deadline", deadline || "Not supplied")
    form.append("message", message.trim())
    form.append("_gotcha", typeof honeypot === "string" ? honeypot : "")
    await handleSubmit(form)
  }

  if (submission.succeeded) {
    return (
      <div className="py-10 text-center" role="status">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-semibold">Message received</h3>
        <p className="mx-auto mt-3 max-w-xl leading-7 text-muted-foreground">Thank you. Your message will normally be reviewed within two business days.</p>
        <Button type="button" variant="outline" className="mt-6" onClick={() => window.location.reload()}>Send another message</Button>
      </div>
    )
  }

  return (
    <form onSubmit={submitMessage} noValidate className="space-y-6">
      <div className="flex items-start gap-3 border-b pb-5">
        <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h3 className="font-semibold">Send a focused message</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Required fields are marked with an asterisk. Do not include passwords, payment-card details, or confidential customer data.</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-topic">Topic <span aria-hidden="true" className="text-red-600">*</span></Label>
        <select id="contact-topic" value={topic} onChange={(event) => setTopic(event.target.value)} className={inputClass} aria-describedby="contact-topic-guidance" required>
          {topics.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <p className="text-xs leading-5 text-muted-foreground" id="contact-topic-guidance">{topicGuidance[topic]}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name <span aria-hidden="true" className="text-red-600">*</span></Label>
          <Input id="contact-name" name="name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required />
          <ValidationError prefix="Name" field="name" errors={submission.errors} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email <span aria-hidden="true" className="text-red-600">*</span></Label>
          <Input id="contact-email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <ValidationError prefix="Email" field="email" errors={submission.errors} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-organization">Organization</Label>
          <Input id="contact-organization" autoComplete="organization" value={organization} onChange={(event) => setOrganization(event.target.value)} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-subject">Subject <span aria-hidden="true" className="text-red-600">*</span></Label>
          <Input id="contact-subject" value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={140} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-page-url">Relevant page or reference URL</Label>
          <Input id="contact-page-url" type="url" inputMode="url" value={pageUrl} onChange={(event) => setPageUrl(event.target.value)} placeholder="https://" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-deadline">Relevant deadline</Label>
          <Input id="contact-deadline" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact-message">Message <span aria-hidden="true" className="text-red-600">*</span></Label>
          <Textarea id="contact-message" value={message} onChange={(event) => setMessage(event.target.value)} rows={7} maxLength={5000} aria-describedby="contact-message-count" required />
          <p id="contact-message-count" className="text-right text-xs text-muted-foreground">{message.length} / 5,000 characters</p>
        </div>
      </div>

      {error && <p className="border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200" role="alert">{error}</p>}
      {submission.errors && Object.keys(submission.errors).length > 0 && <p className="border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200" role="alert">The message could not be sent. Review the details or email contact@accessibility.build.</p>}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
        <p className="text-sm text-muted-foreground">Response target: within two business days.</p>
        <Button type="submit" disabled={submission.submitting}>{submission.submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending message</> : <><Mail className="mr-2 h-4 w-4" />Send message</>}</Button>
      </div>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    </form>
  )
}
