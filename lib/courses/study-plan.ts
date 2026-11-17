import type { CourseMeta, CourseProgressData } from "./types"

export function studyRecommendations(meta: CourseMeta, progress: CourseProgressData, now = new Date()) {
  const due = (values: CourseProgressData["cardReview"], ids?: string[]) => Object.entries(values ?? {}).filter(([id, item]) => (!ids || ids.includes(id)) && Date.parse(item.dueAt) <= now.getTime()).length
  const cardsDue = due(progress.cardReview, meta.flashcardIds)
  const questionsDue = due(progress.questionReview, meta.drillQuestionIds)
  const minutes = progress.study?.settings?.minutesPerDay ?? 25
  const done = new Set(progress.chaptersDone ?? [])
  const latest = progress.history?.slice(-5) ?? []
  const scores: Record<string, [number, number]> = {}
  for (const attempt of latest) for (const [domain, pair] of Object.entries(attempt.dom)) {
    const total = scores[domain] ?? (scores[domain] = [0, 0]); total[0] += pair[0]; total[1] += pair[1]
  }
  const weakDomain = Object.entries(scores).filter(([, pair]) => pair[1] >= 4).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1])[0]?.[0]
  const roman = weakDomain ? ["", "I.", "II.", "III."][Number(weakDomain)] : null
  const weakLesson = roman ? meta.chapters.find((chapter) => chapter.objectiveRefs?.some((ref) => ref.startsWith(roman))) : null
  const unread = meta.chapters.find((chapter) => !done.has(chapter.key))
  const nextLesson = progress.study?.settings?.experience === "new" ? unread ?? meta.chapters[0] : weakLesson ?? unread ?? meta.chapters[0]
  const activityLesson = meta.chapters.find((chapter) => chapter.activityIds?.some((id) => !progress.study?.activities?.[id]?.completedAt || (chapter.activityVersions?.[id] && progress.study.activities[id].version !== chapter.activityVersions[id])))
  const readMinutes = meta.chapters.filter((chapter) => !done.has(chapter.key)).reduce((sum, chapter) => sum + (chapter.readingMinutes ?? 0), 0)
  const examDate = progress.study?.settings?.examDate
  const days = examDate ? Math.max(0, Math.ceil((Date.parse(`${examDate}T23:59:59`) - now.getTime()) / 86400000)) : null
  const versions = Object.fromEntries(meta.chapters.flatMap((chapter) => [[`checks-${chapter.key}`, meta.edition], ...Object.entries(chapter.activityVersions ?? {})]))
  const practiceCount = Object.entries(progress.study?.activities ?? {}).filter(([id, activity]) => activity?.completedAt && activity.version === versions[id]).length
  const retained = Object.entries(progress.questionReview ?? {}).filter(([id, review]) => (!meta.drillQuestionIds || meta.drillQuestionIds.includes(id)) && review.successes >= 2 && review.intervalDays >= 3).length
  return { cardsDue, questionsDue, minutes, nextLesson, activityLesson, weakDomain, readMinutes, days, practiceCount, retained, readingExceedsPlan: days !== null && readMinutes > days * minutes }
}
