"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { CourseStudyProgress, StudyChange } from "@/lib/courses/progress-contract"

type Edit = StudyChange extends infer T ? T extends StudyChange ? Omit<T, "baseRevision"> : never : never
type Pending = { change: StudyChange; requestId: string }
type Recovery = { version: 2; savedAt: string; changes: Pending[]; active: Pending | null }
type Status = "saved" | "saving" | "error" | "conflict"
const revisionKey = (c: Edit) => c.kind === "check" ? `check:${c.questionId}` : c.kind === "note" || c.kind === "activity" || c.kind === "bookmark" ? `${c.kind}:${c.key}` : c.kind
const newId = () => globalThis.crypto?.randomUUID?.() ?? `study-${Date.now()}-${Math.random().toString(36).slice(2)}`

function apply(study: CourseStudyProgress, c: Edit): CourseStudyProgress {
  if (c.kind === "check") return study
  if (c.kind === "note") return { ...study, notes: { ...study.notes, [c.key]: c.text } }
  if (c.kind === "activity") return { ...study, activities: { ...study.activities, [c.key]: c.value } }
  if (c.kind === "settings") return { ...study, settings: c.value }
  if (c.kind === "location") return { ...study, lastLocation: { chapterKey: c.chapterKey, ...(c.anchor ? { anchor: c.anchor } : {}), updatedAt: new Date().toISOString() } }
  const bookmarks = new Set(study.bookmarks ?? [])
  if (c.bookmarked) bookmarks.add(c.key); else bookmarks.delete(c.key)
  return { ...study, bookmarks: [...bookmarks] }
}

function validPending(value: unknown): value is Pending {
  if (!value || typeof value !== "object") return false
  const item = value as Pending
  if (typeof item.requestId !== "string" || item.requestId.length > 100 || !item.change || typeof item.change !== "object") return false
  const c = item.change
  if (!["note", "activity", "bookmark", "settings", "location", "check"].includes(c.kind)) return false
  if ("key" in c && (typeof c.key !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,159}$/.test(c.key))) return false
  if ("baseRevision" in c && (!Number.isSafeInteger(c.baseRevision) || c.baseRevision < 0)) return false
  if (c.kind === "note") return typeof c.text === "string" && c.text.length <= 12000
  if (c.kind === "bookmark") return typeof c.bookmarked === "boolean"
  if (c.kind === "location") return typeof c.chapterKey === "string"
  if (c.kind === "check") return typeof c.questionId === "string" && Number.isInteger(c.answer) && c.answer >= 0 && c.answer <= 3 && ["low", "medium", "high"].includes(c.confidence) && Number.isSafeInteger(c.baseRevision) && c.baseRevision >= 0
  return Boolean(c.value && typeof c.value === "object")
}

