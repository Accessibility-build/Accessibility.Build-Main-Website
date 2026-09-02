import { NextRequest, NextResponse } from "next/server"
import { and, asc, eq, gte, sql } from "drizzle-orm"
import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { caseComments } from "@/lib/db/schema"
import { isCaseSlug } from "@/lib/case-studies"
import { validateCommentBody } from "@/lib/case-comments"
import {
  COMMENT_RATE_LIMIT_PER_HOUR,
  autoApproveEnabled,
  clientIpFrom,
  hashIp,
  ownerUserIds,
  toPublicComment,
} from "@/lib/case-comments-server"

// Reader comments on a case study.
//
// GET  returns approved comments, oldest first, for anyone.
// POST creates one. Sign-in is required, the body is validated and normalised,
//      the slug is checked against the published-case registry, and each account
//      is capped per hour. New comments are held for review unless
//      CASE_COMMENTS_AUTO_APPROVE is set.

export const dynamic = "force-dynamic"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params

    if (!isCaseSlug(slug)) {
      return NextResponse.json({ error: "Unknown case study" }, { status: 404 })
    }

    const rows = await db
      .select()
      .from(caseComments)
      .where(and(eq(caseComments.caseSlug, slug), eq(caseComments.status, "approved")))
      .orderBy(asc(caseComments.createdAt))

    const owners = ownerUserIds()

    return NextResponse.json(
      { comments: rows.map((row) => toPublicComment(row, owners)) },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    console.error("Case comments GET error:", error)
    return NextResponse.json({ error: "Comments could not be loaded" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params

    if (!isCaseSlug(slug)) {
      return NextResponse.json({ error: "Unknown case study" }, { status: 404 })
    }

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Sign in to post a comment." },
        { status: 401 },
      )
    }

    let payload: unknown
    try {
      payload = await request.json()
    } catch {
      return NextResponse.json({ error: "Malformed request." }, { status: 400 })
    }

    const data = (payload ?? {}) as Record<string, unknown>

    // Honeypot. A real person never fills a field they cannot see, so anything
    // here is automation. Answer 200 so the bot cannot tell it was caught.
    if (typeof data.website === "string" && data.website.trim() !== "") {
      return NextResponse.json({ status: "pending" })
    }

    const validation = validateCommentBody(data.body)
    if (!validation.ok || !validation.value) {
      return NextResponse.json(
        { error: validation.errors.body ?? "That comment could not be posted.", errors: validation.errors },
        { status: 400 },
      )
    }

    // Per-account hourly cap, counted in the database so it survives the
    // stateless serverless runtime that an in-memory limiter would not.
    const since = new Date(Date.now() - 60 * 60 * 1000)
    const [{ count } = { count: 0 }] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(caseComments)
      .where(and(eq(caseComments.userId, userId), gte(caseComments.createdAt, since)))

    if (count >= COMMENT_RATE_LIMIT_PER_HOUR) {
      return NextResponse.json(
        {
          error: `You have posted ${COMMENT_RATE_LIMIT_PER_HOUR} comments in the last hour. Try again later.`,
        },
        { status: 429 },
      )
    }

    const user = await currentUser()
    const authorName =
      [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
      user?.username ||
      "Reader"

    const status = autoApproveEnabled() ? "approved" : "pending"

    const [row] = await db
      .insert(caseComments)
      .values({
        caseSlug: slug,
        userId,
        authorName,
        authorImage: user?.imageUrl ?? null,
        body: validation.value,
        status,
        ipHash: hashIp(clientIpFrom(request.headers)),
        userAgent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      })
      .returning()

    return NextResponse.json(
      {
        status,
        comment: status === "approved" ? toPublicComment(row, ownerUserIds()) : null,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Case comments POST error:", error)
    return NextResponse.json({ error: "That comment could not be posted." }, { status: 500 })
  }
}
