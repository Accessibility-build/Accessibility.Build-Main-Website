import type { Metadata } from "next"
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { CourseShell } from "@/components/courses/course-shell"
import { CertificateClaim } from "@/components/courses/certificate-claim"
import { requireCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseMeta } from "@/lib/courses/content"
import { buildOutline } from "@/lib/courses/outline"
import { getCourseProgress } from "@/lib/courses/progress"
import { certificateProgress } from "@/lib/courses/certificate-rules"
import { getUserCertificate } from "@/lib/courses/certificates"
import { getRenewalOverview, hasPassedExam } from "@/lib/courses/exam"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return { title: `${getCourse(slug)?.title ?? "Course"}: your certificate`, robots: { index: false, follow: false } }
}

export default async function CourseCertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course?.certificate) notFound()
  const access = await requireCourseAccess(slug, `${course.homeRoute}/certificate`)
  const [meta, progress, existing, user, passed] = await Promise.all([getCourseMeta(slug), getCourseProgress(access.viewer.userId, slug), getUserCertificate(access.viewer.userId, slug), currentUser(), course.finalExam ? hasPassedExam(access.viewer.userId, slug) : Promise.resolve(true)])
  if (!meta) notFound()
  const outline = buildOutline(meta, progress)
  const renewalInfo = existing?.expiresAt ? await getRenewalOverview(access.viewer.userId, course) : null
  const rules = course.certificate.renewal
  const status = certificateProgress(meta, progress)
  const suggestedName = [user?.firstName, user?.lastName].filter(Boolean).join(" ")
  return (
    <CourseShell title={course.title} homeRoute={course.homeRoute} outline={outline} view="certificate" hasTeam={access.ownedLicences.some((l) => l.licenceType === "team")}>
      <CertificateClaim
        slug={slug}
        homeRoute={course.homeRoute}
        courseTitle={course.title}
        status={status}
        suggestedName={suggestedName}
        examPassed={passed}
        renewal={renewalInfo ? { attemptsLeft: renewalInfo.attemptsLeft, phase: renewalInfo.window?.phase ?? null, opensAt: renewalInfo.window?.opensAt ?? null, closesAt: renewalInfo.window?.closesAt ?? null, priceUsd: rules.priceUsd, attemptsPerPurchase: rules.attemptsPerPurchase, questions: rules.questions, validityMonths: course.certificate.validityMonths } : null}
        certificate={existing ? { code: existing.code, recipientName: existing.recipientName, issuedAt: existing.issuedAt.toISOString(), revoked: Boolean(existing.revokedAt), revokedAt: existing.revokedAt ? existing.revokedAt.toISOString() : null, expiresAt: existing.expiresAt ? existing.expiresAt.toISOString() : null, summary: course.certificate.summary, skills: course.certificate.skills } : null}
      />
    </CourseShell>
  )
}
