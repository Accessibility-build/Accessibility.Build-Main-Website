"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { Ban, Check, CircleSlash, Clock, Filter, Loader2, MessageSquare, Trash2, X } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { LiveRegion, useAnnouncer } from "@/components/admin/prospect-ui"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CaseCommentStatus } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

/**
 * Moderation queue for reader comments on /cases/<slug>.
 *
 * Three rules run through this file:
 *  - Status is always spelled out in words. The icon and the colour only repeat
 *    what the text already says, so nothing depends on telling hues apart.
 *  - Nothing that can hold focus is ever disabled mid-request. A button that
 *    disables itself while its own fetch is in flight drops focus to the body,
 *    so busy buttons are marked with aria-disabled and the handler ignores the
 *    extra clicks instead.
 *  - When a row leaves the current view, focus is moved deliberately: to the
 *    next row's first action, or to the results heading when the view empties.
 *
 * The type is imported from the schema type-only, so drizzle never reaches the
 * client bundle.
 */

/** The subset of a comment row this screen needs, with dates already ISO. */
export type CaseCommentRecord = {
  id: string
  caseSlug: string
  authorName: string
  body: string
  status: CaseCommentStatus
  moderatedAt: string | null
  moderatedBy: string | null
  moderationNote: string | null
  createdAt: string | null
}

export type CaseOption = {
  slug: string
  title: string
}

type AdminCommentsClientProps = {
  comments: CaseCommentRecord[]
  caseOptions: CaseOption[]
  loadError: string | null
}

type StatusFilter = CaseCommentStatus | "all"

type ActionKey = "approve" | "reject" | "spam" | "delete"

type PendingAction = { id: string; action: ActionKey }

/** Row that has just left the view, plus the row that should take its focus. */
type FocusPlan = { rowId: string; neighbourId: string | null }

const STATUS_ORDER: readonly CaseCommentStatus[] = ["pending", "approved", "rejected", "spam"]

const STATUS_LABELS: Record<CaseCommentStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  spam: "Spam",
}

const STATUS_CLASSES: Record<CaseCommentStatus, string> = {
  pending: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100",
  approved:
    "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100",
  rejected: "border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100",
  spam: "border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/50 dark:text-red-100",
}

const STATUS_ICONS: Record<CaseCommentStatus, LucideIcon> = {
  pending: Clock,
  approved: Check,
  rejected: X,
  spam: Ban,
}

const ACTION_STATUS: Record<Exclude<ActionKey, "delete">, CaseCommentStatus> = {
  approve: "approved",
  reject: "rejected",
  spam: "spam",
}

const SELECT_CLASSES =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

// ---------------------------------------------------------------------------
// Time
// ---------------------------------------------------------------------------
// Server and browser rarely share a time zone, so the first paint uses a fixed
// UTC rendering that both agree on and the local, relative wording arrives once
// hydration has happened. That keeps the markup identical across the boundary.

const RELATIVE_FORMAT = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" })
const LOCAL_FORMAT = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" })
const UTC_FORMAT = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
})

const DIVISIONS: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
]

function relativeTime(date: Date): string {
  let duration = (date.getTime() - Date.now()) / 1000

  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return RELATIVE_FORMAT.format(Math.round(duration), division.unit)
    }
    duration /= division.amount
  }

  return LOCAL_FORMAT.format(date)
}

