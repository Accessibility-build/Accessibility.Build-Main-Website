import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { publishedReports, type ReportIssue } from '@/lib/db/schema'
import { verifyDeviceToken } from '@/lib/desktop-auth'
import { generateSlug, isUniqueViolation, SITE_URL, validatePngBase64 } from '@/lib/reports'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Publish an annotated report from the desktop app; returns a shareable URL. */
export async function POST(req: NextRequest) {
  const ctx = await verifyDeviceToken(req.headers.get('authorization'))
  if (!ctx) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }
  const b = body as {
    title?: string
    description?: string
    issues?: unknown
    imageBase64?: string
  }

  // Validate the image is a real PNG within a sane size before storing it.
  const valid = validatePngBase64(String(b.imageBase64 ?? ''))
  if (!valid.ok) {
    return NextResponse.json({ error: valid.error }, { status: valid.error === 'image too large' ? 413 : 400 })
  }

  const title = (typeof b.title === 'string' ? b.title : 'Accessibility findings').slice(0, 140)
  const description =
    typeof b.description === 'string' && b.description.trim() ? b.description.slice(0, 500) : null
  const issues: ReportIssue[] = Array.isArray(b.issues)
    ? (b.issues as ReportIssue[]).slice(0, 100)
    : []

  // Insert with slug-collision retry (unique constraint is the guard).
  let slug = ''
  for (let attempt = 0; attempt < 5; attempt++) {
    slug = generateSlug()
    try {
      await db.insert(publishedReports).values({
        slug,
        userId: ctx.userId,
        title,
        description,
        issues,
        imageBase64: b.imageBase64 as string,
      })
      return NextResponse.json({ url: `${SITE_URL}/reports/${slug}`, slug })
    } catch (err) {
      if (isUniqueViolation(err)) continue
      throw err
    }
  }
  return NextResponse.json({ error: 'could not allocate a report id' }, { status: 500 })
}
