// Readiness check before the final exam: one question from every section, drawn fresh each time.
// These questions are kept out of lessons and out of the exam bank.
import type { CourseQuestion, CourseSection } from "./types"

/** One readiness question per section, in section order. Sections with none are skipped. */
export function drawReadiness(questions: CourseQuestion[], sections: CourseSection[], pick: (count: number) => number): CourseQuestion[] {
  const pool = questions.filter((q) => q.use === "readiness")
  return sections.flatMap((section) => {
    const options = pool.filter((q) => q.sec === section.ref)
    return options.length ? [options[Math.min(options.length - 1, Math.max(0, pick(options.length)))]] : []
  })
}
