import { NextRequest, NextResponse } from "next/server"

const IMAGE_TITLES: Record<string, string> = {
  "faq": "Accessibility FAQ",
  "faq-og": "Accessibility FAQ",
}

function normalizeImageName(image: string): string {
  return image.replace(/\.(png|jpg|jpeg|webp|avif)$/i, "")
}

function titleCase(slug: string): string {
  return slug
    .replace(/-(og|twitter)$/i, "")
    .split("-")
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() || ""}${word.slice(1)}`)
    .join(" ")
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ image: string }> }
): Promise<Response> {
  const { image } = await params
  const slug = normalizeImageName(image)

  if (slug === "logo") {
    const response = NextResponse.redirect(new URL("/android-chrome-512x512.png", request.url), 307)
    response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800")
    return response
  }

  const redirectUrl = new URL("/api/og", request.url)
  redirectUrl.searchParams.set("title", IMAGE_TITLES[slug] || titleCase(slug))
  redirectUrl.searchParams.set("section", "Accessibility.build")

  const response = NextResponse.redirect(redirectUrl, 307)
  response.headers.set("Cache-Control", "public, max-age=86400, s-maxage=604800")
  return response
}
