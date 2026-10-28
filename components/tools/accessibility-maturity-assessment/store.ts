"use client"

import { useSyncExternalStore } from "react"
import { EMPTY_ASSESSMENT, sanitiseAssessment, type AssessmentState } from "@/lib/maturity/assessment"

// The assessment lives in localStorage behind a small external store, the same pattern as
// components/checklists/wcag-criteria-checklist.tsx: the server and the first client render both
// see an empty assessment, then the saved one is read without a hydration mismatch. Every read
// and write is wrapped, because storage can be blocked, full or disabled in private windows.

export const STORAGE_KEY = "accessibility-maturity-assessment:v1"

const listeners = new Set<() => void>()
let cachedRaw: string | null = null
let cachedState: AssessmentState = EMPTY_ASSESSMENT
let storageUnavailable = false

function readState(): AssessmentState {
  if (storageUnavailable) return cachedState
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    storageUnavailable = true
    return cachedState
  }
  if (raw === cachedRaw) return cachedState
  cachedRaw = raw
  if (!raw) {
    cachedState = EMPTY_ASSESSMENT
    return cachedState
  }
  try {
    cachedState = sanitiseAssessment(JSON.parse(raw))
  } catch {
    cachedState = EMPTY_ASSESSMENT
  }
  return cachedState
}

function writeState(next: AssessmentState) {
  cachedState = next
  try {
    const raw = JSON.stringify(next)
    window.localStorage.setItem(STORAGE_KEY, raw)
    cachedRaw = raw
  } catch {
    storageUnavailable = true
  }
  listeners.forEach((listener) => listener())
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) callback()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", onStorage)
  }
}

function getServerSnapshot(): AssessmentState {
  return EMPTY_ASSESSMENT
}

export function useAssessment(): AssessmentState {
  return useSyncExternalStore(subscribe, readState, getServerSnapshot)
}

/** Applies a change to the current assessment and stamps the time. */
export function updateAssessment(change: (current: AssessmentState) => AssessmentState) {
  writeState({ ...change(readState()), updatedAt: new Date().toISOString() })
}

export function clearAssessment() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    cachedRaw = null
  } catch {
    storageUnavailable = true
  }
  cachedState = EMPTY_ASSESSMENT
  listeners.forEach((listener) => listener())
}

/** True once a read or write has failed, so answers will not survive a reload. */
export function isStorageUnavailable(): boolean {
  return storageUnavailable
}
