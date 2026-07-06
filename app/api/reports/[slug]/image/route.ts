import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { publishedReports } from '@/lib/db/schema'

export const runtime = 'nodejs'

/** Serves a published report's annotated PNG (also used as the og:image). */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [row] = await db
    .select({ image: publishedReports.imageBase64 })
    .from(publishedReports)
    .where(eq(publishedReports.slug, slug))
    .limit(1)

  if (!row) return new NextResponse('Not found', { status: 404 })

  const buffer = Buffer.from(row.image, 'base64')
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
