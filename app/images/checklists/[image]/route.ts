import { NextRequest, NextResponse } from "next/server"

const CHECKLIST_TITLES: Record<string, string> = {
  "wcag-aaa": "WCAG 2.2 AAA Checklist",
  "wcag-excel": "WCAG 2.2 Excel Checklist",
}

function normalizeImageName(image: string): string {
  return image
    .replace(/\.(png|jpg|jpeg|webp|avif)$/i, "")
    .replace(/-og$/i, "")
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => {
      if (word.toLowerCase() === "wcag") return "WCAG"
      if (word.toLowerCase() === "aaa") return "AAA"
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
  const redirectUrl = new URL("/api/og", request.url)

  redirectUrl.searchParams.set("title", CHECKLIST_TITLES[slug] || titleCase(slug))
  redirectUrl.searchParams.set("section", "Checklist")

  const response = NextResponse.redirect(redirectUrl, 307)
  response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800")
  return response
}
