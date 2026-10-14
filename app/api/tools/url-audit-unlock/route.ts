import { NextRequest, NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { prospects, trialUsage, type ProspectFinding } from "@/lib/db/schema"
import { createRateLimit } from "@/lib/rate-limit"
import { company } from "@/lib/company"
import { inboundLeadScore } from "@/lib/free-scan"
import { sendInboundScanLeadNotification } from "@/lib/email/service"
import { getPostHogClient } from "@/lib/posthog-server"

// Releases the findings held back from an anonymous free scan, in exchange for
// a work email. The scan row id is an unguessable uuid handed only to the
// browser that ran the scan, so it doubles as the capability to read the rest.
//
// The lead lands in the existing `prospects` table under the "inbound" tier, so
// it appears in the admin list the outbound routine already works from.

const unlockSchema = z.object({
  scanId: z.string().uuid("This scan can no longer be unlocked. Please run it again."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(254),
  // Honeypot: real visitors never fill this in.
  website: z.string().max(0).optional(),
})

const unlockRateLimit = createRateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message: "Too many attempts. Please try again later.",
})

interface StoredViolation {
  description?: string
  impact?: string
  fixSuggestion?: string
}

interface StoredScan {
  title?: string
  overallScore?: number
  totalViolations?: number
  criticalCount?: number
  seriousCount?: number
  violations?: StoredViolation[]
}

export async function POST(request: NextRequest) {
  const limited = await unlockRateLimit(request)
  if (limited) return limited

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const parsed = unlockSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }
  const { scanId, email } = parsed.data

  try {
    const [scan] = await db
      .select()
      .from(trialUsage)
      .where(and(eq(trialUsage.id, scanId), eq(trialUsage.tool, "url_accessibility_auditor")))
      .limit(1)

    if (!scan) {
      return NextResponse.json(
        { error: "This scan can no longer be unlocked. Please run it again." },
        { status: 404 }
      )
    }

    const input = (scan.inputData ?? {}) as { url?: string; domain?: string }
    const output = (scan.outputData ?? {}) as StoredScan
    const violations = Array.isArray(output.violations) ? output.violations : []
    const domain = input.domain || "unknown"
    const url = input.url || ""
    const criticalCount = output.criticalCount ?? 0
    const seriousCount = output.seriousCount ?? 0
    const totalViolations = output.totalViolations ?? violations.length
    const overallScore = output.overallScore ?? 0

    const findings: ProspectFinding[] = violations.slice(0, 5).map((violation, index) => ({
      n: index + 1,
      text: `[${violation.impact ?? "unknown"}] ${violation.description ?? "Unnamed finding"}`,
    }))

    const today = new Date().toISOString().slice(0, 10)
    const inboundNote = `Inbound ${today}: ${email} ran the free scan on ${url} and unlocked the full result (score ${overallScore}/100, ${totalViolations} findings).`

    const [existing] = await db.select().from(prospects).where(eq(prospects.company, domain)).limit(1)

    if (existing) {
      // The domain may already be an outbound prospect. Keep its research and
      // drafted email intact; only record that they came to us, and fill the
      // address in when none had been found.
      await db
        .update(prospects)
        .set({
          notes: existing.notes ? `${existing.notes}\n${inboundNote}` : inboundNote,
          ...(existing.emailAddress
            ? {}
            : {
                emailAddress: email,
                addressSource: "Given by the visitor through the free scan on accessibility.build",
              }),
          updatedAt: new Date(),
        })
        .where(eq(prospects.id, existing.id))
    } else {
      await db.insert(prospects).values({
        company: domain,
        website: url,
        tier: "inbound",
        sendability: "Visitor asked for the full scan result and supplied this address themselves",
        emailAddress: email,
        addressSource: "Given by the visitor through the free scan on accessibility.build",
        findings,
        evidence: `Automated axe-core scan of ${url}: score ${overallScore}/100, ${totalViolations} findings (${criticalCount} critical, ${seriousCount} serious). Automated results only; verify before quoting them back.`,
        score: inboundLeadScore({ criticalCount, seriousCount }),
        status: "new",
        notes: inboundNote,
        scannedAt: scan.createdAt,
      })
    }

    await sendInboundScanLeadNotification({
      scanId,
      to: process.env.LEAD_NOTIFICATION_EMAIL || company.email,
      leadEmail: email,
      domain,
      url,
      overallScore,
      totalViolations,
      criticalCount,
      seriousCount,
      topFindings: findings.map((finding) => finding.text),
    })

    const posthog = getPostHogClient()
    if (posthog) {
      // The address itself stays out of analytics.
      posthog.capture({
        distinctId: `scan_${scanId}`,
        event: "scan_lead_captured",
        properties: {
          domain,
          overall_score: overallScore,
          total_violations: totalViolations,
          critical_count: criticalCount,
          serious_count: seriousCount,
          existing_prospect: Boolean(existing),
        },
      })
      await posthog.flush()
    }

    return NextResponse.json({ violations })
  } catch (error) {
    console.error("url-audit-unlock failed:", error)
    return NextResponse.json(
      { error: "Could not unlock the result. Please try again." },
      { status: 500 }
    )
  }
}
