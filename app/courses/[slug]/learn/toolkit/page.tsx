import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BadgeCheck, Download, FileText, PencilRuler, Sticker } from "lucide-react"
import { CourseShell } from "@/components/courses/course-shell"
import { requireCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseMeta } from "@/lib/courses/content"
import { buildOutline } from "@/lib/courses/outline"
import { getCourseProgress } from "@/lib/courses/progress"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return { title: `${getCourse(slug)?.title ?? "Course"}: toolkit`, robots: { index: false, follow: false } }
}

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950"

export default async function ToolkitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course || course.kind !== "skills") notFound()
  const access = await requireCourseAccess(slug, `${course.homeRoute}/toolkit`)
  const [meta, progress] = await Promise.all([getCourseMeta(slug), getCourseProgress(access.viewer.userId, slug)])
  if (!meta) notFound()
  const items = [
    { icon: Sticker, title: "Annotation kit", file: "annotation-kit.svg", format: "SVG, opens in Figma, Penpot, Sketch and Illustrator", body: "Stickers for heading levels, landmarks, focus order numbers 1 to 24, accessible names, alt text, roles, states, keyboard behavior, target sizes, reflow and reduced motion. Import the file and every sticker arrives as a named layer you can copy onto your designs." },
    { icon: FileText, title: "Design review checklist", file: "design-review-checklist.pdf", format: "PDF, A4, tagged for screen readers", body: "The course checklist as a printable, tickable document: every check with its WCAG 2.2 success criterion and level, and how to check it in a design file. Use it in design reviews and before handoff." },
  ]
  // Capstone files exist only when the course has a capstone lesson loaded.
  const capstone = course.capstone && meta.chapters.some((c) => c.key === course.capstone!.chapterKey) ? course.capstone : null
  const capstoneDone = Boolean(capstone && progress.study?.activities?.[capstone.activityId]?.completedAt)
  const capstoneLesson = capstone ? `${course.homeRoute}/chapters/${capstone.chapterKey}` : ""
  return (
    <CourseShell title={course.title} homeRoute={course.homeRoute} outline={buildOutline(meta, progress)} view="toolkit" hasTeam={access.ownedLicences.some((l) => l.licenceType === "team")}>
      <div className="mx-auto max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Toolkit</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Take the course into your work</h1>
      <p className="mt-3 text-lg text-slate-700 dark:text-slate-300">Download these for your design files and reviews. They are yours to use on your own projects and with your team.</p>
      <ul role="list" className="mt-8 grid gap-5 md:grid-cols-2">
        {items.map((it) => (
          <li key={it.file} className="flex flex-col rounded-xl border border-slate-200 p-6 dark:border-slate-800">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950"><it.icon aria-hidden="true" className="h-6 w-6 text-blue-700 dark:text-blue-300" /></span>
            <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">{it.title}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{it.format}</p>
            <p className="mt-3 flex-1 leading-relaxed text-slate-700 dark:text-slate-300">{it.body}</p>
            <a href={`/api/courses/${slug}/toolkit/${it.file}`} download className={`mt-5 inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-300 ${ring}`}>
              <Download aria-hidden="true" className="h-4 w-4" />Download {it.title.toLowerCase()}
            </a>
          </li>
        ))}
      </ul>
      {capstone ? (
        <section aria-labelledby="capstone-files" className="mt-12">
          <h2 id="capstone-files" className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Capstone project files</h2>
          <p className="mt-2 max-w-3xl text-slate-700 dark:text-slate-300">The capstone is where you do the whole job once: audit the screens, fix them in your own design tool, annotate one screen for handoff, then compare with the marked solution. <Link href={capstoneLesson} className={`rounded font-semibold text-blue-700 underline underline-offset-2 hover:decoration-2 dark:text-blue-300 ${ring}`}>Open the capstone lesson</Link>.</p>
          <ul role="list" className="mt-6 grid gap-5 md:grid-cols-2">
            <li className="flex flex-col rounded-xl border border-slate-200 p-6 dark:border-slate-800">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950"><PencilRuler aria-hidden="true" className="h-6 w-6 text-blue-700 dark:text-blue-300" /></span>
              <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Capstone screens</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">SVG, opens in Figma, Penpot, Sketch and Illustrator</p>
              <p className="mt-3 flex-1 leading-relaxed text-slate-700 dark:text-slate-300">The capstone screens as a design file, exactly as they appear in the lesson, with every element as a named layer. Fix the problems you found, then add your handoff annotations with the annotation kit.</p>
              <a href={`/api/courses/${slug}/toolkit/capstone-screens.svg`} download className={`mt-5 inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-300 ${ring}`}>
                <Download aria-hidden="true" className="h-4 w-4" />Download capstone screens
              </a>
            </li>
            <li className="flex flex-col rounded-xl border border-slate-200 p-6 dark:border-slate-800">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950"><BadgeCheck aria-hidden="true" className="h-6 w-6 text-blue-700 dark:text-blue-300" /></span>
              <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Marked solution</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">SVG, opens in Figma, Penpot, Sketch and Illustrator</p>
              <p className="mt-3 flex-1 leading-relaxed text-slate-700 dark:text-slate-300">The same screens with every finding outlined and numbered, and a note for each one naming the success criterion and the fix. Compare it with your own file to see what you caught and what you missed.</p>
              {capstoneDone ? (
                <a href={`/api/courses/${slug}/toolkit/capstone-solution.svg`} download className={`mt-5 inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-300 ${ring}`}>
                  <Download aria-hidden="true" className="h-4 w-4" />Download marked solution
                </a>
              ) : (
                <p className="mt-5 rounded-lg border border-slate-300 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">This opens when you complete the capstone activity, so it works as a check and not a shortcut. <Link href={capstoneLesson} className={`rounded font-semibold text-blue-700 underline underline-offset-2 hover:decoration-2 dark:text-blue-300 ${ring}`}>Go to the capstone activity</Link>.</p>
              )}
            </li>
          </ul>
        </section>
      ) : null}
      </div>
    </CourseShell>
  )
}
