import { NextRequest, NextResponse } from "next/server"
import { getFileForViewer } from "@/lib/downloads/access"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params
  const result = await getFileForViewer(slug, decodeURIComponent(file))
  if (result.status !== 200) {
    const msg = { 401: "Sign in to download", 403: "You do not have access to this file", 404: "File not found" }[result.status]
    return NextResponse.json({ error: msg }, { status: result.status })
  }
  const f = result.file
  const body = new Uint8Array(f.data)
  return new NextResponse(body, {
    headers: {
      "Content-Type": f.contentType,
      "Content-Length": String(f.sizeBytes),
      "Content-Disposition": `attachment; filename="${f.filename.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
