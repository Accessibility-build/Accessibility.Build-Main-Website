import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Logo } from "@/components/logo"
import { Inline } from "@/components/courses/chapter-blocks"
import { getCourse } from "@/lib/courses/config"
import { getCourseChapter } from "@/lib/courses/content"
import { verifyToolkitToken } from "@/lib/courses/toolkit-token"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return { title: { absolute: `Design review checklist: ${getCourse(slug)?.title ?? "Accessibility.build"}` }, robots: { index: false, follow: false } }
}

/**
 * Print render target for the checklist PDF. Buyer-only course content: reachable only with a
 * short-lived signed token that the download route creates after checking course access.
 */
export default async function ChecklistPrintPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ t?: string }> }) {
  const [{ slug }, { t }] = await Promise.all([params, searchParams])
  const course = getCourse(slug)
  if (!course || !verifyToolkitToken(slug, t)) notFound()
  const chapter = await getCourseChapter(slug, "design-review-checklist")
  if (!chapter) notFound()
  const intro = chapter.blocks.find((b) => b.type === "p")
  return (
    <div className="bg-white text-[#0f172a]" style={{ fontSize: 12 }}>
      <style>{"@page { size: A4; margin: 14mm 12mm 16mm; } html, body { background: #fff; margin: 0; } table { page-break-inside: auto; } tr { page-break-inside: avoid; } h2 { page-break-after: avoid; }"}</style>
      <header className="flex items-center justify-between border-b-2 border-[#1e3a8a] pb-3">
        <p className="flex items-center gap-2 text-[15px] font-bold"><Logo className="h-7 w-7" foreground="#1e3a8a" background="#ffffff" />Accessibility.build</p>
        <p className="text-[11px] text-[#3f4a63]">{course.title}</p>
      </header>
      <h1 className="mt-5 text-[24px] font-extrabold tracking-tight">Design review checklist</h1>
      {intro && intro.type === "p" ? <p className="mt-2 max-w-[160mm] leading-relaxed text-[#3f4a63]"><Inline text={intro.text} /></p> : null}
      <p className="mt-2 text-[11px] text-[#3f4a63]">Tick each row for every screen and component state. WCAG 2.2 success criteria and levels are named in each row.</p>
      {chapter.blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i} className="mt-6 border-b border-[#c7d2fe] pb-1 text-[16px] font-bold text-[#1e3a8a]">{b.text}</h2>
        if (b.type !== "table") return null
        return (
          <table key={i} className="mt-2 w-full border-collapse text-left">
            <caption className="sr-only">{b.caption}</caption>
            <thead><tr className="bg-[#eef2ff]"><th scope="col" className="w-8 border border-[#c7d2fe] p-1.5 text-center">Done</th>{b.headers.map((h) => <th key={h} scope="col" className="border border-[#c7d2fe] p-1.5">{h}</th>)}</tr></thead>
            <tbody>
              {b.rows.map((r, j) => (
                <tr key={j} className="align-top">
                  <td className="border border-[#c7d2fe] p-1.5 text-center"><span role="img" aria-label="Not checked yet" className="inline-block h-3.5 w-3.5 border-2 border-[#1e3a8a]" /></td>
                  {r.map((c, k) => k === 0 ? <th key={k} scope="row" className="border border-[#c7d2fe] p-1.5 font-semibold"><Inline text={c} /></th> : <td key={k} className="border border-[#c7d2fe] p-1.5"><Inline text={c} /></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        )
      })}
      <footer className="mt-6 border-t border-[#c7d2fe] pt-2 text-[10px] text-[#3f4a63]">For course participants of {course.title}. A design review covers what a design can show; confirm the built product with developers and testing.</footer>
    </div>
  )
}
