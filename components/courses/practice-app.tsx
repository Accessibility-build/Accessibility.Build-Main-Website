"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import "./practice-app.css"
import { mountPractice } from "@/lib/courses/practice-engine"
import { createPracticeSaveController, type PracticeSaveStatus } from "@/lib/courses/progress-client"
import type { CourseExam } from "@/lib/courses/config"
import type { CourseAttemptSnapshot, PracticeHistoryEntry, PracticeStart } from "@/lib/courses/practice-types"
import type { CourseFlashcard, CourseProgressData, CourseQuestion, CourseSection } from "@/lib/courses/types"

interface Props {
  slug: string
  userId: string
  edition: string
  courseTitle: string
  exam: CourseExam
  sections: CourseSection[]
  questions: CourseQuestion[]
  flashcards: CourseFlashcard[]
  initial: CourseProgressData
  start?: PracticeStart
}

export function practiceQuery(start: PracticeStart = {}) {
  const query = new URLSearchParams()
  if (start.view) query.set("view", start.view)
  if (start.topics?.length) query.set("topic", [...start.topics].sort().join(","))
  if (start.attempt) query.set("attempt", start.attempt)
  if (start.session) query.set("session", start.session)
  if (start.mock) query.set("mock", start.mock)
  return query.toString()
}

type Engine = ReturnType<typeof mountPractice>
type SaveController = ReturnType<typeof createPracticeSaveController>

