"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { COMMENT_MAX_LENGTH, type PublicComment } from "@/lib/case-comments"

interface CaseCommentsProps {
  caseSlug: string
  caseTitle: string
  /** Approved comments rendered on the server, so the thread exists without JS. */
  initialComments: PublicComment[]
}

type SubmitState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "held" }
  | { kind: "published" }
  | { kind: "error"; message: string }

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

/**
 * Reader discussion for a case study.
 *
 * Notes on the accessibility decisions, since this ships on an accessibility
 * site and the usual comment widget gets all of them wrong:
 * - The existing thread is server-rendered, so it is readable with JavaScript
 *   unavailable and is present for search engines.
 * - Errors are reported in text next to the field and repeated in a live
 *   region, and focus moves to the field that needs attention.
 * - The character counter is polite, not assertive, so a screen reader is not
 *   interrupted on every keystroke.
 * - Spam control is a hidden honeypot plus a server-side per-account rate
 *   limit. No CAPTCHA: they exclude the people this site exists for.
 */
export function CaseComments({ caseSlug, caseTitle, initialComments }: CaseCommentsProps) {
  const { isSignedIn, isLoaded } = useUser()
  const [comments, setComments] = useState<PublicComment[]>(initialComments)
  const [body, setBody] = useState("")
  const [state, setState] = useState<SubmitState>({ kind: "idle" })
  const [announcement, setAnnouncement] = useState("")

  const fieldId = useId()
  const errorId = `${fieldId}-error`
  const counterId = `${fieldId}-counter`
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)

  const remaining = COMMENT_MAX_LENGTH - body.length
  const overLimit = remaining < 0
  const hasError = state.kind === "error"

  useEffect(() => {
    if (hasError) textareaRef.current?.focus()
  }, [hasError])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state.kind === "sending") return

    const trimmed = body.trim()
    if (trimmed.length === 0) {
      setState({ kind: "error", message: "Write a comment before posting." })
      setAnnouncement("Your comment is empty. Write something before posting.")
      return
    }
    if (overLimit) {
      setState({
        kind: "error",
        message: `Your comment is ${Math.abs(remaining).toLocaleString("en-US")} characters over the limit.`,
      })
      setAnnouncement("Your comment is too long.")
      return
    }

    setState({ kind: "sending" })
    setAnnouncement("Posting your comment.")

    try {
      const response = await fetch(`/api/cases/${caseSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed, website: honeypotRef.current?.value ?? "" }),
      })

      const data = (await response.json().catch(() => ({}))) as {
        error?: string
        status?: string
        comment?: PublicComment | null
      }

      if (!response.ok) {
        const message = data.error ?? "That comment could not be posted. Try again."
        setState({ kind: "error", message })
        setAnnouncement(message)
        return
      }

      setBody("")

      if (data.status === "approved" && data.comment) {
        setComments((prev) => [...prev, data.comment as PublicComment])
        setState({ kind: "published" })
        setAnnouncement("Your comment has been posted.")
      } else {
        setState({ kind: "held" })
        setAnnouncement("Your comment has been sent for review and will appear once approved.")
      }
    } catch {
      const message = "The comment could not be sent. Check your connection and try again."
      setState({ kind: "error", message })
      setAnnouncement(message)
    }
  }

  return (
    <section
      id="discussion"
      aria-labelledby="discussion-heading"
      className="scroll-mt-24 border-t-2 border-slate-900 pt-8 dark:border-slate-100"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
        Discussion
      </p>
      <h2
        id="discussion-heading"
        className="mt-2 font-serif text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl"
      >
        {comments.length === 0
          ? "Add to this case study"
          : `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
      </h2>
      <p className="mt-4 max-w-[68ch] text-[1.0625rem] leading-8 text-slate-600 dark:text-slate-400">
        Corrections, primary sources and first-hand experience are all welcome, particularly from
        people who worked on this case or who use assistive technology. Comments are read before
        they appear.
      </p>

      {comments.length > 0 ? (
        <ol className="mt-8 max-w-[68ch] space-y-6">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="border-t border-slate-200 pt-5 first:border-t-0 first:pt-0 dark:border-slate-800"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-semibold text-slate-900 dark:text-white">{comment.authorName}</p>
                {comment.isAuthor ? (
                  <span className="rounded-sm bg-teal-100 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-teal-900 dark:bg-teal-900/50 dark:text-teal-200">
                    Author
                  </span>
                ) : null}
                <time
                  dateTime={comment.createdAt}
                  className="text-sm text-slate-500 dark:text-slate-400"
                >
                  {formatDate(comment.createdAt)}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-[0.95rem] leading-7 text-slate-700 dark:text-slate-300">
                {comment.body}
              </p>
            </li>
          ))}
        </ol>
      ) : null}

      <noscript>
        <div className="mt-10 max-w-[68ch] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-[0.95rem] leading-7 text-slate-700 dark:text-slate-300">
            Posting a comment needs JavaScript. The comments above are part of the page and are
            readable without it. To send a correction another way, email{" "}
            <a href="mailto:contact@accessibility.build" className="font-medium underline">
              contact@accessibility.build
            </a>
            .
          </p>
        </div>
      </noscript>

      <div className="mt-10 max-w-[68ch]">
        {!isLoaded ? (
          // Holds the space while Clerk resolves, so the section does not jump
          // once it knows whether this reader is signed in.
          <div
            className="border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50"
            aria-hidden="true"
          >
            <p className="text-[0.95rem] text-slate-500 dark:text-slate-400">Loading the comment form…</p>
          </div>
        ) : isSignedIn ? (
          <form onSubmit={handleSubmit} noValidate>
            <label
              htmlFor={fieldId}
              className="block text-sm font-semibold text-slate-900 dark:text-white"
            >
              Your comment
            </label>

            {hasError ? (
              <p
                id={errorId}
                className="mt-2 border-l-[3px] border-rose-700 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-400 dark:bg-rose-950/40 dark:text-rose-200"
              >
                {state.message}
              </p>
            ) : null}

            <textarea
              id={fieldId}
              ref={textareaRef}
              value={body}
              onChange={(event) => {
                setBody(event.target.value)
                if (state.kind === "error") setState({ kind: "idle" })
              }}
              rows={5}
              maxLength={COMMENT_MAX_LENGTH * 2}
              aria-describedby={`${counterId}${hasError ? ` ${errorId}` : ""}`}
              aria-invalid={hasError || overLimit}
              className="mt-2 w-full rounded-none border border-slate-300 bg-white px-3 py-2.5 text-[0.95rem] leading-7 text-slate-900 shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus-visible:ring-offset-slate-950"
              placeholder={`What did this miss about ${caseTitle}?`}
            />

            <p
              id={counterId}
              aria-live="polite"
              className={
                overLimit
                  ? "mt-1.5 text-sm font-medium text-rose-700 dark:text-rose-400"
                  : "mt-1.5 text-sm text-slate-500 dark:text-slate-400"
              }
            >
              {overLimit
                ? `${Math.abs(remaining).toLocaleString("en-US")} characters over the limit`
                : `${remaining.toLocaleString("en-US")} characters remaining`}
            </p>

            {/* Honeypot. Hidden from sight, from assistive technology and from
                the tab order, so only automation ever fills it in. */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor={`${fieldId}-website`}>Leave this field empty</label>
              <input
                id={`${fieldId}-website`}
                ref={honeypotRef}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button type="submit" disabled={state.kind === "sending"}>
                {state.kind === "sending" ? "Posting…" : "Post comment"}
              </Button>
              {state.kind === "held" ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Thank you. Your comment is with the editor and will appear once reviewed.
                </p>
              ) : null}
              {state.kind === "published" ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">Your comment is live.</p>
              ) : null}
            </div>
          </form>
        ) : (
          <div className="border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
            <p className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Sign in to comment
            </p>
            <p className="mt-2 text-[0.95rem] leading-7 text-slate-600 dark:text-slate-400">
              An account is required so that every comment has a real person behind it. It takes a
              moment and no payment details are involved.
            </p>
            <Button asChild className="mt-4">
              <Link href={`/sign-in?redirect_url=${encodeURIComponent(`/cases/${caseSlug}#discussion`)}`}>
                Sign in to comment
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Single polite live region for submission status. */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </section>
  )
}
