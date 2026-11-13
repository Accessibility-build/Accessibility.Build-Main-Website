"use client"

import { useEffect, useRef, useState } from "react"
import "./practice-app.css"
import { mountPractice } from "@/lib/courses/practice-engine"
import type { CourseExam } from "@/lib/courses/config"
import type { CourseFlashcard, CourseProgressData, CourseQuestion, CourseSection } from "@/lib/courses/types"

interface Props {
  slug: string
  courseTitle: string
  exam: CourseExam
  sections: CourseSection[]
  questions: CourseQuestion[]
  flashcards: CourseFlashcard[]
  initial: CourseProgressData
  /** Where to open: flashcards, topic picker, or topic picker with sections ticked. */
  start?: { view?: "flashcards" | "topics"; topics?: string[] }
}

export function PracticeApp({ slug, courseTitle, exam, sections, questions, flashcards, initial, start }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    if (!rootRef.current) return
    const onSave = (state: CourseProgressData, final: boolean) => {
      const body = JSON.stringify({
        op: "practice",
        state: { history: state.history, missed: state.missed, cards: state.cards, session: state.session ?? null },
      })
      fetch(`/api/courses/${slug}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: final && body.length < 60000,
      })
        .then((r) => setSaveError(!r.ok))
        .catch(() => setSaveError(true))
    }
    const destroy = mountPractice({
      root: rootRef.current,
      bank: { sections, questions, flashcards },
      initial: { history: initial.history ?? [], missed: initial.missed ?? {}, cards: initial.cards ?? {}, session: initial.session ?? null },
      onSave,
      courseTitle,
      exam,
      start,
    })
    return () => destroy()
    // Mount once; the engine owns the DOM inside the container.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={rootRef} className="practice-app">
      {saveError ? (
        <p role="alert" className="mb-4 rounded-lg border border-red-700 bg-red-50 p-3 text-red-900 dark:border-red-400 dark:bg-red-950 dark:text-red-100">
          Your latest progress could not be saved. Check your connection; it will be saved again on your next answer.
        </p>
      ) : null}
      <div data-practice-main tabIndex={-1} />
      <div data-practice-live role="status" aria-live="polite" className="sr-only" />
      <dialog aria-labelledby="practice-dlg-title">
        <h2 id="practice-dlg-title" data-dlg-title tabIndex={-1} style={{ marginTop: 0 }} />
        <div data-dlg-body />
        <div data-dlg-btns className="row" style={{ marginTop: "1rem" }} />
      </dialog>
    </div>
  )
}
