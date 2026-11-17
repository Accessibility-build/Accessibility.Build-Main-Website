"use client"
import { useEffect, useRef } from "react"
import { Bookmark, BookmarkCheck, BriefcaseBusiness, Check, CircleCheck, ClipboardCheck, NotebookPen } from "lucide-react"
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
  return <section className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-800" aria-labelledby="lesson-work-heading">
    <h2 id="lesson-work-heading" className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-950 dark:text-white"><NotebookPen aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" />Your learning workspace</h2>
    <StudySaveStatus state={state} />
    <fieldset disabled={state.recovery} className="min-w-0 space-y-6">
      <legend className="sr-only">Save your notes and practise this lesson</legend>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/50">
        <button type="button" aria-pressed={bookmarked} className={cn(studyButton, "gap-2 bg-white dark:bg-slate-950", bookmarked && "border-blue-700 text-blue-700 dark:border-blue-400 dark:text-blue-300")} onClick={() => state.change({ kind: "bookmark", key: chapter.key, bookmarked: !bookmarked })}>{bookmarked ? <BookmarkCheck aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" /> : <Bookmark aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />}Bookmark this lesson</button>
        <label htmlFor="lesson-notes" className="mt-5 block font-semibold text-slate-950 dark:text-white">Your notes</label>
        <p id="lesson-notes-help" className="mt-1 text-sm text-slate-600 dark:text-slate-400">Capture a question, a distinction to remember, or an example from your work. Notes are private to your account and save automatically.</p>
        <textarea id="lesson-notes" aria-describedby="lesson-notes-help" maxLength={12000} rows={4} value={state.study.notes?.[chapter.key] ?? ""} onChange={(e) => state.change({ kind: "note", key: chapter.key, text: e.target.value })} className="mt-3 w-full rounded-lg border border-slate-500 bg-white p-3 leading-relaxed text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 dark:border-slate-500 dark:bg-slate-950 dark:text-white" />
      </div>
      {questions.length ? <section aria-labelledby="lesson-checks-heading" className="space-y-5">
        <h3 id="lesson-checks-heading" className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"><ClipboardCheck aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" />Check your understanding</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">These are learning drills. Reserved mock questions are kept separate. Correct answers here show practice, not long-term mastery.</p>
        {questions.map((q, i) => {
          const checked = check.checked.includes(q.id)
          const correct = check.answers[q.id] === String(q.answer)
          return <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <fieldset><legend className="font-semibold leading-relaxed text-slate-950 dark:text-white">{i + 1}. {q.stem}</legend>
              {q.code ? <pre tabIndex={0} aria-label={`Code for check ${i + 1}`} className="my-3 overflow-auto rounded bg-slate-100 p-3 text-sm dark:bg-slate-900"><code>{q.code}</code></pre> : null}
              <div className="mt-4 space-y-2">{q.options.map((option, j) => <label key={j} className={cn("flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-relaxed", check.answers[q.id] === String(j) ? "border-blue-700 bg-blue-50 text-slate-950 dark:border-blue-400 dark:bg-blue-950 dark:text-white" : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900")}><input type="radio" name={`check-${q.id}`} value={j} className="mt-1 h-4 w-4 shrink-0 accent-blue-700 dark:accent-blue-400 dark:[color-scheme:dark]" checked={check.answers[q.id] === String(j)} onChange={() => updateCheck({ ...check, answers: { ...check.answers, [q.id]: String(j) }, checked: check.checked.filter((id) => id !== q.id), completedAt: undefined })} /><span>{option}</span></label>)}</div>
            </fieldset>
            <label htmlFor={`confidence-${q.id}`} className="mt-3 block text-sm font-medium">How confident are you?</label>
            <select id={`confidence-${q.id}`} className="mt-2 min-h-[44px] max-w-full rounded-lg border border-slate-500 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 dark:border-slate-500 dark:bg-slate-950" value={check.answers[`${q.id}:confidence`] ?? "low"} onChange={(e) => updateCheck({ ...check, answers: { ...check.answers, [`${q.id}:confidence`]: e.target.value } })}><option value="low">Unsure or guessing</option><option value="medium">Somewhat confident</option><option value="high">Confident and can explain why</option></select>
            <div className="mt-3"><button type="button" disabled={check.answers[q.id] === undefined} className={cn(studyButton, "gap-2")} onClick={() => checkAnswer(q)}><Check aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />Check answer</button></div>
            {checked ? <div role="status" className="mt-4 space-y-2 border-t border-slate-200 pt-4 leading-relaxed dark:border-slate-800"><p className={cn("flex items-center gap-2 font-semibold", correct ? "text-emerald-700 dark:text-emerald-300" : "text-slate-950 dark:text-white")}>{correct ? <CircleCheck aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" /> : null}{correct ? "Correct" : "Review this distinction"}</p><p>{q.exp}</p><p className="text-sm">Answer: {q.options[q.answer]}</p>{check.answers[`${q.id}:confidence`] !== "high" ? <p className="text-sm">Revisit this concept after a delay, even if your answer was correct.</p> : null}</div> : null}
            {checked ? <CourseSources sources={q.sources} slug={slug} item={q.id} /> : null}
          </div>
        })}
      </section> : null}
      {chapter.activities?.length ? <section aria-labelledby="apply-lesson-heading" className="space-y-6">
        <h3 id="apply-lesson-heading" className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"><BriefcaseBusiness aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" />Apply this lesson</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">The recurring case follows a fictional public service. Save your decisions and test evidence as a learning portfolio.</p>
        {chapter.activities.map((activity) => <LearningActivity key={`${activity.id}:${activity.version}:${state.epoch}`} activity={activity} initial={state.study.activities?.[activity.id]} onChange={(value) => state.change({ kind: "activity", key: activity.id, value })} />)}
      </section> : null}
    </fieldset>
    <p aria-hidden="true" className="mt-4 text-sm text-slate-600 dark:text-slate-400">{state.message}</p>
  </section>
}
