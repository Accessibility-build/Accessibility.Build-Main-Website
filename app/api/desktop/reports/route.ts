import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { publishedReports, type ReportIssue } from '@/lib/db/schema'
import { verifyDeviceToken } from '@/lib/desktop-auth'
import { generateSlug, SITE_URL } from '@/lib/reports'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// ~4MB of base64 ≈ ~3MB PNG; the app caps report width so this is generous.
const MAX_IMAGE_CHARS = 4_500_000

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
  const b = body as { title?: string; issues?: unknown; imageBase64?: string }

  const imageBase64 = typeof b.imageBase64 === 'string' ? b.imageBase64 : ''
  if (!imageBase64) return NextResponse.json({ error: 'missing image' }, { status: 400 })
  if (imageBase64.length > MAX_IMAGE_CHARS) {
    return NextResponse.json({ error: 'image too large' }, { status: 413 })
  }

  const title = (typeof b.title === 'string' ? b.title : 'Accessibility findings').slice(0, 140)
  const issues: ReportIssue[] = Array.isArray(b.issues)
    ? (b.issues as ReportIssue[]).slice(0, 100)
    : []

  const slug = generateSlug()
  await db.insert(publishedReports).values({ slug, userId: ctx.userId, title, issues, imageBase64 })

  return NextResponse.json({ url: `${SITE_URL}/reports/${slug}`, slug })
}
