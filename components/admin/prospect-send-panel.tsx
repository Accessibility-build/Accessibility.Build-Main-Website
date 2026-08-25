"use client"

import { useId, useMemo, useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Send,
  Settings2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { CopyButton, TierBadge, type ProspectRecord } from "@/components/admin/prospect-ui"

export type EmailConfig = {
  configured: boolean
  fromAddress: string | null
  replyTo: string | null
}

const BLOCKED_TIERS = new Set(["linkedin-only", "hold"])

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Mirror of lib/email/templates.ts → renderProspectOutreachEmail, so the
 * preview shows exactly what will land in the recipient's inbox: the same
 * minimal, personal styling, the same link handling, the same opt-out line.
 */
function buildPreviewHtml(subject: string, body: string, includeOptOut: boolean): string {
  const linkify = (escaped: string): string =>
    escaped
      .replace(
        /\b((?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<]*)?)/gi,
        (match) => {
          const href = match.startsWith("http") ? match : `https://${match}`
          return `<a href="${href}">${match}</a>`
        },
      )
      .replace(
        /\b([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})\b/gi,
        (match) => `<a href="mailto:${match}">${match}</a>`,
      )

  const paragraphs = body.trim()
    ? body
        .trim()
        .split(/\n{2,}/)
        .map((block) => `<p>${linkify(escapeHtml(block)).replace(/\n/g, "<br />")}</p>`)
        .join("\n")
    : `<p style="color:#9ca3af">Nothing to preview yet.</p>`

  const optOut =
    "If you would rather not hear from me, reply to this note and I will not write again."

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { margin: 0; padding: 0; background:#ffffff; -webkit-text-size-adjust:100%; }
  .wrap { max-width:560px; margin:0 auto; padding:32px 24px; }
  .wrap, .wrap p { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; font-size:15px; line-height:1.65; color:#1f2937; }
  .wrap p { margin:0 0 16px; }
  .wrap p:last-of-type { margin-bottom:0; }
  .wrap a { color:#0f766e; text-decoration:underline; }
  .sig-rule { border:none; border-top:1px solid #e5e7eb; margin:28px 0 16px; }
  .optout { font-size:12px; line-height:1.5; color:#9ca3af; margin:0; }
</style></head>
<body><div class="wrap">
${paragraphs}
${includeOptOut ? `<hr class="sig-rule" /><p class="optout">${escapeHtml(optOut)}</p>` : ""}
</div></body></html>`
}

type SendResult = { tone: "success" | "error"; text: string }

export function ProspectSendPanel({
  prospect,
  emailConfig,
  onSent,
  onAnnounce,
}: {
  prospect: ProspectRecord
  emailConfig: EmailConfig
  onSent: (updated: ProspectRecord) => void
  onAnnounce: (message: string) => void
}) {
  const subjectId = useId()
  const bodyId = useId()
  const optOutId = useId()

  const [subject, setSubject] = useState(prospect.subject ?? "")
  const [body, setBody] = useState(prospect.emailBody ?? "")
  const [includeOptOut, setIncludeOptOut] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  const [sentAt, setSentAt] = useState<string | null>(prospect.sentAt)
  const [confirming, setConfirming] = useState(false)
  const [sending, setSending] = useState(false)
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)

  const blockedTier = BLOCKED_TIERS.has(prospect.tier ?? "")
  const hasAddress = Boolean(prospect.emailAddress)
  const alreadySent = Boolean(sentAt)

  const previewHtml = useMemo(
    () => buildPreviewHtml(subject, body, includeOptOut),
    [subject, body, includeOptOut],
  )

  const canRealSend =
    emailConfig.configured &&
    !blockedTier &&
    hasAddress &&
    subject.trim().length > 0 &&
    body.trim().length > 0 &&
    !sending

  const canTest =
    emailConfig.configured &&
    Boolean(emailConfig.replyTo) &&
    subject.trim().length > 0 &&
    body.trim().length > 0 &&
    !testing

  async function post(payload: Record<string, unknown>) {
    const response = await fetch(`/api/admin/prospects/${prospect.id}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await response.json().catch(() => null)
    return { response, data }
  }

  async function handleTest() {
    if (!canTest) return
    setTesting(true)
    setResult(null)
    try {
      const { response, data } = await post({
        subject: subject.trim(),
        body: body.trim(),
        includeOptOut,
        test: true,
      })
      if (!response.ok) {
        setResult({ tone: "error", text: data?.error ?? `Test failed (${response.status}).` })
        return
      }
      setResult({ tone: "success", text: `Test sent to ${data?.to ?? "your inbox"}. Check how it looks.` })
    } catch {
      setResult({ tone: "error", text: "Test failed. Check your connection and try again." })
    } finally {
      setTesting(false)
    }
  }

  async function handleRealSend() {
    if (!canRealSend) return
    setSending(true)
    setResult(null)
    try {
      const { response, data } = await post({
        subject: subject.trim(),
        body: body.trim(),
        includeOptOut,
        confirmResend: alreadySent ? true : undefined,
      })
      if (!response.ok) {
        setResult({ tone: "error", text: data?.error ?? `Send failed (${response.status}).` })
        setConfirming(false)
        return
      }
      const updated = data?.prospect as ProspectRecord | null
      if (updated) {
        setSentAt(updated.sentAt)
        onSent(updated)
      } else {
        setSentAt(new Date().toISOString())
      }
      setConfirming(false)
      setResult({
        tone: "success",
        text: `Sent to ${data?.to ?? prospect.emailAddress}. Status moved to Sent.`,
      })
    } catch {
      setResult({ tone: "error", text: "Send failed. Check your connection and try again." })
    } finally {
      setSending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
          <Send className="h-5 w-5" aria-hidden="true" />
          Send email
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Delivery configuration status */}
        {emailConfig.configured ? (
          <div className="flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <Settings2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div className="space-y-0.5">
              <p>
                From <span className="font-medium text-slate-800 dark:text-slate-200">{emailConfig.fromAddress ?? "unknown sender"}</span>
              </p>
              <p>
                Replies go to{" "}
                <span className="font-medium text-slate-800 dark:text-slate-200">{emailConfig.replyTo ?? "the sending address"}</span>
              </p>
            </div>
          </div>
        ) : (
          <div
            role="note"
            className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-50"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-medium">Email sending is not configured yet.</p>
              <p className="mt-1 text-xs">
                Add <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">RESEND_API_KEY</code> and{" "}
                <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">RESEND_FROM_ADDRESS</code> to the
                environment, then redeploy. You can still edit and preview the draft below.
              </p>
            </div>
          </div>
        )}

        {/* Recipient + guardrails */}
        <div className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm">
              <span className="text-slate-500">To </span>
              {hasAddress ? (
                <span className="font-mono font-medium">{prospect.emailAddress}</span>
              ) : (
                <span className="font-medium text-amber-700 dark:text-amber-300">No published address</span>
              )}
            </div>
            <TierBadge tier={prospect.tier} />
          </div>
          {blockedTier ? (
            <p className="mt-2 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              This tier should be approached on LinkedIn. Cold email is blocked for it.
            </p>
          ) : null}
          {alreadySent ? (
            <p className="mt-2 flex items-center gap-2 text-xs text-sky-800 dark:text-sky-300">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Already sent on {new Date(sentAt as string).toLocaleString()}.
            </p>
          ) : null}
        </div>

        {/* Editable subject */}
        <div>
          <Label htmlFor={subjectId}>Subject</Label>
          <Input
            id={subjectId}
            className="mt-1.5"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            maxLength={300}
            disabled={sending}
            placeholder="Subject line"
          />
        </div>

        {/* Editable body */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor={bodyId}>Body</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview((value) => !value)}
              aria-pressed={showPreview}
            >
              {showPreview ? (
                <>
                  <EyeOff className="mr-1.5 h-4 w-4" aria-hidden="true" /> Hide preview
                </>
              ) : (
                <>
                  <Eye className="mr-1.5 h-4 w-4" aria-hidden="true" /> Preview
                </>
              )}
            </Button>
          </div>
          <Textarea
            id={bodyId}
            className="mt-1.5 min-h-[13rem] font-mono text-sm leading-6"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={20000}
            disabled={sending}
            placeholder="Write the note here. Plain text; blank lines start new paragraphs."
          />
          <p className="mt-1 text-xs text-slate-500">
            Sent as a plain, personal email. No logo, no buttons, no marketing footer.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <CopyButton
              value={subject}
              label="Copy subject"
              announcement="Subject copied to the clipboard"
              onAnnounce={onAnnounce}
            />
            <CopyButton
              value={body}
              label="Copy body"
              announcement="Body copied to the clipboard"
              onAnnounce={onAnnounce}
            />
            <CopyButton
              value={subject || body ? `Subject: ${subject}\n\n${body}` : null}
              label="Copy subject + body"
              announcement="Subject and body copied to the clipboard"
              onAnnounce={onAnnounce}
            />
          </div>
        </div>

        {/* WYSIWYG preview */}
        {showPreview ? (
          <div>
            <p className="mb-1.5 text-xs font-medium text-slate-500">
              Preview — this is exactly what lands in the inbox
            </p>
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white dark:border-slate-700">
              <iframe
                title="Email preview"
                srcDoc={previewHtml}
                className="h-80 w-full border-0 bg-white"
                sandbox=""
              />
            </div>
          </div>
        ) : null}

        {/* Opt-out toggle */}
        <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800">
          <Label htmlFor={optOutId} className="text-sm font-normal">
            Append a one-line opt-out
            <span className="mt-0.5 block text-xs text-slate-500">
              Standard for cold B2B email and recommended for UK, IE and CA.
            </span>
          </Label>
          <Switch id={optOutId} checked={includeOptOut} onCheckedChange={setIncludeOptOut} disabled={sending} />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button type="button" variant="outline" onClick={handleTest} disabled={!canTest}>
            {testing ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" /> Sending test…
              </>
            ) : (
              "Send test to me"
            )}
          </Button>

          {confirming ? (
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-teal-300 bg-teal-50 px-3 py-2 dark:border-teal-800 dark:bg-teal-950/40">
              <span className="text-sm font-medium text-teal-900 dark:text-teal-100">
                Send a real email to {prospect.emailAddress}?
              </span>
              <Button type="button" size="sm" onClick={handleRealSend} disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
                  </>
                ) : (
                  "Yes, send it"
                )}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={sending}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={() => {
                setResult(null)
                setConfirming(true)
              }}
              disabled={!canRealSend}
            >
              <Send className="mr-1.5 h-4 w-4" aria-hidden="true" />
              {alreadySent ? "Resend" : `Send to ${prospect.company}`}
            </Button>
          )}
        </div>

        <div aria-live="polite">
          {result ? (
            <p
              className={
                result.tone === "success"
                  ? "rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-50"
                  : "rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-950 dark:border-red-800 dark:bg-red-950/40 dark:text-red-50"
              }
            >
              {result.text}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
