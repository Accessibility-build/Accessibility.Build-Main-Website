import type { CourseProgressData } from "./types"
import { MAX_PROGRESS_REQUEST_BYTES, PRACTICE_FIELDS, type PracticeSaveRequest, type ProgressConflictResult, type ProgressSaveResult, type StudyChange } from "./progress-contract"

export type PracticeSaveStatus = {
  state: "saved" | "saving" | "pending" | "offline" | "conflict" | "error" | "recovery"
  message: string
  revision: number
  remote?: CourseProgressData
  local?: CourseProgressData
  /** False means browser storage is blocked/full; the UI must not promise durable local recovery. */
  storageAvailable: boolean
}
export interface PracticeRecovery {
  version: 2
  userId: string
  slug: string
  state: CourseProgressData
  baseRevision: number
  savedAt: string
  active?: PracticeSaveRequest
}

function requestId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `save-${Date.now()}-${Math.random().toString(36).slice(2)}`
}
function revisionOf(progress: CourseProgressData): number {
  const revision = (progress as CourseProgressData & { practiceRevision?: number }).practiceRevision
  return Number.isSafeInteger(revision) && Number(revision) >= 0 ? Number(revision) : 0
}
function practiceOnly(input: CourseProgressData): CourseProgressData {
  const state: Record<string, unknown> = {}
  for (const key of PRACTICE_FIELDS) {
    const value = (input as Record<string, unknown>)[key]
    if (value !== undefined) state[key] = value
  }
  return structuredClone(state) as CourseProgressData
}

/**
 * Saves are strictly sequential. Failed requests retain their original ID and base
 * revision, so an uncertain network response can be retried without duplicating work.
 * Recovery is scoped to the signed-in account, course and browser tab, and is never
 * applied without a learner's choice. Conflicts cannot overwrite the server version.
 */
