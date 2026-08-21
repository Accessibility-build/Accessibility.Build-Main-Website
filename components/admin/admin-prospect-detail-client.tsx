"use client"

import { useId, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Mail, ShieldAlert, TriangleAlert } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import {
  CopyButton,
  LiveRegion,
  STATUS_LABELS,
  StatusBadge,
  TierBadge,
  statusLabel,
  useAnnouncer,
  type ProspectRecord,
} from "@/components/admin/prospect-ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const SELECT_CLASSES =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-slate-200 py-3 last:border-b-0 sm:grid sm:grid-cols-3 sm:gap-4 dark:border-slate-800">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{children}</dd>
    </div>
  )
}

export function AdminProspectDetailClient({ prospect }: { prospect: ProspectRecord }) {
  const { message, announce } = useAnnouncer()

  const [status, setStatus] = useState(prospect.status)
  const [notes, setNotes] = useState(prospect.notes ?? "")
  const [saved, setSaved] = useState({ status: prospect.status, notes: prospect.notes ?? "" })
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ tone: "success" | "error"; text: string } | null>(null)

  const statusId = useId()
  const notesId = useId()

  const dirty = status !== saved.status || notes.trim() !== saved.notes.trim()

  const subjectAndBody = useMemo(() => {
    const subject = prospect.subject ? `Subject: ${prospect.subject}` : null
    const body = prospect.emailBody ?? null
    if (!subject && !body) return null
    return [subject, body].filter(Boolean).join("\n\n")
  }, [prospect.subject, prospect.emailBody])

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!dirty || saving) return

    setSaving(true)
    setResult(null)

    try {
      const response = await fetch(`/api/admin/prospects/${prospect.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes: notes.trim() }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        const text = payload?.error ?? `Save failed (${response.status}).`
        setResult({ tone: "error", text })
        announce(text)
        return
      }

      setSaved({ status, notes: notes.trim() })
      const text = `Saved. Status is now ${statusLabel(status)}.`
      setResult({ tone: "success", text })
      announce(text)
    } catch {
      const text = "Save failed. Check your connection and try again."
      setResult({ tone: "error", text })
      announce(text)
    } finally {
      setSaving(false)
    }
  }

  const summary = [prospect.sector, prospect.country].filter(Boolean).join(" — ")

  return (
    <div className="space-y-6">
      <LiveRegion message={message} />

      <p>
        <Link
          href="/admin/prospects"
          className="inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-300"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to all prospects
        </Link>
      </p>

      <AdminPageHeader
        eyebrow="Outreach prospect"
        title={prospect.company}
        description={
          summary
            ? `${summary}. Read the finding, then copy the email into your mail client.`
            : "Read the finding, then copy the email into your mail client."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <TierBadge tier={prospect.tier} />
            <StatusBadge status={prospect.status} />
            <span className="text-sm text-slate-600 dark:text-slate-400">Score {prospect.score}</span>
          </div>
        }
      />

      {prospect.caution ? (
        <div
          role="alert"
          className="flex gap-3 rounded-md border-2 border-red-500 bg-red-50 p-4 text-red-950 dark:border-red-500 dark:bg-red-950/60 dark:text-red-50"
        >
          <TriangleAlert className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />
          <div>
            <h2 className="text-base font-bold">Caution before contacting</h2>
            <p className="mt-1 text-sm font-medium">{prospect.caution}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                <Mail className="h-5 w-5" aria-hidden="true" />
                The email
              </h2>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <h3 className="text-sm font-medium text-slate-500">Subject</h3>
                <div className="mt-2 flex flex-wrap items-start gap-3">
                  <p className="min-w-0 flex-1 break-words rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-medium dark:border-slate-800 dark:bg-slate-900">
                    {prospect.subject ?? "No subject line recorded."}
                  </p>
                  <CopyButton
                    value={prospect.subject}
                    label="Copy subject"
                    announcement="Subject copied to the clipboard"
                    onAnnounce={announce}
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-medium text-slate-500">Body</h3>
                  <div className="flex flex-wrap gap-2">
                    <CopyButton
                      value={subjectAndBody}
                      label="Copy subject + body"
                      announcement="Subject and body copied to the clipboard"
                      onAnnounce={announce}
                    />
                    <CopyButton
                      value={prospect.emailBody}
                      label="Copy email"
                      announcement="Email body copied to the clipboard"
                      onAnnounce={announce}
                      variant="default"
                      size="lg"
                      className="font-semibold"
                    />
                  </div>
                </div>
                {prospect.emailBody ? (
                  <pre className="mt-2 whitespace-pre-wrap break-words rounded-md border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
                    {prospect.emailBody}
                  </pre>
                ) : (
                  <p className="mt-2 rounded-md border border-dashed border-slate-300 p-4 text-sm dark:border-slate-700">
                    No email body recorded for this prospect yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold leading-none tracking-tight">Verified findings</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {prospect.findings && prospect.findings.length > 0 ? (
                <ol className="space-y-2 pl-5 [list-style:decimal]">
                  {prospect.findings.map((finding, index) => (
                    <li key={`${finding.n}-${index}`} className="pl-1 text-sm leading-6">
                      {finding.text}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">No findings recorded.</p>
              )}

              {prospect.evidence ? (
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Evidence</h3>
                  <p className="mt-1 text-sm leading-6">{prospect.evidence}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold leading-none tracking-tight">Contact</h2>
            </CardHeader>
            <CardContent>
              <h3 className="text-sm font-medium text-slate-500">Email address</h3>
              {prospect.emailAddress ? (
                <div className="mt-2 space-y-2">
                  <p className="break-all rounded-md border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm dark:border-slate-800 dark:bg-slate-900">
                    {prospect.emailAddress}
                  </p>
                  <CopyButton
                    value={prospect.emailAddress}
                    label="Copy address"
                    announcement="Email address copied to the clipboard"
                    onAnnounce={announce}
                  />
                  {prospect.addressSource ? (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Published at: {prospect.addressSource}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-2 flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-50">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>No published address — use LinkedIn instead.</span>
                </p>
              )}

              <dl className="mt-4">
                <DetailRow label="Contact role">{prospect.contactRole ?? "Not researched"}</DetailRow>
                <DetailRow label="Website">
                  {prospect.website ? (
                    <a
                      href={prospect.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 break-all underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-300"
                    >
                      {prospect.website}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    "Not recorded"
                  )}
                </DetailRow>
                <DetailRow label="Country">{prospect.country ?? "Unknown"}</DetailRow>
                <DetailRow label="Sector">{prospect.sector ?? "Unknown"}</DetailRow>
                <DetailRow label="Tier">
                  <TierBadge tier={prospect.tier} />
                </DetailRow>
                <DetailRow label="Sendability">{prospect.sendability ?? "Not assessed"}</DetailRow>
                <DetailRow label="Overlay">{prospect.overlay ?? "None detected"}</DetailRow>
                <DetailRow label="Accessibility statement">
                  {prospect.hasStatement ? "Published" : "None found"}
                  {prospect.statementNote ? (
                    <span className="mt-1 block text-slate-600 dark:text-slate-400">{prospect.statementNote}</span>
                  ) : null}
                </DetailRow>
                <DetailRow label="Scanned">
                  {prospect.scannedAt ? new Date(prospect.scannedAt).toLocaleDateString() : "Not recorded"}
                </DetailRow>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold leading-none tracking-tight">Your pipeline</h2>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSave}>
                <div>
                  <Label htmlFor={statusId}>Status</Label>
                  <select
                    id={statusId}
                    className={`${SELECT_CLASSES} mt-1.5`}
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    disabled={saving}
                  >
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor={notesId}>Your notes</Label>
                  <Textarea
                    id={notesId}
                    className="mt-1.5 min-h-[8rem]"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    disabled={saving}
                    maxLength={5000}
                    placeholder="What happened, who replied, what to do next."
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Notes and status are yours. Re-running the seed script never overwrites them.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={!dirty || saving}>
                    {saving ? "Saving…" : "Save changes"}
                  </Button>
                  {dirty && !saving ? (
                    <span className="text-xs text-slate-600 dark:text-slate-400">Unsaved changes</span>
                  ) : null}
                </div>

                {result ? (
                  <p
                    className={
                      result.tone === "success"
                        ? "rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-50"
                        : "rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-950 dark:border-red-800 dark:bg-red-950/40 dark:text-red-50"
                    }
                  >
                    {result.tone === "success" ? "Saved: " : "Error: "}
                    {result.text}
                  </p>
                ) : null}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
