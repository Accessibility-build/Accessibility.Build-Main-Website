import "server-only"
import { and, eq, inArray, isNull, or } from "drizzle-orm"
import { db } from "@/lib/db"
import { productEntitlements, productFiles } from "@/lib/db/schema"
import { getCourseViewer, type CourseViewer } from "@/lib/courses/access"

/** Products the viewer may download (claims email-held entitlements on the way). */
export async function getDownloadEntitlements(viewer: CourseViewer) {
  if (viewer.emails.length) {
    await db
      .update(productEntitlements)
      .set({ userId: viewer.userId })
      .where(and(isNull(productEntitlements.userId), inArray(productEntitlements.email, viewer.emails)))
  }
  const match = viewer.emails.length
    ? or(eq(productEntitlements.userId, viewer.userId), inArray(productEntitlements.email, viewer.emails))
    : eq(productEntitlements.userId, viewer.userId)
  return db
    .select({ productSlug: productEntitlements.productSlug, licence: productEntitlements.licence, createdAt: productEntitlements.createdAt })
    .from(productEntitlements)
    .where(and(isNull(productEntitlements.revokedAt), match))
}

export async function listProductFiles(slug: string) {
  return db
    .select({ filename: productFiles.filename, sizeBytes: productFiles.sizeBytes, version: productFiles.version, updatedAt: productFiles.updatedAt })
    .from(productFiles)
    .where(eq(productFiles.productSlug, slug))
    .orderBy(productFiles.filename)
}

export async function getFileForViewer(slug: string, filename: string) {
  const viewer = await getCourseViewer()
  if (!viewer) return { status: 401 as const }
  const ents = await getDownloadEntitlements(viewer)
  if (!ents.some((e) => e.productSlug === slug)) return { status: 403 as const }
  const [file] = await db
    .select()
    .from(productFiles)
    .where(and(eq(productFiles.productSlug, slug), eq(productFiles.filename, filename)))
    .limit(1)
  if (!file) return { status: 404 as const }
  return { status: 200 as const, file }
}