export function createPracticeSaveController(options: {
  slug: string
  userId: string
  initial: CourseProgressData
  onStatus?: (status: PracticeSaveStatus) => void
  onRemote?: (progress: CourseProgressData) => void
  /** Dependency injection keeps the same production controller testable without a browser. */
  storage?: Storage | null
  fetch?: typeof fetch
  tabId?: string
}) {
  const fetcher = options.fetch ?? globalThis.fetch.bind(globalThis)
  let storage: Storage | null = options.storage ?? null
  if (options.storage === undefined && typeof window !== "undefined") {
    try { storage = window.localStorage } catch { /* private mode can prohibit access */ }
  }
  let tab = options.tabId
  if (!tab && typeof window !== "undefined") {
    try {
      tab = window.sessionStorage.getItem("course-progress-tab") ?? requestId()
      window.sessionStorage.setItem("course-progress-tab", tab)
    } catch { /* use a unique tab identity without session storage */ }
  }
  tab ??= requestId()
  const prefix = `course-progress:v2:${encodeURIComponent(options.userId)}:${encodeURIComponent(options.slug)}:`
  const storageKey = `${prefix}${tab}`
  let storageAvailable = storage !== null
  let revision = revisionOf(options.initial)
  let remote: CourseProgressData = structuredClone(options.initial)
  let lastSaved = JSON.stringify(practiceOnly(options.initial))
  let pending: CourseProgressData | null = null
  let active: PracticeSaveRequest | null = null
  let running: Promise<void> | null = null
  let disposed = false
  let blocked = false
  let generation = 0
  let recovery: PracticeRecovery | null = null
  let recoverySource: { key: string; raw: string } | null = null
  const subscribers = new Set<(status: PracticeSaveStatus) => void>()
  let status: PracticeSaveStatus = { state: "saved", message: "Progress saved to your account.", revision, storageAvailable }

  function emit(state: PracticeSaveStatus["state"], message: string) {
    status = { state, message, revision, storageAvailable, ...(state === "conflict" ? { remote: structuredClone(remote) } : {}), ...(pending || active || recovery ? { local: structuredClone(pending ?? active?.state ?? recovery!.state) } : {}) }
    if (disposed) return
    options.onStatus?.(status)
    subscribers.forEach((subscriber) => subscriber(status))
  }
  function removeRecoverySource() {
    if (!storage || !recoverySource) return
    try {
      // Never erase a newer save from another tab while acknowledging this snapshot.
      if (storage.getItem(recoverySource.key) === recoverySource.raw) storage.removeItem(recoverySource.key)
    } catch { storageAvailable = false }
    recoverySource = null
  }
  function persist() {
    if (!storage || recovery) return
    try {
      if (!pending && !active) {
        storage.removeItem(storageKey)
        removeRecoverySource()
      } else {
        const value: PracticeRecovery = { version: 2, userId: options.userId, slug: options.slug, state: pending ?? active!.state, baseRevision: active?.baseRevision ?? revision, savedAt: new Date().toISOString(), ...(active ? { active } : {}) }
        storage.setItem(storageKey, JSON.stringify(value))
      }
      storageAvailable = true
    } catch { storageAvailable = false }
  }
  if (storage) {
    try {
      const candidates: Array<{ key: string; raw: string; value: PracticeRecovery }> = []
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i)
        if (!key?.startsWith(prefix)) continue
        const raw = storage.getItem(key)
        if (!raw || raw.length > MAX_PROGRESS_REQUEST_BYTES * 3) continue
        try {
          const value = JSON.parse(raw) as PracticeRecovery
          if (value.version !== 2 || value.userId !== options.userId || value.slug !== options.slug || !value.state || !Number.isSafeInteger(value.baseRevision) || value.baseRevision < 0 || !Number.isFinite(Date.parse(value.savedAt))) continue
          candidates.push({ key, raw, value })
        } catch { /* ignore malformed storage; server validation still applies on restore */ }
      }
      candidates.sort((a, b) => (a.key === storageKey ? -1 : b.key === storageKey ? 1 : Date.parse(b.value.savedAt) - Date.parse(a.value.savedAt)))
      const found = candidates[0]
      if (found) {
        recovery = found.value
        recoverySource = { key: found.key, raw: found.raw }
        blocked = true
        emit("recovery", "This device has practice work waiting to be saved. Restore it, or continue with the version saved to your account.")
      }
    } catch { storageAvailable = false }
  }
  if (!recovery) emit("saved", "Progress saved to your account.")

  async function flush(final = false): Promise<void> {
    if (running) return running
    if (blocked || (!pending && !active)) return
    const runGeneration = generation
    running = (async () => {
      while (!blocked && (active || pending) && runGeneration === generation) {
        if (!active) {
          active = { op: "practice", state: pending!, baseRevision: revision, requestId: requestId() }
          pending = null
        }
        persist()
        emit("saving", "Saving progress…")
        const body = JSON.stringify(active)
        if (new TextEncoder().encode(body).byteLength > MAX_PROGRESS_REQUEST_BYTES) {
          emit("error", "This practice save is too large. Download your recovery copy and contact support.")
          break
        }
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 15000)
        try {
          const response = await fetcher(`/api/courses/${encodeURIComponent(options.slug)}/progress`, {
            method: "PATCH", headers: { "Content-Type": "application/json" }, body,
            keepalive: final && new TextEncoder().encode(body).byteLength < 60000,
            signal: controller.signal,
          })
          const payload = await response.json().catch(() => ({})) as ProgressSaveResult | ProgressConflictResult | { error?: string }
          if (runGeneration !== generation) return
          if (response.status === 409 && "progress" in payload && "revision" in payload) {
            remote = payload.progress
            blocked = true
            persist()
            emit("conflict", "Another tab or device saved newer progress. Download this device’s work before choosing the account version.")
            break
          }
          if (!response.ok || !("ok" in payload) || !Number.isSafeInteger(payload.revision)) {
            emit("error", "error" in payload && payload.error ? payload.error : "Progress could not be saved. Retry when your connection is ready.")
            break
          }
          revision = payload.revision
          remote = payload.progress
          lastSaved = JSON.stringify(active.state)
          active = null
          if (pending && JSON.stringify(pending) === lastSaved) pending = null
          persist()
          emit(pending ? "pending" : "saved", pending ? "More progress is waiting to save." : "Progress saved to your account.")
        } catch {
          if (runGeneration !== generation) return
          persist()
          emit("offline", storageAvailable ? "Progress is kept on this device. Check your connection and retry." : "Progress is not saved, and this browser cannot keep a recovery copy. Keep this page open, download your work, and retry.")
          break
        } finally { clearTimeout(timeout) }
      }
    })().finally(() => { running = null })
    return running
  }

  function enqueue(input: CourseProgressData) {
    if (disposed || recovery) return
    const state = practiceOnly(input)
    if (!active && JSON.stringify(state) === lastSaved) return
    pending = state
    persist()
    if (!blocked) {
      emit("pending", "Progress is waiting to save.")
      void flush()
    }
  }
  function recoverLocal(): CourseProgressData | null {
    if (!recovery) return null
    const value = recovery
    recovery = null
    revision = value.baseRevision
    active = value.active ?? null
    pending = practiceOnly(value.state)
    blocked = false
    persist()
    void flush()
    return { ...options.initial, ...value.state, practiceRevision: value.baseRevision } as CourseProgressData
  }
  function useRemote(): CourseProgressData | null {
    if (!blocked) return null
    generation++
    active = null; pending = null; recovery = null; blocked = false
    revision = revisionOf(remote)
    lastSaved = JSON.stringify(practiceOnly(remote))
    persist()
    emit("saved", "Using the progress saved to your account.")
    options.onRemote?.(structuredClone(remote))
    return structuredClone(remote)
  }
  const online = () => { if (!blocked && (status.state === "offline" || status.state === "error")) void flush() }
  const pagehide = () => { persist(); void flush(true) }
  if (typeof window !== "undefined") {
    window.addEventListener("online", online)
    window.addEventListener("pagehide", pagehide)
  }
  return {
    enqueue, flush, recoverLocal, useRemote,
    retry: () => flush(),
    getRecovery: () => recovery ? structuredClone(recovery) : null,
    getStatus: () => status,
    subscribe(callback: (state: PracticeSaveStatus) => void) { subscribers.add(callback); callback(status); return () => { subscribers.delete(callback) } },
    exportLocal() {
      const state = pending ?? active?.state ?? recovery?.state
      return state ? JSON.stringify({ course: options.slug, savedAt: new Date().toISOString(), baseRevision: active?.baseRevision ?? recovery?.baseRevision ?? revision, state }, null, 2) : null
    },
    dispose() {
      persist(); void flush(true); disposed = true
      if (typeof window !== "undefined") { window.removeEventListener("online", online); window.removeEventListener("pagehide", pagehide) }
      subscribers.clear()
    },
  }
}

export class StudySaveError extends Error {
  constructor(message: string, public readonly status: number, public readonly progress?: CourseProgressData, public readonly revision?: number) { super(message) }
}

/** Callers retain the same requestId when retrying an uncertain response. */
export async function saveStudyChange({ slug, change, requestId: id = requestId() }: { slug: string; change: StudyChange; requestId?: string }): Promise<ProgressSaveResult> {
  const response = await fetch(`/api/courses/${encodeURIComponent(slug)}/progress`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ op: "study", change, requestId: id }) })
  const result = await response.json().catch(() => ({})) as Partial<ProgressSaveResult & ProgressConflictResult>
  if (!response.ok || !result.ok) throw new StudySaveError(result.error ?? "Your study work could not be saved. Keep this page open and retry.", response.status, result.progress, result.revision)
  return result as ProgressSaveResult
}
