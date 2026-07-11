import { NextRequest, NextResponse } from "next/server"

const GUIDE_TITLES: Record<string, string> = {
  "heading-analysis": "Heading Analysis Guide",
  "pdf-accessibility": "PDF Accessibility Guide",
}

function normalizeImageName(image: string): string {
  return image
    .replace(/\.(png|jpg|jpeg|webp|avif)$/i, "")
    .replace(/-(og|twitter|screenshot|guide)$/i, "")
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => {
      if (word.toLowerCase() === "pdf") return "PDF"
      if (word.toLowerCase() === "wcag") return "WCAG"
      if (word.toLowerCase() === "ai") return "AI"
      return `${word[0]?.toUpperCase() || ""}${word.slice(1)}`
    })
    .join(" ")
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ image: string }> }
): Promise<Response> {
  const { image } = await params
  const slug = normalizeImageName(image)
  const title = GUIDE_TITLES[slug] || titleCase(slug)
  const redirectUrl = new URL("/api/og", request.url)

  redirectUrl.searchParams.set("title", title)
  redirectUrl.searchParams.set("section", "Guide")

  const response = NextResponse.redirect(redirectUrl, 307)
  response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800")
  return response
}