export function PracticeApp(props: Props) {
  const { slug, userId, edition, courseTitle, exam, sections, questions, flashcards, initial, start } = props
  const router = useRouter()
  const rootRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const controllerRef = useRef<SaveController | null>(null)
  const mountRef = useRef<((progress: CourseProgressData) => void) | null>(null)
  const pendingRef = useRef(new Map<string, CourseAttemptSnapshot>())
  const retryAttemptsRef = useRef<(() => Promise<void>) | null>(null)
  const routeRef = useRef(practiceQuery(start))
  const startRef = useRef(start)
  startRef.current = start
  const [status, setStatus] = useState<PracticeSaveStatus | null>(null)
  const [pendingCount, setPendingCount] = useState(0)
  const [attemptStorageError, setAttemptStorageError] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const query = practiceQuery(start)

  useEffect(() => {
    if (!rootRef.current) return
    let live = true
    const storagePrefix = `course-attempt:v2:${encodeURIComponent(userId)}:${encodeURIComponent(slug)}:`
    const inFlight = new Map<string, Promise<boolean>>()
    const pending = new Map<string, CourseAttemptSnapshot>()
    pendingRef.current = pending
    try {
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index)
        if (!key?.startsWith(storagePrefix)) continue
        const attempt = JSON.parse(localStorage.getItem(key) ?? "null") as CourseAttemptSnapshot | null
        if (attempt && typeof attempt.id === "string" && key === storagePrefix + attempt.id && Array.isArray(attempt.questions) && attempt.questions.length <= 200) pending.set(attempt.id, attempt)
      }
    } catch { setAttemptStorageError(true) }
    setPendingCount(pending.size)
    function persistAttempts() {
      if (live) setPendingCount(pending.size)
      try {
        for (const attempt of pending.values()) localStorage.setItem(storagePrefix + attempt.id, JSON.stringify(attempt))
        if (live) setAttemptStorageError(false)
      } catch { if (live) setAttemptStorageError(true) }
    }
    function saveAttempt(attempt: CourseAttemptSnapshot): Promise<boolean> {
      const active = inFlight.get(attempt.id)
      if (active) return active
      pending.set(attempt.id, attempt)
      persistAttempts()
      const request = (async () => {
        try {
          const response = await fetch(`/api/courses/${encodeURIComponent(slug)}/attempts`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(attempt),
          })
          if (!response.ok) return false
          pending.delete(attempt.id)
          try { localStorage.removeItem(storagePrefix + attempt.id) } catch { /* a duplicate retry is safe */ }
          persistAttempts()
          if (live) engineRef.current?.markAttemptSaved(attempt.id)
          return true
        } catch { return false }
        finally { inFlight.delete(attempt.id) }
      })()
      inFlight.set(attempt.id, request)
      return request
    }
    retryAttemptsRef.current = async () => {
      for (const attempt of [...pending.values()]) await saveAttempt(attempt)
    }
    const controller = createPracticeSaveController({
      slug, userId, initial,
      onStatus(next) {
        if (!live) return
        setStatus(next)
        if (next.state === "conflict") engineRef.current?.suspend()
      },
    })
    controllerRef.current = controller
    setStatus(controller.getStatus())
    const mount = (progress: CourseProgressData) => {
      if (!rootRef.current) return
      if (engineRef.current) { engineRef.current.replaceState(progress); return }
      engineRef.current = mountPractice({
        root: rootRef.current, slug, edition, courseTitle, exam,
        bank: { sections, questions, flashcards }, initial: progress, start: startRef.current,
        onSave(state: CourseProgressData, final: boolean) { controller.enqueue(state); if (final) void controller.flush() },
        onAttempt: saveAttempt,
        async onListAttempts(offset = 0): Promise<{ attempts: PracticeHistoryEntry[]; nextOffset: number | null }> {
          const response = await fetch(`/api/courses/${encodeURIComponent(slug)}/attempts?offset=${offset}`, { cache: "no-store" })
          if (!response.ok) throw new Error("Attempt history unavailable")
          return await response.json() as { attempts: PracticeHistoryEntry[]; nextOffset: number | null }
        },
        async onLoadAttempt(id: string) {
          const local = pending.get(id)
          if (local) return local
          const response = await fetch(`/api/courses/${encodeURIComponent(slug)}/attempts/${encodeURIComponent(id)}`, { cache: "no-store" })
          if (!response.ok) throw new Error("Attempt unavailable")
          const data = await response.json() as CourseAttemptSnapshot | { attempt: CourseAttemptSnapshot }
          return "attempt" in data ? data.attempt : data
        },
        onRoute(destination: PracticeStart) {
          const next = practiceQuery(destination)
          if (routeRef.current === next) return
          routeRef.current = next
          router.push(`/courses/${encodeURIComponent(slug)}/learn/practice${next ? `?${next}` : ""}`, { scroll: false })
        },
      })
    }
    mountRef.current = mount
    if (!controller.getRecovery()) mount(initial)
    const online = () => { void retryAttemptsRef.current?.() }
    window.addEventListener("online", online)
    if (pending.size) void retryAttemptsRef.current()
    return () => {
      live = false
      window.removeEventListener("online", online)
      engineRef.current?.destroy()
      engineRef.current = null
      controller.dispose()
      controllerRef.current = null
      mountRef.current = null
      retryAttemptsRef.current = null
    }
    // Identity/edition changes create a new controller; route changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, userId, edition])

  useEffect(() => {
    if (routeRef.current === query) return
    routeRef.current = query
    engineRef.current?.navigate(startRef.current)
  }, [query])

  const blocked = status?.state === "recovery" || status?.state === "conflict"
  const failed = status?.state === "offline" || status?.state === "error"
  function downloadLocal() {
    const progress = controllerRef.current?.exportLocal()
    const data = JSON.stringify({ progress: progress ? JSON.parse(progress) : null, attempts: [...pendingRef.current.values()] }, null, 2)
    const url = URL.createObjectURL(new Blob([data], { type: "application/json" }))
    const link = document.createElement("a")
    link.href = url; link.download = `${slug}-unsaved-study-work.json`; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  async function retry() {
    setRetrying(true)
    try { await controllerRef.current?.retry(); await retryAttemptsRef.current?.() }
    finally { setRetrying(false) }
  }

  return (
    <div className="practice-app">
      <div className="save-status" aria-live="polite" aria-atomic="true">
        <p>{status?.message ?? "Loading your practice progress…"}</p>
        {status && !status.storageAvailable ? <p>Browser recovery storage is unavailable. Keep this page open until saving finishes, or download your work.</p> : null}
      </div>
      {blocked ? (
        <section className="feedback" aria-label="Recover your practice work">
          <h2>{status.state === "conflict" ? "Your account has newer progress" : "Unsaved work was found on this device"}</h2>
          <p>{status.state === "conflict" ? "Your local work has not overwritten the account version. Download it before choosing to use the account version." : "Choose which version to continue with. Recovering this device’s work will first check that the account version has not changed."}</p>
          <div className="row">
            {status.state === "recovery" ? <button type="button" className="primary" onClick={() => { const recovered = controllerRef.current?.recoverLocal(); if (recovered) mountRef.current?.(recovered) }}>Recover this device’s work</button> : null}
            <button type="button" className="quiet" onClick={downloadLocal}>Download local work</button>
            <button type="button" className="quiet" onClick={() => { const remote = controllerRef.current?.useRemote(); if (remote) mountRef.current?.(remote) }}>Use account version</button>
          </div>
        </section>
      ) : null}
      {failed || pendingCount > 0 || attemptStorageError ? (
        <section className="feedback" aria-label="Save recovery">
          {pendingCount > 0 ? <p>{pendingCount} detailed {pendingCount === 1 ? "attempt is" : "attempts are"} waiting to save.</p> : null}
          {attemptStorageError ? <p>Your browser could not retain a recovery copy of the detailed review. Keep this page open and retry saving, or download it now.</p> : null}
          <div className="row">
            <button type="button" className="primary" disabled={retrying || blocked} onClick={() => { void retry() }}>{retrying ? "Retrying…" : "Retry saving"}</button>
            <button type="button" className="quiet" onClick={downloadLocal}>Download unsaved work</button>
          </div>
        </section>
      ) : null}
      <div ref={rootRef} hidden={blocked} inert={blocked}>
        <div data-practice-main tabIndex={-1} />
        <div data-practice-live role="status" aria-live="polite" className="sr-only" />
        <dialog aria-labelledby="practice-dlg-title">
          <h2 id="practice-dlg-title" data-dlg-title tabIndex={-1} />
          <div data-dlg-body />
          <div data-dlg-btns className="row" />
        </dialog>
      </div>
    </div>
  )
}
