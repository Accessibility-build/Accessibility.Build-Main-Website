import { NextResponse } from "next/server"
import { desc } from "drizzle-orm"
import { AdminAccessError, requireAdminApi } from "@/lib/admin-auth"
import { db } from "@/lib/db"
import { caseComments } from "@/lib/db/schema"

// Full comment list for the moderation screen, newest first. Includes every
// status, and the abuse signals the public route never returns.
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await requireAdminApi()

    const rows = await db
      .select()
      .from(caseComments)
      .orderBy(desc(caseComments.createdAt))

    return NextResponse.json({ comments: rows, total: rows.length })
  } catch (error) {
    console.error("Admin case comments list error:", error)

    if (error instanceof AdminAccessError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }

    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 })
  }
}
