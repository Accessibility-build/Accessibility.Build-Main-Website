"use client"
import { useEffect, useRef } from "react"
import { useStudyProgress } from "@/hooks/use-study-progress"
import type { CourseChapter, CourseQuestion } from "@/lib/courses/types"
import type { CourseStudyProgress } from "@/lib/courses/progress-contract"
import type { ActivityState } from "@/lib/courses/activity-types"
import { LearningActivity } from "./learning-activity"
import { CourseSources } from "./course-sources"
import { StudySaveStatus, studyButton } from "./study-save-status"
import { cn } from "@/lib/utils"

export function LessonWorkspace({ slug, userId, chapter, edition, initial, questions }: { slug: string; userId: string; chapter: CourseChapter; edition: string; initial?: CourseStudyProgress; questions: CourseQuestion[] }) {
  const state = useStudyProgress(slug, userId, initial)
  const change = useRef(state.change)
  useEffect(() => { change.current = state.change }, [state.change])
  useEffect(() => {
    if (state.recovery) return
    const save = () => change.current({ kind: "location", chapterKey: chapter.key, anchor: window.location.hash.slice(1) || undefined })
    save()
    window.addEventListener("hashchange", save)
    return () => window.removeEventListener("hashchange", save)
  }, [chapter.key, state.recovery])
  const checkKey = `checks-${chapter.key}`
  const empty: ActivityState = { version: edition, answers: {}, checked: [], reflection: "", criteria: [], manual: [] }
  const saved = state.study.activities?.[checkKey]
  const check = saved?.version === edition ? saved : empty
  function updateCheck(next: ActivityState) { state.change({ kind: "activity", key: checkKey, value: next }) }
  function checkAnswer(q: CourseQuestion) {
    const next = { ...check, checked: [...new Set([...check.checked, q.id])] }
    const complete = questions.every((item) => next.checked.includes(item.id) && next.answers[item.id] === String(item.answer))
    updateCheck({ ...next, completedAt: complete ? new Date().toISOString() : undefined })
    state.change({ kind: "check", questionId: q.id, answer: Number(check.answers[q.id]), confidence: (check.answers[`${q.id}:confidence`] ?? "low") as "low" | "medium" | "high" })
  }
  const bookmarked = state.study.bookmarks?.includes(chapter.key) ?? false
  return <section className="mt-10 border-t border-slate-300 pt-8 dark:border-slate-700" aria-labelledby="lesson-work-heading">
    <h2 id="lesson-work-heading" className="text-2xl font-bold">Your learning workspace</h2>
    <StudySaveStatus state={state} />
    <fieldset disabled={state.recovery} className="min-w-0 space-y-6">
      <legend className="sr-only">Save your notes and practise this lesson</legend>
      <div>
        <button type="button" aria-pressed={bookmarked} className={studyButton} onClick={() => state.change({ kind: "bookmark", key: chapter.key, bookmarked: !bookmarked })}>Bookmark this lesson</button>
        <label htmlFor="lesson-notes" className="mt-4 block font-semibold">Your notes</label>
        <p id="lesson-notes-help" className="mt-1 text-sm text-slate-600 dark:text-slate-400">Capture a question, a distinction to remember, or an example from your work. Notes are private to your account and save automatically.</p>
        <textarea id="lesson-notes" aria-describedby="lesson-notes-help" maxLength={12000} rows={4} value={state.study.notes?.[chapter.key] ?? ""} onChange={(e) => state.change({ kind: "note", key: chapter.key, text: e.target.value })} className="mt-2 w-full rounded-lg border border-slate-400 bg-white p-3 text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-600 dark:bg-slate-950 dark:text-white" />
      </div>
      {questions.length ? <section aria-labelledby="lesson-checks-heading" className="space-y-5">
        <h3 id="lesson-checks-heading" className="text-xl font-semibold">Check your understanding</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">These are learning drills. Reserved mock questions are kept separate. Correct answers here show practice, not long-term mastery.</p>
        {questions.map((q, i) => {
          const checked = check.checked.includes(q.id)
          const correct = check.answers[q.id] === String(q.answer)
          return <div key={q.id} className="rounded-xl border border-slate-300 p-5 dark:border-slate-700">
            <fieldset><legend className="font-semibold">{i + 1}. {q.stem}</legend>
              {q.code ? <pre tabIndex={0} aria-label={`Code for check ${i + 1}`} className="my-3 overflow-auto rounded bg-slate-100 p-3 text-sm dark:bg-slate-900"><code>{q.code}</code></pre> : null}
              <div className="mt-3 space-y-2">{q.options.map((option, j) => <label key={j} className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border border-slate-300 p-3 dark:border-slate-700"><input type="radio" name={`check-${q.id}`} value={j} className="mt-1 h-4 w-4 shrink-0" checked={check.answers[q.id] === String(j)} onChange={() => updateCheck({ ...check, answers: { ...check.answers, [q.id]: String(j) }, checked: check.checked.filter((id) => id !== q.id), completedAt: undefined })} /><span>{option}</span></label>)}</div>
            </fieldset>
            <label htmlFor={`confidence-${q.id}`} className="mt-3 block text-sm font-medium">How confident are you?</label>
            <select id={`confidence-${q.id}`} className="mt-1 min-h-[44px] max-w-full rounded border border-slate-400 bg-white px-3 dark:bg-slate-950" value={check.answers[`${q.id}:confidence`] ?? "low"} onChange={(e) => updateCheck({ ...check, answers: { ...check.answers, [`${q.id}:confidence`]: e.target.value } })}><option value="low">Unsure or guessing</option><option value="medium">Somewhat confident</option><option value="high">Confident and can explain why</option></select>
            <button type="button" disabled={check.answers[q.id] === undefined} className={cn(studyButton, "mt-3 ml-0 block")} onClick={() => checkAnswer(q)}>Check answer</button>
            {checked ? <div role="status" className="mt-4 space-y-2 border-t border-slate-300 pt-3 dark:border-slate-700"><p className="font-semibold">{correct ? "Correct" : "Review this distinction"}</p><p>{q.exp}</p><p className="text-sm">Answer: {q.options[q.answer]}</p>{check.answers[`${q.id}:confidence`] !== "high" ? <p className="text-sm">Revisit this concept after a delay, even if your answer was correct.</p> : null}</div> : null}
            {checked ? <CourseSources sources={q.sources} slug={slug} item={q.id} /> : null}
          </div>
        })}
      </section> : null}
      {chapter.activities?.length ? <section aria-labelledby="apply-lesson-heading" className="space-y-6">
        <h3 id="apply-lesson-heading" className="text-xl font-semibold">Apply this lesson</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">The recurring case follows a fictional public service. Save your decisions and test evidence as a learning portfolio.</p>
        {chapter.activities.map((activity) => <LearningActivity key={`${activity.id}:${activity.version}:${state.epoch}`} activity={activity} initial={state.study.activities?.[activity.id]} onChange={(value) => state.change({ kind: "activity", key: activity.id, value })} />)}
      </section> : null}
    </fieldset>
    <p aria-hidden="true" className="mt-4 text-sm text-slate-600 dark:text-slate-400">{state.message}</p>
  </section>
}
