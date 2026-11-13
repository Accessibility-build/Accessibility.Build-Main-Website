import "server-only"
import { and, eq, inArray, isNull, or, sql } from "drizzle-orm"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { courseLicences, courseSeats, users } from "@/lib/db/schema"
import { getOrCreateUserByClerkId } from "@/lib/credits"
import { CourseLicenceType, getCourse, normalizeEmail } from "./config"

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

export interface CourseViewer {
  userId: string
  clerkUserId: string
  email: string
  emails: string[]
  firstName: string | null
}

export interface CourseAccess {
  viewer: CourseViewer | null
  hasAccess: boolean
  /** Active licences this viewer owns (for the team page). */
  ownedLicences: Array<{ id: string; licenceType: string; seats: number }>
}

/** Signed-in viewer with verified email addresses, or null. Creates the users row if missing. */
export async function getCourseViewer(): Promise<CourseViewer | null> {
  const user = await currentUser()
  if (!user) return null
  const verified = user.emailAddresses
    .filter((e) => e.verification?.status === "verified")
    .map((e) => normalizeEmail(e.emailAddress))
  const primary = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress
  const email = normalizeEmail(primary || verified[0] || user.emailAddresses[0]?.emailAddress || "")
  const dbUser = await getOrCreateUserByClerkId({
    userId: user.id,
    email,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    profileImageUrl: user.imageUrl ?? undefined,
  })
  return { userId: dbUser.id, clerkUserId: user.id, email, emails: verified, firstName: user.firstName ?? null }
}

/** Attach any unclaimed seats held by the viewer's verified emails to their account. */
async function claimSeats(viewer: CourseViewer) {
  if (!viewer.emails.length) return
  // Licences granted to an email before that person had an account become theirs on sign-in.
  await db
    .update(courseLicences)
    .set({ ownerUserId: viewer.userId, updatedAt: new Date() })
    .where(and(isNull(courseLicences.ownerUserId), inArray(courseLicences.ownerEmail, viewer.emails)))
  await db
    .update(courseSeats)
    .set({ userId: viewer.userId, claimedAt: new Date() })
    .where(and(isNull(courseSeats.userId), inArray(courseSeats.email, viewer.emails)))
}

export async function getCourseAccess(slug: string): Promise<CourseAccess> {
  const viewer = await getCourseViewer()
  if (!viewer) return { viewer: null, hasAccess: false, ownedLicences: [] }
  await claimSeats(viewer)

  const seatMatch = viewer.emails.length
    ? or(eq(courseSeats.userId, viewer.userId), inArray(courseSeats.email, viewer.emails))
    : eq(courseSeats.userId, viewer.userId)

  const [seat] = await db
    .select({ id: courseSeats.id })
    .from(courseSeats)
    .innerJoin(courseLicences, eq(courseSeats.licenceId, courseLicences.id))
    .where(and(eq(courseLicences.courseSlug, slug), isNull(courseLicences.revokedAt), seatMatch))
    .limit(1)

  const ownedLicences = await db
    .select({ id: courseLicences.id, licenceType: courseLicences.licenceType, seats: courseLicences.seats })
    .from(courseLicences)
    .where(and(eq(courseLicences.courseSlug, slug), eq(courseLicences.ownerUserId, viewer.userId), isNull(courseLicences.revokedAt)))

  return { viewer, hasAccess: Boolean(seat), ownedLicences }
}

