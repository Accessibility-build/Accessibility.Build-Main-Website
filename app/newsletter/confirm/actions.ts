"use server"

import { redirect } from "next/navigation"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { emailSubscriptions } from "@/lib/db/schema"
import { sendNewsletterWelcomeEmail } from "@/lib/email/service"
import { CONFIRM_LINK_MAX_AGE_MS, hashConfirmToken } from "@/lib/newsletter/guard"

export async function confirmSubscription(formData: FormData) {
  const token = formData.get("token")
  if (typeof token !== "string" || token.length < 20 || token.length > 200) {
    redirect("/newsletter/confirm?status=invalid")
  }

  const tokenHash = hashConfirmToken(token)
  const [row] = await db
    .select()
    .from(emailSubscriptions)
    .where(sql`${emailSubscriptions.metadata}->>'confirmTokenHash' = ${tokenHash}`)
    .limit(1)

  if (!row) redirect("/newsletter/confirm?status=invalid")

  const meta = (row.metadata ?? {}) as Record<string, unknown>
  const sentAt = typeof meta.confirmSentAt === "string" ? Date.parse(meta.confirmSentAt) : NaN
  if (!Number.isFinite(sentAt) || Date.now() - sentAt > CONFIRM_LINK_MAX_AGE_MS) {
    redirect("/newsletter/confirm?status=expired")
  }

  const rest = { ...meta }
  delete rest.confirmTokenHash
  await db
    .update(emailSubscriptions)
    .set({
      isActive: true,
      subscribedAt: new Date(),
      unsubscribedAt: null,
      metadata: { ...rest, confirmedAt: new Date().toISOString() },
    })
    .where(sql`${emailSubscriptions.id} = ${row.id}`)

  sendNewsletterWelcomeEmail({
    type: "newsletter_welcome",
    recipient: { email: row.email },
    source: row.source === "blog" || row.source === "other" ? row.source : "footer",
  })

  redirect("/newsletter/confirm?status=confirmed")
}
