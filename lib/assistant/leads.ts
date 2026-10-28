import "server-only"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { prospects } from "@/lib/db/schema"

// Turns a Curb contact request into an inbound prospect, the same tier the free-scan unlock
// uses, so it shows up in /admin/prospects alongside the rest of the pipeline.

const FREE_MAIL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "yahoo.co.in", "hotmail.com", "hotmail.co.uk",
  "outlook.com", "live.com", "msn.com", "icloud.com", "me.com", "mac.com", "aol.com", "proton.me",
  "protonmail.com", "gmx.com", "gmx.de", "mail.com", "yandex.com", "zoho.com", "rediffmail.com",
])

/** "example.com/x" becomes "https://example.com/x"; anything that is not a usable URL becomes null. */
export function normaliseWebsite(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  try {
    const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`)
    if (!url.hostname.includes(".")) return null
    return url.toString().replace(/\/$/, "")
  } catch {
    return null
  }
}

/**
 * The prospects table is keyed by company. Prefer the website's domain, then a work email's
 * domain, and fall back to the address itself for free mail, so two people from one company
 * land on one prospect.
 */
export function prospectKey(email: string, website: string | null): string {
  if (website) return new URL(website).hostname.replace(/^www\./, "")
  const domain = email.split("@")[1]?.toLowerCase() ?? ""
  return domain && !FREE_MAIL_DOMAINS.has(domain) ? domain : email.toLowerCase()
}

export async function upsertInboundProspect(lead: {
  key: string
  website: string | null
  email: string
  name: string
  organisation: string
  message: string
  summary: string
  score: number
}): Promise<string | null> {
  const today = new Date().toISOString().slice(0, 10)
  const who = `${lead.name} <${lead.email}>${lead.organisation ? ` (${lead.organisation})` : ""}`
  const note = `Inbound ${today} via the Curb assistant: ${who} wrote: "${lead.message.slice(0, 600)}"`

  const [existing] = await db.select().from(prospects).where(eq(prospects.company, lead.key)).limit(1)
  if (existing) {
    // Keep any outbound research and drafted email; record the inbound request and fill the
    // address in when none had been found.
    await db
      .update(prospects)
      .set({
        notes: existing.notes ? `${existing.notes}\n${note}` : note,
        ...(existing.emailAddress
          ? {}
          : { emailAddress: lead.email, addressSource: "Given by the visitor through the Curb assistant on accessibility.build" }),
        updatedAt: new Date(),
      })
      .where(eq(prospects.id, existing.id))
    return existing.id
  }

  const [created] = await db
    .insert(prospects)
    .values({
      company: lead.key,
      website: lead.website,
      tier: "inbound",
      sendability: "Visitor asked for help through the Curb assistant and supplied this address themselves",
      emailAddress: lead.email,
      addressSource: "Given by the visitor through the Curb assistant on accessibility.build",
      evidence: lead.summary,
      score: lead.score,
      status: "new",
      notes: note,
    })
    .returning({ id: prospects.id })
  return created?.id ?? null
}
