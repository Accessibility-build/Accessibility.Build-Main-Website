import "server-only"
import { and, eq, inArray, isNull, or, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { billingOrders } from "@/lib/db/schema"

/** Call only with email addresses verified by Clerk, never a checkout form's email. */
export async function claimGuestProductOrders(userId: string, verifiedEmails: string[]) {
  if (!verifiedEmails.length) return
  await db.update(billingOrders).set({ userId, updatedAt: new Date() }).where(and(
    isNull(billingOrders.userId),
    eq(billingOrders.paymentProvider, "dodo"),
    eq(billingOrders.credits, 0),
    inArray(billingOrders.status, ["paid", "refunded", "partially_refunded"]),
    or(sql`${billingOrders.catalogKey} LIKE 'course:%'`, sql`${billingOrders.catalogKey} LIKE 'template:%'`),
    sql`${billingOrders.metadata}->>'guestCheckout' = 'true'`,
    inArray(sql<string>`${billingOrders.metadata}->>'buyerEmail'`, verifiedEmails),
  ))
}
