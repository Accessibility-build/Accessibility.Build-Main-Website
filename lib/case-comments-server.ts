import { createHash } from "node:crypto"
import type { CaseComment } from "@/lib/db/schema"
import type { PublicComment } from "@/lib/case-comments"

// Server-only helpers for case study comments. Kept apart from
// lib/case-comments.ts because these pull in Node built-ins and database types
// that must not reach the browser bundle.

/**
 * Comments are held for review unless this is explicitly switched off. These
 * pages discuss named companies and live litigation, so publishing unreviewed
 * text carries more than the usual spam risk.
 */
export function autoApproveEnabled(): boolean {
  return process.env.CASE_COMMENTS_AUTO_APPROVE === "true"
}

/** How many comments one signed-in account may post per hour. */
export const COMMENT_RATE_LIMIT_PER_HOUR = 5

/**
 * Hashes a client IP with a server-side secret so the raw address is never
 * stored. Used only to spot abuse patterns across accounts.
 */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null
  const secret = process.env.COMMENT_IP_SALT || process.env.CLERK_SECRET_KEY || "accessibility-build"
  return createHash("sha256").update(`${secret}:${ip}`).digest("hex").slice(0, 32)
}

/** Best-effort client IP from the proxy headers Vercel sets. */
export function clientIpFrom(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim() || null
  return headers.get("x-real-ip")
}

/** Clerk user ids belonging to the site owner, for the "author" badge. */
export function ownerUserIds(): string[] {
  return (process.env.CASE_COMMENTS_OWNER_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

export function toPublicComment(row: CaseComment, owners: string[]): PublicComment {
  return {
    id: row.id,
    authorName: row.authorName,
    authorImage: row.authorImage,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    isAuthor: owners.includes(row.userId),
  }
}