function parseDate(iso: string | null): Date | null {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

/**
 * A subscribe function that never fires. `useSyncExternalStore` then returns the
 * server snapshot for the hydrating render and the client one straight after,
 * which is the cheapest way to ask "has this hydrated yet" without setting
 * state from an effect.
 */
const neverChanges = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

function useHydrated(): boolean {
  return useSyncExternalStore(neverChanges, clientSnapshot, serverSnapshot)
}

function Timestamp({ iso, hydrated }: { iso: string | null; hydrated: boolean }) {
  const date = parseDate(iso)

  if (!date || !iso) {
    return <span className="text-slate-600 dark:text-slate-400">Unknown</span>
  }

  return (
    <time dateTime={iso} className="block whitespace-nowrap">
      {hydrated ? (
        <>
          <span className="block">{relativeTime(date)}</span>
          <span className="block text-xs text-slate-600 dark:text-slate-400">{LOCAL_FORMAT.format(date)}</span>
        </>
      ) : (
        <span className="block">{UTC_FORMAT.format(date)} UTC</span>
      )}
    </time>
  )
}

function StatusBadge({ status }: { status: CaseCommentStatus }) {
  const Icon = STATUS_ICONS[status]

  return (
    <Badge variant="outline" className={cn("gap-1.5", STATUS_CLASSES[status])}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {STATUS_LABELS[status]}
    </Badge>
  )
}

// ---------------------------------------------------------------------------
// Response reading
// ---------------------------------------------------------------------------

function readErrorText(payload: unknown): string | null {
  if (payload && typeof payload === "object") {
    const { error } = payload as { error?: unknown }
    if (typeof error === "string" && error.trim() !== "") return error
  }
  return null
}

function isCaseCommentStatus(value: unknown): value is CaseCommentStatus {
  return typeof value === "string" && (STATUS_ORDER as readonly string[]).includes(value)
}

/** Fold the server's copy of a moderated comment over the optimistic one. */
function applyServerComment(payload: unknown, fallback: CaseCommentRecord): CaseCommentRecord {
  if (!payload || typeof payload !== "object") return fallback

  const { comment } = payload as { comment?: unknown }
  if (!comment || typeof comment !== "object") return fallback

  const raw = comment as Record<string, unknown>

  return {
    ...fallback,
    status: isCaseCommentStatus(raw.status) ? raw.status : fallback.status,
    moderatedAt: typeof raw.moderatedAt === "string" ? raw.moderatedAt : fallback.moderatedAt,
    moderatedBy: typeof raw.moderatedBy === "string" ? raw.moderatedBy : fallback.moderatedBy,
    moderationNote: typeof raw.moderationNote === "string" ? raw.moderationNote : null,
  }
}

// ---------------------------------------------------------------------------

export function AdminCommentsClient({ comments, caseOptions, loadError }: AdminCommentsClientProps) {
  const [rows, setRows] = useState<CaseCommentRecord[]>(comments)
  // Pending is the queue that needs a decision, so that is what opens.
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending")
  const [caseFilter, setCaseFilter] = useState<string>("all")
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmTarget, setConfirmTarget] = useState<CaseCommentRecord | null>(null)

  const { message, announce } = useAnnouncer()
  const hydrated = useHydrated()

  const statusGroupId = useId()
  const caseFilterId = useId()

  const approveRefs = useRef(new Map<string, HTMLButtonElement>())
  const deleteRefs = useRef(new Map<string, HTMLButtonElement>())
  const summaryRef = useRef<HTMLHeadingElement>(null)
  const focusPlanRef = useRef<FocusPlan | null>(null)

  const titles = useMemo(() => {
    const map = new Map<string, string>()
    caseOptions.forEach((option) => map.set(option.slug, option.title))
    return map
  }, [caseOptions])

  const caseTitle = useCallback(
    (slug: string) => titles.get(slug) ?? slug,
    [titles]
  )

  /** Every slug worth offering: the registry, plus any orphan a row still uses. */
  const filterCases = useMemo(() => {
    const seen = new Map<string, string>()
    caseOptions.forEach((option) => seen.set(option.slug, option.title))
    rows.forEach((row) => {
      if (!seen.has(row.caseSlug)) seen.set(row.caseSlug, row.caseSlug)
    })
    return [...seen.entries()]
      .map(([slug, title]) => ({ slug, title }))
      .sort((a, b) => a.title.localeCompare(b.title))
  }, [caseOptions, rows])

  const counts = useMemo(() => {
    const byStatus: Record<CaseCommentStatus, number> = { pending: 0, approved: 0, rejected: 0, spam: 0 }
    rows.forEach((row) => {
      byStatus[row.status] += 1
    })
    return byStatus
  }, [rows])

  const matches = useCallback(
    (comment: CaseCommentRecord) => {
      if (statusFilter !== "all" && comment.status !== statusFilter) return false
      if (caseFilter !== "all" && comment.caseSlug !== caseFilter) return false
      return true
    },
    [statusFilter, caseFilter]
  )

  const filtered = useMemo(() => rows.filter(matches), [rows, matches])

  const describe = useCallback(
    (comment: CaseCommentRecord) => `by ${comment.authorName} on ${caseTitle(comment.caseSlug)}`,
    [caseTitle]
  )

  /**
   * Focus after a row leaves the view. Runs once the new list is on screen, so
   * the neighbour it reaches for is guaranteed to be mounted.
   */
  useEffect(() => {
    const plan = focusPlanRef.current
    if (!plan) return
    focusPlanRef.current = null

    // Still visible: the button that was clicked kept focus on its own.
    if (filtered.some((comment) => comment.id === plan.rowId)) return

    const neighbour = plan.neighbourId ? approveRefs.current.get(plan.neighbourId) : undefined
    if (neighbour) {
      neighbour.focus()
      return
    }

    summaryRef.current?.focus()
  }, [filtered])

  const planFocus = (id: string) => {
    const index = filtered.findIndex((comment) => comment.id === id)
    const neighbour = index === -1 ? undefined : filtered[index + 1] ?? filtered[index - 1]
    focusPlanRef.current = { rowId: id, neighbourId: neighbour?.id ?? null }
  }

  const changeStatusFilter = (next: StatusFilter) => {
    setStatusFilter(next)
    const visible = rows.filter(
      (comment) =>
        (next === "all" || comment.status === next) &&
        (caseFilter === "all" || comment.caseSlug === caseFilter)
    ).length
    const label = next === "all" ? "all statuses" : STATUS_LABELS[next].toLowerCase()
    announce(`Filtered to ${label}. ${visible} comment${visible === 1 ? "" : "s"} shown.`)
  }

  const changeCaseFilter = (next: string) => {
    setCaseFilter(next)
    const visible = rows.filter(
      (comment) =>
        (statusFilter === "all" || comment.status === statusFilter) &&
        (next === "all" || comment.caseSlug === next)
    ).length
    const label = next === "all" ? "all case studies" : caseTitle(next)
    announce(`Filtered to ${label}. ${visible} comment${visible === 1 ? "" : "s"} shown.`)
  }

  const moderate = async (comment: CaseCommentRecord, action: Exclude<ActionKey, "delete">) => {
    if (pending) return

    const nextStatus = ACTION_STATUS[action]
    const previous = rows
    const optimistic = previous.map((row) =>
      row.id === comment.id ? { ...row, status: nextStatus, moderatedAt: new Date().toISOString() } : row
    )
    const remaining = optimistic.filter(matches).length
    const leavesView = !optimistic.some((row) => row.id === comment.id && matches(row))

    setPending({ id: comment.id, action })
    setActionError(null)
    planFocus(comment.id)
    setRows(optimistic)

    try {
      const response = await fetch(`/api/admin/case-comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })

      const payload: unknown = await response.json().catch(() => null)

      if (!response.ok) {
        focusPlanRef.current = null
        setRows(previous)
        const text =
          readErrorText(payload) ?? `Could not update the comment ${describe(comment)} (${response.status}).`
        setActionError(text)
        announce(text)
        return
      }

      setRows((current) =>
        current.map((row) => (row.id === comment.id ? applyServerComment(payload, row) : row))
      )

      const base = `Comment ${describe(comment)} marked as ${STATUS_LABELS[nextStatus].toLowerCase()}.`
      announce(
        leavesView
          ? `${base} It has left this view. ${remaining} comment${remaining === 1 ? "" : "s"} left here.`
          : base
      )
    } catch {
      focusPlanRef.current = null
      setRows(previous)
      const text = `Could not update the comment ${describe(comment)}. Check your connection and try again.`
      setActionError(text)
      announce(text)
    } finally {
      setPending(null)
    }
  }

  const confirmDelete = async () => {
    const target = confirmTarget
    if (!target || pending) return

    setPending({ id: target.id, action: "delete" })
    setActionError(null)

    try {
      const response = await fetch(`/api/admin/case-comments/${target.id}`, { method: "DELETE" })
      const payload: unknown = await response.json().catch(() => null)

      if (!response.ok) {
        const text = readErrorText(payload) ?? `Could not delete the comment ${describe(target)} (${response.status}).`
        setActionError(text)
        announce(text)
        setConfirmTarget(null)
        // The row survived, so send focus back to the control that opened this.
        requestAnimationFrame(() => deleteRefs.current.get(target.id)?.focus())
        return
      }

      planFocus(target.id)
      const remaining = rows.filter((row) => row.id !== target.id).filter(matches).length
      setRows((current) => current.filter((row) => row.id !== target.id))
      setConfirmTarget(null)
      announce(
        `Comment ${describe(target)} deleted. ${remaining} comment${remaining === 1 ? "" : "s"} left in this view.`
      )
    } catch {
      const text = `Could not delete the comment ${describe(target)}. Check your connection and try again.`
      setActionError(text)
      announce(text)
      setConfirmTarget(null)
      requestAnimationFrame(() => deleteRefs.current.get(target.id)?.focus())
    } finally {
      setPending(null)
    }
  }

  const total = rows.length
  const deleting = pending?.action === "delete"

  return (
    <div className="space-y-6">
      <LiveRegion message={message} />

      <AdminPageHeader
        eyebrow="Moderation"
        title="Case study comments"
        description="Reader comments on the case studies. Nothing is published until it is approved here. Approving, rejecting and marking as spam are all reversible; deleting is not."
      />

      {loadError ? (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
        >
          <p>
            <strong>Comments could not be loaded.</strong> {loadError}
          </p>
        </div>
      ) : null}

      {actionError ? (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
        >
          <p>
            <strong>That did not save.</strong> {actionError}
          </p>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <h2 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
            <Filter className="h-5 w-5" aria-hidden="true" />
            Filter
          </h2>
        </CardHeader>
        <CardContent className="space-y-5">
          <fieldset>
            <legend className="text-sm font-medium leading-none">Status</legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {(["all", ...STATUS_ORDER] as StatusFilter[]).map((value) => {
                const label = value === "all" ? "All" : STATUS_LABELS[value]
                const count = value === "all" ? total : counts[value]
                const inputId = `${statusGroupId}-${value}`

                return (
                  <div key={value}>
                    <input
                      type="radio"
                      id={inputId}
                      name={statusGroupId}
                      value={value}
                      checked={statusFilter === value}
                      onChange={() => changeStatusFilter(value)}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={inputId}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-50 peer-checked:border-teal-800 peer-checked:bg-teal-800 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-teal-600 peer-focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 dark:peer-checked:border-teal-500 dark:peer-checked:bg-teal-600 dark:peer-focus-visible:ring-teal-300"
                    >
                      {label}
                      <span className="tabular-nums">{count.toLocaleString()}</span>
                    </label>
                  </div>
                )
              })}
            </div>
          </fieldset>

          <div className="max-w-md">
            <Label htmlFor={caseFilterId}>Case study</Label>
            <select
              id={caseFilterId}
              className={`${SELECT_CLASSES} mt-1.5`}
              value={caseFilter}
              onChange={(event) => changeCaseFilter(event.target.value)}
            >
              <option value="all">All case studies</option>
              {filterCases.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.title}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2
            ref={summaryRef}
            tabIndex={-1}
            className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-300"
          >
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
            Showing {filtered.length.toLocaleString()} of {total.toLocaleString()}
          </h2>
        </CardHeader>
        <CardContent>
          {total === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <p className="font-medium">No comments yet.</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Readers have to be signed in to comment, and everything they post lands here for review
                before it appears on the case study.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
              <p className="font-medium">No comments match these filters.</p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setStatusFilter("all")
                  setCaseFilter("all")
                  announce(`Filters cleared. ${total} comment${total === 1 ? "" : "s"} shown.`)
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[1000px]">
                <TableCaption className="mt-0 caption-top pb-4 text-left">
                  {statusFilter === "all" ? "All comments" : `${STATUS_LABELS[statusFilter]} comments`}
                  {caseFilter === "all" ? "" : ` on ${caseTitle(caseFilter)}`}, newest first. Approve, reject
                  or mark a comment as spam to change what readers see; delete removes it for good.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">Author</TableHead>
                    <TableHead scope="col">Case study</TableHead>
                    <TableHead scope="col">Comment</TableHead>
                    <TableHead scope="col">Posted</TableHead>
                    <TableHead scope="col">Status</TableHead>
                    <TableHead scope="col">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((comment) => {
                    const busy = pending?.id === comment.id
                    const suffix = `comment ${describe(comment)}`
                    const moderatedOn = parseDate(comment.moderatedAt)
                    const hasTrail = Boolean(comment.moderatedBy || moderatedOn || comment.moderationNote)

                    return (
                      <TableRow key={comment.id}>
                        <TableHead scope="row" className="h-auto py-4 align-top font-medium text-foreground">
                          {comment.authorName}
                        </TableHead>
                        <TableCell className="align-top">
                          <Link
                            href={`/cases/${comment.caseSlug}`}
                            className="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-300"
                          >
                            {caseTitle(comment.caseSlug)}
                          </Link>
                        </TableCell>
                        <TableCell className="max-w-[28rem] align-top">
                          {/* Plain text. The body is never treated as markup. */}
                          <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">{comment.body}</p>
                        </TableCell>
                        <TableCell className="align-top">
                          <Timestamp iso={comment.createdAt} hydrated={hydrated} />
                        </TableCell>
                        <TableCell className="align-top">
                          <StatusBadge status={comment.status} />
                          {hasTrail ? (
                            <p className="mt-2 max-w-[16rem] text-xs text-slate-600 dark:text-slate-400">
                              {comment.moderatedBy ? `By ${comment.moderatedBy}` : "Moderated"}
                              {moderatedOn ? ` on ${hydrated ? LOCAL_FORMAT.format(moderatedOn) : `${UTC_FORMAT.format(moderatedOn)} UTC`}` : ""}
                              .
                              {comment.moderationNote ? ` Note: ${comment.moderationNote}` : ""}
                            </p>
                          ) : null}
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex flex-wrap gap-2">
                            <ActionButton
                              action="approve"
                              label="Approve"
                              context={suffix}
                              busy={busy && pending?.action === "approve"}
                              blocked={Boolean(pending)}
                              onClick={() => void moderate(comment, "approve")}
                              buttonRef={(element) => {
                                if (element) approveRefs.current.set(comment.id, element)
                                else approveRefs.current.delete(comment.id)
                              }}
                            />
                            <ActionButton
                              action="reject"
                              label="Reject"
                              context={suffix}
                              busy={busy && pending?.action === "reject"}
                              blocked={Boolean(pending)}
                              onClick={() => void moderate(comment, "reject")}
                            />
                            <ActionButton
                              action="spam"
                              label="Mark as spam"
                              context={suffix}
                              busy={busy && pending?.action === "spam"}
                              blocked={Boolean(pending)}
                              onClick={() => void moderate(comment, "spam")}
                            />
                            <ActionButton
                              action="delete"
                              label="Delete"
                              context={suffix}
                              busy={busy && pending?.action === "delete"}
                              blocked={Boolean(pending)}
                              onClick={() => {
                                setActionError(null)
                                setConfirmTarget(comment)
                              }}
                              buttonRef={(element) => {
                                if (element) deleteRefs.current.set(comment.id, element)
                                else deleteRefs.current.delete(comment.id)
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setConfirmTarget(null)
        }}
      >
        <AlertDialogContent
          onCloseAutoFocus={(event) => {
            // Focus is placed by hand: the trigger row may no longer exist.
            event.preventDefault()
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmTarget ? `Delete the comment by ${confirmTarget.authorName}?` : "Delete this comment?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmTarget
                ? `This permanently removes the comment ${describe(confirmTarget)}. It cannot be undone. To hide it without losing the record, reject it or mark it as spam instead.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {confirmTarget ? (
            <blockquote className="max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-sm whitespace-pre-wrap [overflow-wrap:anywhere] dark:border-slate-800 dark:bg-slate-900">
              {confirmTarget.body}
            </blockquote>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                const id = confirmTarget?.id
                if (id) requestAnimationFrame(() => deleteRefs.current.get(id)?.focus())
              }}
            >
              Keep the comment
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              aria-busy={deleting}
              onClick={(event) => {
                // Radix closes on click; the request drives the close instead.
                event.preventDefault()
                void confirmDelete()
              }}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
              {deleting ? "Deleting" : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

const ACTION_ICONS: Record<ActionKey, LucideIcon> = {
  approve: Check,
  reject: X,
  spam: CircleSlash,
  delete: Trash2,
}

type ActionButtonProps = {
  action: ActionKey
  /** Visible text, which is also the start of the accessible name. */
  label: string
  /** Sr-only continuation naming the comment, e.g. "comment by Jane Doe". */
  context: string
  busy: boolean
  /** True while any request is in flight, including this row's own. */
  blocked: boolean
  onClick: () => void
  buttonRef?: (element: HTMLButtonElement | null) => void
}

/**
 * Never uses the `disabled` attribute: a button that disables itself while its
 * own request runs takes focus down with it. `aria-disabled` says the same thing
 * to assistive technology, keeps the button focusable, and the click is dropped
 * in the handler.
 */
function ActionButton({ action, label, context, busy, blocked, onClick, buttonRef }: ActionButtonProps) {
  const Icon = ACTION_ICONS[action]

  return (
    <Button
      ref={buttonRef}
      type="button"
      size="sm"
      variant={action === "approve" ? "default" : "outline"}
      aria-disabled={blocked}
      aria-busy={busy}
      className={cn(
        blocked && "cursor-not-allowed opacity-60",
        action === "delete" &&
          "border-red-300 text-red-800 hover:bg-red-50 hover:text-red-900 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-950/50 dark:hover:text-red-100"
      )}
      onClick={() => {
        if (blocked) return
        onClick()
      }}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Icon className="h-4 w-4" aria-hidden="true" />
      )}
      <span>
        {label}
        <span className="sr-only"> {context}</span>
      </span>
    </Button>
  )
}
