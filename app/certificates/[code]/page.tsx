import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CredentialPage } from "@/components/courses/credential-page"
import { getCourse } from "@/lib/courses/config"
import { getCertificateByCode } from "@/lib/courses/certificates"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params
  const cert = await getCertificateByCode(code)
  const course = cert ? getCourse(cert.courseSlug) : null
  const title = cert && course ? `${cert.recipientName}: ${course.title} certificate` : "Certificate not found"
  const description = cert && course ? `Verify the Accessibility.build certificate of completion ${cert.code} for ${course.title}.` : "No certificate matches this credential ID."
  const og = `/api/og?title=${encodeURIComponent(course ? `${course.title}: certificate of completion` : "Certificate")}&section=Courses`
  // Shareable by link, but a personal record, so kept out of search results.
  return { title, description, robots: { index: false, follow: false }, openGraph: { title, description, type: "website", images: [{ url: og, width: 1200, height: 630 }] }, twitter: { card: "summary_large_image", title, description, images: [og] } }
}

export default async function CertificateVerifyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const cert = await getCertificateByCode(code)
  const course = cert ? getCourse(cert.courseSlug) : null
  if (!cert || !course?.certificate) notFound()
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white pt-24 pb-16 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <CredentialPage data={{ code: cert.code, recipientName: cert.recipientName, courseTitle: course.title, courseRoute: course.salesRoute, summary: course.certificate.summary, skills: course.certificate.skills, issuedAt: cert.issuedAt.toISOString(), revokedAt: cert.revokedAt ? cert.revokedAt.toISOString() : null, expiresAt: cert.expiresAt ? cert.expiresAt.toISOString() : null }} />
        <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">This page is the authoritative record. Anyone with the credential ID can check it here.</p>
      </div>
    </div>
  )
}