/** Serial, idempotent per-item writes with explicit conflict and device recovery. */
export function useStudyProgress(slug: string, userId: string, initial: CourseStudyProgress = {}) {
  const [study, setStudy] = useState(initial)
  const [status, setStatus] = useState<Status>("saved")
  const [message, setMessage] = useState("")
  const [recovery, setRecovery] = useState<Recovery | null>(null)
  const [epoch, setEpoch] = useState(0)
  const revisions = useRef({ ...initial.revisions })
  const initialRef = useRef(initial)
  initialRef.current = initial
  const pending = useRef(new Map<string, Pending>())
  // Active is immutable until acknowledged. Later edits live separately in pending.
  const active = useRef<Pending | null>(null)
  const running = useRef<Promise<void> | null>(null)
  const blocked = useRef(false)
  const mounted = useRef(true)
  const recoveryPending = useRef(false)
  const recoveryRef = useRef<Recovery | null>(null)
  const remote = useRef<CourseStudyProgress | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const key = useRef("")
  const initialized = useRef("")
  const generation = useRef(0)
  const source = useRef<{ key: string; raw: string } | null>(null)
  const storageAvailable = useRef(true)

  const removeSource = useCallback(() => {
    if (!source.current) return
    try {
      if (localStorage.getItem(source.current.key) === source.current.raw) localStorage.removeItem(source.current.key)
    } catch { storageAvailable.current = false }
    source.current = null
  }, [])
  const persist = useCallback(() => {
    if (!key.current || recoveryPending.current) return
    try {
      if (active.current || pending.current.size) {
        const value: Recovery = { version: 2, savedAt: new Date().toISOString(), active: active.current, changes: [...pending.current.values()] }
        localStorage.setItem(key.current, JSON.stringify(value))
      } else {
        localStorage.removeItem(key.current)
        removeSource()
      }
      storageAvailable.current = true
    } catch { storageAvailable.current = false }
  }, [removeSource])

  const drain = useCallback((final = false): Promise<void> => {
    if (running.current) return running.current
    if (blocked.current || recoveryPending.current || (!active.current && !pending.current.size)) return Promise.resolve()
    if (timer.current) { clearTimeout(timer.current); timer.current = null }
    const ownGeneration = generation.current
    running.current = (async () => {
      if (mounted.current) { setStatus("saving"); setMessage("Saving your work…") }
      while (!blocked.current && !recoveryPending.current && (active.current || pending.current.size)) {
        if (!active.current) {
          const [itemKey, item] = pending.current.entries().next().value as [string, Pending]
          active.current = item
          pending.current.delete(itemKey)
        }
        const item = active.current
        const itemKey = revisionKey(item.change)
        persist()
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 15000)
        try {
          const body = JSON.stringify({ op: "study", change: item.change, requestId: item.requestId })
          const response = await fetch(`/api/courses/${encodeURIComponent(slug)}/progress`, {
            method: "PATCH", headers: { "Content-Type": "application/json" }, body,
            keepalive: final && new TextEncoder().encode(body).byteLength < 60000, signal: controller.signal,
          })
          const result = await response.json()
          if (generation.current !== ownGeneration) return
          if (response.status === 409) {
            remote.current = result.progress?.study ?? {}
            blocked.current = true
            if (mounted.current) { setStatus("conflict"); setMessage("This item was changed in another tab or device. Your local work is kept. Choose which version to use.") }
            break
          }
          if (!response.ok || !result.ok) throw new Error(result.error || "Save failed")
          const revision = result.progress?.study?.revisions?.[itemKey] ?? result.revision
          if (!Number.isSafeInteger(revision)) throw new Error("Invalid save acknowledgement")
          revisions.current[itemKey] = revision
          active.current = null
          const next = pending.current.get(itemKey)
          // Rebase only this device's next edit, after its preceding write succeeded.
          if (next && "baseRevision" in next.change) next.change.baseRevision = revision
          persist()
        } catch {
          if (generation.current !== ownGeneration) return
          blocked.current = true
          persist()
          if (mounted.current) {
            setStatus("error")
            setMessage(storageAvailable.current ? "Your work has not reached your account. It is kept on this device. Retry before switching devices." : "Your work is not saved, and this browser cannot keep a recovery copy. Keep this page open, download your work, and retry.")
          }
          break
        } finally { clearTimeout(timeout) }
      }
      if (!active.current && !pending.current.size && mounted.current) { setStatus("saved"); setMessage("Saved to your account.") }
    })().finally(() => { if (generation.current === ownGeneration) running.current = null })
    return running.current
  }, [slug, persist])

  const change = useCallback((edit: Edit) => {
    if (recoveryPending.current) return
    setStudy((value) => apply(value, edit))
    const itemKey = revisionKey(edit)
    const needsRevision = edit.kind === "note" || edit.kind === "activity" || edit.kind === "settings" || edit.kind === "check"
    const value = structuredClone({ ...edit, ...(needsRevision ? { baseRevision: revisions.current[itemKey] ?? 0 } : {}) }) as StudyChange
    pending.current.set(itemKey, { change: value, requestId: newId() })
    persist()
    if (!blocked.current) { setStatus("saving"); setMessage("Saving your work…") }
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => void drain(), 650)
  }, [persist, drain])

  useEffect(() => {
    mounted.current = true
    const identity = `${encodeURIComponent(userId)}:${encodeURIComponent(slug)}`
    if (initialized.current !== identity) {
      generation.current++
      initialized.current = identity
      pending.current.clear(); active.current = null; running.current = null
      blocked.current = false; recoveryPending.current = false; recoveryRef.current = null; remote.current = null; source.current = null
      revisions.current = { ...initialRef.current.revisions }
      setStudy(initialRef.current); setRecovery(null); setStatus("saved"); setMessage("")
      let tab = newId()
      try {
        tab = sessionStorage.getItem("course-progress-tab") ?? tab
        sessionStorage.setItem("course-progress-tab", tab)
      } catch { /* A fresh identity still isolates recovery from other tabs. */ }
      const prefix = `course-study-v2:${identity}:`
      key.current = `${prefix}${tab}`
      try {
        const candidates: Array<{ key: string; raw: string; value: Recovery }> = []
        for (let i = 0; i < localStorage.length; i++) {
          const candidateKey = localStorage.key(i)
          if (!candidateKey?.startsWith(prefix)) continue
          const raw = localStorage.getItem(candidateKey)
          if (!raw || raw.length > 2 * 1024 * 1024) continue
          try {
            const value = JSON.parse(raw) as Recovery
            if (value.version !== 2 || !Number.isFinite(Date.parse(value.savedAt)) || !Array.isArray(value.changes) || value.changes.length > 200 || !value.changes.every(validPending) || (value.active !== null && !validPending(value.active)) || (!value.active && !value.changes.length)) continue
            candidates.push({ key: candidateKey, raw, value })
          } catch { /* Ignore invalid storage. The server also validates every restored edit. */ }
        }
        candidates.sort((a, b) => a.key === key.current ? -1 : b.key === key.current ? 1 : Date.parse(b.value.savedAt) - Date.parse(a.value.savedAt))
        const found = candidates[0]
        if (found) {
          recoveryPending.current = true
          recoveryRef.current = found.value
          source.current = { key: found.key, raw: found.raw }
          setRecovery(found.value)
        }
      } catch { storageAvailable.current = false }
    }
    const flush = () => { persist(); void drain(true) }
    const online = () => { if (blocked.current && !remote.current && !recoveryPending.current) { blocked.current = false; void drain() } }
    const warn = (event: BeforeUnloadEvent) => { if (active.current || pending.current.size) { event.preventDefault(); event.returnValue = "" } }
    window.addEventListener("pagehide", flush)
    window.addEventListener("beforeunload", warn)
    window.addEventListener("online", online)
    return () => {
      mounted.current = false
      if (timer.current) clearTimeout(timer.current)
      flush()
      window.removeEventListener("pagehide", flush); window.removeEventListener("beforeunload", warn); window.removeEventListener("online", online)
    }
  }, [userId, slug, drain, persist])

  const retry = () => { if (!remote.current && !recoveryPending.current) { blocked.current = false; void drain() } }
  const resolve = (keepLocal: boolean) => {
    if (!remote.current || !active.current) return
    const item = active.current
    const itemKey = revisionKey(item.change)
    const server = remote.current
    revisions.current[itemKey] = server.revisions?.[itemKey] ?? 0
    if (keepLocal) {
      const latest = pending.current.get(itemKey) ?? item
      const value = structuredClone(latest.change)
      if ("baseRevision" in value) value.baseRevision = revisions.current[itemKey]
      active.current = { change: value, requestId: newId() }
      pending.current.delete(itemKey)
    } else {
      active.current = null
      pending.current.delete(itemKey)
      setStudy((local) => {
        if (item.change.kind === "note") return { ...local, notes: { ...local.notes, [item.change.key]: server.notes?.[item.change.key] ?? "" } }
        if (item.change.kind === "activity") {
          const activities = { ...local.activities }
          const value = server.activities?.[item.change.key]
          if (value) activities[item.change.key] = value; else delete activities[item.change.key]
          return { ...local, activities }
        }
        if (item.change.kind === "settings") return { ...local, settings: server.settings }
        if (item.change.kind === "bookmark") {
          const bookmarks = new Set(local.bookmarks)
          if (server.bookmarks?.includes(item.change.key)) bookmarks.add(item.change.key); else bookmarks.delete(item.change.key)
          return { ...local, bookmarks: [...bookmarks] }
        }
        if (item.change.kind === "location") return { ...local, lastLocation: server.lastLocation }
        return local
      })
      setEpoch((n) => n + 1)
    }
    remote.current = null; blocked.current = false
    persist()
    if (!active.current && !pending.current.size) { setStatus("saved"); setMessage("Using the version saved to your account.") }
    else void drain()
  }
  const recover = (restore: boolean) => {
    const saved = recoveryRef.current
    if (!saved) return
    recoveryPending.current = false; recoveryRef.current = null
    if (restore) {
      active.current = saved.active
      for (const item of saved.changes) pending.current.set(revisionKey(item.change), item)
      const edits = [...(saved.active ? [saved.active] : []), ...saved.changes]
      setStudy((local) => edits.reduce((value, item) => apply(value, item.change), local))
      setEpoch((n) => n + 1)
    } else removeSource()
    setRecovery(null)
    persist()
    if (restore) void drain()
  }
  const exportLocal = () => {
    const saved = recoveryRef.current ?? { version: 2, savedAt: new Date().toISOString(), active: active.current, changes: [...pending.current.values()] }
    return saved.active || saved.changes.length ? JSON.stringify({ course: slug, ...saved }, null, 2) : null
  }
  return { study, status, message, change, retry, resolve, recovery: Boolean(recovery), recover, epoch, exportLocal, flush: drain }
}
