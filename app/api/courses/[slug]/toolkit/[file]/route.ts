import { NextRequest, NextResponse } from "next/server"
import { getCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { annotationKitSvg } from "@/lib/courses/annotation-kit"
import { auditScreensSvg, type AuditScreen } from "@/lib/courses/audit-svg"
import { getCourseChapter } from "@/lib/courses/content"
import { getCourseProgress } from "@/lib/courses/progress"
import { toolkitToken } from "@/lib/courses/toolkit-token"
import { launchBrowser } from "@/lib/render/browser"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

/** Buyer-only downloads: the annotation sticker sheet (SVG), the design review checklist (tagged PDF) and the capstone design files (SVG). */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params
  const course = getCourse(slug)
  if (!course || course.kind !== "skills") return NextResponse.json({ error: "Not found" }, { status: 404 })
  const access = await getCourseAccess(slug)
  if (!access.viewer) return NextResponse.json({ error: "Sign in required" }, { status: 401 })
  if (!access.hasAccess) return NextResponse.json({ error: "No access to this course" }, { status: 403 })
  const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" }

  if (file === "annotation-kit.svg") {
    return new NextResponse(annotationKitSvg(course.title), { headers: { ...headers, "Content-Type": "image/svg+xml; charset=utf-8", "Content-Disposition": 'attachment; filename="accessibility-annotation-kit.svg"' } })
  }
  if (file === "capstone-screens.svg" || file === "capstone-solution.svg") {
    if (!course.capstone) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const solution = file === "capstone-solution.svg"
    const [chapter, progress] = await Promise.all([getCourseChapter(slug, course.capstone.chapterKey), solution ? getCourseProgress(access.viewer.userId, slug) : null])
    const screens: AuditScreen[] = (chapter?.blocks ?? []).flatMap((block) => (block.type === "audit" ? [{ title: block.title.replace(/^Audit:\s*/i, ""), canvas: block.canvas, elements: block.elements }] : []))
    if (!screens.length) return NextResponse.json({ error: "Not found" }, { status: 404 })
    // The marked solution opens once the learner has done the work, so it is a check and not a shortcut.
    if (solution && !progress?.study?.activities?.[course.capstone.activityId]?.completedAt) return NextResponse.json({ error: "Complete the capstone activity to open the marked solution." }, { status: 403 })
    const svg = auditScreensSvg({
      heading: solution ? "Capstone project: marked solution" : "Capstone project: screens to audit, fix and annotate",
      note: solution ? `${course.title} · Accessibility.build · Each numbered outline is a finding; the notes under each screen name the success criterion and the fix.` : `${course.title} · Accessibility.build · Every element is a named layer. Fix the issues you find, then annotate the booking form for handoff.`,
      screens,
      solution,
    })
    return new NextResponse(svg, { headers: { ...headers, "Content-Type": "image/svg+xml; charset=utf-8", "Content-Disposition": `attachment; filename="${solution ? "capstone-marked-solution" : "capstone-screens"}.svg"` } })
  }
  if (file === "design-review-checklist.pdf") {
    const target = new URL(`/toolkit/${slug}/checklist?t=${encodeURIComponent(toolkitToken(slug))}`, req.nextUrl.origin)
    const browser = await launchBrowser()
    try {
      const page = await browser.newPage()
      const res = await page.goto(target.href, { waitUntil: "networkidle0", timeout: 30_000 })
      if (!res?.ok()) throw new Error(`Checklist view returned ${res?.status()}`)
      await page.evaluate(() => document.fonts.ready)
      const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true, tagged: true, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: '<div style="width:100%;font-size:8px;color:#3f4a63;text-align:center;font-family:system-ui,sans-serif">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>' })
      return new NextResponse(Buffer.from(pdf), { headers: { ...headers, "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="design-review-checklist.pdf"' } })
    } catch (e) {
      console.error("toolkit checklist pdf", e)
      return NextResponse.json({ error: "The PDF could not be created. Try again in a moment." }, { status: 502 })
    } finally {
      await browser.close().catch(() => {})
    }
  }
  return NextResponse.json({ error: "Not found" }, { status: 404 })
}
