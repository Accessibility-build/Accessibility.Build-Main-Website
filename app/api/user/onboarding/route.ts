import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getUser } from "@/lib/credits"

const onboardingSchema = z.object({
  role: z.enum(["developer", "designer", "product", "content", "consultant", "other"]),
  goals: z.array(z.enum([
    "wcag-aa",
    "audit-existing-site",
    "design-system",
    "documents",
    "training",
    "service-support",
  ])).min(1).max(6),
})

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const parsed = onboardingSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a role and at least one goal" }, { status: 400 })
  }

  const user = await getUser()
  const existingMetadata = user.metadata && typeof user.metadata === "object" && !Array.isArray(user.metadata)
    ? user.metadata as Record<string, unknown>
    : {}

  await db
    .update(users)
    .set({
      metadata: {
        ...existingMetadata,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
        accessibilityRole: parsed.data.role,
        accessibilityGoals: parsed.data.goals,
      },
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))

  return NextResponse.json({ ok: true })
}
