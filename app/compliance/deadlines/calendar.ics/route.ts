import { NextRequest } from "next/server"
import {
  DEADLINES_CALENDAR_PATH,
  DEADLINES_REVIEWED_ISO,
  DEADLINE_STATUS_META,
  getCalendarDeadlines,
  getRegionLabel,
  isDeadlineRegion,
  type ComplianceDeadline,
} from "@/lib/data/compliance-deadlines"

// iCalendar (RFC 5545) feed of every compliance deadline that has not passed.
//   /compliance/deadlines/calendar.ics               all regions
//   /compliance/deadlines/calendar.ics?region=eu     one region group
//   /compliance/deadlines/calendar.ics?id=<row-id>   a single event
// Output is deterministic: DTSTAMP is the dataset's reviewed date, not the
// request time, and rows are filtered on their stored status, so an unchanged
// dataset yields byte-identical files.
export const revalidate = 86400

const SITE = "https://accessibility.build"
const PAGE_URL = `${SITE}/compliance/deadlines`
const CRLF = "\r\n"
const DTSTAMP = `${DEADLINES_REVIEWED_ISO.replace(/-/g, "")}T000000Z`

/** Escape a TEXT value (RFC 5545 s.3.3.11). */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n")
}

/**
 * Fold a content line at 75 octets (RFC 5545 s.3.1). Continuation lines start
 * with one space, so they carry at most 74 octets of content. Never splits a
 * UTF-8 sequence.
 */
function foldLine(line: string): string {
  const encoder = new TextEncoder()
  if (encoder.encode(line).length <= 75) return line
  const parts: string[] = []
  let current = ""
  let currentBytes = 0
  let limit = 75
  for (const char of line) {
    const bytes = encoder.encode(char).length
    if (currentBytes + bytes > limit) {
      parts.push(current)
      current = ""
      currentBytes = 0
      limit = 74
    }
    current += char
    currentBytes += bytes
  }
  parts.push(current)
  return parts.join(`${CRLF} `)
}

function compactDate(iso: string): string {
  return iso.replace(/-/g, "")
}

function nextDay(iso: string): string {
  const t = Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)))
  return new Date(t + 86400000).toISOString().slice(0, 10).replace(/-/g, "")
}

function summaryFor(row: ComplianceDeadline): string {
  const flagged = /expected|about/i.test(row.title)
  const prefix = flagged ? "" : row.status === "expected" ? "Expected: " : row.dateApprox ? "About: " : ""
  const suffix = row.status === "computed" ? " (computed date)" : ""
  return `${prefix}${row.jurisdiction}: ${row.title}${suffix}`
}

function descriptionFor(row: ComplianceDeadline): string {
  const lines = [
    row.description,
    "",
    `Who: ${row.appliesTo}`,
    `What: ${row.requirement}`,
  ]
  if (row.standard) lines.push(`Standard: ${row.standard}`)
  let status = DEADLINE_STATUS_META[row.status].label
  if (row.challenged) status += " (challenged in court)"
  if (row.confidence === "unverified") status += " (not re-confirmed in the primary source)"
  lines.push(`Status: ${status}`)
  if (row.cadence) lines.push(`How the date was computed: ${row.cadence}`)
  if (row.note) lines.push(`Note: ${row.note}`)
  lines.push(`Source: ${row.sourceLabel}, ${row.sourceUrl}`)
  lines.push(`Details: ${PAGE_URL}#${row.id}`)
  lines.push(`Reviewed ${DEADLINES_REVIEWED_ISO}. Educational content, not legal advice.`)
  return lines.join("\n")
}

function isTentative(row: ComplianceDeadline): boolean {
  return (
    row.status === "expected" ||
    row.status === "computed" ||
    row.status === "proposed" ||
    Boolean(row.dateApprox) ||
    row.confidence === "unverified"
  )
}

function eventLines(row: ComplianceDeadline): string[] {
  const summary = escapeText(summaryFor(row))
  return [
    "BEGIN:VEVENT",
    `UID:${row.id}@accessibility.build`,
    `DTSTAMP:${DTSTAMP}`,
    `DTSTART;VALUE=DATE:${compactDate(row.date)}`,
    `DTEND;VALUE=DATE:${nextDay(row.date)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${escapeText(descriptionFor(row))}`,
    `URL:${row.sourceUrl}`,
    `CATEGORIES:${escapeText(getRegionLabel(row.region))}`,
    `STATUS:${isTentative(row) ? "TENTATIVE" : "CONFIRMED"}`,
    "TRANSP:TRANSPARENT",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${summary}`,
    "TRIGGER:-P14D",
    "END:VALARM",
    "END:VEVENT",
  ]
}

function buildCalendar(rows: ComplianceDeadline[], name: string, description: string, sourceUrl: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Accessibility.build//Compliance Deadlines//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(name)}`,
    `X-WR-CALDESC:${escapeText(description)}`,
    `NAME:${escapeText(name)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `URL:${PAGE_URL}`,
    `SOURCE;VALUE=URI:${sourceUrl}`,
    "REFRESH-INTERVAL;VALUE=DURATION:P1D",
    "X-PUBLISHED-TTL:P1D",
    ...rows.flatMap(eventLines),
    "END:VCALENDAR",
  ]
  return lines.map(foldLine).join(CRLF) + CRLF
}

function notFound(message: string): Response {
  return new Response(`${message}\n`, {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const id = params.get("id")
  const region = params.get("region")
  const all = getCalendarDeadlines()

  let rows = all
  let name = "Accessibility compliance deadlines"
  let filename = "accessibility-compliance-deadlines.ics"
  let query = ""

  if (id) {
    rows = all.filter((d) => d.id === id)
    if (rows.length === 0) return notFound("No upcoming deadline has that id.")
    name = `Accessibility deadline: ${rows[0].title}`
    filename = `${rows[0].id}.ics`
    query = `?id=${encodeURIComponent(id)}`
  } else if (region) {
    if (!isDeadlineRegion(region)) return notFound("Unknown region.")
    rows = all.filter((d) => d.region === region)
    if (rows.length === 0) return notFound("No upcoming deadlines for this region.")
    name = `Accessibility compliance deadlines (${getRegionLabel(region)})`
    filename = `accessibility-compliance-deadlines-${region}.ics`
    query = `?region=${region}`
  }

  const description = `Digital accessibility compliance deadlines from ${PAGE_URL}, each with its primary source. Reviewed ${DEADLINES_REVIEWED_ISO}. Educational content, not legal advice.`
  const body = buildCalendar(rows, name, description, `${SITE}${DEADLINES_CALENDAR_PATH}${query}`)

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  })
}