/** For course pages: sign-in redirect for visitors, sales page for signed-in people without a seat. */
export async function requireCourseAccess(slug: string, returnTo: string) {
  const course = getCourse(slug)
  if (!course) redirect("/")
  const access = await getCourseAccess(slug)
  if (!access.viewer) redirect(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`)
  if (!access.hasAccess) redirect(`${course.salesRoute}?access=none#buy`)
  return access as CourseAccess & { viewer: CourseViewer }
}

/**
 * Create a licence and the owner's seat. Idempotent per billing order. Pass `tx` to run inside
 * the payment webhook's transaction.
 */
export async function grantCourseLicence(
  input: {
    slug: string
    licenceType: CourseLicenceType
    ownerUserId: string | null
    ownerEmail: string
    billingOrderId?: string | null
    source: "purchase" | "admin"
    grantedBy?: string | null
    note?: string | null
    seats?: number
  },
  tx?: Tx
) {
  const run = async (t: Tx) => {
    const course = getCourse(input.slug)
    if (!course) throw new Error(`Unknown course ${input.slug}`)
    if (input.billingOrderId) {
      const [existing] = await t
        .select({ id: courseLicences.id })
        .from(courseLicences)
        .where(eq(courseLicences.billingOrderId, input.billingOrderId))
        .limit(1)
      if (existing) return existing.id
    }
    const ownerEmail = normalizeEmail(input.ownerEmail)
    const [licence] = await t
      .insert(courseLicences)
      .values({
        courseSlug: input.slug,
        licenceType: input.licenceType,
        seats: input.seats ?? course.licences[input.licenceType].seats,
        ownerUserId: input.ownerUserId,
        ownerEmail,
        billingOrderId: input.billingOrderId ?? null,
        source: input.source,
        grantedBy: input.grantedBy ?? null,
        note: input.note ?? null,
      })
      .returning({ id: courseLicences.id })
    await t
      .insert(courseSeats)
      .values({
        licenceId: licence.id,
        email: ownerEmail,
        userId: input.ownerUserId,
        claimedAt: input.ownerUserId ? new Date() : null,
      })
      .onConflictDoNothing()
    return licence.id
  }
  return tx ? run(tx) : db.transaction(run)
}

export async function revokeCourseLicenceForOrder(billingOrderId: string, reason: string) {
  await db
    .update(courseLicences)
    .set({ revokedAt: new Date(), revokedReason: reason, updatedAt: new Date() })
    .where(and(eq(courseLicences.billingOrderId, billingOrderId), isNull(courseLicences.revokedAt)))
}

export async function getLicenceSeats(licenceId: string) {
  return db
    .select({
      id: courseSeats.id,
      email: courseSeats.email,
      userId: courseSeats.userId,
      claimedAt: courseSeats.claimedAt,
      invitedAt: courseSeats.invitedAt,
      createdAt: courseSeats.createdAt,
    })
    .from(courseSeats)
    .where(eq(courseSeats.licenceId, licenceId))
    .orderBy(courseSeats.createdAt)
}

export class SeatError extends Error {
  constructor(message: string, public status = 400) {
    super(message)
  }
}

/** Owner adds a seat. Checks ownership, the seat limit and duplicates. */
export async function addSeat(licenceId: string, ownerUserId: string, rawEmail: string) {
  const email = normalizeEmail(rawEmail)
  return db.transaction(async (t) => {
    await t.execute(sql`SELECT id FROM course_licences WHERE id = ${licenceId} FOR UPDATE`)
    const [licence] = await t.select().from(courseLicences).where(eq(courseLicences.id, licenceId)).limit(1)
    if (!licence || licence.ownerUserId !== ownerUserId || licence.revokedAt) throw new SeatError("Licence not found", 404)
    const seats = await t.select({ id: courseSeats.id, email: courseSeats.email }).from(courseSeats).where(eq(courseSeats.licenceId, licenceId))
    if (seats.some((s) => s.email === email)) throw new SeatError("That email already has a seat on this licence.")
    if (seats.length >= licence.seats) throw new SeatError(`All ${licence.seats} seats are in use. Remove someone to add another person.`)
    const [userRow] = await t.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
    const [seat] = await t
      .insert(courseSeats)
      .values({ licenceId, email, invitedAt: new Date(), userId: null, claimedAt: null })
      .returning({ id: courseSeats.id })
    return { seatId: seat.id, email, existingUser: Boolean(userRow), courseSlug: licence.courseSlug }
  })
}

/** Owner removes a seat. The owner's own seat cannot be removed. */
export async function removeSeat(licenceId: string, ownerUserId: string, seatId: string) {
  const [licence] = await db.select().from(courseLicences).where(eq(courseLicences.id, licenceId)).limit(1)
  if (!licence || licence.ownerUserId !== ownerUserId) throw new SeatError("Licence not found", 404)
  const [seat] = await db.select().from(courseSeats).where(and(eq(courseSeats.id, seatId), eq(courseSeats.licenceId, licenceId))).limit(1)
  if (!seat) throw new SeatError("Seat not found", 404)
  if (seat.email === licence.ownerEmail || (seat.userId && seat.userId === licence.ownerUserId)) throw new SeatError("You cannot remove your own seat.")
  await db.delete(courseSeats).where(eq(courseSeats.id, seatId))
}
