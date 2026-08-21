import type { Prospect } from '@/lib/db/schema'
import type { ProspectRecord } from '@/components/admin/prospect-ui'

/**
 * Flatten a prospect row into the plain, JSON-safe shape the admin client
 * components expect. Dates become ISO strings so nothing depends on the RSC
 * payload rehydrating a Date, and `findings` is normalised to an array.
 */
export function serializeProspect(row: Prospect): ProspectRecord {
  return {
    id: row.id,
    company: row.company,
    website: row.website,
    country: row.country,
    sector: row.sector,
    tier: row.tier,
    sendability: row.sendability,
    emailAddress: row.emailAddress,
    addressSource: row.addressSource,
    contactRole: row.contactRole,
    overlay: row.overlay,
    hasStatement: row.hasStatement,
    statementNote: row.statementNote,
    findings: Array.isArray(row.findings) ? row.findings : null,
    evidence: row.evidence,
    subject: row.subject,
    emailBody: row.emailBody,
    caution: row.caution,
    score: row.score,
    status: row.status,
    notes: row.notes,
    scannedAt: row.scannedAt ? row.scannedAt.toISOString() : null,
    createdAt: row.createdAt ? row.createdAt.toISOString() : null,
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
  }
}
