// Team progress report: what a Team licence owner sees about each seat. Pure functions, shared by the
// team page and the CSV download. Only completion facts are reported: never notes, answers or scores.
import { certificateProgress, certificateState, type CertificateState } from "./certificate-rules"
import type { CourseMeta, CourseProgressData } from "./types"

export interface TeamReportRow {
  email: string
  /** False until the person has signed in with the invited email. */
  joined: boolean
  lessonsDone: number
  lessonsTotal: number
  activitiesDone: number
  activitiesTotal: number
  /** ISO date the final exam was passed, for courses that have one. */
  examPassedAt: string | null
  certificate: { code: string; state: CertificateState; issuedAt: string; expiresAt: string | null } | null
}

export interface TeamMemberFacts {
  email: string
  userId: string | null
  progress?: CourseProgressData | null
  examPassedAt?: Date | string | null
  certificate?: { code: string; issuedAt: Date | string; expiresAt: Date | string | null; revokedAt: Date | string | null } | null
}

const iso = (value: Date | string | null | undefined) => (value ? new Date(value).toISOString() : null)

export function teamReportRow(meta: CourseMeta, member: TeamMemberFacts, now = new Date()): TeamReportRow {
  const status = certificateProgress(meta, member.progress ?? {})
  const cert = member.certificate
  return {
    email: member.email,
    joined: Boolean(member.userId),
    lessonsDone: member.userId ? status.lessonsDone : 0,
    lessonsTotal: status.lessonsTotal,
    activitiesDone: member.userId ? status.activitiesDone : 0,
    activitiesTotal: status.activitiesTotal,
    examPassedAt: member.userId ? iso(member.examPassedAt) : null,
    certificate: member.userId && cert ? { code: cert.code, state: certificateState({ revokedAt: cert.revokedAt, expiresAt: cert.expiresAt }, now), issuedAt: iso(cert.issuedAt)!, expiresAt: iso(cert.expiresAt) } : null,
  }
}

/** Spreadsheet programs run cells that start with these characters as formulas, so such cells are neutralized. */
function cell(value: string | number) {
  const text = String(value)
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

export function teamReportCsv(rows: TeamReportRow[], options: { exam: boolean }) {
  const day = (value: string | null) => (value ? value.slice(0, 10) : "")
  const head = ["Email", "Joined", "Lessons completed", "Lessons total", "Activities completed", "Activities total", ...(options.exam ? ["Final exam passed", "Certificate ID", "Certificate status", "Certificate issued", "Certificate valid until"] : [])]
  const body = rows.map((r) => [r.email, r.joined ? "Yes" : "No", r.lessonsDone, r.lessonsTotal, r.activitiesDone, r.activitiesTotal, ...(options.exam ? [day(r.examPassedAt), r.certificate?.code ?? "", r.certificate?.state ?? "", day(r.certificate?.issuedAt ?? null), day(r.certificate?.expiresAt ?? null)] : [])])
  // A byte order mark lets spreadsheet programs read the file as UTF-8.
  return "﻿" + [head, ...body].map((line) => line.map(cell).join(",")).join("\r\n") + "\r\n"
}
