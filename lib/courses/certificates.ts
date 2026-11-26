import "server-only"
import { randomInt } from "node:crypto"
import { and, desc, eq, ilike, isNotNull, isNull, or, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { courseCertificates, users, type CourseCertificate } from "@/lib/db/schema"
import { CERTIFICATE_CODE_RE, addMonthsUtc } from "./certificate-rules"

const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"

export function newCertificateCode() {
  const part = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("")
  return `AB-${part()}-${part()}`
}

export type HistoryEntry = { at: string; by: string; action: "issued" | "renamed" | "revoked" | "reinstated" | "renewed"; detail?: string }

const entry = (by: string, action: HistoryEntry["action"], detail?: string): HistoryEntry => ({ at: new Date().toISOString(), by, action, ...(detail ? { detail } : {}) })
const append = (e: HistoryEntry) => sql`${courseCertificates.history} || ${JSON.stringify([e])}::jsonb`

export async function getCertificateByCode(code: string): Promise<CourseCertificate | null> {
  const normalized = code.trim().toUpperCase()
  if (!CERTIFICATE_CODE_RE.test(normalized)) return null
  const [row] = await db.select().from(courseCertificates).where(eq(courseCertificates.code, normalized)).limit(1)
  return row ?? null
}

export async function getUserCertificate(userId: string, slug: string): Promise<CourseCertificate | null> {
  const [row] = await db.select().from(courseCertificates).where(and(eq(courseCertificates.userId, userId), eq(courseCertificates.courseSlug, slug))).limit(1)
  return row ?? null
}

/** Inserts with a fresh code, retrying on the rare code collision. Returns the existing row if one already exists. */
export async function issueCertificate(input: { userId: string | null; slug: string; name: string; email: string; edition: string; source: "earned" | "admin"; by: string; note?: string; validityMonths?: number }) {
  if (input.userId) {
    const existing = await getUserCertificate(input.userId, input.slug)
    if (existing) return { certificate: existing, created: false }
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    const rows = await db.insert(courseCertificates).values({
      code: newCertificateCode(),
      userId: input.userId,
      courseSlug: input.slug,
      recipientName: input.name,
      recipientEmail: input.email.toLowerCase(),
      edition: input.edition,
      source: input.source,
      expiresAt: input.validityMonths ? addMonthsUtc(new Date(), input.validityMonths) : null,
      history: [entry(input.by, "issued", input.note)],
    }).onConflictDoNothing().returning()
    if (rows[0]) return { certificate: rows[0], created: true }
    if (input.userId) {
      const existing = await getUserCertificate(input.userId, input.slug)
      if (existing) return { certificate: existing, created: false }
    }
  }
  throw new Error("Could not create a certificate code; try again")
}

export async function listCertificates(filters: { q?: string; slug?: string; status?: "active" | "revoked" }) {
  const conds = []
  if (filters.slug) conds.push(eq(courseCertificates.courseSlug, filters.slug))
  if (filters.status === "active") conds.push(isNull(courseCertificates.revokedAt))
  if (filters.status === "revoked") conds.push(isNotNull(courseCertificates.revokedAt))
  const q = filters.q?.trim()
  if (q) {
    const like = `%${q.replace(/[%_\\]/g, (c) => `\\${c}`)}%`
    conds.push(or(ilike(courseCertificates.recipientName, like), ilike(courseCertificates.recipientEmail, like), ilike(courseCertificates.code, like)))
  }
  return db.select().from(courseCertificates).where(conds.length ? and(...conds) : undefined).orderBy(desc(courseCertificates.issuedAt)).limit(300)
}

export async function renameCertificate(id: string, name: string, by: string, reason: string) {
  const [row] = await db.update(courseCertificates).set({ recipientName: name, updatedAt: new Date(), history: append(entry(by, "renamed", `${name}: ${reason}`)) }).where(eq(courseCertificates.id, id)).returning()
  return row ?? null
}

export async function revokeCertificate(id: string, reason: string, by: string) {
  const [row] = await db.update(courseCertificates).set({ revokedAt: new Date(), revokedReason: reason, updatedAt: new Date(), history: append(entry(by, "revoked", reason)) }).where(and(eq(courseCertificates.id, id), isNull(courseCertificates.revokedAt))).returning()
  return row ?? null
}

export async function reinstateCertificate(id: string, by: string, reason: string) {
  const [row] = await db.update(courseCertificates).set({ revokedAt: null, revokedReason: null, updatedAt: new Date(), history: append(entry(by, "reinstated", reason)) }).where(and(eq(courseCertificates.id, id), isNotNull(courseCertificates.revokedAt))).returning()
  return row ?? null
}

export async function findUserIdByEmail(email: string) {
  const [u] = await db.select({ id: users.id }).from(users).where(eq(users.email, email.toLowerCase())).limit(1)
  return u?.id ?? null
}

/** Moves a certificate's expiry forward after a passed renewal exam. */
export async function renewCertificateExpiry(id: string, expiresAt: Date, by: string, detail: string, tx: Pick<typeof db, "update"> = db) {
  const [row] = await tx.update(courseCertificates).set({ expiresAt, renewalCount: sql`${courseCertificates.renewalCount} + 1`, updatedAt: new Date(), history: append(entry(by, "renewed", detail)) }).where(eq(courseCertificates.id, id)).returning()
  return row ?? null
}
