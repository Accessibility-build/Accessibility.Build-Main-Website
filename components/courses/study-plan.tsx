"use client"
import Link from "next/link"
import { useStudyProgress } from "@/hooks/use-study-progress"
import { studyRecommendations } from "@/lib/courses/study-plan"
import type { CourseMeta, CourseProgressData } from "@/lib/courses/types"
import { StudySaveStatus, studyButton } from "./study-save-status"
import { cn } from "@/lib/utils"

export function StudyPlan({ slug, userId, meta, progress }: { slug: string; userId: string; meta: CourseMeta; progress: CourseProgressData }) {
  const state = useStudyProgress(slug, userId, progress.study)
  const settings = state.study.settings ?? { minutesPerDay: 25, experience: "some" as const }
  const plan = studyRecommendations(meta, { ...progress, study: state.study })
  const route = `/courses/${slug}/learn`
  const change = (patch: Partial<typeof settings>) => state.change({ kind: "settings", value: { ...settings, ...patch } })
  return <section aria-labelledby="study-plan-heading" className="mt-8 rounded-xl border border-slate-300 p-5 dark:border-slate-700">
    <h2 id="study-plan-heading" className="text-xl font-semibold">Your next study session</h2>
    <p className="mt-2 text-slate-700 dark:text-slate-300">Choose a pace you can sustain. Recommendations use your recent practice and saved work; they do not predict an exam result.</p>
    <StudySaveStatus state={state} />
    <fieldset disabled={state.recovery} className="mt-4 flex flex-wrap gap-4">
      <legend className="sr-only">Optional study preferences</legend>
      <label className="block text-sm font-medium">Time per day<select value={settings.minutesPerDay} onChange={(e) => change({ minutesPerDay: Number(e.target.value) })} className="mt-1 block min-h-[44px] rounded border border-slate-400 bg-white px-3 dark:bg-slate-950">{[10, 15, 25, 45, 60, 90, 120].map((n) => <option key={n} value={n}>{n} minutes</option>)}</select></label>
      <label className="block text-sm font-medium">Your experience<select value={settings.experience ?? "some"} onChange={(e) => change({ experience: e.target.value as typeof settings.experience })} className="mt-1 block min-h-[44px] rounded border border-slate-400 bg-white px-3 dark:bg-slate-950"><option value="new">New to this material</option><option value="some">Some experience</option><option value="experienced">Experienced; filling gaps</option></select></label>
      <label className="block text-sm font-medium">Exam date (optional)<input type="date" value={settings.examDate ?? ""} onChange={(e) => change({ examDate: e.target.value })} className="mt-1 block min-h-[44px] rounded border border-slate-400 bg-white px-3 dark:bg-slate-950" /></label>
    </fieldset>
    {plan.readingExceedsPlan ? <p className="mt-3 text-sm font-medium text-amber-900 dark:text-amber-200">The remaining reading alone exceeds the time available in this plan. Allow additional time for practice and two-hour mocks; adjust your pace or date.</p> : null}
    <ol className="mt-5 list-decimal space-y-4 pl-5">
      <li><p className="font-semibold">Retrieve what you have learned</p><p className="text-sm text-slate-600 dark:text-slate-400">{plan.cardsDue} flashcards and {plan.questionsDue} questions are due for review. Start with a short review, then move to new material.</p><div className="mt-2 flex flex-wrap gap-2"><Link href={`${route}/practice?view=review`} className={studyButton}>Review due questions</Link><Link href={`${route}/practice?view=flashcards`} className={studyButton}>Review flashcards</Link></div></li>
      {plan.nextLesson ? <li><p className="font-semibold">{settings.experience === "new" ? "Build the foundation" : plan.weakDomain ? `Revisit Domain ${plan.weakDomain}` : "Study the next concept"}</p><p className="text-sm text-slate-600 dark:text-slate-400">Use one-section reading if the lesson is longer than today’s session.</p><Link href={`${route}/chapters/${plan.nextLesson.key}`} className={cn(studyButton, "mt-2")}>{plan.nextLesson.title}</Link></li> : null}
      {plan.activityLesson ? <li><p className="font-semibold">Apply and explain</p><Link href={`${route}/chapters/${plan.activityLesson.key}#apply-lesson-heading`} className={cn(studyButton, "mt-2")}>Continue a case or lab: {plan.activityLesson.title}</Link></li> : <li><p className="font-semibold">Transfer to a different situation</p><p className="text-sm">Revisit a saved case or lab with a different constraint and explain what you would change.</p></li>}
    </ol>
    <div className="mt-5 border-t border-slate-300 pt-4 text-sm dark:border-slate-700"><p><strong>{progress.chaptersDone?.length ?? 0}</strong> lessons marked read · <strong>{plan.practiceCount}</strong> lesson checks or activities completed · <strong>{plan.retained}</strong> questions recalled successfully across spaced reviews.</p><p className="mt-1 text-slate-600 dark:text-slate-400">Activity completion includes self-assessment. Delayed recall is a learning signal, not certification or proof of full professional competence.</p></div>
  </section>
}
