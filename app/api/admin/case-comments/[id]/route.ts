import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { currentUser } from "@clerk/nextjs/server"
import { AdminAccessError, requireAdminApi } from "@/lib/admin-auth"
import { db } from "@/lib/db"
import { CASE_COMMENT_STATUSES, caseComments, type CaseCommentStatus } from "@/lib/db/schema"

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const MAX_NOTE_LENGTH = 2000

function isStatus(value: unknown): value is CaseCommentStatus {
  return typeof value === "string" && (CASE_COMMENT_STATUSES as readonly string[]).includes(value)
}

/** Approve, reject or mark a comment as spam, recording who did it and when. */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminApi()

    const { id } = await params
    if (!UUID_PATTERN.test(id)) {
      return NextResponse.json({ error: "Invalid comment id" }, { status: 400 })
    }

    let payload: unknown
    try {
      payload = await request.json()
    } catch {
      return NextResponse.json({ error: "Malformed request" }, { status: 400 })
    }

    const data = (payload ?? {}) as Record<string, unknown>

    if (!isStatus(data.status)) {
      return NextResponse.json(
        { error: `status must be one of: ${CASE_COMMENT_STATUSES.join(", ")}` },
        { status: 400 },
      )
    }

    const note =
      typeof data.moderationNote === "string"
        ? data.moderationNote.trim().slice(0, MAX_NOTE_LENGTH) || null
        : null

    const admin = await currentUser()

    const [row] = await db
      .update(caseComments)
      .set({
        status: data.status,
        moderatedAt: new Date(),
        moderatedBy: admin?.emailAddresses[0]?.emailAddress ?? admin?.id ?? "admin",
        moderationNote: note,
        updatedAt: new Date(),
      })
      .where(eq(caseComments.id, id))
      .returning()

    if (!row) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    return NextResponse.json({ comment: row })
  } catch (error) {
    console.error("Admin case comment moderation error:", error)

    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}

/** Permanently remove a comment. Used for content that should not be retained. */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdminApi()

    const { id } = await params
    if (!UUID_PATTERN.test(id)) {
      return NextResponse.json({ error: "Invalid comment id" }, { status: 400 })
    }

    const [row] = await db.delete(caseComments).where(eq(caseComments.id, id)).returning()

    if (!row) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    return NextResponse.json({ deleted: true })
  } catch (error) {
    console.error("Admin case comment delete error:", error)

    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
