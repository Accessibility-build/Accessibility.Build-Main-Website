import { NextRequest, NextResponse } from "next/server"
import { launchBrowser } from "@/lib/render/browser"
import { getCertificateByCode } from "@/lib/courses/certificates"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

/**
 * Downloads the certificate as a tagged PDF. Chrome renders our own print view (the fixed A4 landscape
 * design, served with the site font), so the PDF matches the design exactly and keeps the text,
 * headings and reading order for screen readers.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const cert = await getCertificateByCode(code)
  if (!cert) return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
  if (cert.revokedAt) return NextResponse.json({ error: "This certificate has been revoked" }, { status: 410 })
  if (cert.expiresAt && cert.expiresAt.getTime() <= Date.now()) return NextResponse.json({ error: "This certificate has expired. Renew it to download a current copy." }, { status: 410 })

  // Only ever our own origin and a validated code, so this cannot be pointed at another site.
  const target = new URL(`/certificates/${cert.code}/print`, req.nextUrl.origin)
  const browser = await launchBrowser()
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 1 })
    const res = await page.goto(target.href, { waitUntil: "networkidle0", timeout: 30_000 })
    if (!res?.ok()) throw new Error(`Print view returned ${res?.status()}`)
    await page.evaluate(() => document.fonts.ready)
    const pdf = await page.pdf({ width: "297mm", height: "210mm", printBackground: true, preferCSSPageSize: true, tagged: true, pageRanges: "1" })
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="accessibility-build-certificate-${cert.code}.pdf"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex",
      },
    })
  } catch (e) {
    console.error("certificate pdf", cert.code, e)
    return NextResponse.json({ error: "The PDF could not be created. Try again in a moment." }, { status: 502 })
  } finally {
    await browser.close().catch(() => {})
  }
}
