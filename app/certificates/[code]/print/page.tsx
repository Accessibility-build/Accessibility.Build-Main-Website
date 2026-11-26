import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CertificateDocument } from "@/components/courses/certificate-document"
import { getCourse } from "@/lib/courses/config"
import { getCertificateByCode } from "@/lib/courses/certificates"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params
  const cert = await getCertificateByCode(code)
  const course = cert ? getCourse(cert.courseSlug) : null
  // The PDF takes its document title from this page title.
  return { title: { absolute: cert && course ? `${course.title} certificate of completion: ${cert.recipientName} (${cert.code})` : "Certificate" }, robots: { index: false, follow: false } }
}

/**
 * The render target for the downloadable PDF: the certificate alone at its fixed A4 landscape size,
 * with no site navigation (see isCertificatePrintPath). Learners download the PDF instead of visiting this.
 */
export default async function CertificatePrintPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const cert = await getCertificateByCode(code)
  const course = cert ? getCourse(cert.courseSlug) : null
  if (!cert || !course?.certificate) notFound()
  return (
    <div className="certificate-render bg-white">
      <style>{"@page { size: 297mm 210mm; margin: 0; } html, body { margin: 0; background: #fff; }"}</style>
      <CertificateDocument cert={{ code: cert.code, recipientName: cert.recipientName, courseTitle: course.title, summary: course.certificate.summary, skills: course.certificate.skills, issuedAt: cert.issuedAt, verifyUrl: `https://accessibility.build/certificates/${cert.code}`, expiresAt: cert.expiresAt, revoked: Boolean(cert.revokedAt) }} />
    </div>
  )
}
